"""
Neetab File Conversion + AI API
Uses pdf2docx for PDF->Word, LibreOffice headless for Word->PDF,
and Gemini/Groq (random with fallback) for AI text tools.
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.background import BackgroundTask
from pydantic import BaseModel
from typing import Literal, Optional
import tempfile
import os
import subprocess
import uuid
import time
import asyncio
import random
import httpx
from pathlib import Path
from collections import defaultdict

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GROQ_API_KEY   = os.environ.get("GROQ_API_KEY", "")

app = FastAPI(title="Neetab Conversion API", version="1.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://neetab.com", "https://www.neetab.com", "http://localhost:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path(tempfile.gettempdir()) / "neetab_uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
TEMP_FILE_MAX_AGE = 300  # 5 minutes
RATE_LIMIT_WINDOW = 60  # seconds
RATE_LIMIT_MAX = 10  # requests per window per IP

# LibreOffice cannot run concurrently — use a lock
libreoffice_lock = asyncio.Lock()

# Simple in-memory rate limiter
rate_limit_store: dict[str, list[float]] = defaultdict(list)


def check_rate_limit(ip: str) -> bool:
    """Returns True if request is allowed, False if rate limited."""
    now = time.time()
    # Clean old entries
    rate_limit_store[ip] = [t for t in rate_limit_store[ip] if now - t < RATE_LIMIT_WINDOW]
    if len(rate_limit_store[ip]) >= RATE_LIMIT_MAX:
        return False
    rate_limit_store[ip].append(now)
    return True


def cleanup(*filepaths: Path):
    """Remove temp files."""
    for fp in filepaths:
        try:
            fp.unlink(missing_ok=True)
        except Exception:
            pass


def cleanup_old_files():
    """Remove any temp files older than TEMP_FILE_MAX_AGE seconds (safety net)."""
    try:
        now = time.time()
        for f in UPLOAD_DIR.iterdir():
            if f.is_file() and (now - f.stat().st_mtime) > TEMP_FILE_MAX_AGE:
                f.unlink(missing_ok=True)
    except Exception:
        pass


@app.on_event("startup")
async def startup_cleanup():
    """Clean any leftover temp files from previous runs."""
    cleanup_old_files()


@app.post("/api/convert/pdf-to-word")
async def pdf_to_word(request: Request, file: UploadFile = File(...)):
    """Convert PDF to DOCX using pdf2docx (preserves layout, tables, images)."""
    client_ip = request.client.host if request.client else "unknown"
    if not check_rate_limit(client_ip):
        raise HTTPException(429, "Too many requests. Please wait a minute.")

    if not file.filename or not file.filename.lower().endswith('.pdf'):
        raise HTTPException(400, "Only PDF files are accepted")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(413, "File too large (max 50MB)")

    job_id = str(uuid.uuid4())[:8]
    pdf_path = UPLOAD_DIR / f"{job_id}.pdf"
    docx_path = UPLOAD_DIR / f"{job_id}.docx"

    try:
        with open(pdf_path, "wb") as f:
            f.write(content)

        from pdf2docx import Converter
        cv = Converter(str(pdf_path))
        cv.convert(str(docx_path))
        cv.close()

        if not docx_path.exists():
            raise HTTPException(500, "Conversion failed")

        # Sanitize filename for Content-Disposition header
        safe_name = "".join(c for c in (file.filename or "document.pdf") if c.isalnum() or c in ".-_ ").strip()
        safe_name = (safe_name.replace('.pdf', '') or 'document') + '.docx'

        return FileResponse(
            str(docx_path),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=safe_name,
            background=BackgroundTask(cleanup, pdf_path, docx_path),
        )
    except ImportError:
        cleanup(pdf_path, docx_path)
        raise HTTPException(500, "pdf2docx not installed")
    except HTTPException:
        cleanup(pdf_path, docx_path)
        raise
    except Exception as e:
        cleanup(pdf_path, docx_path)
        raise HTTPException(500, f"Conversion failed: {str(e)}")


@app.post("/api/convert/word-to-pdf")
async def word_to_pdf(request: Request, file: UploadFile = File(...)):
    """Convert DOCX to PDF using LibreOffice headless."""
    client_ip = request.client.host if request.client else "unknown"
    if not check_rate_limit(client_ip):
        raise HTTPException(429, "Too many requests. Please wait a minute.")

    if not file.filename or not file.filename.lower().endswith(('.docx', '.doc')):
        raise HTTPException(400, "Only Word documents are accepted")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(413, "File too large (max 50MB)")

    job_id = str(uuid.uuid4())[:8]
    docx_path = UPLOAD_DIR / f"{job_id}.docx"
    pdf_path = UPLOAD_DIR / f"{job_id}.pdf"

    try:
        with open(docx_path, "wb") as f:
            f.write(content)

        # Lock ensures only one LibreOffice process runs at a time
        async with libreoffice_lock:
            result = subprocess.run([
                'libreoffice', '--headless', '--convert-to', 'pdf',
                '--outdir', str(UPLOAD_DIR),
                str(docx_path)
            ], capture_output=True, timeout=120)

        if result.returncode != 0:
            raise HTTPException(500, f"LibreOffice failed: {result.stderr.decode()}")

        if not pdf_path.exists():
            raise HTTPException(500, "PDF output not found")

        # Sanitize filename for Content-Disposition header
        safe_name = "".join(c for c in (file.filename or "document.docx") if c.isalnum() or c in ".-_ ").strip()
        safe_name = (safe_name.replace('.docx', '').replace('.doc', '') or 'document') + '.pdf'

        return FileResponse(
            str(pdf_path),
            media_type="application/pdf",
            filename=safe_name,
            background=BackgroundTask(cleanup, docx_path, pdf_path),
        )
    except subprocess.TimeoutExpired:
        cleanup(docx_path, pdf_path)
        raise HTTPException(504, "Conversion timed out")
    except FileNotFoundError:
        cleanup(docx_path, pdf_path)
        raise HTTPException(500, "LibreOffice not installed. Use Docker deployment.")
    except HTTPException:
        cleanup(docx_path, pdf_path)
        raise
    except Exception as e:
        cleanup(docx_path, pdf_path)
        raise HTTPException(500, f"Conversion failed: {str(e)}")


# ─── AI helpers ───────────────────────────────────────────────────────────────

async def _call_gemini(prompt: str, system: str) -> str:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not set")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"maxOutputTokens": 1024, "temperature": 0.7},
    }
    if system:
        body["systemInstruction"] = {"parts": [{"text": system}]}
    async with httpx.AsyncClient() as client:
        r = await client.post(url, json=body, timeout=30.0)
        r.raise_for_status()
        return r.json()["candidates"][0]["content"]["parts"][0]["text"].strip()


async def _call_groq(prompt: str, system: str) -> str:
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY not set")
    messages = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})
    async with httpx.AsyncClient() as client:
        r = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {GROQ_API_KEY}"},
            json={"model": "llama-3.1-70b-versatile", "messages": messages, "max_tokens": 1024, "temperature": 0.7},
            timeout=30.0,
        )
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"].strip()


async def call_ai(prompt: str, system: str = "") -> str:
    """Call Gemini or Groq at random; fall back to the other on error."""
    providers = [_call_gemini, _call_groq]
    random.shuffle(providers)
    last_err: Exception = Exception("No AI provider configured")
    for fn in providers:
        try:
            return await fn(prompt, system)
        except Exception as e:
            last_err = e
    raise last_err


# ─── AI tools ────────────────────────────────────────────────────────────────

AI_RATE_LIMIT_MAX = 8   # stricter limit for AI endpoint (per minute per IP)

TOOL_PROMPTS: dict[str, tuple[str, str]] = {
    # (system, user_template)  – {text} and option keys are substituted
    "paraphrase": (
        "You are a writing assistant. Return only the rewritten text with no preamble, labels, or explanation.",
        "Paraphrase the following text in a {style} style:\n\n{text}",
    ),
    "summarize": (
        "You are a summarization assistant. Return only the summary with no preamble.",
        "Write a {length} summary of the following text:\n\n{text}",
    ),
    "humanize": (
        "You are an editor who rewrites AI-generated text to sound natural and human. Remove robotic phrasing, vary sentence length, and use natural transitions. Return only the rewritten text.",
        "Rewrite the following AI-generated text to sound human and {tone}:\n\n{text}",
    ),
    "cover_letter": (
        "You are a professional career coach. Write compelling, authentic cover letters. Return only the cover letter body - no subject line, no labels.",
        "Write a professional cover letter for a {job_title} position at {company}.\n\nCandidate background: {text}\n\nKeep it to 3-4 paragraphs. No placeholder brackets.",
    ),
    "email": (
        "You are a professional email writer. Return the email starting with 'Subject: ...' on the first line, then a blank line, then the email body.",
        "Write a professional email.\nPurpose: {purpose}\nTone: {tone}\nContext: {text}",
    ),
    "email_subject": (
        "You are an email marketing expert. Return a numbered list of subject lines only - no explanations.",
        "Generate 8 compelling email subject lines for this email:\n\n{text}",
    ),
    "bullets": (
        "You are a content editor. Convert text to clear bullet points. Return only the bullet points using - as the bullet character.",
        "Convert the following text into concise bullet points:\n\n{text}",
    ),
    "meta_desc": (
        "You are an SEO expert. Return a numbered list of 3 meta descriptions only - no extra commentary.",
        "Write 3 SEO meta descriptions (150-160 characters each) for:\n\nPage topic: {text}\n{keyword_hint}",
    ),
}


class AIRequest(BaseModel):
    tool: Literal["paraphrase", "summarize", "humanize", "cover_letter", "email", "email_subject", "bullets", "meta_desc"]
    text: str
    options: Optional[dict] = {}


@app.post("/api/ai/process")
async def ai_process(request: Request, body: AIRequest):
    client_ip = request.client.host if request.client else "unknown"
    # Use a separate rate limit key for AI to avoid sharing with file conversion
    ai_ip_key = f"ai:{client_ip}"
    now = time.time()
    rate_limit_store[ai_ip_key] = [t for t in rate_limit_store[ai_ip_key] if now - t < RATE_LIMIT_WINDOW]
    if len(rate_limit_store[ai_ip_key]) >= AI_RATE_LIMIT_MAX:
        raise HTTPException(429, "Too many requests. Please wait a minute.")
    rate_limit_store[ai_ip_key].append(now)

    text = body.text.strip()
    if not text:
        raise HTTPException(400, "text is required")
    if len(text) > 8000:
        raise HTTPException(400, "text too long (max 8000 characters)")

    opts = body.options or {}
    system_tmpl, user_tmpl = TOOL_PROMPTS[body.tool]

    # Build substitution dict
    subs = {"text": text, **opts}
    if body.tool == "meta_desc":
        subs["keyword_hint"] = f"Target keyword: {opts['keyword']}" if opts.get("keyword") else ""
    if body.tool == "paraphrase":
        subs.setdefault("style", "formal")
    if body.tool == "summarize":
        subs.setdefault("length", "concise")
    if body.tool == "humanize":
        subs.setdefault("tone", "conversational")
    if body.tool == "email":
        subs.setdefault("purpose", "")
        subs.setdefault("tone", "professional")

    try:
        user_prompt = user_tmpl.format(**subs)
        result = await call_ai(user_prompt, system_tmpl)
        return {"result": result}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(503, f"AI service unavailable: {str(e)}")


@app.get("/api/health")
async def health():
    """Health check endpoint."""
    cleanup_old_files()

    try:
        result = subprocess.run(['libreoffice', '--version'], capture_output=True, timeout=5)
        lo_version = result.stdout.decode().strip()
    except Exception:
        lo_version = "not available"

    temp_files = list(UPLOAD_DIR.iterdir())

    return {
        "status": "ok",
        "libreoffice": lo_version,
        "max_file_size": f"{MAX_FILE_SIZE // (1024*1024)}MB",
        "temp_files": len(temp_files),
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
