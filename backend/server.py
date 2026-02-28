"""
Neetab File Conversion API
Uses pdf2docx for PDF→Word and LibreOffice headless for Word→PDF.
Deploy via Docker for consistent LibreOffice availability.
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Request
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.background import BackgroundTask
import tempfile
import os
import subprocess
import uuid
import time
import asyncio
from pathlib import Path
from collections import defaultdict

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
