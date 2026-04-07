// ─── Tool Data: Single Source of Truth ───
// No React imports. Pure data only.
// Used by Astro pages at build time and by ToolLoader.tsx at runtime.

export interface ToolMeta {
  id: string;
  slug: string;
  name: string;
  desc: string;
  emoji: string;
  tags: string[];
  category: string;
  popular?: boolean;
  wide?: boolean;
  componentPath: string; // maps to file under src/tools/, e.g. 'file/PDFtoWord'
  seo: {
    title: string;
    description: string;
    h1: string;
  };
  howTo?: string[];
  faq?: { q: string; a: string }[];
  about?: string;
}

export interface Category {
  name: string;
  emoji: string;
  slug: string;
  tools: ToolMeta[];
}

// ─── Tool Definitions (popular first by demand, then alphabetical within each category) ───
const tools: ToolMeta[] = [
  // ═══ FILE TOOLS ═══
  {
    id: 'heic2jpg', slug: 'heic-to-jpg', name: 'HEIC to JPG', desc: 'Convert iPhone HEIC photos to JPEG',
    emoji: '📸', tags: ['heic', 'heif', 'jpg', 'jpeg', 'iphone', 'convert'], category: 'File Tools',
    componentPath: 'file/HEICtoJPG',
    seo: {
      title: 'HEIC to JPG Converter - Free iPhone Photo Convert | Neetab',
      description: 'Convert iPhone HEIC photos to JPG free online. Batch convert HEIC/HEIF files to JPEG instantly in your browser. No sign-up, fully private.',
      h1: 'Free HEIC to JPG Converter',
    },
    howTo: [
      'Upload your HEIC or HEIF photo files - drag and drop or click to select. Multiple files are supported.',
      'Conversion happens automatically in your browser. A preview of each converted file is shown with its file size.',
      'Click Download on any individual file or Download All to save all converted JPEGs at once.',
    ],
    faq: [
      { q: 'What is a HEIC file?', a: 'HEIC (High Efficiency Image Container) is the default photo format on iPhones and iPads running iOS 11 and later. It offers better compression than JPEG while maintaining quality, but is not supported on all platforms and older software.' },
      { q: 'Why convert HEIC to JPG?', a: 'JPEG is universally supported across all operating systems, web browsers, and apps. Convert HEIC to JPG when you need to share photos with Windows users, upload to websites, or use in apps that do not support HEIC.' },
      { q: 'Are my photos uploaded to a server?', a: 'No. Conversion runs entirely in your browser. Your HEIC photos never leave your device and are never sent to any server.' },
      { q: 'Can I convert multiple files at once?', a: 'Yes. Select multiple HEIC files at once or drag them all in together. Each file is converted and made available for download individually or all at once.' },
    ],
  },
  {
    id: 'html2pdf', slug: 'html-to-pdf', name: 'HTML to PDF', desc: 'Convert HTML code to a PDF document',
    emoji: '📄', tags: ['html', 'pdf', 'convert', 'dev'], category: 'File Tools',
    componentPath: 'file/HTMLtoPDF',
    seo: {
      title: 'HTML to PDF Converter - Free Online | Neetab',
      description: 'Convert HTML code to PDF free online. Paste HTML, preview the result, and download a multi-page PDF instantly. No sign-up required.',
      h1: 'Free HTML to PDF Converter',
    },
    howTo: [
      'Paste your HTML code into the editor.',
      'Click Update Preview to render it in the preview pane.',
      'Click Convert to PDF to generate and download the PDF. Choose A4 or Letter page size.',
    ],
    faq: [
      { q: 'What HTML features are supported?', a: 'Standard HTML5 and inline CSS are fully supported. This includes tables, lists, headings, paragraphs, divs, spans, images with data URIs, and most CSS layout properties. External stylesheets and web fonts loaded from external URLs may not render because the browser sandbox restricts cross-origin requests during conversion. For best results, inline all your CSS using the style attribute or a <style> tag, and use base64-encoded images instead of external image URLs.' },
      { q: 'Is my HTML code sent to a server?', a: 'No, your HTML code never leaves your device. The conversion uses html2canvas to render your HTML visually in the browser, then jsPDF to encode that rendering as a PDF document. The entire process happens locally in your browser tab. This means your code - whether it contains sensitive data, internal business documents, or proprietary designs - is completely private.' },
      { q: 'Can I convert multi-page content?', a: 'Yes. Long HTML content is automatically split across multiple PDF pages. The tool calculates the A4 or Letter page height and adds page breaks at the appropriate positions. If you need to control exactly where page breaks occur, add a CSS rule like page-break-before: always or page-break-after: always to elements in your HTML before converting.' },
      { q: 'What page sizes are available?', a: 'You can choose between A4 (210x297mm, standard internationally) and Letter (8.5x11 inches, standard in the US and Canada). A4 is the recommended default for international documents, presentations, and reports. Letter is preferred for US business documents.' },
    ],
    about: 'The HTML to PDF converter lets developers and designers turn HTML markup directly into a downloadable PDF without any server, backend, or third-party service. This is especially useful for generating reports from HTML templates, saving styled web content as PDF, creating documentation from HTML files, or testing how a webpage looks when printed. Unlike browser print-to-PDF which depends on browser settings and print margins, this tool gives you a consistent, predictable result every time. It works entirely in your browser - no file uploads, no accounts, and no data leaving your device. Paste any valid HTML, preview it live, and download the PDF instantly. Ideal for web developers working on invoice templates, email templates, report generators, or any project where HTML needs to become a portable document.',
  },
  {
    id: 'imgcompress', slug: 'image-compressor', name: 'Image Compressor', desc: 'Reduce image file size instantly',
    emoji: '🗜️', tags: ['image', 'compress', 'resize', 'optimize'], category: 'File Tools', popular: true,
    componentPath: 'file/ImageCompressor',
    seo: {
      title: 'Image Compressor - Reduce Image Size Free | Neetab',
      description: 'Compress JPEG, PNG, and WebP images free online. Reduce file size by up to 80% without visible quality loss. No upload, runs in your browser.',
      h1: 'Free Online Image Compressor',
    },
    howTo: [
      'Upload a PNG, JPG, or WebP image by clicking the upload area or dragging and dropping it.',
      'Adjust the quality slider to your preference - 80% is recommended as a sweet spot between file size and visual quality.',
      'Compare the before and after file sizes in the preview, then click Download to save your compressed image.',
    ],
    faq: [
      { q: 'Does compression reduce image quality?', a: 'You are in full control of the quality level using the slider. At 80% quality, the vast majority of images are visually identical to the original - the difference is imperceptible to the human eye in most real-world use cases. For social media posts, website thumbnails, email attachments, and general sharing, 70-85% quality gives you the best balance between file size and visual clarity. If the image contains very fine detail like small text or intricate illustrations, try 85-90% to preserve sharpness.' },
      { q: 'Is my image uploaded anywhere?', a: 'No. Image compression on Neetab runs entirely inside your browser using the HTML5 Canvas API. Your image is loaded into a canvas element, re-encoded at the quality level you choose, and returned to you as a download - all within your browser tab. Nothing is transmitted to any server. This means you can safely compress confidential images, private photos, and internal business graphics without any privacy concerns.' },
      { q: 'What image formats are supported?', a: 'You can compress JPEG, PNG, and WebP images. Beyond just compressing, you can also convert between formats at the same time - for example, you can upload a large PNG file and download it as a smaller WebP, or convert a WebP to a universally-compatible JPEG. WebP generally produces the smallest files, JPEG is best for photographs, and PNG is best for images with transparency or sharp edges like logos and icons.' },
      { q: 'How much can I reduce the file size?', a: 'Typical results range from 50-80% file size reduction, though the exact amount depends on the original image and format. A 5MB JPEG photo often compresses to under 1MB with no visible quality loss at 80% quality. PNG images compress especially well when they contain large areas of flat color. WebP output is typically 25-35% smaller than equivalent JPEG at the same visual quality. The tool shows you the exact before and after file sizes so you can see the savings before downloading.' },
    ],
    about: 'Image compression is one of the most practical things you can do to improve website performance, reduce storage costs, and speed up file sharing. Large uncompressed images are one of the leading causes of slow-loading websites - compressing them can reduce page load times by 40-70% in many cases. This tool uses the browser\'s built-in Canvas API to re-encode your image at a lower quality setting, stripping unnecessary metadata and reducing the data needed to represent each pixel. Unlike many online compressors that upload your files to a cloud server for processing, this tool compresses everything locally in your browser, making it faster and completely private. It is useful for web developers optimising assets, photographers sharing portfolios, marketers preparing images for email campaigns, and anyone who needs to reduce file sizes quickly without installing software.',
  },
  {
    id: 'imgformat', slug: 'image-format-converter', name: 'Image Format Converter', desc: 'Convert images between JPG, PNG, and WebP',
    emoji: '🖼️', tags: ['image', 'jpg', 'png', 'webp', 'convert', 'format'], category: 'File Tools',
    componentPath: 'file/ImageFormatConverter',
    seo: {
      title: 'Image Format Converter - JPG PNG WebP Free | Neetab',
      description: 'Convert images between JPG, PNG, and WebP free online. Batch convert multiple files, set quality for JPG/WebP. Runs in your browser, no upload needed.',
      h1: 'Free Image Format Converter',
    },
    howTo: [
      'Select your output format (JPG, PNG, or WebP) and set the quality if applicable.',
      'Drop your image files onto the upload area or click to select them. Multiple files are supported.',
      'Download individual converted files or click Download All for batch download.',
    ],
    faq: [
      { q: 'When should I use JPG vs PNG vs WebP?', a: 'JPG is best for photos and complex images where small file size matters. PNG is ideal for graphics, logos, and images needing transparency. WebP offers better compression than both JPG and PNG and is supported by all modern browsers.' },
      { q: 'Does converting to JPG lose quality?', a: 'JPG uses lossy compression, so some quality is lost. At 90%+ quality the difference is usually imperceptible. If lossless conversion is needed, use PNG output instead.' },
    ],
  },
  {
    id: 'imgresizer', slug: 'image-resizer', name: 'Image Resizer', desc: 'Resize images to exact dimensions',
    emoji: '📐', tags: ['image', 'resize', 'dimensions', 'scale'], category: 'File Tools',
    componentPath: 'file/ImageResizer',
    seo: {
      title: 'Image Resizer - Resize Images Free Online | Neetab',
      description: 'Resize images to exact pixel dimensions free online. Lock aspect ratio, choose JPEG/PNG/WebP output. Fast, private, runs in your browser.',
      h1: 'Free Online Image Resizer',
    },
    howTo: [
      'Upload a PNG, JPG, or WebP image by clicking the upload area or dragging it in.',
      'Enter your desired width or height. Toggle the lock icon to maintain the original aspect ratio automatically.',
      'Choose an output format (JPEG, PNG, or WebP) and quality, then click Resize & Download.',
    ],
    faq: [
      { q: 'Does the aspect ratio lock work automatically?', a: 'Yes. When the lock is enabled, changing the width automatically recalculates the height to maintain the original proportions, and vice versa. Toggle the lock icon to resize freely without constraints.' },
      { q: 'What formats can I export to?', a: 'JPEG (best for photos), PNG (best for transparency and graphics), and WebP (best for web - smaller files with great quality). WebP is supported in all modern browsers.' },
      { q: 'Is my image uploaded to a server?', a: 'No. Resizing runs entirely in your browser using the HTML Canvas API. Your images never leave your device.' },
      { q: 'Can I upscale an image?', a: 'Yes, you can enter dimensions larger than the original. Note that upscaling increases file size and does not add detail - the result may appear soft or pixelated. For best quality, resize down rather than up.' },
    ],
  },
  {
    id: 'imgrotate', slug: 'image-rotate-flip', name: 'Image Rotate & Flip', desc: 'Rotate and flip images',
    emoji: '🔄', tags: ['image', 'rotate', 'flip', 'mirror'], category: 'File Tools',
    componentPath: 'file/ImageRotateFlip',
    seo: {
      title: 'Image Rotate and Flip - Free Online Tool | Neetab',
      description: 'Rotate images 90, 180, or 270 degrees and flip horizontally or vertically free. Supports JPEG, PNG, WebP. Download instantly, no sign-up.',
      h1: 'Image Rotate and Flip Tool',
    },
    howTo: [
      'Upload a PNG, JPG, or WebP image.',
      'Click Rotate 90 CW, Rotate 90 CCW, Rotate 180, Flip Horizontal, or Flip Vertical to transform the image.',
      'Preview updates instantly. Click Download to save the result as PNG.',
    ],
    faq: [
      { q: 'What transformations are supported?', a: 'Rotate 90 degrees clockwise, 90 degrees counter-clockwise, 180 degrees, flip horizontally (mirror), and flip vertically. Transformations can be combined.' },
      { q: 'Does this work on mobile?', a: 'Yes. The tool uses the HTML Canvas API which works in all modern mobile browsers.' },
      { q: 'Is my image uploaded to a server?', a: 'No. All transformations happen in your browser using Canvas. Your image never leaves your device.' },
    ],
  },
  {
    id: 'img2pdf', slug: 'image-to-pdf', name: 'Image to PDF', desc: 'Combine images into one PDF',
    emoji: '🖼️', tags: ['image', 'pdf', 'convert', 'combine'], category: 'File Tools',
    componentPath: 'file/ImageToPDF',
    seo: {
      title: 'Image to PDF Converter - Free Online | Neetab',
      description: 'Combine multiple images into one PDF free online. Supports JPEG, PNG, WebP. Drag, reorder, and download your PDF instantly. No sign-up needed.',
      h1: 'Free Image to PDF Converter',
    },
    howTo: [
      'Upload one or more images. Supported formats include PNG, JPG, WebP, and other common image types.',
      'Drag and reorder the images to set your desired page order. Choose page size (A4, Letter) and orientation (portrait or landscape).',
      'Click Create PDF and download the resulting document. Each image becomes one page in the PDF.',
    ],
    faq: [
      { q: 'Can I combine multiple images into one PDF?', a: 'Yes. Upload as many images as you need and they will be combined into a single PDF document, with one image per page in the order you arrange them.' },
      { q: 'What image formats can I use?', a: 'PNG, JPG, JPEG, WebP, and other common browser-supported image formats are all accepted.' },
      { q: 'Can I reorder the pages?', a: 'Yes. After uploading, drag and rearrange the image thumbnails to set the exact page order before creating the PDF.' },
      { q: 'Is my data private?', a: 'Yes. The entire conversion happens in your browser using jsPDF. No images are uploaded to any server - everything stays on your device.' },
    ],
  },
  {
    id: 'invoice', slug: 'invoice-generator', name: 'Invoice Generator', desc: 'Create professional PDF invoices',
    emoji: '🧾', tags: ['invoice', 'bill', 'pdf', 'business', 'receipt', 'freelance'], category: 'File Tools',
    componentPath: 'file/InvoiceGenerator',
    seo: {
      title: 'Invoice Generator - Free PDF Invoice Maker | Neetab',
      description: 'Create professional PDF invoices free online. Add line items, taxes, logos, and custom notes. Download instantly - no account, no watermark.',
      h1: 'Free PDF Invoice Generator',
    },
    howTo: [
      'Fill in your business name and contact details in the "From" section, and your client\'s details in the "Bill To" section.',
      'Add line items with descriptions, quantities, and unit prices. Set a tax rate and any notes or payment terms at the bottom.',
      'Click Download PDF to instantly save a professional, print-ready invoice to your device - no sign-up required.',
    ],
    faq: [
      { q: 'Is this invoice generator really free?', a: 'Yes, completely free with no watermarks, no sign-up, and no limits on how many invoices you can create. Download as many PDFs as you need.' },
      { q: 'Are my invoices saved or stored?', a: 'No. Everything runs in your browser using jsPDF. Your business information and invoice data never leave your device and are never sent to any server.' },
      { q: 'Can I add tax to my invoices?', a: 'Yes. Set a tax percentage (e.g., 10% VAT or 8.5% sales tax) and it will be automatically calculated and shown as a separate line on the invoice.' },
      { q: 'What currencies are supported?', a: 'You can choose from common currency symbols including USD ($), EUR (€), GBP (£), JPY (¥), INR (₹), NGN (₦), CAD (C$), and AUD (A$).' },
      { q: 'Can I customize the invoice number?', a: 'Yes. The invoice number is auto-generated but fully editable. Use any numbering scheme you prefer - sequential numbers, date-based codes, or client-specific prefixes.' },
    ],
  },
  {
    id: 'mergepdf', slug: 'merge-pdf', name: 'Merge PDF', desc: 'Combine multiple PDFs into one',
    emoji: '📎', tags: ['pdf', 'merge', 'combine', 'join'], category: 'File Tools',
    componentPath: 'file/MergePDF',
    seo: {
      title: 'Merge PDF - Combine PDFs Free Online | Neetab',
      description: 'Merge multiple PDF files into one free online. Drag to reorder pages, combine instantly. 100% client-side - files never leave your browser.',
      h1: 'Free Online PDF Merger',
    },
    howTo: [
      'Upload two or more PDF files by clicking the upload area or dragging them in.',
      'Reorder the files by dragging them into your preferred sequence - the merged PDF will follow this order.',
      'Click Merge & Download to combine all PDFs into a single file and save it to your device.',
    ],
    faq: [
      { q: 'How many PDFs can I merge at once?', a: 'There is no hard limit on the number of files. However, very large PDFs may require more memory and time to process. For best performance, keep total combined size under 100MB.' },
      { q: 'Is my PDF uploaded to a server?', a: 'No. Merging runs entirely in your browser using pdf-lib, a pure JavaScript PDF library. Your files never leave your device.' },
      { q: 'Can I reorder pages before merging?', a: 'Yes. Drag the file thumbnails to set the order before merging. Each file\'s pages are inserted in sequence.' },
      { q: 'Will the PDF quality be affected?', a: 'No. pdf-lib merges PDFs at the binary level, preserving the original quality, formatting, fonts, and embedded content of each source file.' },
    ],
  },
  {
    id: 'pdfcompress', slug: 'pdf-compressor', name: 'PDF Compressor', desc: 'Reduce PDF file size',
    emoji: '📦', tags: ['pdf', 'compress', 'reduce', 'optimize'], category: 'File Tools',
    componentPath: 'file/PDFCompressor',
    seo: {
      title: 'PDF Compressor - Reduce PDF Size Free | Neetab',
      description: 'Compress PDF files free online to reduce file size. Strips metadata and optimizes streams in your browser. No upload to servers, fully private.',
      h1: 'Free Online PDF Compressor',
    },
    howTo: [
      'Upload your PDF file by clicking the upload area or dragging it in.',
      'Select a compression level: Screen (smallest size), eBook (balanced), or Printer (higher quality).',
      'Click Compress and download the optimized PDF. Original and compressed sizes are shown.',
    ],
    faq: [
      { q: 'How much can PDF compression reduce file size?', a: 'Results vary widely. PDFs with large embedded images can see significant reductions. PDFs that are already optimized may show minimal savings. The tool strips metadata and optimizes object streams.' },
      { q: 'Is my PDF uploaded to a server?', a: 'No. Compression runs entirely in your browser using pdf-lib. Your file never leaves your device.' },
      { q: 'Will compression affect PDF quality?', a: 'Metadata stripping has no visual impact. The compression mainly targets file structure efficiency. For aggressive image compression in PDFs, a server-side tool may produce better results.' },
    ],
  },
  {
    id: 'pdf2img', slug: 'pdf-to-image', name: 'PDF to Image', desc: 'Convert PDF pages to PNG/JPG',
    emoji: '📑', tags: ['pdf', 'image', 'convert', 'png', 'jpg'], category: 'File Tools',
    componentPath: 'file/PDFtoImage',
    seo: {
      title: 'PDF to Image Converter - Free PNG/JPG | Neetab',
      description: 'Convert PDF pages to high-quality PNG or JPG images free online. Choose any page or convert all pages at once. No sign-up, runs in browser.',
      h1: 'Free PDF to Image Converter',
    },
    howTo: [
      'Upload a PDF file by clicking the upload area or dragging it in.',
      'Select your preferred output format - PNG for lossless quality or JPG for smaller file sizes.',
      'Each page is converted and shown as a separate image. Click Download under any page to save it, or download all pages.',
    ],
    faq: [
      { q: 'What image formats can I export to?', a: 'You can export PDF pages as high-quality PNG or JPG images. PNG is best for preserving sharp text and graphics. JPG is better when you need smaller file sizes and the content is photographic.' },
      { q: 'Can I convert a multi-page PDF?', a: 'Yes. Each page is converted to a separate image that you can download individually. There is no practical limit on the number of pages, though very large PDFs may take more time to render.' },
      { q: 'Is my PDF uploaded to a server?', a: 'No. PDF to image conversion runs entirely in your browser using PDF.js, the same library used by Firefox and Chrome. Your files never leave your device.' },
      { q: 'What resolution are the output images?', a: 'Images are rendered at the PDF native resolution, which is typically 72-150 DPI. The result is sharp for screen use. For high-resolution print output, a dedicated desktop tool may produce better results at 300+ DPI.' },
    ],
  },
  {
    id: 'pdf2word', slug: 'pdf-to-word', name: 'PDF to Word', desc: 'Convert PDF to editable DOCX',
    emoji: '📝', tags: ['pdf', 'word', 'docx', 'convert'], category: 'File Tools', popular: true,
    componentPath: 'file/PDFtoWord',
    seo: {
      title: 'PDF to Word Converter - Free and Instant | Neetab',
      description: 'Convert PDF to editable Word documents free - no sign-up. Preserves formatting, tables, and images. Server-side conversion with browser fallback.',
      h1: 'Free PDF to Word Converter',
    },
    howTo: [
      'Upload your PDF by clicking the upload area or dragging and dropping the file onto it.',
      'Click Convert. The tool attempts server-side conversion first for best quality, then falls back to browser-based extraction if the server is unavailable.',
      'Once conversion is complete, click Download to save your editable .docx file. Open it in Microsoft Word, Google Docs, or LibreOffice.',
    ],
    faq: [
      { q: 'Is my PDF file uploaded to a server?', a: 'When the server conversion is used, your file is transmitted securely over HTTPS to a dedicated conversion server, processed immediately, and permanently deleted right after the converted file is returned to you. The file is never stored on disk beyond the conversion window, never read or analysed by any person, and never shared with any third party. If you prefer zero uploads, you can disable this option and use the browser-only fallback, though the output quality will be lower for complex documents.' },
      { q: 'What quality can I expect from the conversion?', a: 'Server-side conversion uses pdf2docx combined with LibreOffice, which together handle layout reconstruction, table detection, image extraction, header and footer preservation, and text formatting with high accuracy. Simple PDFs with standard text and basic formatting typically convert with near-perfect fidelity. Complex PDFs - such as those with multi-column layouts, unusual fonts, overlapping elements, or heavy use of graphics - may require minor manual cleanup in Word after conversion. Scanned PDFs (images of text) cannot be converted accurately without OCR, which is not currently included.' },
      { q: 'Is there a file size limit?', a: 'The upload limit is 50MB per file. For most documents - even long reports, contracts, and books - this is more than sufficient. Very large PDFs with hundreds of pages and many embedded images may take 30-60 seconds to process. If your PDF is larger than 50MB, consider splitting it into sections first using the PDF Splitter tool on Neetab, converting each section, then merging the resulting Word documents.' },
      { q: 'What happens if the server is not available?', a: 'The tool is designed with a two-stage fallback. It first attempts server-side conversion for the highest quality result. If the server is unavailable or returns an error, the tool automatically switches to a browser-based fallback using PDF.js to extract the text content. The browser fallback produces a plain-text DOCX file - formatting, tables, and images will not be preserved. A notice will be shown so you know which mode was used. For complex documents, try again later when the server is available.' },
    ],
    about: 'PDF to Word conversion is one of the most commonly needed document tasks - PDFs are everywhere, but they are designed for viewing, not editing. Whether you received a contract you need to revise, a report you need to update, or a form you need to fill in, converting it to an editable Word document is often the fastest path forward. This tool uses a professional-grade conversion pipeline (pdf2docx + LibreOffice) on the server side to reconstruct the Word document as accurately as possible, preserving text styles, tables, columns, and images. For privacy-sensitive documents, the file is deleted from the server immediately after conversion. The tool also includes a client-side fallback for situations where the server is unavailable, so you can always extract the text content even if layout preservation is not possible. Compatible with Microsoft Word, Google Docs, and LibreOffice.',
  },
  {
    id: 'splitpdf', slug: 'split-pdf', name: 'Split PDF', desc: 'Split or extract pages from a PDF',
    emoji: '✂️', tags: ['pdf', 'split', 'extract', 'pages'], category: 'File Tools',
    componentPath: 'file/SplitPDF',
    seo: {
      title: 'Split PDF - Extract Pages Free Online | Neetab',
      description: 'Split PDF files or extract specific pages free online. Split all pages or define custom page ranges like 1-3, 5, 7-9. Fully private, no upload.',
      h1: 'Free Online PDF Splitter',
    },
    howTo: [
      'Upload your PDF file.',
      'Choose a mode: "Split All Pages" to save each page as a separate PDF, or "Extract Range" to specify pages like "1-3, 5, 7-9".',
      'Click Split/Extract and each resulting PDF downloads automatically.',
    ],
    faq: [
      { q: 'Can I extract specific pages?', a: 'Yes. Use the Extract Range mode and enter page numbers like "1-3, 5, 8-10". Each range or individual page is saved as a separate PDF file.' },
      { q: 'Is there a page limit?', a: 'No hard limit. Very large PDFs may take longer to process in the browser. For extremely large files, processing is still fully client-side.' },
      { q: 'Is my PDF uploaded anywhere?', a: 'No. Splitting uses pdf-lib entirely in your browser. Your file stays on your device.' },
    ],
  },
  {
    id: 'svg2png', slug: 'svg-to-png', name: 'SVG to PNG', desc: 'Convert SVG vector files to PNG images',
    emoji: '🎭', tags: ['svg', 'png', 'vector', 'convert', 'export'], category: 'File Tools',
    componentPath: 'file/SVGtoPNG',
    seo: {
      title: 'SVG to PNG Converter - Free Online | Neetab',
      description: 'Convert SVG vector files to PNG images free online. Set custom scale and export high-resolution PNGs. Runs in your browser, no sign-up needed.',
      h1: 'Free SVG to PNG Converter',
    },
    howTo: [
      'Upload an SVG file by clicking the upload area or dragging it in.',
      'Use the scale slider to set your desired output resolution - 2× gives double the source dimensions, great for retina displays.',
      'Click Export as PNG to download the rasterized image at your chosen resolution.',
    ],
    faq: [
      { q: 'What does scale mean for SVG to PNG?', a: 'SVG files are resolution-independent vectors. The scale multiplier determines the output PNG dimensions. At 2×, a 512×512 SVG produces a 1024×1024 PNG. Higher scales produce larger, sharper images suitable for print or retina displays.' },
      { q: 'Will the PNG have a transparent background?', a: 'Yes, if your SVG has a transparent background, the exported PNG will preserve that transparency. PNG natively supports alpha channel transparency.' },
      { q: 'Is my SVG file uploaded to a server?', a: 'No. The conversion runs entirely in your browser using the HTML Canvas API. Your SVG file never leaves your device.' },
      { q: 'Why would I convert SVG to PNG?', a: 'SVG is not supported everywhere - some apps, word processors, and email clients cannot display SVG. PNG is universally supported and is the best format when you need a raster version of a vector graphic.' },
    ],
  },
  {
    id: 'word2pdf', slug: 'word-to-pdf', name: 'Word to PDF', desc: 'Convert DOCX to PDF',
    emoji: '📃', tags: ['word', 'pdf', 'docx', 'convert'], category: 'File Tools', popular: true,
    componentPath: 'file/WordToPDF',
    seo: {
      title: 'Word to PDF Converter - Free Online | Neetab',
      description: 'Convert Word documents to PDF free online. Preserves fonts, tables, images, and page layout perfectly. Works with .doc and .docx files instantly.',
      h1: 'Free Word to PDF Converter',
    },
    howTo: [
      'Upload your .docx or .doc Word file by clicking the upload area or dragging it in.',
      'Click Convert to PDF. Server-side conversion via LibreOffice preserves your fonts, tables, images, headers, footers, and page layout.',
      'Download the resulting PDF when conversion is complete. The PDF is universally readable on any device without needing Microsoft Word.',
    ],
    faq: [
      { q: 'Will my Word document formatting be preserved?', a: 'Yes - server-side conversion uses LibreOffice headless, which is one of the most accurate tools available for rendering Word documents to PDF. Fonts, tables, images, headers, footers, numbered lists, page margins, and column layouts are all preserved with near-perfect fidelity. The resulting PDF looks exactly as the document would if you printed it directly from Microsoft Word. Complex documents with embedded objects like charts, equations, or macros may occasionally have minor differences, but standard business documents convert cleanly.' },
      { q: 'Can I convert .doc files or only .docx?', a: 'Both the older .doc format (used by Word 97-2003) and the modern .docx format (Word 2007 and later) are fully supported. You can drag and drop either file type and the tool will detect the format automatically. If you have a .odt file from LibreOffice, that is also supported. The output is always a standard PDF compatible with Adobe Reader, Chrome, Safari, and all modern PDF viewers.' },
      { q: 'Is there a file size limit?', a: 'Files up to 50MB are supported. The vast majority of Word documents - even lengthy reports, books, and presentations with embedded images - are well under this limit. Very large documents with hundreds of high-resolution images may take 20-40 seconds to process. If your file exceeds 50MB, consider removing embedded images or compressing them in Word before uploading.' },
      { q: 'Is my document uploaded to a server?', a: 'Yes, for server-side conversion your file is uploaded securely over HTTPS to a dedicated processing server. The file is processed immediately upon receipt and permanently deleted right after the PDF is returned to you. It is never stored, never read by any person, and never used for any purpose other than the conversion. The entire lifecycle from upload to deletion happens within seconds.' },
      { q: 'Can I convert multiple documents at once?', a: 'Currently the tool converts one document at a time. After your first conversion completes and you have downloaded the PDF, simply click to upload another file. There is no limit on how many conversions you can do in a session - you can convert as many documents as you need without any daily cap or account required.' },
    ],
    about: 'Converting Word documents to PDF is a fundamental task for anyone sharing documents professionally. PDFs are universally readable on every device and operating system without needing Microsoft Word installed, and they preserve your formatting exactly as intended - no risk of fonts shifting, tables breaking, or layout changing on the recipient\'s screen. This tool uses LibreOffice headless on the server to produce high-quality PDFs that faithfully render your fonts, tables, images, headers, footers, and page layout. It supports both the modern .docx format and the legacy .doc format. The conversion happens server-side for maximum quality, and the file is immediately deleted after processing. This is useful for sending contracts, reports, CVs, proposals, invoices, and any document where you need the recipient to see exactly what you created.',
  },
  // ═══ CALCULATORS ═══
  {
    id: 'age', slug: 'age-calculator', name: 'Age Calculator', desc: 'Exact age from birthdate',
    emoji: '🎂', tags: ['date', 'birthday', 'days'], category: 'Calculators',
    componentPath: 'calculators/AgeCalculator',
    seo: {
      title: 'Age Calculator - Find Your Exact Age | Neetab',
      description: 'Calculate your exact age in years, months, weeks, and days from your birthdate. Shows days until your next birthday. Free, instant, no sign-up.',
      h1: 'Age Calculator',
    },
    howTo: [
      'Enter your date of birth using the date picker.',
      'Your exact age in years, months, and days is calculated instantly based on today\'s date.',
      'Scroll down to see your total days and weeks lived, and how many days remain until your next birthday.',
    ],
    faq: [
      { q: 'How accurate is the age calculation?', a: 'The calculator computes your exact age in years, months, and days from your date of birth to today, correctly accounting for leap years and varying month lengths.' },
      { q: 'Does it show days until my next birthday?', a: 'Yes. The calculator shows how many days remain until your next birthday, making it easy to plan ahead or simply satisfy your curiosity.' },
      { q: 'Can I calculate age between two dates?', a: 'The calculator uses today as the end date. To find the age or duration between two custom dates, enter the earlier date as the birth date - the result will represent the elapsed time between the two dates.' },
    ],
  },
  {
    id: 'aspectratio', slug: 'aspect-ratio-calculator', name: 'Aspect Ratio Calculator', desc: 'Calculate and convert aspect ratios',
    emoji: '📐', tags: ['aspect', 'ratio', 'resolution', 'screen', 'dimensions'], category: 'Calculators',
    componentPath: 'calculators/AspectRatioCalculator',
    seo: {
      title: 'Aspect Ratio Calculator - Free Online | Neetab',
      description: 'Calculate, simplify, and convert aspect ratios free online. Find missing dimensions, use common presets like 16:9 and 4:3. Instant results.',
      h1: 'Aspect Ratio Calculator',
    },
    howTo: [
      'Enter a width and height to calculate the simplified aspect ratio (e.g. 1920x1080 = 16:9).',
      'Or select a preset ratio (16:9, 4:3, 1:1) and enter one dimension to calculate the other.',
      'Results show the ratio, decimal equivalent, and percentage width.',
    ],
    faq: [
      { q: 'What is aspect ratio?', a: 'Aspect ratio is the proportional relationship between width and height, expressed as W:H. 16:9 is the standard widescreen ratio for HD video, monitors, and most modern phones in landscape.' },
      { q: 'How do I maintain aspect ratio when resizing?', a: 'Use the Scale section: enter the known ratio and one target dimension, and the calculator gives you the other. For example, scale a 16:9 image to 800px wide and get the correct height of 450px.' },
    ],
  },
  {
    id: 'bmi', slug: 'bmi-calculator', name: 'BMI Calculator', desc: 'Body mass index check',
    emoji: '⚖️', tags: ['health', 'fitness', 'weight', 'body'], category: 'Calculators',
    componentPath: 'calculators/BMICalculator',
    seo: {
      title: 'BMI Calculator - Body Mass Index Check | Neetab',
      description: 'Calculate your Body Mass Index (BMI) free online. Enter height and weight in metric or imperial units. Get your BMI score and health category instantly.',
      h1: 'BMI Calculator',
    },
    howTo: [
      'Select your unit system - imperial (feet/inches and pounds) or metric (centimeters and kilograms).',
      'Enter your height and weight in the corresponding fields.',
      'Your BMI is calculated instantly and displayed alongside your weight category (underweight, normal, overweight, or obese).',
    ],
    faq: [
      { q: 'What is a healthy BMI range?', a: 'A BMI between 18.5 and 24.9 is considered normal weight. Below 18.5 is underweight, 25-29.9 is overweight, and 30 or above is considered obese. These ranges apply to adults aged 18 and over and are the same for both men and women.' },
      { q: 'Does BMI apply to athletes?', a: 'BMI may overestimate body fat in athletes and muscular individuals because muscle weighs more than fat. A heavily muscled person may have a high BMI while being very lean. It is best used as a general population screening tool, not a definitive individual health measure.' },
      { q: 'Does BMI work the same for men and women?', a: 'The same BMI scale applies to adult men and women, though body composition naturally differs between sexes. Women typically carry a higher body fat percentage at the same BMI as men. For a fuller picture of health, consider waist circumference and body fat percentage alongside your BMI result.' },
    ],
  },
  {
    id: 'calorie', slug: 'calorie-calculator', name: 'Calorie Calculator', desc: 'BMR, TDEE and daily macro targets',
    emoji: '🔥', tags: ['calorie', 'bmr', 'tdee', 'diet', 'nutrition', 'health', 'macro'], category: 'Calculators',
    componentPath: 'calculators/CalorieCalculator',
    seo: {
      title: 'Calorie Calculator - BMR and TDEE Free Online | Neetab',
      description: 'Calculate your BMR and TDEE free online. Get daily calorie targets for weight loss, maintenance, or muscle gain. Includes macro recommendations. No sign-up.',
      h1: 'Free Calorie Calculator',
    },
    howTo: [
      'Enter your age, biological sex, weight, and height. Toggle between metric (kg/cm) and imperial (lb/ft/in).',
      'Select your activity level honestly - most people are Sedentary or Lightly Active.',
      'Choose your goal (lose weight, maintain, or build muscle) to see your personalized daily calorie target and macros.',
    ],
    faq: [
      { q: 'What is BMR?', a: 'BMR (Basal Metabolic Rate) is the number of calories your body burns at complete rest just to maintain vital functions like breathing, circulation, and cell production. It is the minimum calories needed to stay alive.' },
      { q: 'What is TDEE?', a: 'TDEE (Total Daily Energy Expenditure) is your BMR multiplied by an activity factor. It represents the total calories you burn in a day including all movement and exercise. Eating at your TDEE means your weight stays stable.' },
      { q: 'How accurate is this calculator?', a: 'This uses the Mifflin-St Jeor equation, which is the most accurate formula for most people and is used by registered dietitians. Results are within 10% for most individuals. Factors like muscle mass, hormones, and metabolism variation mean results are estimates, not guarantees.' },
    ],
  },
  {
    id: 'discount', slug: 'discount-calculator', name: 'Discount Calculator', desc: 'Sale price & savings',
    emoji: '🏷️', tags: ['shopping', 'sale', 'savings'], category: 'Calculators',
    componentPath: 'calculators/DiscountCalculator',
    seo: {
      title: 'Discount Calculator - Sale Price and Savings | Neetab',
      description: 'Calculate discounted prices and savings instantly. Enter the original price and discount percentage to see the sale price and amount saved. Free online.',
      h1: 'Discount Calculator',
    },
    howTo: [
      'Enter the original price of the item in the Price field.',
      'Enter the discount percentage - for example, 25 for a 25% off sale.',
      'The discount amount and the final sale price are shown instantly so you know exactly what you will pay.',
    ],
    faq: [
      { q: 'How do I calculate a sale price?', a: 'Enter the original price and the discount percentage. The calculator instantly shows the discount amount in dollars (or your currency) and the final price you will pay.' },
      { q: 'Can I calculate double discounts?', a: 'Enter the combined effective discount percentage. Note that a 20% off sale followed by an additional 10% off is not 30% - it is approximately 28%, because the second discount applies to the already-reduced price, not the original.' },
      { q: 'Does this include sales tax?', a: 'The calculator shows the discounted price before tax. Sales tax rates vary by location and are not included. Add your local tax percentage to the final discounted price for the actual total.' },
    ],
  },
  {
    id: 'percentage', slug: 'percentage-calculator', name: 'Percentage Calculator', desc: 'All percentage calculations',
    emoji: '📊', tags: ['math', 'percent', 'discount'], category: 'Calculators',
    componentPath: 'calculators/PercentageCalculator',
    seo: {
      title: 'Percentage Calculator - All % Calculations | Neetab',
      description: 'Calculate percentages, percentage change, and what percent X is of Y - free online. Covers all common percentage math with instant results.',
      h1: 'Percentage Calculator',
    },
    howTo: [
      'Choose the type of calculation you need: "What is X% of Y?", "X is what % of Y?", or "Percentage change from X to Y".',
      'Enter the required values in the input fields.',
      'The result appears instantly. Use the Swap button to reverse the inputs if needed.',
    ],
    faq: [
      { q: 'How do I calculate what percent X is of Y?', a: 'Select the "X is what % of Y" mode, enter both values, and the percentage appears instantly. For example, 25 is 50% of 50.' },
      { q: 'Can I calculate percentage increase or decrease?', a: 'Yes. Select "Percentage change" mode, enter the original value and the new value, and the calculator shows whether it is an increase or decrease and by what percentage.' },
      { q: 'How do I find what number is X% of Y?', a: 'Select "What is X% of Y" mode. Enter the percentage and the base number, and the result appears instantly. For example, 20% of 150 is 30.' },
    ],
  },
  {
    id: 'tip', slug: 'tip-calculator', name: 'Tip Calculator', desc: 'Split bills & calculate tips',
    emoji: '💰', tags: ['money', 'restaurant', 'bill', 'split'], category: 'Calculators', popular: true,
    componentPath: 'calculators/TipCalculator',
    seo: {
      title: 'Tip Calculator - Split Bills Easily | Neetab',
      description: 'Calculate tips and split restaurant bills free online. Enter the bill amount, tip percentage, and number of people to get the amount per person instantly.',
      h1: 'Tip Calculator - Split Bills',
    },
    howTo: [
      'Enter your total bill amount in the Bill field.',
      'Select a tip percentage from the preset buttons (15%, 18%, 20%) or type a custom percentage.',
      'Enter the number of people splitting the bill to see each person\'s share, including their portion of the tip.',
    ],
    faq: [
      { q: 'How do I calculate a tip?', a: 'Enter your total bill amount, select a tip percentage using one of the preset buttons (15%, 18%, 20%) or type a custom percentage, and enter how many people are splitting the bill. The calculator instantly shows the tip amount, the full total with tip, and each person\'s share. No manual math required - it handles all the division and rounding for you.' },
      { q: 'What is the standard tip percentage?', a: 'In the United States, 15-20% is the widely accepted standard for sit-down restaurant service. 18% is a common default on payment terminals. For excellent or exceptional service, 20-25% is a generous and appreciated tip. For quick-service, counter service, or takeout, 10-15% is typical if tipping at all. Outside the US, tipping customs vary significantly by country - some countries have no tipping culture at all, while others expect a service charge to be included automatically.' },
      { q: 'Can I split the bill between multiple people?', a: 'Yes. Enter the number of people sharing the bill and the calculator divides the total (including tip) evenly, showing each person\'s exact share rounded to the nearest cent. This is especially useful at group dinners where multiple couples or individuals want to pay their own way. If people ordered different amounts, you would need to split manually - this calculator assumes equal sharing.' },
      { q: 'Does this work for non-restaurant tips?', a: 'Yes, this calculator works for any tipping situation. Use it to calculate tips for hotel housekeeping, taxi and rideshare drivers, delivery drivers, hairdressers and barbers, spa and massage therapists, airport porters, and any other service where you want to calculate a percentage gratuity. Simply enter the total amount and your desired tip percentage.' },
    ],
    about: 'The tip calculator makes bill-splitting and gratuity calculation instant and stress-free, especially in group dining situations where splitting the bill fairly can get complicated. Tipping customs and percentages vary by service type, country, and individual preference - this tool puts you in control by letting you set any percentage from 0 to 100 and split between any number of people. It is most commonly used at restaurants, but works equally well for any service industry transaction. The calculator runs entirely in your browser with no data collection - just fast, accurate arithmetic so you can focus on the conversation instead of mental math.',
  },
  {
    id: 'payeng', slug: 'paye-tax-calculator-nigeria', name: 'PAYE Tax Calculator Nigeria', desc: 'Calculate Nigerian PAYE income tax (2026)',
    emoji: '🇳🇬', tags: ['paye', 'tax', 'nigeria', 'income tax', 'salary', 'naira', 'firs', 'tax calculator nigeria'], category: 'Calculators',
    componentPath: 'calculators/PAYETaxNigeria',
    seo: {
      title: 'PAYE Tax Calculator Nigeria 2026 - Free Online | Neetab',
      description: 'Calculate your Nigerian PAYE income tax for 2026 based on the Nigeria Tax Act 2025. Enter monthly salary, see tax breakdown, deductions, and take-home pay.',
      h1: 'PAYE Tax Calculator Nigeria 2026',
    },
    howTo: [
      'Enter your monthly gross salary in Naira. The default salary structure (Basic 40%, Housing 30%, Transport 10%, Others 20%) is pre-filled — adjust the sliders if your payslip uses different percentages.',
      'Enter your annual rent paid (if any) to claim the Rent Relief deduction. Toggle Pension and NHF on or off depending on whether your employer deducts these.',
      'Your monthly PAYE tax, annual tax, effective tax rate, and take-home pay are calculated instantly using the six tax bands from the Nigeria Tax Act 2025.',
      'Review the breakdown table to see each deduction line by line, and the tax band table to see exactly how your chargeable income is taxed at each rate.',
    ],
    faq: [
      { q: 'What changed in the Nigeria Tax Act 2025?', a: 'The Nigeria Tax Act 2025, effective January 1, 2026, replaced the Personal Income Tax Act (PITA). The biggest change is the abolition of the Consolidated Relief Allowance (CRA), which was 20% of gross income plus ₦200,000 as a flat amount. In its place, the new law introduced Rent Relief (20% of annual rent paid, capped at ₦500,000) and a new six-band tax table starting with a 0% rate on the first ₦800,000 of chargeable income. The top marginal rate is now 25% on income above ₦50 million, compared to the old top rate of 24%.' },
      { q: 'What is the 0% tax band and how does it work?', a: 'Under the new law, the first ₦800,000 of chargeable income (after deductions) is taxed at 0%. This effectively replaces the old CRA as the main relief for lower-income earners. For someone earning around ₦150,000 per month or less, this zero-rate band means their entire chargeable income may fall within it, resulting in zero or very little PAYE tax. This is a significant benefit for low-to-middle income Nigerian workers.' },
      { q: 'What is Rent Relief and who qualifies?', a: 'Rent Relief is a new deduction introduced by the Nigeria Tax Act 2025 to replace part of the old CRA. It equals 20% of your actual annual rent paid, capped at a maximum of ₦500,000. To claim it, you must provide evidence of rent payment to your employer. If you own your home outright or do not pay rent, this relief does not apply to you and your chargeable income will be higher as a result.' },
      { q: 'How is employee pension contribution calculated?', a: 'Under the Pension Reform Act, employees contribute a minimum of 8% of their basic salary, housing allowance, and transport allowance combined. This contribution is deducted before tax, reducing your chargeable income. Not all employers enrol staff in pension schemes — if you work in the informal sector or for a small company not covered by the Pension Act, you may not have pension deductions.' },
      { q: 'What is NHF and is it mandatory?', a: 'The National Housing Fund (NHF) is a 2.5% deduction on basic salary, established by the National Housing Fund Act. It applies to employees earning the national minimum wage or above and is used to fund the Federal Mortgage Bank. Like pension, NHF is deducted before tax. Contributions are refundable upon retirement or if you use them toward a National Housing Fund mortgage. In practice, not all private employers deduct NHF, so toggle it off if it does not appear on your payslip.' },
      { q: 'What are the six PAYE tax bands for 2026?', a: 'The Nigeria Tax Act 2025 sets six progressive tax bands on chargeable income: 0% on the first ₦800,000, 15% on ₦800,001 to ₦3,000,000, 18% on ₦3,000,001 to ₦10,000,000, 21% on ₦10,000,001 to ₦25,000,000, 23% on ₦25,000,001 to ₦50,000,000, and 25% on any amount above ₦50,000,000. The tax is cumulative — you pay each rate only on the portion of income falling within that band, not on your entire income.' },
    ],
    about: 'The PAYE Tax Calculator Nigeria is a free tool that calculates your Pay-As-You-Earn income tax based on the Nigeria Tax Act 2025, which took effect on January 1, 2026. This new tax law replaced the Personal Income Tax Act (PITA) and introduced significant changes to how Nigerian employees are taxed. The old Consolidated Relief Allowance (CRA) — which gave every taxpayer 20% of gross income plus a flat ₦200,000 — has been abolished. In its place, the new law provides a 0% tax rate on the first ₦800,000 of chargeable income and a Rent Relief deduction capped at ₦500,000 per year. The calculator lets you enter your monthly gross salary and customise the salary structure breakdown (basic, housing, transport, and others) to match your payslip. It then computes statutory deductions including employee pension contribution (8% of basic, housing, and transport under the Pension Reform Act) and the National Housing Fund levy (2.5% of basic salary). After deductions and rent relief, your chargeable income is taxed across six progressive bands ranging from 0% to 25%. The result shows your monthly and annual PAYE tax, effective tax rate, and take-home pay, with a line-by-line breakdown of every deduction and a table showing exactly how much tax applies at each band. This is especially useful for Nigerian employees, HR professionals processing payroll, job seekers evaluating salary offers, and freelancers estimating their tax obligations. All calculations run in your browser — no data is sent to any server. This tool provides estimates for planning purposes and should not be treated as official tax advice. Consult a qualified tax professional or the Federal Inland Revenue Service (FIRS) for definitive guidance on your tax obligations.',
  },
  {
    id: 'cgpang', slug: 'cgpa-calculator-nigeria', name: 'CGPA Calculator Nigeria', desc: 'Calculate CGPA on 5.0 or 4.0 scale',
    emoji: '🎓', tags: ['cgpa', 'gpa', 'nigeria', 'university', 'grades', 'nuc', 'degree classification', 'cgpa calculator'], category: 'Calculators',
    componentPath: 'calculators/CGPACalculatorNigeria',
    seo: {
      title: 'CGPA Calculator Nigeria - Free Online 5.0 & 4.0 Scale | Neetab',
      description: 'Calculate your Nigerian university CGPA on the 5.0 or 4.0 grading scale. See degree classification, GPA per semester, and US 4.0 conversion. Free, instant.',
      h1: 'CGPA Calculator Nigeria (5.0 & 4.0 Scale)',
    },
    howTo: [
      'Select your university\'s grading scale — 5.0 (used by most Nigerian universities) or 4.0 (used by some per the NUC 2017 directive).',
      'For each semester, add your courses with credit units (1-6) and the letter grade you received (A through F). Course names are optional.',
      'Your GPA per semester and cumulative CGPA are calculated instantly. The summary card shows your total credits, quality points, CGPA, and degree classification.',
      'Click "+ Add Semester" to add more semesters. Use the × button to remove individual courses or the Remove button to delete an entire semester.',
    ],
    faq: [
      { q: 'How is CGPA calculated in Nigerian universities?', a: 'CGPA (Cumulative Grade Point Average) is calculated by dividing total quality points by total credit units across all semesters. Quality points for a course equal the credit units multiplied by the grade point. For example, a 3-credit course with a grade of B on a 5.0 scale earns 3 × 4 = 12 quality points. Your CGPA is the sum of all quality points divided by the sum of all credit units. This weighted average means courses with higher credit units have more impact on your CGPA.' },
      { q: 'What is the difference between the 5.0 and 4.0 grading scale?', a: 'The 5.0 scale assigns A=5, B=4, C=3, D=2, E=1, F=0 and is used by the majority of Nigerian universities including UNILAG, University of Ibadan, OAU, UNIBEN, and most federal and state universities. The 4.0 scale assigns A=4, B=3, C=2, D=1, E=0, F=0 and was recommended by the National Universities Commission (NUC) in a 2017 directive, though adoption has been limited. Check your university handbook to confirm which scale your institution uses.' },
      { q: 'What are the degree classifications on a 5.0 scale?', a: 'On the 5.0 scale: First Class is 4.50–5.00, Second Class Upper (2:1) is 3.50–4.49, Second Class Lower (2:2) is 2.40–3.49, Third Class is 1.50–2.39, and Pass is 1.00–1.49. A CGPA below 1.00 generally means the student has failed to meet minimum academic requirements. First Class is the highest distinction and Second Class Upper is the most common target for competitive graduate programmes and employers.' },
      { q: 'What are the degree classifications on a 4.0 scale?', a: 'On the 4.0 scale: First Class is 3.50–4.00, Second Class Upper (2:1) is 3.00–3.49, Second Class Lower (2:2) is 2.00–2.99, and Third Class is 1.00–1.99. This scale does not have a separate "Pass" category — a CGPA below 1.00 is considered a fail. The 4.0 scale classifications are structurally similar to the US GPA system, which makes international comparison slightly more straightforward.' },
      { q: 'How do I convert my Nigerian CGPA to the US 4.0 GPA?', a: 'A common rough conversion is to multiply your 5.0 CGPA by 0.8. For example, a 4.25 CGPA on the 5.0 scale becomes approximately 3.40 on the US 4.0 scale. This is an estimate — credential evaluation services like WES (World Education Services) or ECE use their own proprietary formulas that consider individual course grades, credit hours, and institutional context. If you are applying to a US university or employer that requires a US GPA, use an official credential evaluation rather than a simple multiplication.' },
      { q: 'What credit unit range is used in Nigerian universities?', a: 'Nigerian universities typically assign between 1 and 6 credit units per course. Most lecture courses are 2 or 3 credits. Lab-based courses and practicals are often 1-2 credits. Capstone projects and final-year research are usually 4-6 credits. The credit unit reflects the weekly contact hours — a 3-credit course meets for roughly 3 hours per week over a semester. The total credit load per semester is usually 15-24 credits depending on the programme and university.' },
    ],
    about: 'The CGPA Calculator Nigeria is a free tool for Nigerian university students to calculate their Cumulative Grade Point Average on either the 5.0 or 4.0 grading scale. The 5.0 scale is the traditional system used by the majority of Nigerian universities — including UNILAG, University of Ibadan, Obafemi Awolowo University, University of Benin, Ahmadu Bello University, and most federal, state, and private institutions. The 4.0 scale was recommended by the National Universities Commission (NUC) in a 2017 directive to align with international standards, though adoption has been gradual and most institutions still use the 5.0 system. This calculator lets you add multiple semesters, enter courses with credit units and letter grades, and instantly see your GPA per semester, cumulative CGPA, degree classification (First Class, Second Class Upper, Second Class Lower, Third Class, or Pass), and an approximate conversion to the US 4.0 GPA scale. Quality points are calculated by multiplying each course\'s credit units by the grade point value, then summing across all courses. The CGPA is the total quality points divided by total credit units. Degree classifications follow the standard bands used across Nigerian universities: on the 5.0 scale, First Class requires a minimum CGPA of 4.50, Second Class Upper starts at 3.50, and Second Class Lower starts at 2.40. The US 4.0 conversion uses the common approximation of multiplying the 5.0 CGPA by 0.8, though official credential evaluations by WES or ECE may produce different results. This tool is useful for tracking your academic performance across semesters, estimating where you stand for graduation, evaluating eligibility for scholarships or postgraduate programmes, and preparing transcripts for international applications. All calculations run entirely in your browser — no data is stored or sent anywhere.',
  },
  {
    id: 'waecng', slug: 'waec-grade-calculator-nigeria', name: 'WAEC Grade Calculator', desc: 'Check WAEC credits, aggregate & admission eligibility',
    emoji: '📋', tags: ['waec', 'neco', 'grade', 'nigeria', 'ssce', 'credit', 'aggregate', 'admission', 'o level', 'waec result checker'], category: 'Calculators',
    componentPath: 'calculators/WAECGradeCalculator',
    seo: {
      title: 'WAEC Grade Calculator Nigeria - Free Aggregate Score | Neetab',
      description: 'Calculate your WAEC aggregate score, count credit passes, and check admission eligibility for Medicine, Engineering, Law & more. Free, instant, no sign-up.',
      h1: 'WAEC Grade Calculator Nigeria',
    },
    howTo: [
      'Select up to 9 subjects from the dropdown (English Language and Mathematics are pre-filled). Choose your grade for each subject from A1 to F9.',
      'Your aggregate score (sum of your best 6 grades), number of credit passes (C6 or above), and total passes are calculated instantly.',
      'Review the subject breakdown to see which subjects earned credits (✓), passes (P), or fails (✗).',
      'Scroll to Admission Eligibility to see whether your grades meet the minimum requirements for popular courses like Medicine, Engineering, Law, Accounting, Computer Science, and Nursing.',
    ],
    faq: [
      { q: 'How does the WAEC 9-point grading system work?', a: 'WAEC uses a 9-point scale from A1 (best, 75-100%) to F9 (fail, 0-39%). The grades are: A1 (Excellent), B2 (Very Good), B3 (Good), C4 (Credit), C5 (Credit), C6 (Credit), D7 (Pass), E8 (Pass), F9 (Fail). A "credit pass" means C6 or above — grades A1 through C6. D7 and E8 are considered passes but are not credits. Most university admission requirements specify a minimum of 5 credits, meaning five subjects at C6 or better.' },
      { q: 'What is an aggregate score and how is it calculated?', a: 'The aggregate score is the sum of your best 6 subject grades. Since each grade has a numerical value (A1=1, B2=2, etc.), a lower aggregate is better. The best possible aggregate is 6 (six A1 grades = 6×1 = 6) and the worst usable aggregate is 36 (six C6 grades = 6×6 = 36). Universities and polytechnics sometimes use aggregate scores as a cutoff for post-UTME screening — for example, some competitive programmes may require an aggregate of 12 or lower.' },
      { q: 'What is a credit pass in WAEC?', a: 'A credit pass is any grade from A1 to C6. Grades D7 (Pass) and E8 (Pass) are not considered credit passes even though the candidate technically passed the subject. This distinction matters because virtually all Nigerian university admission requirements specify "five credits" or "credit in English and Mathematics," which means those subjects must be C6 or better. A D7 in a required subject will disqualify you from most programmes, even though it is a pass.' },
      { q: 'Can I use NECO results with this calculator?', a: 'Yes. NECO (National Examinations Council) uses the same A1-F9 grading scale as WAEC. The grade boundaries and point values are identical, so you can enter your NECO grades in this calculator and get the same aggregate score and eligibility results. Most Nigerian universities accept both WAEC and NECO results, and you can even combine results from two sittings (one WAEC and one NECO) to make up the required five credits, though each university has its own policy on combining sittings.' },
      { q: 'What subjects are required for Medicine in Nigerian universities?', a: 'Medicine and Surgery at most Nigerian universities requires a minimum of five credit passes including English Language, Mathematics, Physics, Chemistry, and Biology. Some universities require all five in a single sitting, while others accept two sittings. In addition to O-Level results, candidates must score above the university cutoff in JAMB UTME and pass the post-UTME screening. Competitive medical schools like UNILAG, UI, and UCH may require higher grade quality (e.g., mostly A1s and B2s) in practice even if C6 is the official minimum.' },
      { q: 'Is D7 a pass or a fail in WAEC?', a: 'D7 is officially a "Pass" in WAEC — the candidate demonstrated some knowledge of the subject. However, D7 is not a credit pass. This distinction is critical for university admission: if a programme requires "credit in Mathematics" and you have D7, you do not meet the requirement. D7 may be acceptable for some polytechnic programmes or as a non-required elective, but for the five core credits needed for most university courses, you need C6 or better. Many students retake WAEC or NECO to upgrade a D7 to a credit.' },
    ],
    about: 'The WAEC Grade Calculator is a free tool for Nigerian students to calculate their aggregate score, count credit passes, and check admission eligibility based on their WAEC or NECO O-Level results. WAEC (West African Examinations Council) administers the WASSCE (West African Senior School Certificate Examination), the primary secondary school leaving exam taken by millions of students across West Africa every year. The exam uses a 9-point grading scale from A1 (Excellent, 75-100%) to F9 (Fail, 0-39%). A credit pass — any grade from A1 to C6 — is the standard minimum for university admission in Nigeria. Most programmes require at least five credit passes including English Language and Mathematics. This calculator lets you enter up to 9 subjects with their grades, then instantly shows your aggregate score (sum of your best 6 grades, where lower is better), the number of credit passes earned, and a subject-by-subject breakdown indicating whether each grade is a credit, pass, or fail. The admission eligibility checker compares your results against the standard minimum requirements for six popular courses: Medicine and Surgery, Engineering, Law, Accounting and Business, Computer Science, and Nursing. Each course has specific required subjects — for example, Medicine requires credits in English, Maths, Physics, Chemistry, and Biology, while Law requires English, Literature in English, and at least a C6 in Mathematics. The tool shows a clear checkmark or cross for each programme and lists any missing subject credits. Requirements shown are general guidelines followed by most federal and state universities. Specific cutoffs and subject combinations vary by institution and may change each admission cycle. Always verify requirements with your chosen university\'s admissions office. All calculations run entirely in your browser. No data is stored or sent to any server.',
  },
  // ═══ DESIGN TOOLS ═══
  {
    id: 'borderradius', slug: 'css-border-radius-generator', name: 'Border Radius Generator', desc: 'Generate CSS border-radius visually',
    emoji: '⬛', tags: ['css', 'border-radius', 'design', 'rounded'], category: 'Design Tools',
    componentPath: 'design/CSSBorderRadiusGenerator',
    seo: {
      title: 'CSS Border Radius Generator - Free Online | Neetab',
      description: 'Generate CSS border-radius values visually free online. Set uniform or per-corner radii with a live preview. Copy the ready-to-use CSS instantly.',
      h1: 'CSS Border Radius Generator',
    },
    howTo: [
      'Use the uniform slider to round all corners equally, or toggle individual corners for asymmetric shapes.',
      'See a live preview of the shape as you adjust the values.',
      'Copy the generated CSS border-radius value and paste it into your stylesheet.',
    ],
    faq: [
      { q: 'Can I set different radius for each corner?', a: 'Yes. Toggle individual corner mode to set top-left, top-right, bottom-right, and bottom-left independently.' },
      { q: 'What units are supported?', a: 'The generator uses pixel values. You can also use percentage (50% creates a circle/ellipse) - the preview shows approximate results.' },
    ],
  },
  {
    id: 'boxshadow', slug: 'css-box-shadow-generator', name: 'Box Shadow Generator', desc: 'Generate CSS box-shadow visually',
    emoji: '🌑', tags: ['css', 'shadow', 'design', 'generator'], category: 'Design Tools',
    componentPath: 'design/CSSBoxShadowGenerator',
    seo: {
      title: 'CSS Box Shadow Generator - Free Online | Neetab',
      description: 'Create CSS box-shadow effects visually free online. Layer multiple shadows, adjust blur, spread, offset, and color. Copy CSS with one click.',
      h1: 'CSS Box Shadow Generator',
    },
    howTo: [
      'Use the sliders to adjust horizontal offset, vertical offset, blur radius, and spread radius.',
      'Pick a shadow color and opacity. Toggle "Inset" for inner shadows. Add multiple shadow layers.',
      'Copy the generated CSS box-shadow code and paste it into your stylesheet.',
    ],
    faq: [
      { q: 'Can I add multiple shadow layers?', a: 'Yes. Click "Add Layer" to stack multiple shadows. Multi-layer shadows create depth effects and glows. Each layer can have different settings.' },
      { q: 'What is the spread radius?', a: 'The spread radius expands or contracts the shadow beyond the blur. Positive values make the shadow larger than the element; negative values make it smaller.' },
      { q: 'What is an inset shadow?', a: 'An inset shadow is cast inside the element rather than outside, creating a pressed-in or sunken appearance. Useful for input fields and buttons.' },
    ],
  },
  {
    id: 'colorblind', slug: 'color-blindness-simulator', name: 'Color Blindness Simulator', desc: 'Simulate how designs look to color-blind users',
    emoji: '🎨', tags: ['color', 'accessibility', 'vision', 'design', 'a11y'], category: 'Design Tools',
    componentPath: 'design/ColorBlindnessSimulator',
    seo: {
      title: 'Color Blindness Simulator - Free Design Tool | Neetab',
      description: 'Simulate how your designs look to people with color blindness free online. Supports protanopia, deuteranopia, tritanopia, and achromatopsia.',
      h1: 'Color Blindness Simulator',
    },
    howTo: [
      'Upload an image of your design, screenshot, or any visual.',
      'Switch between simulation modes: Protanopia (red-blind), Deuteranopia (green-blind), Tritanopia (blue-blind), and Achromatopsia (total color blindness).',
      'Compare the original and simulated views side by side to identify accessibility issues.',
    ],
    faq: [
      { q: 'What types of color blindness are simulated?', a: 'Protanopia (reduced red sensitivity, affecting ~1% of males), Deuteranopia (reduced green sensitivity, ~1% of males), Tritanopia (reduced blue sensitivity, rare), and Achromatopsia (no color perception, very rare).' },
      { q: 'Why does this matter for design?', a: 'About 8% of males and 0.5% of females have some form of color vision deficiency. Checking your designs ensures they are usable and readable for all users, which is also a WCAG accessibility requirement.' },
      { q: 'Is my image uploaded to a server?', a: 'No. The simulation uses CSS filter matrices and Canvas API entirely in your browser.' },
    ],
  },
  {
    id: 'colorcontrast', slug: 'color-contrast-checker', name: 'Color Contrast Checker', desc: 'Check WCAG color contrast ratios',
    emoji: '👁️', tags: ['color', 'contrast', 'accessibility', 'wcag', 'a11y'], category: 'Design Tools',
    componentPath: 'design/ColorContrastChecker',
    seo: {
      title: 'Color Contrast Checker - WCAG Accessibility | Neetab',
      description: 'Check WCAG 2.1 color contrast ratios free online. Verify AA and AAA compliance for normal and large text. Essential for accessible design.',
      h1: 'WCAG Color Contrast Checker',
    },
    howTo: [
      'Choose a foreground (text) color and a background color using the color pickers or hex inputs.',
      'The contrast ratio is calculated instantly using the WCAG 2.1 relative luminance formula.',
      'Review the AA and AAA pass/fail results for normal text and large text. Preview how the colors look together.',
    ],
    faq: [
      { q: 'What is WCAG contrast ratio?', a: 'WCAG (Web Content Accessibility Guidelines) defines minimum contrast ratios to ensure text is readable for people with visual impairments. AA requires 4.5:1 for normal text (3:1 for large text). AAA requires 7:1 (4.5:1 for large text).' },
      { q: 'What counts as large text?', a: 'Large text is defined as 18pt (24px) or larger for regular weight, or 14pt (18.67px) or larger for bold weight. Large text has lower contrast requirements.' },
      { q: 'How is the contrast ratio calculated?', a: 'The formula uses relative luminance: each color channel is linearized from sRGB, weighted (R: 21.26%, G: 71.52%, B: 7.22%), then contrast = (lighter + 0.05) / (darker + 0.05).' },
    ],
  },
  {
    id: 'color', slug: 'color-converter', name: 'Color Converter', desc: 'HEX ↔ RGB ↔ HSL',
    emoji: '🔵', tags: ['design', 'css', 'color', 'hex', 'rgb'], category: 'Design Tools',
    componentPath: 'design/ColorConverter',
    seo: {
      title: 'Color Converter - HEX RGB HSL Free Online | Neetab',
      description: 'Convert colors between HEX, RGB, HSL, and CMYK free online. Paste any color format and get all equivalents instantly. Great for CSS and design.',
      h1: 'Color Converter - HEX, RGB, HSL',
    },
    howTo: [
      'Type a color value in any supported format - HEX (#ff5733), RGB (255, 87, 51), or HSL (11, 100%, 60%).',
      'All other format representations update instantly as you type.',
      'Click the copy icon next to any format to copy it for use in CSS, design tools, or code.',
    ],
    faq: [
      { q: 'What color formats are supported?', a: 'Convert between HEX, RGB, and HSL formats instantly. Enter any format and see all the equivalent values in real time.' },
      { q: 'Can I use the visual color picker?', a: 'Yes. Click the color swatch or picker area to open a visual color chooser. Drag the picker to any hue and saturation, and all format values update automatically.' },
      { q: 'How do I copy a color value?', a: 'Click the copy icon next to any color format - HEX, RGB, or HSL - to instantly copy it to your clipboard, ready to paste into your CSS, Figma, Sketch, or any other tool.' },
    ],
  },
  {
    id: 'palette', slug: 'color-palette-generator', name: 'Color Palette', desc: 'Generate beautiful color schemes',
    emoji: '🎨', tags: ['design', 'color', 'css', 'palette'], category: 'Design Tools', popular: true,
    componentPath: 'design/ColorPalette',
    seo: {
      title: 'Color Palette Generator - Free CSS Colors | Neetab',
      description: 'Generate beautiful color palettes free online. Create harmonious color schemes - complementary, triadic, analogous. Copy HEX, RGB, or HSL values.',
      h1: 'Free Color Palette Generator',
    },
    howTo: [
      'Click Generate for a random palette, or enter a specific base hex color to start from a particular hue.',
      'Choose a color harmony - complementary, analogous, triadic, split-complementary - to shape the mood of your palette.',
      'Lock any colors you want to keep, then click Generate again to refresh only the unlocked swatches. Click any color to copy its hex code.',
    ],
    faq: [
      { q: 'How are the color palettes generated?', a: 'Palettes are generated using established color theory harmony rules. Complementary palettes use colors directly opposite on the color wheel for high contrast and visual energy. Analogous palettes use colors that sit adjacent on the wheel for a calm, cohesive look. Triadic palettes use three colors equally spaced around the wheel for a balanced, vibrant result. Split-complementary palettes take a base color and the two colors flanking its complement, giving contrast with more variety than a pure complementary pair.' },
      { q: 'Can I export the palette?', a: 'Yes. Click any individual color swatch to instantly copy its HEX code to your clipboard. The Export button gives you the full palette in multiple formats: as CSS custom properties (ready to paste into your stylesheet), as a list of HEX values, or as RGB values. This makes it easy to use your palette in any design tool, code editor, or presentation software.' },
      { q: 'Can I lock a color and regenerate the rest?', a: 'Yes. Click the lock icon on any swatch to pin that color in place, then click Generate to refresh the remaining unlocked swatches. This is particularly useful when you have a specific brand color that must stay fixed and you want to find harmonious accent colors around it. You can lock multiple swatches at once, leaving only one free to explore variations.' },
      { q: 'Are the palettes free for commercial use?', a: 'Yes, completely. All generated palettes are free to use in personal projects, client work, commercial products, and any other application without any attribution requirement. Colors themselves cannot be copyrighted or trademarked (with narrow exceptions for specific brand color claims), so you are free to use any generated palette however you like.' },
    ],
    about: 'A color palette generator is an essential tool for designers, developers, and anyone creating visual content. Good color choices make designs feel intentional and professional, while poor color combinations create visual tension and reduce readability. This tool applies color theory principles - complementary, analogous, triadic, and split-complementary harmonies - to generate palettes that are mathematically balanced and visually pleasing. Start from any hex color that matches your brand or preference, choose a harmony type, and explore variations by locking colors you like while regenerating the rest. The tool generates all colors in the browser with no server required, and you can export in HEX, RGB, or as CSS custom properties for immediate use in your project.',
  },
  {
    id: 'colorfrompic', slug: 'color-palette-from-image', name: 'Color Palette from Image', desc: 'Extract colors from any image or PDF',
    emoji: '🖼️', tags: ['color', 'palette', 'extract', 'image', 'pdf', 'design'], category: 'Design Tools', popular: true,
    componentPath: 'design/ColorPickerFromImage',
    seo: {
      title: 'Color Palette from Image - Extract Colors Free | Neetab',
      description: 'Extract dominant colors from any image or PDF free online. Uses K-means clustering to find the most prominent colors. Copy HEX, RGB, or HSL codes.',
      h1: 'Color Palette Extractor from Image',
    },
    howTo: [
      'Upload an image (PNG, JPG, WebP) or a PDF file by clicking the upload area or dragging it in.',
      'The dominant colors are extracted automatically using k-means clustering and shown as a palette.',
      'Click any color swatch or value to copy it. Adjust the number of colors (4-12) using the count buttons. Use "Copy all HEX codes" to export the full palette.',
    ],
    faq: [
      { q: 'How does color extraction work?', a: 'The tool samples pixels from your image and applies k-means clustering, a machine learning algorithm that groups similar colors together iteratively until stable clusters form. Each cluster\'s average color becomes one swatch in your palette. The result is the set of colors that best represent the visual content of your image - not just the most frequent pixels, but the most perceptually distinct and representative hues. This produces much more useful palettes than a simple pixel frequency count would.' },
      { q: 'How many colors can I extract?', a: 'You can extract between 4 and 12 dominant colors. Fewer colors (4-6) gives you the essential, most prominent hues - useful for identifying a brand\'s core colors or a photograph\'s dominant mood. More colors (8-12) reveals more of the subtle palette with secondary and accent colors included. You can switch between different counts after uploading without needing to re-upload the file - results update instantly.' },
      { q: 'Does this work with PDFs?', a: 'Yes. When you upload a PDF, the first page is rendered at full resolution in the browser using PDF.js, and then color extraction runs on that rendered image. This is particularly useful for extracting brand colors from a company\'s PDF brochure, presentation slide, or marketing document when you want to match their visual style.' },
      { q: 'Is my file uploaded to a server?', a: 'No. The entire color extraction process runs locally in your browser. Images are loaded onto an HTML Canvas element and processed using JavaScript. PDFs are rendered using PDF.js, also entirely client-side. Your files - whether they are personal photos, confidential business documents, or brand assets - never leave your device and are never transmitted to any server.' },
      { q: 'Can I use the extracted colors in my designs?', a: 'Yes. Click any color swatch to copy its value in HEX, or toggle to copy as RGB or HSL format instead. All three formats are supported because different tools have different preferences - CSS uses HEX or RGB, Figma accepts all three, and some design software prefers HSL. Use the "Copy all HEX codes" button to export the complete palette as a comma-separated list for quick import into design tools.' },
    ],
    about: 'Extracting colors from an image is one of the most practical tasks in design and branding work. When you need to match the color palette of an existing logo, photograph, or brand asset, manually eyedropping colors is tedious and imprecise. This tool automates the process using k-means clustering, a mathematical algorithm that identifies the most visually significant and distinct colors in any image. Upload a product photo to extract its color story for your e-commerce listing, analyze a competitor\'s branding from their PDF, match accent colors to a hero image on your website, or build a cohesive design system from a reference image. Results appear instantly with HEX, RGB, and HSL values ready to copy.',
  },
  {
    id: 'favicon', slug: 'favicon-generator', name: 'Favicon Generator', desc: 'Generate all favicon sizes from one image',
    emoji: '⭐', tags: ['favicon', 'icon', 'website', 'pwa', 'apple-touch'], category: 'Design Tools',
    componentPath: 'design/FaviconGenerator',
    seo: {
      title: 'Favicon Generator - All Sizes Free | Neetab',
      description: 'Generate all favicon sizes from one image free online. Outputs 16x16, 32x32, 48x48, 180x180 and more. Download as ICO or PNG, no sign-up.',
      h1: 'Free Favicon Generator',
    },
    howTo: [
      'Upload a square PNG or SVG image. For best results, use a 512×512 pixel image or larger with a simple, bold design.',
      'All required favicon sizes are generated automatically: 16×16, 32×32, 48×48, 180×180 (Apple Touch), 192×192, and 512×512.',
      'Download individual sizes as PNG files, or use the Download All button to get a ZIP containing every size at once.',
    ],
    faq: [
      { q: 'What sizes do I need for a favicon?', a: 'At minimum: 16×16 and 32×32 for browser tabs, 180×180 for Apple Touch Icon (iOS home screen), and 192×192 and 512×512 for Android and PWA manifest icons. This tool generates all of them from a single upload.' },
      { q: 'What image format should I upload?', a: 'PNG or SVG work best. Use a square image for optimal results - the tool will resize and center automatically. Avoid complex photographs; simple logos and icons look much cleaner at small sizes.' },
      { q: 'Are the favicons generated locally?', a: 'Yes. All processing happens in your browser using the HTML Canvas API. No images are uploaded to any server.' },
      { q: 'How do I add favicons to my website?', a: 'Place the generated files in your site\'s root directory (or /public folder), then add the appropriate link tags in your HTML <head>: <link rel="icon" sizes="32x32" href="/favicon-32x32.png"> for each size, and <link rel="apple-touch-icon" href="/apple-touch-icon.png"> for iOS.' },
    ],
  },
  {
    id: 'gradient', slug: 'css-gradient-generator', name: 'Gradient Maker', desc: 'Create CSS gradients visually',
    emoji: '🌈', tags: ['design', 'css', 'background', 'gradient'], category: 'Design Tools',
    componentPath: 'design/GradientMaker',
    seo: {
      title: 'CSS Gradient Generator - Free Online | Neetab',
      description: 'Create CSS linear and radial gradients visually free online. Pick colors, adjust direction, and copy the CSS gradient code instantly. No sign-up.',
      h1: 'CSS Gradient Generator',
    },
    howTo: [
      'Choose a gradient type - linear (directional), radial (circular), or conic (angular sweep).',
      'Click the color stops on the gradient bar to edit them. Add new stops by clicking on the bar; delete stops by dragging them off.',
      'Copy the generated CSS code with one click and paste it as a background property in your stylesheet.',
    ],
    faq: [
      { q: 'What gradient types are supported?', a: 'Linear, radial, and conic gradients are all supported. You can customize the angle or position, adjust color stops, and copy the complete CSS background property code.' },
      { q: 'Can I use more than two colors?', a: 'Yes. Add multiple color stops anywhere along the gradient bar to create complex multi-color transitions. Each stop\'s position can be adjusted precisely by dragging.' },
      { q: 'How do I use the generated CSS?', a: 'Click the Copy CSS button to copy the gradient declaration, then paste it as a background or background-image property in your CSS. It works in all modern browsers without any prefix.' },
    ],
  },
  // ═══ DEV TOOLS ═══
  {
    id: 'barcode', slug: 'barcode-generator', name: 'Barcode Generator', desc: 'Create barcodes in multiple formats',
    emoji: '|||', tags: ['barcode', 'code128', 'ean', 'upc', 'generator'], category: 'Dev Tools',
    componentPath: 'generators/BarcodeGenerator',
    seo: {
      title: 'Barcode Generator - Free Code128 EAN UPC | Neetab',
      description: 'Generate barcodes free online. Supports Code128, EAN-13, EAN-8, UPC-A formats. Download as PNG or SVG. No sign-up, instant results.',
      h1: 'Free Barcode Generator',
    },
    howTo: [
      'Select the barcode format you need - Code 128 for general-purpose alphanumeric content, EAN-13 or UPC-A for retail products.',
      'Enter your barcode data in the input field. Note that EAN-13 requires exactly 12 digits (the 13th check digit is added automatically).',
      'Click Download PNG to save a high-quality barcode image ready for print labels, packaging, or digital use.',
    ],
    faq: [
      { q: 'What barcode formats are supported?', a: 'Code 128, Code 39, EAN-13, EAN-8, UPC-A, ITF-14, and MSI. Code 128 is the most versatile and supports all alphanumeric characters with high data density.' },
      { q: 'What format should I use for product barcodes?', a: 'Use EAN-13 for international retail products (found on most global consumer goods), UPC-A for US and Canada retail, and EAN-8 for smaller packages where space is limited. These formats require specific digit counts.' },
      { q: 'Can I download the barcode?', a: 'Yes. Click Download PNG to save a high-quality, scalable PNG image of your barcode suitable for both print and digital applications.' },
      { q: 'Is the barcode generated locally?', a: 'Yes. All barcode generation runs in your browser using the JsBarcode library. Nothing is sent to any server.' },
      { q: 'Why does EAN-13 require exactly 12 digits?', a: 'EAN-13 has a 13th check digit that is automatically calculated from the first 12 digits using the Luhn-like algorithm. You only need to enter the first 12 digits - the tool adds the check digit for you.' },
    ],
  },
  {
    id: 'base64', slug: 'base64-encoder-decoder', name: 'Base64 Encoder', desc: 'Encode & decode Base64 strings',
    emoji: '🔡', tags: ['base64', 'encode', 'decode', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/Base64Tool',
    seo: {
      title: 'Base64 Encoder Decoder - Free Online | Neetab',
      description: 'Encode and decode Base64 strings free online. Supports plain text and binary data. Instant results with copy button. No sign-up required.',
      h1: 'Base64 Encoder and Decoder',
    },
    howTo: [
      'Enter or paste the text you want to encode in the input box. The Base64-encoded output appears instantly.',
      'To decode, switch to Decode mode and paste a Base64 string - the original text is revealed immediately.',
      'Use the Swap button to quickly reverse direction, or Copy to copy the output to your clipboard.',
    ],
    faq: [
      { q: 'What is Base64 encoding?', a: 'Base64 is a way of encoding binary data as ASCII text using 64 printable characters (A-Z, a-z, 0-9, +, /). It is widely used to safely transmit binary content through systems that only handle text.' },
      { q: 'When would I need Base64?', a: 'Common uses include embedding images in HTML/CSS as data URLs (data:image/png;base64,...), sending binary data in JSON API payloads, encoding email attachments in MIME format, and creating Basic Auth headers (username:password encoded as Base64).' },
      { q: 'Is Base64 encryption?', a: 'No. Base64 is encoding, not encryption. It makes data safe to transport through text-based systems but provides zero security. Anyone can instantly decode a Base64 string. Never use it to protect sensitive data - use proper encryption instead.' },
    ],
  },
  {
    id: 'base64img', slug: 'base64-to-image', name: 'Base64 to Image', desc: 'Decode Base64 strings to images',
    emoji: '🖼️', tags: ['base64', 'image', 'decode', 'data-url', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/Base64toImage',
    seo: {
      title: 'Base64 to Image Converter - Free Online | Neetab',
      description: 'Decode Base64 strings to images free online. Accepts raw Base64 or data URLs. Auto-detects format (PNG, JPEG, GIF, WebP). Preview and download.',
      h1: 'Base64 to Image Converter',
    },
    howTo: [
      'Paste a Base64 string or a full data URL (data:image/png;base64,...) into the input.',
      'The image preview appears instantly.',
      'Click Download to save the decoded image to your device.',
    ],
    faq: [
      { q: 'What is the difference between a data URL and raw Base64?', a: 'A data URL includes a MIME type prefix: data:image/png;base64,... A raw Base64 string is just the encoded data without that prefix. This tool handles both automatically.' },
      { q: 'Is my data sent to a server?', a: 'No. Decoding happens entirely in your browser using the built-in atob() function.' },
    ],
  },
  {
    id: 'cronparser', slug: 'cron-expression-parser', name: 'Cron Expression Parser', desc: 'Parse and explain cron expressions with next run times',
    emoji: '⏰', tags: ['cron', 'schedule', 'linux', 'devops', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/CronParser',
    seo: {
      title: 'Cron Expression Parser - Explain Cron Jobs Free | Neetab',
      description: 'Parse and explain cron expressions free online. See a human-readable description and the next 5 scheduled run times. Includes 12 common presets.',
      h1: 'Cron Expression Parser and Explainer',
    },
    howTo: [
      'Type or paste a cron expression in the input field (5 fields: minute hour day month weekday).',
      'Read the plain-English explanation for each field below the input.',
      'Check the "Next 5 executions" section to see exactly when the job will run.',
    ],
    faq: [
      { q: 'What is a cron expression?', a: 'A cron expression is a string of 5 space-separated fields that defines a schedule for automated tasks on Unix-like systems. The fields are: minute (0-59), hour (0-23), day of month (1-31), month (1-12), and day of week (0-6, where 0 is Sunday).' },
      { q: 'What does */15 mean?', a: '*/15 means "every 15 units". In the minute field, */15 runs the job at 0, 15, 30, and 45 minutes past the hour. The asterisk means "starting from the minimum value", and the number after the slash is the step.' },
    ],
  },
  {
    id: 'cssminify', slug: 'css-minifier', name: 'CSS Minifier', desc: 'Minify or beautify CSS code',
    emoji: '🎨', tags: ['css', 'minify', 'beautify', 'compress', 'dev'], category: 'Dev Tools', wide: true,
    componentPath: 'devtools/CSSMinifier',
    seo: {
      title: 'CSS Minifier and Beautifier - Free Online | Neetab',
      description: 'Minify or beautify CSS code free online. Reduce CSS file size for faster page loads or format minified CSS for readability. Instant, no sign-up.',
      h1: 'CSS Minifier and Beautifier',
    },
    howTo: [
      'Paste your CSS code into the input box.',
      'Click Minify to compress your CSS by removing whitespace, comments, and redundant characters - or click Beautify to expand minified CSS into readable, indented code.',
      'The size savings or expansion are displayed above the output. Click Copy to copy the result.',
    ],
    faq: [
      { q: 'How much can CSS minification save?', a: 'Typically 20-50% of file size by removing comments, whitespace between rules, and unnecessary characters. Highly commented or loosely formatted CSS can see even greater savings. Every kilobyte saved improves page load speed.' },
      { q: 'Does minification change how my CSS works?', a: 'No. Minification only removes formatting and comments. The CSS selectors, properties, and values - and therefore the visual rendering - remain completely identical to the original.' },
      { q: 'What is the difference between minification and compression?', a: 'Minification removes whitespace and comments from the source code itself, permanently reducing the file size. HTTP compression (gzip or brotli) is applied by the web server at transfer time, compressing the file for transmission without changing the stored file. Both techniques are complementary and can be used together.' },
    ],
  },
  {
    id: 'csv2json', slug: 'csv-to-json', name: 'CSV to JSON', desc: 'Convert CSV data to JSON format',
    emoji: '📋', tags: ['csv', 'json', 'convert', 'data', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/CSVtoJSON',
    seo: {
      title: 'CSV to JSON Converter - Free Online | Neetab',
      description: 'Convert CSV data to JSON format free online. Auto-detects delimiters, supports header rows. Preview, copy, or download the JSON output instantly.',
      h1: 'Free CSV to JSON Converter',
    },
    howTo: [
      'Paste CSV data into the input box or upload a CSV file.',
      'Toggle "Header row" if your CSV has column headers to use them as JSON keys.',
      'The JSON output is generated instantly. Copy or download the result.',
    ],
    faq: [
      { q: 'Does it handle CSV with headers?', a: 'Yes. When "Header row" is enabled, the first row becomes the key names in each JSON object. Without headers, rows are converted to arrays.' },
      { q: 'What delimiters are supported?', a: 'Comma, semicolon, and tab delimiters are auto-detected. Most CSV files use commas, but European formats often use semicolons.' },
      { q: 'Is my data sent to a server?', a: 'No. Conversion uses PapaParse in your browser. Your data never leaves your device.' },
    ],
  },
  {
    id: 'hash', slug: 'hash-generator', name: 'Hash Generator', desc: 'MD5, SHA-1, SHA-256, SHA-512',
    emoji: '#️⃣', tags: ['hash', 'md5', 'sha', 'checksum', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/HashGenerator',
    seo: {
      title: 'Hash Generator - MD5 SHA-1 SHA-256 Free | Neetab',
      description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes free online. Instant cryptographic hash computation for text strings. Copy with one click.',
      h1: 'Hash Generator - MD5, SHA-1, SHA-256',
    },
    howTo: [
      'Type or paste the text you want to hash into the input field.',
      'All hash formats - MD5, SHA-1, SHA-256, and SHA-512 - are generated simultaneously and update in real time as you type.',
      'Click the copy icon next to any hash to copy it to your clipboard.',
    ],
    faq: [
      { q: 'What is the difference between MD5 and SHA-256?', a: 'MD5 produces a 128-bit hash and is fast but cryptographically broken - it should not be used for security purposes. SHA-256 produces a 256-bit hash and is the current standard for secure hashing, used in TLS certificates, code signing, and blockchain.' },
      { q: 'What are hashes used for?', a: 'Hashes verify file integrity (checksums), store passwords securely, create digital signatures, and detect data tampering. A hash is a fixed-size fingerprint of any input - even a single character change produces a completely different hash.' },
      { q: 'Is my data sent to a server?', a: 'No. All hashing runs in your browser using the Web Crypto API (for SHA family) and pure JavaScript (for MD5). Your input never leaves your device.' },
    ],
  },
  {
    id: 'htmlformat', slug: 'html-formatter', name: 'HTML Formatter', desc: 'Beautify or minify HTML code',
    emoji: '🏷️', tags: ['html', 'format', 'beautify', 'minify', 'dev'], category: 'Dev Tools', wide: true,
    componentPath: 'devtools/HTMLFormatter',
    seo: {
      title: 'HTML Formatter and Minifier - Free Online | Neetab',
      description: 'Beautify or minify HTML code free online. Format messy HTML with proper indentation or compress HTML to reduce file size. Instant, no sign-up.',
      h1: 'HTML Formatter and Minifier',
    },
    howTo: [
      'Paste your HTML code into the input box.',
      'Click Beautify to add proper indentation and formatting, or Minify to collapse it into a single compact line.',
      'Copy the output or see the size savings percentage.',
    ],
    faq: [
      { q: 'Does beautifying affect how the HTML renders?', a: 'No. Adding whitespace between tags does not change how browsers render the HTML. The visual output remains identical.' },
      { q: 'Is this safe for production HTML?', a: 'Minified HTML is safe for production and reduces page size. Always test in a browser after minifying to confirm nothing was accidentally altered.' },
    ],
  },
  {
    id: 'html2md', slug: 'html-to-markdown', name: 'HTML to Markdown', desc: 'Convert HTML code to clean Markdown',
    emoji: '⬇️', tags: ['html', 'markdown', 'convert', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/HTMLtoMarkdown',
    seo: {
      title: 'HTML to Markdown Converter - Free Online | Neetab',
      description: 'Convert HTML to Markdown free online. Paste any HTML and get clean Markdown instantly. Choose heading and code block styles. No sign-up required.',
      h1: 'Free HTML to Markdown Converter',
    },
    howTo: [
      'Paste your HTML code into the input box.',
      'Choose your preferred heading style (ATX # or Setext underline) and code block style.',
      'The Markdown output updates instantly - copy it or download as a .md file.',
    ],
    faq: [
      { q: 'What is HTML to Markdown conversion used for?', a: 'Developers use it to migrate content from HTML-based CMS platforms to Markdown-based static site generators like Jekyll, Hugo, or Astro. It also helps when writing README files or documentation from existing HTML content.' },
      { q: 'Does it handle complex HTML like tables?', a: 'Yes, the converter handles headings, paragraphs, bold, italic, links, images, ordered and unordered lists, code blocks, blockquotes, and basic tables.' },
    ],
  },
  {
    id: 'img2base64', slug: 'image-to-base64', name: 'Image to Base64', desc: 'Encode images as Base64 data URLs',
    emoji: '🖼️', tags: ['base64', 'image', 'encode', 'data-url', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/ImageToBase64',
    seo: {
      title: 'Image to Base64 Converter - Free Online | Neetab',
      description: 'Convert images to Base64 data URLs free online. Supports JPEG, PNG, GIF, WebP, SVG. Copy the data URL or raw Base64 string instantly.',
      h1: 'Image to Base64 Converter',
    },
    howTo: [
      'Upload a PNG, JPG, WebP, GIF, or SVG image by clicking the upload area or dragging it in.',
      'The full data URL (for use in <img src="..."> or CSS background-image) and the raw Base64 string are shown immediately.',
      'Click Copy next to either output to copy it for use in your code.',
    ],
    faq: [
      { q: 'What is a Base64 data URL?', a: 'A data URL embeds the image directly into HTML or CSS as a Base64-encoded string instead of referencing an external file. Format: data:image/png;base64,iVBORw0KGgo... - the browser renders it without a network request.' },
      { q: 'When should I use Base64 images?', a: 'Base64 images are useful for small icons and logos that should be bundled with HTML/CSS, email templates (which cannot use external images reliably), and offline-first web apps that need to embed assets.' },
      { q: 'Does Base64 increase file size?', a: 'Yes. Base64 encoding increases the data size by approximately 33% compared to the binary image file. Use it selectively for small images - large images are better served as external files.' },
      { q: 'Is my image uploaded to a server?', a: 'No. The encoding uses the browser\'s built-in FileReader API. Your image never leaves your device.' },
    ],
  },
  {
    id: 'json', slug: 'json-formatter', name: 'JSON Formatter', desc: 'Format, validate & minify JSON',
    emoji: '{ }', tags: ['json', 'format', 'validate', 'minify', 'dev'], category: 'Dev Tools', popular: true,
    componentPath: 'generators/JSONFormatter',
    seo: {
      title: 'JSON Formatter and Validator - Free Online | Neetab',
      description: 'Format, validate, and minify JSON free online. Instantly beautify minified JSON or compress formatted JSON. Highlights syntax errors in real time.',
      h1: 'JSON Formatter and Validator',
    },
    howTo: [
      'Paste your JSON into the input box. It is validated and formatted automatically with syntax highlighting.',
      'If your JSON has errors, they are highlighted with a message showing the exact location of the problem.',
      'Use the Minify button to compress JSON for production use, or adjust indentation (2 spaces, 4 spaces, tabs) using the format options.',
    ],
    faq: [
      { q: 'Does this validate my JSON?', a: 'Yes. The formatter runs your JSON through a strict parser and immediately highlights any errors with a descriptive message pinpointing the location of the problem. Common mistakes detected include missing commas between elements, unquoted object keys, trailing commas after the last element (valid in JavaScript but not in JSON), mismatched brackets and braces, and incorrect data types. This makes it easy to find and fix malformed JSON from API responses, log files, or configuration files.' },
      { q: 'Can I minify JSON?', a: 'Yes. The Minify button strips all whitespace, newlines, and indentation to produce the most compact possible JSON string. Minified JSON is ideal for API responses where bandwidth matters, configuration files embedded in code, data serialised for storage or transmission, and any situation where readability is secondary to file size. Minified JSON is functionally identical to formatted JSON - it contains exactly the same data.' },
      { q: 'Is my JSON data private?', a: 'Yes, completely. All formatting, validation, and minification happen directly in your browser using the built-in JavaScript JSON.parse and JSON.stringify functions. Your JSON data is never transmitted to any server, never logged, and never stored. This means you can safely paste API keys in configuration JSON, database query results, internal business data, or any sensitive JSON without privacy concerns.' },
      { q: 'What indentation options are available?', a: 'You can choose between 2 spaces (the most common default in JavaScript projects and style guides like Airbnb and StandardJS), 4 spaces (common in Python and some older JavaScript codebases), or tabs (preferred in Go and some other languages). The choice is purely aesthetic - all three produce functionally identical JSON that any parser will read correctly.' },
    ],
    about: 'JSON is the universal data interchange format for modern APIs, configuration files, and web applications, but raw JSON is often hard to read - especially when it arrives minified (all on one line) from an API response or log file. This formatter instantly beautifies JSON with proper indentation and syntax highlighting, making it easy to inspect, debug, and understand the structure of any JSON data. It also validates your JSON in real time, catching syntax errors before they cause issues in your code. Beyond formatting, it can minify JSON back to a compact form for production use. Commonly used by developers debugging API responses, backend engineers reviewing log data, and anyone working with configuration files in JSON format.',
  },
  {
    id: 'json2csv', slug: 'json-to-csv', name: 'JSON to CSV', desc: 'Convert JSON arrays to CSV files',
    emoji: '📊', tags: ['json', 'csv', 'convert', 'data', 'export'], category: 'Dev Tools',
    componentPath: 'devtools/JSONtoCSV',
    seo: {
      title: 'JSON to CSV Converter - Free Online | Neetab',
      description: 'Convert JSON arrays to CSV format free online. Automatically maps object keys to column headers. Download as .csv or copy to clipboard.',
      h1: 'Free JSON to CSV Converter',
    },
    howTo: [
      'Paste a JSON array (an array of objects) into the input box.',
      'The CSV output is generated instantly. Column headers are derived from the object keys in your JSON.',
      'Click Copy to copy the CSV text, or Download CSV to save the file directly.',
    ],
    faq: [
      { q: 'What JSON structure does this accept?', a: 'The converter expects a JSON array of objects: [{"key": "value"}, ...]. Each object becomes a row, and each unique key across all objects becomes a column header. Single objects are also supported.' },
      { q: 'How are nested objects handled?', a: 'Nested objects are serialized as a JSON string within the CSV cell. For example, a nested object like {"address": {"city": "Lagos"}} will appear as the string {"city":"Lagos"} in the CSV.' },
      { q: 'Are special characters escaped?', a: 'Yes. Values containing commas, double quotes, or newlines are automatically wrapped in double quotes and internal quotes are escaped as double double-quotes, following the RFC 4180 CSV standard.' },
    ],
  },
  {
    id: 'json2xml', slug: 'json-to-xml', name: 'JSON to XML', desc: 'Convert JSON data to XML format',
    emoji: '🔄', tags: ['json', 'xml', 'convert', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/JSONtoXML',
    seo: {
      title: 'JSON to XML Converter - Free Online | Neetab',
      description: 'Convert JSON to XML free online. Paste any JSON object or array and download the formatted XML output instantly. No sign-up, fully private.',
      h1: 'Free JSON to XML Converter',
    },
    howTo: [
      'Paste your JSON data into the input area.',
      'Optionally set a custom root element tag name.',
      'Copy or download the generated XML output.',
    ],
    faq: [
      { q: 'When would I need JSON to XML conversion?', a: 'JSON to XML conversion is common when integrating with legacy systems, SOAP APIs, or enterprise software that requires XML input. It is also used in data transformation pipelines.' },
      { q: 'How are JSON arrays handled?', a: 'Each array item is wrapped in a repeated element using the parent key as the tag name. Nested objects become nested XML elements.' },
    ],
  },
  {
    id: 'json2yaml', slug: 'json-to-yaml', name: 'JSON to YAML', desc: 'Convert JSON data to YAML format',
    emoji: '🔄', tags: ['json', 'yaml', 'convert', 'dev', 'config'], category: 'Dev Tools',
    componentPath: 'devtools/JSONtoYAML',
    seo: {
      title: 'JSON to YAML Converter - Free Online | Neetab',
      description: 'Convert JSON to YAML free online. Paste any JSON object and get clean YAML output instantly. Adjustable indentation, copy or download. No sign-up.',
      h1: 'Free JSON to YAML Converter',
    },
    howTo: [
      'Paste your JSON into the input area.',
      'Choose 2 or 4 space indentation for the YAML output.',
      'Copy the YAML or download it as a .yaml file.',
    ],
    faq: [
      { q: 'Why convert JSON to YAML?', a: 'YAML is more human-readable than JSON and is widely used for configuration files in tools like Docker Compose, Kubernetes, GitHub Actions, and Ansible. Converting from JSON to YAML makes configs easier to read and edit.' },
    ],
  },
  {
    id: 'jwt', slug: 'jwt-decoder', name: 'JWT Decoder', desc: 'Decode and inspect JWT tokens',
    emoji: '🔓', tags: ['jwt', 'token', 'auth', 'decode', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/JWTDecoder',
    seo: {
      title: 'JWT Decoder - Inspect JWT Tokens Free | Neetab',
      description: 'Decode and inspect JWT tokens free online. View the header, payload, and signature. Checks token expiry automatically. No sign-up, fully private.',
      h1: 'JWT Token Decoder',
    },
    howTo: [
      'Paste your JWT token (the long string with two dots separating three parts) into the input box.',
      'The header and payload are decoded and displayed as formatted JSON. Timestamps (iat, exp) are shown as human-readable dates.',
      'Check the validity indicator to see if the token has expired based on the exp claim.',
    ],
    faq: [
      { q: 'What is a JWT?', a: 'A JSON Web Token (JWT) is a compact, URL-safe token format used to represent claims between parties. It consists of three Base64Url-encoded parts separated by dots: a header, a payload, and a signature.' },
      { q: 'Can this verify the JWT signature?', a: 'No. Signature verification requires the secret key or public key, which this tool does not have access to. The decoder shows the header and payload contents but cannot confirm whether the token was issued by a trusted source.' },
      { q: 'Is it safe to paste a JWT here?', a: 'This tool runs entirely in your browser - your token is never sent to any server. However, never share JWTs that grant access to sensitive systems in any external tool if you are unsure. Inspect tokens in development environments only.' },
      { q: 'What claims does the payload typically contain?', a: 'Common JWT claims include: sub (subject/user ID), iat (issued at timestamp), exp (expiration timestamp), aud (audience), iss (issuer), and custom application-specific claims.' },
    ],
  },
  {
    id: 'markdown', slug: 'markdown-preview', name: 'Markdown Preview', desc: 'Write Markdown and preview it live',
    emoji: '📝', tags: ['markdown', 'preview', 'editor', 'dev'], category: 'Dev Tools', wide: true,
    componentPath: 'devtools/MarkdownPreview',
    seo: {
      title: 'Markdown Preview - Live Editor Free | Neetab',
      description: 'Write and preview Markdown in real time free online. Full GFM support including tables, code blocks, and task lists. Copy the rendered HTML.',
      h1: 'Live Markdown Editor and Preview',
    },
    howTo: [
      'Type Markdown syntax in the left editor panel.',
      'The rendered HTML preview updates live in the right panel as you type - no button press needed.',
      'Your Markdown is processed entirely in your browser. Use the Copy button to copy either the source or the rendered content.',
    ],
    faq: [
      { q: 'What Markdown features are supported?', a: 'Headings (# H1 through ###### H6), bold (**text**), italic (*text*), strikethrough (~~text~~), links ([text](url)), images (![alt](url)), fenced code blocks (```language), inline code (`code`), blockquotes (>), ordered and unordered lists, and horizontal rules (---).' },
      { q: 'Can I export the rendered HTML?', a: 'You can copy the Markdown source and use it anywhere. The preview shows how your Markdown will render in GitHub, README files, most blogging platforms, and any standard Markdown renderer.' },
      { q: 'How do I create a code block in Markdown?', a: 'Wrap code with triple backticks on separate lines before and after. Add a language name after the opening backticks for syntax highlighting: ```javascript on the first line, then your code, then ``` to close. For inline code, wrap with single backticks.' },
      { q: 'Can I write tables in Markdown?', a: 'Yes. Use pipe characters | to separate columns and hyphens --- for the header separator row. Example: | Name | Age | on the first line, | --- | --- | on the second line, then data rows below.' },
    ],
  },
  {
    id: 'numbase', slug: 'number-base-converter', name: 'Number Base Converter', desc: 'Binary, Octal, Decimal, Hex',
    emoji: '🔢', tags: ['binary', 'hex', 'octal', 'decimal', 'base', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/NumberBaseConverter',
    seo: {
      title: 'Number Base Converter - Binary Hex Octal | Neetab',
      description: 'Convert numbers between binary, octal, decimal, and hexadecimal free online. Instant bidirectional conversion with copy buttons. No sign-up.',
      h1: 'Number Base Converter',
    },
    howTo: [
      'Type a number in any of the four fields - binary (base 2), octal (base 8), decimal (base 10), or hexadecimal (base 16).',
      'All other bases update instantly as you type.',
      'Click Copy next to any field to copy that representation to your clipboard.',
    ],
    faq: [
      { q: 'What is binary?', a: 'Binary is base 2, using only digits 0 and 1. It is the fundamental language of computers, where every bit is either off (0) or on (1). The decimal number 10 is 1010 in binary.' },
      { q: 'What is hexadecimal used for?', a: 'Hexadecimal (base 16) uses digits 0-9 and letters A-F. It is widely used in programming for memory addresses, color codes (#FF5733), byte values, and representing binary data compactly - 1 hex digit = 4 binary bits.' },
      { q: 'What is octal?', a: 'Octal (base 8) uses digits 0-7. It appears in Unix file permissions (e.g., chmod 755) and was historically used in early computing as a compact representation of binary groups of 3 bits.' },
    ],
  },
  {
    id: 'password', slug: 'password-generator', name: 'Password Generator', desc: 'Secure random passwords',
    emoji: '🔐', tags: ['security', 'random', 'strong', 'password'], category: 'Dev Tools', popular: true,
    componentPath: 'generators/PasswordGenerator',
    seo: {
      title: 'Password Generator - Strong Random Passwords | Neetab',
      description: 'Generate strong, random passwords free online. Customize length, include uppercase, lowercase, numbers, and symbols. Copy to clipboard instantly.',
      h1: 'Strong Password Generator',
    },
    howTo: [
      'Set your desired password length using the slider - 16 characters is recommended as a minimum for strong passwords.',
      'Toggle the character types you want included: uppercase letters, lowercase letters, numbers, and special symbols.',
      'Click Generate to create a new password, then click Copy to copy it to your clipboard. Store it in a password manager.',
    ],
    faq: [
      { q: 'How secure are the generated passwords?', a: 'Passwords are generated using the Web Cryptography API\'s crypto.getRandomValues function, which provides cryptographically secure random numbers suitable for security-critical applications. This is the same standard used by password managers, banking apps, and security software. The randomness cannot be predicted or reproduced, even by the tool itself. Your generated passwords are never sent to any server, logged, or stored anywhere - they exist only in your browser for the moment you see them.' },
      { q: 'What makes a strong password?', a: 'The two most important factors are length and randomness. A 20-character random password with any combination of character types is far stronger than a shorter but more complex password. Passwords should include a mix of uppercase letters (A-Z), lowercase letters (a-z), numbers (0-9), and special symbols (!@#$%^&*). Avoid dictionary words, names, dates, and keyboard patterns like "qwerty" or "12345678" even when substituting letters for numbers, since these patterns are the first things attackers try.' },
      { q: 'Can I generate multiple passwords at once?', a: 'Click the Generate button as many times as you need - each click produces a completely new cryptographically random password that is statistically independent of all previous ones. There is no daily limit or usage cap. If you need to generate passwords for multiple accounts, simply click Generate after copying each one.' },
      { q: 'Should I use a password manager?', a: 'Yes - a password manager is essential if you use strong, unique passwords for every account (which you should). Without one, there is no practical way to remember dozens of long random passwords. Bitwarden is free, open-source, and widely trusted. 1Password and Dashlane are popular paid options with polished apps. KeePass is a local, offline option for users who prefer not to use cloud storage. Never reuse passwords across accounts - if one site is breached, reused passwords compromise every other account that shares it.' },
    ],
    about: 'Weak and reused passwords are the leading cause of account takeovers and data breaches. Most people use passwords that are too short, too predictable, or reused across multiple sites - creating a single point of failure. This generator creates cryptographically random passwords that are effectively impossible to guess or brute-force at any reasonable length above 16 characters. You control the length and character set, and can generate a new password instantly with one click. The passwords are generated entirely in your browser using the Web Cryptography API and are never transmitted anywhere. Use alongside a password manager so you never need to remember or type these passwords manually.',
  },
  {
    id: 'qr', slug: 'qr-code-generator', name: 'QR Code Generator', desc: 'Generate QR codes for any text or URL',
    emoji: '📱', tags: ['qr', 'barcode', 'link', 'generator'], category: 'Dev Tools', popular: true,
    componentPath: 'generators/QRCodeGenerator',
    seo: {
      title: 'QR Code Generator - Free Custom QR Codes | Neetab',
      description: 'Generate custom QR codes for URLs, text, and more free online. Download as PNG instantly. No sign-up, no watermark, fully private.',
      h1: 'Free QR Code Generator',
    },
    howTo: [
      'Type or paste the content you want to encode - a URL, plain text, phone number, email address, or any other data.',
      'Customize the QR code size, error correction level, and foreground/background colors if desired.',
      'Click Download to save the QR code as a PNG image ready for print, web, or digital use.',
    ],
    faq: [
      { q: 'Can I customize the QR code?', a: 'Yes. You can adjust the output size in pixels, choose the error correction level (Low, Medium, Quartile, or High), and set custom foreground and background colors to match your brand. Higher error correction allows the QR code to be scanned correctly even if part of it is damaged, dirty, or obscured - useful for printed materials, product labels, and outdoor signage. Lower error correction produces a simpler, less dense QR code that scans faster in ideal conditions.' },
      { q: 'What can I encode in a QR code?', a: 'QR codes can contain any text data up to a few thousand characters. Common uses include website URLs, plain text messages, phone numbers (formatted as tel:+1234567890), email addresses, geographic coordinates, Wi-Fi network credentials, contact card data (vCard format), and calendar events. The QR code is generated and updated in real time as you type, so you can immediately see how your data affects the density and complexity of the code.' },
      { q: 'What format is the downloaded QR code?', a: 'QR codes download as PNG image files, which is the most universally compatible raster format for both digital and print use. PNG supports transparency (you can set a transparent background if needed) and is losslessly compressed, meaning the sharp edges of the QR code modules are preserved perfectly - essential for reliable scanning. For vector output suitable for professional printing at any size, consider using an SVG-based QR tool.' },
      { q: 'Is the QR code generated locally?', a: 'Yes. QR codes are generated entirely in your browser using the qrcode.js library. Your input text is never sent to any server during normal operation. There is a rare fallback to an external API if the JavaScript library fails to load for any reason - in that case, a notice is shown. For privacy-sensitive data like Wi-Fi passwords or internal URLs, the local generation ensures your data stays on your device.' },
    ],
    about: 'QR codes have become one of the most practical ways to bridge physical and digital worlds. A QR code printed on a business card, restaurant menu, product label, event poster, or email signature lets anyone with a smartphone instantly open a URL, save contact details, connect to Wi-Fi, or access any text-based information - no typing required. This generator creates QR codes entirely in your browser with customizable colors, sizes, and error correction levels. The output is a high-quality PNG ready for print or digital use. Suitable for marketing materials, product packaging, internal office signage, restaurant menus, event ticketing, and any situation where you want to make a URL or text instantly scannable.',
  },
  {
    id: 'qrscanner', slug: 'qr-code-scanner', name: 'QR Code Scanner', desc: 'Scan QR codes from camera or image',
    emoji: '🔍', tags: ['qr', 'scan', 'camera', 'decode', 'reader'], category: 'Dev Tools',
    componentPath: 'devtools/QRCodeScanner',
    seo: {
      title: 'QR Code Scanner - Scan from Camera or Image | Neetab',
      description: 'Scan QR codes free online using your camera or by uploading an image. Decodes QR codes instantly in your browser. No app needed, no sign-up.',
      h1: 'Free Online QR Code Scanner',
    },
    howTo: [
      'Choose Camera to scan using your device\'s camera in real time, or Upload Image to decode a QR code from a saved photo or screenshot.',
      'Point your camera at the QR code and hold steady, or upload an image file containing the code.',
      'The decoded content - URL, plain text, Wi-Fi credentials, or other data - appears below the scanner instantly.',
    ],
    faq: [
      { q: 'Can I scan a QR code without a camera?', a: 'Yes. Use the Upload Image tab to scan a QR code from any image file saved on your device, including screenshots and downloaded images.' },
      { q: 'Is my camera feed uploaded anywhere?', a: 'No. Scanning happens entirely in your browser. Your camera feed and any uploaded images never leave your device.' },
      { q: 'Why does the camera not work?', a: 'Camera access requires HTTPS and explicit browser permission. If denied, go to your browser settings, find camera permissions for this site, set it to Allow, and refresh the page.' },
      { q: 'What can a QR code contain?', a: 'QR codes can store URLs, plain text, phone numbers, Wi-Fi network credentials, email addresses, contact cards (vCard), and more. The type and content are detected and displayed automatically.' },
    ],
  },
  {
    id: 'regex', slug: 'regex-tester', name: 'Regex Tester', desc: 'Test regular expressions with live highlighting',
    emoji: '🔎', tags: ['regex', 'regular expression', 'pattern', 'test', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/RegexTester',
    seo: {
      title: 'Regex Tester - Live Regular Expression Tool | Neetab',
      description: 'Test regular expressions with live match highlighting free online. Supports flags, groups, and global matching. Instant results as you type.',
      h1: 'Regular Expression Tester',
    },
    howTo: [
      'Enter your regular expression in the pattern field at the top. Use the flag checkboxes to toggle global (g), case-insensitive (i), multiline (m), and other flags.',
      'Type or paste your test string in the input box below. Matches are highlighted in real time.',
      'Review the match details panel to see each match, its position, and any captured groups.',
    ],
    faq: [
      { q: 'What regex flavors are supported?', a: 'This tool uses JavaScript regular expressions, which support flags: global (g) for all matches, case-insensitive (i), multiline (m) to treat ^ and $ as line boundaries, dotall (s) to make . match newlines, and unicode (u) for full Unicode support.' },
      { q: 'Does this tool support named capture groups?', a: 'Yes. JavaScript named capture groups using the (?<name>...) syntax are fully supported and their values are displayed in the match details panel.' },
      { q: 'How do I match across multiple lines?', a: 'Use the multiline flag (m) to make ^ and $ match the start and end of each line instead of the entire string. Use the dotall flag (s) to make the . character match newline characters as well as everything else.' },
      { q: 'What is a capture group?', a: 'Capture groups let you extract specific parts of a match. Use parentheses: (\\d+) captures one or more digits. Named groups use (?<name>\\d+) syntax for clearer references. Non-capturing groups use (?:...) when you want to group without capturing.' },
    ],
  },
  {
    id: 'sqlfmt', slug: 'sql-formatter', name: 'SQL Formatter', desc: 'Beautify or minify SQL queries',
    emoji: '🗄️', tags: ['sql', 'format', 'beautify', 'minify', 'query', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/SQLFormatter',
    seo: {
      title: 'SQL Formatter and Beautifier - Free Online | Neetab',
      description: 'Format, beautify, or minify SQL queries free online. Supports SELECT, INSERT, UPDATE, DELETE, JOIN, and more. Adjustable indentation, copy or download.',
      h1: 'Free SQL Formatter and Beautifier',
    },
    howTo: [
      'Paste your SQL query into the input area.',
      'Choose Beautify to format with proper indentation, or Minify to compress it.',
      'Copy the result or download it as a .sql file.',
    ],
    faq: [
      { q: 'Which SQL dialects are supported?', a: 'The formatter works with standard SQL keywords used across MySQL, PostgreSQL, SQLite, SQL Server, and Oracle. Dialect-specific syntax is preserved as-is while standard keywords are formatted.' },
      { q: 'Why minify SQL?', a: 'Minifying SQL removes unnecessary whitespace and comments, which reduces the size of SQL files and can slightly improve query parsing speed in automated scripts or API calls.' },
    ],
  },
  {
    id: 'textcase', slug: 'text-case-converter', name: 'Text Case Converter', desc: 'Convert text between all cases',
    emoji: 'Aa', tags: ['text', 'case', 'camelcase', 'snake_case', 'uppercase', 'title'], category: 'Dev Tools',
    componentPath: 'devtools/TextCaseConverter',
    seo: {
      title: 'Text Case Converter - All Cases Free | Neetab',
      description: 'Convert text between camelCase, snake_case, SCREAMING_SNAKE, kebab-case, Title Case, and 6 more formats free online. All variants shown at once.',
      h1: 'Text Case Converter',
    },
    howTo: [
      'Type or paste your text into the input box.',
      'All case conversions are shown simultaneously - UPPER CASE, lower case, Title Case, camelCase, PascalCase, snake_case, kebab-case, and more.',
      'Click Copy next to any variant to copy it to your clipboard.',
    ],
    faq: [
      { q: 'What case formats are supported?', a: 'UPPER CASE, lower case, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and aLtErNaTiNg case - all generated simultaneously from a single input.' },
      { q: 'What is camelCase?', a: 'camelCase joins words with no separators, where the first word is lowercase and each subsequent word starts with a capital letter. Example: "myVariableName". Used widely in JavaScript, Java, and Swift.' },
      { q: 'What is snake_case?', a: 'snake_case uses underscores between words with all letters in lowercase. Example: "my_variable_name". Common in Python, Ruby, and database column names.' },
      { q: 'What is kebab-case?', a: 'kebab-case uses hyphens between words with all lowercase letters. Example: "my-component-name". Standard for HTML attributes, CSS class names, and URL slugs.' },
    ],
  },
  {
    id: 'textdiff', slug: 'text-diff', name: 'Text Diff', desc: 'Compare two texts side by side',
    emoji: '📋', tags: ['diff', 'compare', 'text', 'merge', 'dev'], category: 'Dev Tools', wide: true,
    componentPath: 'devtools/TextDiff',
    seo: {
      title: 'Text Diff Checker - Compare Two Texts Free | Neetab',
      description: 'Compare two blocks of text side by side free online. Highlights added, removed, and changed lines. Useful for code review and proofreading.',
      h1: 'Text Diff Checker',
    },
    howTo: [
      'Paste the original text into the left panel.',
      'Paste the new or modified version into the right panel.',
      'Differences are highlighted immediately - green for lines that were added and red for lines that were removed.',
    ],
    faq: [
      { q: 'How does the text comparison work?', a: 'The tool uses a longest common subsequence (LCS) algorithm to identify differences between two texts, highlighting added lines in green and removed lines in red, similar to how git diff works.' },
      { q: 'Is there a size limit?', a: 'For best performance, each text should be under 5,000 lines. Very large texts may slow down your browser tab during the comparison calculation.' },
      { q: 'Can I compare code files?', a: 'Yes. The diff tool works with any plain text including source code, JSON, XML, configuration files, Markdown, and prose documents. Paste the content directly from your files.' },
    ],
  },
  {
    id: 'timestamp', slug: 'timestamp-converter', name: 'Timestamp Converter', desc: 'Unix timestamp ↔ human date',
    emoji: '🕐', tags: ['time', 'unix', 'epoch', 'date', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/TimestampConverter',
    seo: {
      title: 'Timestamp Converter - Unix to Date Free | Neetab',
      description: 'Convert Unix timestamps to human-readable dates and back free online. Supports seconds and milliseconds. Shows UTC and local time instantly.',
      h1: 'Unix Timestamp Converter',
    },
    howTo: [
      'Enter a Unix timestamp (seconds or milliseconds) to convert it to a human-readable date and time.',
      'Or click "Use Now" to populate the current timestamp and see the current date/time in all formats.',
      'Switch to Date to Timestamp mode to convert a calendar date back to its Unix timestamp value.',
    ],
    faq: [
      { q: 'What is a Unix timestamp?', a: 'A Unix timestamp is the number of seconds that have elapsed since January 1, 1970, 00:00:00 UTC (the Unix Epoch). It is the most common way computers store and exchange date/time data, independent of timezone.' },
      { q: 'Does it handle milliseconds?', a: 'Yes. The converter auto-detects whether your input is in seconds (10 digits) or milliseconds (13 digits) and converts accordingly. JavaScript uses milliseconds by default; most Unix/Linux systems use seconds.' },
      { q: 'How do I get the current Unix timestamp?', a: 'Click the "Use Now" button to populate the current timestamp. In code: Date.now() in JavaScript returns milliseconds, time.time() in Python returns seconds, and System.currentTimeMillis() in Java returns milliseconds.' },
      { q: 'What time zone does the converter use?', a: 'The converted date is displayed in your local browser timezone. Unix timestamps themselves are timezone-agnostic (always UTC internally), so the same timestamp will display as a different local time in different timezones.' },
    ],
  },
  {
    id: 'urlencode', slug: 'url-encoder-decoder', name: 'URL Encoder', desc: 'Encode & decode URLs',
    emoji: '🔗', tags: ['url', 'encode', 'decode', 'percent', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/URLEncoderDecoder',
    seo: {
      title: 'URL Encoder Decoder - Percent Encoding Free | Neetab',
      description: 'Encode and decode URLs with percent-encoding free online. Handles special characters, spaces, and query strings. Instant results, no sign-up.',
      h1: 'URL Encoder and Decoder',
    },
    howTo: [
      'Paste your URL or text into the input box. The encoded output appears automatically in the field below.',
      'Switch between Encode and Decode modes using the toggle button.',
      'Click Copy to copy the result to your clipboard.',
    ],
    faq: [
      { q: 'When should I URL encode?', a: 'URL encoding is required when passing special characters (spaces, &, =, ?, #) in URLs or query string parameters. It converts unsafe characters to percent-encoded format (e.g., a space becomes %20) so they are transmitted correctly.' },
      { q: 'What is the difference between encodeURI and encodeURIComponent?', a: 'encodeURI encodes a complete URL but preserves structural URL characters like :, /, ?, and &. encodeURIComponent encodes everything including those characters, making it safe for use as a value within a query parameter. Use encodeURIComponent for individual parameter values.' },
      { q: 'Can I decode a URL?', a: 'Yes. Paste a percent-encoded URL or string and switch to Decode mode to see the original readable text. This is useful for debugging URLs with encoded query parameters.' },
    ],
  },
  {
    id: 'uuid', slug: 'uuid-generator', name: 'UUID Generator', desc: 'Generate random UUID v4 strings',
    emoji: '🆔', tags: ['uuid', 'guid', 'random', 'id', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/UUIDGenerator',
    seo: {
      title: 'UUID Generator - Random UUID v4 Free | Neetab',
      description: 'Generate random UUID v4 strings free online. Create one or multiple UUIDs instantly and copy to clipboard. No sign-up, fully client-side.',
      h1: 'UUID v4 Generator',
    },
    howTo: [
      'Click Generate to create a new random UUID v4 string.',
      'Toggle options for uppercase format or no-dash format (e.g., for database IDs that don\'t support hyphens).',
      'Use Bulk Generate to create multiple UUIDs at once and copy them all with a single click.',
    ],
    faq: [
      { q: 'What is a UUID?', a: 'A UUID (Universally Unique Identifier) is a 128-bit identifier standardized in RFC 4122. UUID v4 uses random numbers and is the most commonly used version - it looks like: 550e8400-e29b-41d4-a716-446655440000.' },
      { q: 'Can I generate multiple UUIDs?', a: 'Yes. Use Bulk Generate to create a list of UUIDs at once. Options include uppercase, lowercase, and no-dash formats to match your system\'s requirements.' },
      { q: 'Are UUIDs truly unique?', a: 'With 2^122 possible values (about 5.3 × 10^36), the probability of generating the same UUID v4 twice is astronomically small - effectively zero for any practical application, even at massive scale.' },
    ],
  },
  {
    id: 'xml2json', slug: 'xml-to-json', name: 'XML to JSON', desc: 'Convert XML data to JSON format',
    emoji: '🔄', tags: ['xml', 'json', 'convert', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/XMLtoJSON',
    seo: {
      title: 'XML to JSON Converter - Free Online | Neetab',
      description: 'Convert XML to JSON free online. Paste any XML document and get a formatted JSON object instantly. Adjustable indentation, copy or download. No sign-up.',
      h1: 'Free XML to JSON Converter',
    },
    howTo: [
      'Paste your XML into the input area.',
      'Choose your preferred indentation (2 or 4 spaces).',
      'Copy the JSON output or download it as a .json file.',
    ],
    faq: [
      { q: 'When would I need XML to JSON conversion?', a: 'XML to JSON is common when working with REST APIs that need JSON, processing RSS/Atom feeds, migrating data from legacy SOAP services to modern APIs, or simplifying XML data structures for JavaScript apps.' },
      { q: 'How are XML attributes handled?', a: 'XML attributes are prefixed with @ in the JSON output (e.g., @id, @class). Text content of elements is stored under the #text key when the element also has attributes or child elements.' },
    ],
  },
  {
    id: 'yaml2json', slug: 'yaml-to-json', name: 'YAML to JSON', desc: 'Convert YAML data to JSON format',
    emoji: '🔄', tags: ['yaml', 'json', 'convert', 'dev', 'config'], category: 'Dev Tools',
    componentPath: 'devtools/YAMLtoJSON',
    seo: {
      title: 'YAML to JSON Converter - Free Online | Neetab',
      description: 'Convert YAML to JSON free online. Paste any YAML config or data file and get formatted JSON output instantly. Adjustable indentation. No sign-up required.',
      h1: 'Free YAML to JSON Converter',
    },
    howTo: [
      'Paste your YAML content into the input area.',
      'Choose 2 or 4 space indentation for the JSON output.',
      'Copy the JSON or download it as a .json file.',
    ],
    faq: [
      { q: 'What YAML formats are supported?', a: 'All standard YAML 1.2 features are supported - scalars, sequences, mappings, anchors, aliases, multi-line strings, and comments (comments are stripped in output). YAML used in Docker Compose, Kubernetes, and GitHub Actions files all convert correctly.' },
    ],
  },
  // ═══ CONVERTERS ═══
  {
    id: 'csv2excel', slug: 'csv-to-excel', name: 'CSV to Excel', desc: 'Convert CSV data to Excel XLSX',
    emoji: '📗', tags: ['csv', 'excel', 'xlsx', 'convert', 'spreadsheet'], category: 'Converters',
    componentPath: 'converters/CSVtoExcel',
    seo: {
      title: 'CSV to Excel Converter - Free Online | Neetab',
      description: 'Convert CSV files to Excel XLSX format free online. Paste CSV or upload a file, preview the data, and download the spreadsheet instantly.',
      h1: 'Free CSV to Excel Converter',
    },
    howTo: [
      'Paste CSV data or upload a .csv file.',
      'Preview the data as a table. Set a sheet name if desired.',
      'Click Download XLSX to save the Excel file.',
    ],
    faq: [
      { q: 'Does the Excel file support formatting?', a: 'The generated XLSX file contains the data in a clean spreadsheet. Advanced formatting like merged cells or formulas are not added - just the raw data ready to open in Excel or Google Sheets.' },
      { q: 'Is my data sent to a server?', a: 'No. The conversion uses SheetJS entirely in your browser.' },
    ],
  },
  {
    id: 'currency', slug: 'currency-converter', name: 'Currency Converter', desc: 'Real-time exchange rates',
    emoji: '💱', tags: ['currency', 'money', 'exchange', 'forex', 'rate', 'dollar', 'euro'], category: 'Converters', popular: true,
    componentPath: 'converters/CurrencyConverter',
    seo: {
      title: 'Currency Converter - Live Exchange Rates | Neetab',
      description: 'Convert currencies with real-time exchange rates free online. Powered by live data. Supports 30+ currencies. No sign-up, instant conversion.',
      h1: 'Live Currency Converter',
    },
    howTo: [
      'Select the currency you want to convert from and the currency you want to convert to using the dropdowns.',
      'Enter the amount you want to convert.',
      'The converted amount is shown instantly based on today\'s exchange rate from the European Central Bank.',
    ],
    faq: [
      { q: 'Where do the exchange rates come from?', a: 'Rates are sourced from the European Central Bank (ECB) via the Frankfurter API, a free and open-source exchange rate service maintained by the German Central Bank. ECB reference rates are published on every business day at approximately 16:00 CET after the daily fixing by the foreign exchange market. They are widely cited as a reliable, neutral reference rate and are used in academic research, financial reporting, and accounting applications worldwide.' },
      { q: 'How many currencies are supported?', a: 'Over 30 major and regional currencies are supported including USD (US Dollar), EUR (Euro), GBP (British Pound), JPY (Japanese Yen), CAD (Canadian Dollar), AUD (Australian Dollar), CHF (Swiss Franc), INR (Indian Rupee), NGN (Nigerian Naira), BRL (Brazilian Real), MXN (Mexican Peso), KRW (South Korean Won), ZAR (South African Rand), CNY (Chinese Yuan), and many more from Europe, Asia, the Americas, and Africa.' },
      { q: 'Are the rates real-time?', a: 'The rates update once per business day (Monday to Friday, excluding ECB holidays) when the European Central Bank publishes its daily reference rates. They are not live intraday market rates - the rate shown will not change throughout the day. For real-time rates needed for active forex trading, stock market transactions, or time-sensitive financial decisions, use a dedicated forex platform or financial data provider. For everyday conversions, travel planning, price comparisons, and general financial awareness, ECB reference rates are reliable and accurate.' },
      { q: 'Is my conversion data saved?', a: 'No. Conversions are calculated instantly in your browser using the fetched exchange rate. Your currency selections, amounts, and conversion results are never sent to any analytics system, database, or third-party service. The only external call made is to the Frankfurter API to fetch the current exchange rate - this request contains only the selected currency pair, not your conversion amount.' },
    ],
    about: 'Currency conversion is one of the most frequently needed financial calculations for travellers, online shoppers, freelancers working with international clients, importers and exporters, and anyone comparing prices across countries. This tool fetches daily reference rates from the European Central Bank via the Frankfurter API and performs the conversion instantly in your browser. Supporting over 30 currencies across all major economic regions, it covers the vast majority of everyday currency conversion needs. The rates update once per business day and represent reliable reference rates rather than live trading rates, making the tool ideal for budgeting, price comparison, invoicing, and general financial awareness.',
  },
  {
    id: 'excel2csv', slug: 'excel-to-csv', name: 'Excel to CSV', desc: 'Convert Excel files to CSV',
    emoji: '📊', tags: ['excel', 'xlsx', 'csv', 'convert', 'spreadsheet'], category: 'Converters',
    componentPath: 'converters/ExcelToCSV',
    seo: {
      title: 'Excel to CSV Converter - Free Online | Neetab',
      description: 'Convert Excel XLSX files to CSV free online. Supports multi-sheet workbooks. Preview the data before downloading. No sign-up, fully private.',
      h1: 'Free Excel to CSV Converter',
    },
    howTo: [
      'Upload an .xlsx or .xls Excel file.',
      'If the file has multiple sheets, select the one you want to convert.',
      'Preview the data and click Download CSV to save the file.',
    ],
    faq: [
      { q: 'What Excel formats are supported?', a: 'Both .xlsx (Excel 2007 and later) and .xls (older Excel format) are supported.' },
      { q: 'Can I convert multiple sheets?', a: 'You can select and convert one sheet at a time. Switch between sheets using the tab selector that appears for multi-sheet files.' },
      { q: 'Is my file uploaded to a server?', a: 'No. Conversion uses the SheetJS library entirely in your browser. Your file never leaves your device.' },
    ],
  },
  {
    id: 'unit', slug: 'unit-converter', name: 'Unit Converter', desc: 'Length, weight, temp, volume & more',
    emoji: '📏', tags: ['measurement', 'science', 'length', 'weight', 'temperature'], category: 'Converters', popular: true,
    componentPath: 'converters/UnitConverter',
    seo: {
      title: 'Unit Converter - Length Weight Temp and More | Neetab',
      description: 'Convert units of length, weight, temperature, volume, area, and speed free online. Fast, accurate, and easy to use. No sign-up required.',
      h1: 'Free Unit Converter',
    },
    howTo: [
      'Select the measurement category - length, weight, temperature, volume, speed, area, or data storage.',
      'Enter a value and select the source unit from the dropdown.',
      'All equivalent values in other units are shown instantly. Select a different output unit to focus on a specific conversion.',
    ],
    faq: [
      { q: 'What units can I convert?', a: 'The converter covers seven measurement categories. Length: meters, centimeters, millimeters, kilometers, inches, feet, yards, miles, nautical miles. Weight: kilograms, grams, milligrams, metric tons, pounds, ounces, stones. Temperature: Celsius, Fahrenheit, Kelvin. Volume: liters, milliliters, cubic meters, US gallons, UK gallons, fluid ounces, US cups, teaspoons, tablespoons. Speed: km/h, mph, meters per second, knots. Area: square meters, square feet, square inches, acres, hectares, square kilometers, square miles. Data storage: bytes, kilobytes, megabytes, gigabytes, terabytes, petabytes.' },
      { q: 'Is the conversion accurate?', a: 'Yes. All conversions use exact mathematical formulas and internationally defined conversion factors. For example, 1 inch is defined as exactly 25.4 millimeters. 1 pound is exactly 0.45359237 kilograms. Results are displayed with sufficient decimal places to be practically accurate for any everyday use case. Temperature conversions use the correct non-linear formulas rather than approximations, ensuring results are accurate across the full range of values.' },
      { q: 'Can I convert temperature?', a: 'Yes. The tool converts between Celsius (the international standard used in most countries), Fahrenheit (standard in the United States and a few other countries), and Kelvin (the SI unit of thermodynamic temperature used in science). Temperature conversion uses the exact formulas: Fahrenheit = (Celsius x 9/5) + 32, and Kelvin = Celsius + 273.15. Common conversions include body temperature (37°C = 98.6°F), water boiling point (100°C = 212°F), and absolute zero (0K = -273.15°C).' },
      { q: 'Why do some units not appear in every category?', a: 'Each category contains the most commonly used units for that measurement type. For example, the length category includes both metric units (mm, cm, m, km) and imperial units (in, ft, yd, mi) because both systems are in widespread use globally. Less common or highly specialised units are not included to keep the interface clean and focused on practical everyday conversions.' },
    ],
    about: 'Unit conversion is a constant need in everyday life, education, science, cooking, travel, and engineering. Different countries use different measurement systems - the United States uses the imperial system while most of the world uses metric - and switching between them is a frequent source of confusion and errors. This unit converter handles the seven most commonly needed measurement categories: length, weight, temperature, volume, speed, area, and data storage. All conversions are calculated using exact, internationally defined conversion factors and formulas. The tool works entirely in your browser with no data sent to any server, and results update instantly as you type.',
  },
  // ═══ TEXT TOOLS ═══
  {
    id: 'charcounter', slug: 'character-counter', name: 'Character Counter', desc: 'Count characters, words, sentences and bytes',
    emoji: '🔢', tags: ['character', 'count', 'text', 'letters', 'writing'], category: 'Text Tools',
    componentPath: 'text/CharacterCounter',
    seo: {
      title: 'Character Counter - Count Characters Free Online | Neetab',
      description: 'Count characters with and without spaces, words, sentences, lines, and bytes free online. Also shows top character frequency. Instant, no sign-up.',
      h1: 'Free Character Counter',
    },
    howTo: [
      'Type or paste your text into the input area.',
      'Character count, word count, sentence count, and byte size update instantly as you type.',
      'Scroll down to see the top most-used characters in your text.',
    ],
    faq: [
      { q: 'What is the difference between characters with and without spaces?', a: 'Characters with spaces counts every single character including spaces, tabs, and newlines. Characters without spaces only counts visible characters - letters, numbers, and punctuation. Twitter and LinkedIn character limits count all characters including spaces.' },
      { q: 'Why does the byte count sometimes differ from the character count?', a: 'Standard ASCII characters (English letters, numbers, basic punctuation) take 1 byte each. Characters outside the basic Latin alphabet - such as accented letters, Arabic, Chinese, or emoji - take 2-4 bytes each in UTF-8 encoding. The byte count matters for database storage and API payload limits.' },
    ],
  },
  {
    id: 'findreplace', slug: 'find-and-replace', name: 'Find & Replace', desc: 'Find and replace text with regex support',
    emoji: '🔍', tags: ['find', 'replace', 'text', 'regex', 'search'], category: 'Text Tools',
    componentPath: 'text/FindAndReplace',
    seo: {
      title: 'Find and Replace - Text Editor Free Online | Neetab',
      description: 'Find and replace text free online with regex support, case-sensitive matching, and whole-word options. Live match highlighting and instant preview.',
      h1: 'Find and Replace Text Tool',
    },
    howTo: [
      'Paste your source text, then enter what you want to find and what to replace it with.',
      'Matches are highlighted in real time. Toggle case-sensitive, whole word, or regex options as needed.',
      'The result with all replacements applied appears in the output box. Copy it with one click.',
    ],
    faq: [
      { q: 'Can I use regular expressions?', a: 'Yes. Toggle "Use regex" to use JavaScript regular expression syntax in the Find field. For example, \\d+ matches any number, and (\\w+)@(\\w+) captures email parts.' },
      { q: 'Is this case-sensitive?', a: 'By default no. Toggle "Case sensitive" to make the search match the exact case of your search term.' },
    ],
  },
  {
    id: 'lorem', slug: 'lorem-ipsum-generator', name: 'Lorem Ipsum', desc: 'Generate placeholder text',
    emoji: '📄', tags: ['lorem', 'ipsum', 'placeholder', 'text', 'dummy'], category: 'Text Tools',
    componentPath: 'text/LoremIpsumGenerator',
    seo: {
      title: 'Lorem Ipsum Generator - Placeholder Text | Neetab',
      description: 'Generate Lorem Ipsum placeholder text free online. Choose paragraphs, sentences, or words. Copy instantly for mockups and design projects.',
      h1: 'Lorem Ipsum Generator',
    },
    howTo: [
      'Choose the type of output you need: paragraphs, sentences, or a specific word count.',
      'Enter the desired count - for example, 3 paragraphs or 50 words.',
      'Click Generate and copy the Lorem Ipsum placeholder text for use in your designs, mockups, or prototypes.',
    ],
    faq: [
      { q: 'What is Lorem Ipsum?', a: 'Lorem Ipsum is dummy placeholder text derived from Cicero\'s "de Finibus Bonorum et Malorum" (45 BC). It has been the standard dummy text in the printing and typesetting industry since the 1500s and is used to fill layouts without distracting with real content.' },
      { q: 'Can I generate a specific number of words?', a: 'Yes. Switch to Words mode and enter any number from 1 upward to get an exact word count. Paragraphs and Sentences modes are also available for different layout needs.' },
      { q: 'Does it always start with "Lorem ipsum"?', a: 'The traditional Lorem Ipsum always begins with "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." - our generator uses this standard opening for the first paragraph to match the classic placeholder text everyone recognizes.' },
    ],
  },
  {
    id: 'morse', slug: 'morse-code-converter', name: 'Morse Code', desc: 'Convert text to Morse code and play audio',
    emoji: '📡', tags: ['morse', 'code', 'audio', 'convert', 'signal'], category: 'Text Tools',
    componentPath: 'text/MorseCodeConverter',
    seo: {
      title: 'Morse Code Converter - Text to Morse Audio | Neetab',
      description: 'Convert text to Morse code and play audio free online. Adjust playback speed. Supports bidirectional conversion. Full reference table included.',
      h1: 'Morse Code Converter and Player',
    },
    howTo: [
      'Select Text to Morse or Morse to Text mode.',
      'Type your text or Morse code (use spaces between symbols and / between words).',
      'Click Play Audio to hear the Morse code as beeps. Adjust the playback speed with the WPM slider.',
    ],
    faq: [
      { q: 'What is WPM in Morse code?', a: 'WPM (words per minute) in Morse code is based on the standard word "PARIS", which contains a representative mix of short and long signals. 15 WPM is a good learning speed; 25+ WPM is considered proficient.' },
      { q: 'How do I enter Morse code manually?', a: 'Use dots (.) for dits, dashes (-) for dahs, spaces between letters, and / between words. For example: "... --- ..." is SOS.' },
    ],
  },
  {
    id: 'readability', slug: 'readability-checker', name: 'Readability Checker', desc: 'Check Flesch-Kincaid, Gunning Fog and grade level',
    emoji: '📖', tags: ['readability', 'flesch', 'grade', 'writing', 'text', 'seo'], category: 'Text Tools',
    componentPath: 'text/ReadabilityChecker',
    seo: {
      title: 'Readability Checker - Flesch-Kincaid Score Free | Neetab',
      description: 'Check text readability free online. Get Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog, and SMOG scores. Essential for writers and SEOs.',
      h1: 'Free Readability Checker',
    },
    howTo: [
      'Paste your text into the input area. At least 50 words gives the most accurate scores.',
      'Read your Flesch Reading Ease score (0-100, higher is easier) and grade level.',
      'Use the scale reference at the bottom to understand what your score means for your target audience.',
    ],
    faq: [
      { q: 'What is a good Flesch Reading Ease score?', a: 'For general web content, aim for 60-70 (Standard). Blog posts work best at 70-80 (Easy). Technical documentation can go lower. Most popular websites target 60+ to reach the widest audience.' },
      { q: 'What is the Flesch-Kincaid Grade Level?', a: 'The FK Grade Level estimates the US school grade needed to understand the text. A score of 8 means an 8th-grader can read it. Most mainstream content targets grade 6-8. Academic writing typically scores 12+.' },
      { q: 'Why do SEOs care about readability?', a: 'Google uses engagement signals like time on page and bounce rate as ranking factors. Easier-to-read content keeps visitors longer, reducing bounce rate. Many SEO tools include readability as a direct on-page factor.' },
    ],
  },
  {
    id: 'roman', slug: 'roman-numeral-converter', name: 'Roman Numeral Converter', desc: 'Convert between Arabic and Roman numerals',
    emoji: 'X', tags: ['roman', 'numeral', 'convert', 'number'], category: 'Text Tools',
    componentPath: 'text/RomanNumeralConverter',
    seo: {
      title: 'Roman Numeral Converter - Free Online | Neetab',
      description: 'Convert between Arabic numbers and Roman numerals free online. Auto-detects input direction. Shows step-by-step breakdown. Supports 1-3999.',
      h1: 'Roman Numeral Converter',
    },
    howTo: [
      'Type a number (e.g. 2024) to convert it to Roman numerals, or type a Roman numeral (e.g. MMXXIV) to convert it to a number.',
      'The converter auto-detects which direction to convert.',
      'See the step-by-step breakdown showing how the value was assembled.',
    ],
    faq: [
      { q: 'What range of numbers is supported?', a: 'Standard Roman numerals represent numbers from 1 to 3999. The number 0 and numbers above 3999 cannot be expressed in classic Roman numeral notation.' },
      { q: 'Why is there no zero in Roman numerals?', a: 'Roman numerals were developed without a concept of zero. The numeral system is additive and subtractive, not positional, so zero was not needed.' },
    ],
  },
  {
    id: 'slug', slug: 'slug-generator', name: 'Slug Generator', desc: 'Generate URL-friendly slugs from text',
    emoji: '🔗', tags: ['slug', 'url', 'seo', 'text', 'permalink'], category: 'Text Tools',
    componentPath: 'text/SlugGenerator',
    seo: {
      title: 'Slug Generator - URL Slug from Text Free | Neetab',
      description: 'Generate URL-friendly slugs from any text free online. Creates slug, camelCase, and URL-safe variants in real time. Great for SEO and permalinks.',
      h1: 'URL Slug Generator',
    },
    howTo: [
      'Type or paste your text (e.g. a blog post title or page name).',
      'The URL slug is generated instantly as you type.',
      'Choose your preferred format: hyphen-separated, underscore_separated, or camelCase. Copy with one click.',
    ],
    faq: [
      { q: 'What is a URL slug?', a: 'A URL slug is the human-readable part of a URL that identifies a specific page. For example, in neetab.com/tools/slug-generator, the slug is "slug-generator". Good slugs are lowercase, hyphen-separated, and free of special characters.' },
      { q: 'Are accented characters handled?', a: 'Yes. Accented characters are transliterated to their ASCII equivalents (e.g. "cafe" becomes "cafe") before generating the slug.' },
    ],
  },
  {
    id: 'stt', slug: 'speech-to-text', name: 'Speech to Text', desc: 'Convert spoken words to text using your microphone',
    emoji: '🎤', tags: ['speech', 'voice', 'transcribe', 'microphone', 'stt', 'accessibility'], category: 'Text Tools',
    componentPath: 'text/SpeechToText',
    seo: {
      title: 'Speech to Text - Free Online Voice Transcription | Neetab',
      description: 'Convert speech to text free online using your microphone. Supports 12 languages. Audio stays on your device - fully private. No sign-up, works in Chrome.',
      h1: 'Free Speech to Text Transcription',
    },
    howTo: [
      'Select your language from the dropdown.',
      'Click Start Recording and allow microphone access when prompted.',
      'Speak clearly - the transcript appears in real time. Click Stop when done, then copy or save the text.',
    ],
    faq: [
      { q: 'Which browsers support this tool?', a: 'Speech recognition works in Google Chrome and Microsoft Edge. It is not supported in Firefox or Safari due to missing Web Speech API support in those browsers.' },
      { q: 'Is my audio sent to any server?', a: 'Audio processing is handled by your browser using the built-in Web Speech API. On Chrome, audio is processed by Google speech recognition services as part of the browser engine. Neetab itself never receives or stores your audio.' },
      { q: 'What languages are supported?', a: 'English (US and UK), Spanish, French, German, Portuguese (Brazil), Italian, Japanese, Chinese (Simplified), Arabic, Hindi, and Korean.' },
    ],
  },
  {
    id: 'tts', slug: 'text-to-speech', name: 'Text to Speech', desc: 'Read text aloud with natural voices',
    emoji: '🔊', tags: ['speech', 'voice', 'read', 'tts', 'audio', 'accessibility'], category: 'Text Tools',
    componentPath: 'text/TextToSpeech',
    seo: {
      title: 'Text to Speech - Free Online TTS Reader | Neetab',
      description: 'Convert text to speech free online using natural browser voices. Adjust speed and pitch. Listen instantly or read any text aloud. No sign-up.',
      h1: 'Free Text to Speech',
    },
    howTo: [
      'Type or paste the text you want to hear in the input box.',
      'Select a voice from the dropdown and adjust the speed and pitch sliders to your preference.',
      'Click Speak to start playback. Click Stop to pause, and Resume to continue from where you left off.',
    ],
    faq: [
      { q: 'What voices are available?', a: 'The available voices depend on your browser and operating system. Most modern browsers offer dozens of voices in multiple languages - Chrome and Edge tend to have the widest selection, including high-quality neural voices on Windows.' },
      { q: 'Does this work offline?', a: 'Yes. Text-to-speech uses your browser\'s built-in Web Speech API speech synthesis engine, which runs locally. No internet connection is needed after the page loads.' },
      { q: 'Is there a text length limit?', a: 'The input is limited to 10,000 characters. For very long texts, split the content into sections for best results, as some browsers have limits on single synthesis utterances.' },
      { q: 'Can I adjust the reading speed?', a: 'Yes. The Speed slider goes from 0.25× (very slow, useful for language learning) up to 2× (double speed, useful for proofreading). The Pitch slider adjusts the voice tone from deep to high.' },
    ],
  },
  {
    id: 'textutils', slug: 'text-utilities', name: 'Text Utilities', desc: 'Sort, reverse, deduplicate and clean text',
    emoji: '🔧', tags: ['text', 'sort', 'reverse', 'deduplicate', 'clean'], category: 'Text Tools',
    componentPath: 'text/TextUtilities',
    seo: {
      title: 'Text Utilities - Sort Reverse Deduplicate | Neetab',
      description: 'Sort lines alphabetically, reverse text, remove duplicates, trim whitespace, and clean text free online. 8 text operations in one free tool.',
      h1: 'Text Utilities - Sort, Reverse, Deduplicate',
    },
    howTo: [
      'Paste your text into the input box.',
      'Click an operation: Sort Lines (A-Z or Z-A), Reverse Text, Reverse Lines, Remove Duplicates, Remove Empty Lines, or Trim Whitespace.',
      'The result appears in the output box. Copy it with one click.',
    ],
    faq: [
      { q: 'Can I sort lines alphabetically?', a: 'Yes. "Sort A-Z" sorts lines in ascending alphabetical order. "Sort Z-A" sorts in descending order. Sorting is case-insensitive by default.' },
      { q: 'What does Remove Duplicates do?', a: 'It removes any line that appears more than once, keeping only the first occurrence. Useful for cleaning lists of emails, URLs, or other repeated entries.' },
    ],
  },
  {
    id: 'wordcount', slug: 'word-counter', name: 'Word Counter', desc: 'Characters, words, sentences & read time',
    emoji: '🔤', tags: ['writing', 'content', 'characters', 'count'], category: 'Text Tools', popular: true,
    componentPath: 'text/WordCounter',
    seo: {
      title: 'Word Counter - Count Words and Characters | Neetab',
      description: 'Count words, characters, sentences, and estimated reading time free online. Paste any text for instant analysis. No sign-up, no data stored.',
      h1: 'Word and Character Counter',
    },
    howTo: [
      'Type or paste your text into the input box.',
      'Word count, character count (with and without spaces), sentence count, and estimated reading time all update live as you type.',
      'Use the stats panel for additional details including paragraph count and average word length.',
    ],
    faq: [
      { q: 'What does this tool count?', a: 'The counter tracks characters with spaces (every character including spaces, tabs, and newlines), characters without spaces (only visible non-whitespace characters), words (sequences of characters separated by spaces), sentences (text segments ending with a period, exclamation mark, or question mark), paragraphs (blocks of text separated by blank lines), and estimated reading time. All counts update in real time as you type or paste - no button to click.' },
      { q: 'How is reading time calculated?', a: 'Reading time is estimated based on an average adult reading speed of approximately 200-250 words per minute for standard prose. Academic or technical content is typically read more slowly. The reading time shown is the midpoint estimate and gives a practical guide for content planning. For a 1,000-word article, the estimated reading time would be approximately 4-5 minutes - a commonly cited benchmark for blog content that suggests depth without overwhelming casual readers.' },
      { q: 'Is this useful for SEO and content writing?', a: 'Yes, word count is a practical content planning metric. For SEO, most studies suggest that longer, more comprehensive content tends to rank better - pages under 300 words are often considered thin content by Google, while pages over 1,500 words signal topical depth. For social media, Twitter/X has a 280-character limit, LinkedIn posts perform well around 700-1300 characters, and Instagram captions can be up to 2200 characters. For academic work, word count requirements are set by institutions. This tool helps you hit the right target for any platform or purpose.' },
      { q: 'Does it count characters for Twitter or LinkedIn limits?', a: 'Yes. The character count with spaces matches how Twitter and most social platforms count characters (including spaces and punctuation). The character count without spaces is useful for SMS character limits and some academic citation formats. For Twitter specifically, URLs are always counted as 23 characters regardless of their actual length due to Twitter\'s URL shortener.' },
    ],
    about: 'Word counters are essential for writers, students, content marketers, journalists, and anyone working within character or word count requirements. Whether you need to hit a minimum word count for an SEO-optimised blog post, stay within a maximum for a university essay, check if your tweet is under 280 characters, or estimate how long a speech will take to deliver, this tool gives you all the numbers instantly. Unlike the word counter in Microsoft Word or Google Docs, this tool works directly in your browser without needing to open any application - just paste your text and read the stats. Everything runs locally in your browser with no data stored or transmitted.',
  },
  {
    id: 'wordfreq', slug: 'word-frequency-counter', name: 'Word Frequency', desc: 'Count how often each word appears',
    emoji: '📊', tags: ['text', 'frequency', 'word', 'count', 'analysis'], category: 'Text Tools',
    componentPath: 'text/WordFrequencyCounter',
    seo: {
      title: 'Word Frequency Counter - Analyze Text | Neetab',
      description: 'Count word frequency in any text free online. See ranked word lists with percentages and visual bars. Optional stop word filter included.',
      h1: 'Word Frequency Counter',
    },
    howTo: [
      'Paste or type your text into the input box.',
      'The most frequent words are ranked and displayed with counts, percentages, and visual bars.',
      'Toggle "Filter common words" to exclude stop words like "the", "and", "is" for more meaningful results.',
    ],
    faq: [
      { q: 'What are stop words?', a: 'Stop words are common function words like "the", "a", "is", "and" that appear frequently in most texts but carry little meaning. Filtering them reveals the content-bearing words.' },
      { q: 'Is this useful for SEO?', a: 'Yes. Analyzing word frequency helps identify the most-used keywords in your content, which is useful for on-page SEO optimization.' },
    ],
  },
  {
    id: 'aihumanizer', slug: 'ai-humanizer', name: 'AI Humanizer', desc: 'Rewrite AI-generated text to sound natural and human',
    emoji: '🤖', tags: ['ai', 'humanize', 'rewrite', 'chatgpt', 'text', 'writing'], category: 'Text Tools',
    componentPath: 'text/AIHumanizer',
    seo: {
      title: 'AI Humanizer - Make AI Text Sound Human | Neetab',
      description: 'Free AI humanizer tool. Paste ChatGPT or AI-generated text and rewrite it to sound natural, human, and bypass AI detection.',
      h1: 'AI Text Humanizer',
    },
    howTo: [
      'Paste your AI-generated text (from ChatGPT, Gemini, etc.) into the input box.',
      'Select your preferred output tone: Conversational, Professional, Friendly, or Academic.',
      'Click "Humanize Text". The tool rewrites the text with natural phrasing, varied sentence length, and authentic tone.',
    ],
    faq: [
      { q: 'Will this bypass AI detection tools?', a: 'The tool rewrites text with natural phrasing and sentence variety, which significantly reduces AI-like patterns. Results vary by detection tool, but most rewritten outputs score much lower on AI detectors.' },
      { q: 'What types of AI text work best?', a: 'It works on any AI-generated content: essays, blog posts, emails, product descriptions, and social media content. Longer, structured passages tend to produce the best humanization results.' },
      { q: 'Is my text stored or shared?', a: 'No. Your text is sent to the AI model for processing and is never stored on our servers.' },
    ],
  },
  {
    id: 'aiemailwriter', slug: 'ai-email-writer', name: 'AI Email Writer', desc: 'Write professional emails instantly with AI',
    emoji: '✉️', tags: ['email', 'ai', 'write', 'professional', 'business', 'writing'], category: 'Text Tools',
    componentPath: 'text/AIEmailWriter',
    seo: {
      title: 'AI Email Writer - Write Professional Emails Free | Neetab',
      description: 'Free AI email writer. Describe your email purpose and context, and AI instantly writes a professional, polished email for you.',
      h1: 'AI Email Writer',
    },
    howTo: [
      'Choose the tone: Professional, Friendly, Formal, Persuasive, or Concise.',
      'Optionally enter the email purpose (e.g. "Follow up on job application").',
      'Describe the context and key points in the text area, then click "Write Email".',
    ],
    faq: [
      { q: 'What kinds of emails can I write?', a: 'Any type: job application follow-ups, cold outreach, meeting requests, client updates, apology emails, sales pitches, and more. The more context you provide, the better the result.' },
      { q: 'Does the AI include a subject line?', a: 'Yes. The output starts with "Subject: ..." on the first line, followed by the full email body.' },
      { q: 'Can I edit the result?', a: 'Absolutely. The generated email is a starting point. Copy it and make any personalization tweaks before sending.' },
    ],
  },
  {
    id: 'bulletpoints', slug: 'bullet-point-generator', name: 'Bullet Point Generator', desc: 'Convert any text into clean bullet points with AI',
    emoji: '•', tags: ['bullet', 'points', 'ai', 'text', 'summary', 'writing', 'notes'], category: 'Text Tools',
    componentPath: 'text/BulletPointGenerator',
    seo: {
      title: 'Bullet Point Generator - Convert Text to Bullets Free | Neetab',
      description: 'Free AI bullet point generator. Paste any article, paragraph, or document and instantly convert it into clear, concise bullet points.',
      h1: 'AI Bullet Point Generator',
    },
    howTo: [
      'Paste your text (article, document, meeting notes, etc.) into the input box.',
      'Click "Generate Bullet Points". The AI extracts and condenses the key ideas.',
      'Copy individual bullets or copy all at once for use in presentations, notes, or summaries.',
    ],
    faq: [
      { q: 'What types of content work best?', a: 'Articles, blog posts, research papers, meeting notes, product descriptions, and any dense paragraph-style text. The AI identifies the core ideas and presents them concisely.' },
      { q: 'How many bullet points will I get?', a: 'The number scales with the length and complexity of your input. Short paragraphs typically yield 3-5 bullets; long articles may produce 8-12.' },
      { q: 'Can I use this for slide presentations?', a: 'Yes. The bullet format is perfect for PowerPoint or Google Slides. Copy the points directly into your slide deck.' },
    ],
  },
  {
    id: 'coverletter', slug: 'cover-letter-generator', name: 'Cover Letter Generator', desc: 'Generate a tailored professional cover letter with AI',
    emoji: '📝', tags: ['cover letter', 'ai', 'job', 'resume', 'career', 'writing'], category: 'Text Tools',
    componentPath: 'text/CoverLetterGenerator',
    seo: {
      title: 'Cover Letter Generator - Free AI Cover Letter Writer | Neetab',
      description: 'Free AI cover letter generator. Enter the job title, company, and your background. Get a tailored, professional cover letter in seconds.',
      h1: 'AI Cover Letter Generator',
    },
    howTo: [
      'Enter the job title and company name you are applying to.',
      'Write a brief summary of your relevant experience, skills, and why you are a good fit.',
      'Click "Generate Cover Letter". AI writes a 3-4 paragraph professional cover letter tailored to the role.',
    ],
    faq: [
      { q: 'Do I need to provide my full resume?', a: 'No. Just a brief summary of your relevant experience and skills. A few sentences describing your background is enough for the AI to write a strong letter.' },
      { q: 'Is the letter ATS-friendly?', a: 'Yes. The generated letters use clean, professional language with relevant keywords for the job title, which helps pass Applicant Tracking System filters.' },
      { q: 'Can I use this for multiple applications?', a: 'Absolutely. Change the job title, company, and background details to generate a unique cover letter for each application.' },
    ],
  },
  {
    id: 'emailsubject', slug: 'email-subject-line-generator', name: 'Email Subject Line Generator', desc: 'Generate high-open-rate email subject lines with AI',
    emoji: '📧', tags: ['email', 'subject', 'ai', 'marketing', 'open rate', 'writing'], category: 'Text Tools',
    componentPath: 'text/EmailSubjectGenerator',
    seo: {
      title: 'Email Subject Line Generator - Free AI Tool | Neetab',
      description: 'Free AI email subject line generator. Paste your email body and get 8 compelling subject lines optimized for high open rates.',
      h1: 'Email Subject Line Generator',
    },
    howTo: [
      'Paste your email body into the input box.',
      'Click "Generate Subject Lines". AI analyzes the email content and generates 8 compelling subject line options.',
      'Click any subject line to copy it instantly to your clipboard.',
    ],
    faq: [
      { q: 'How many subject lines will I get?', a: 'You will get 8 subject line options per generation, ranging from direct and informational to curiosity-driven and benefit-focused styles.' },
      { q: 'Does this work for cold email and newsletters?', a: 'Yes. The AI adapts to the tone and purpose of your email, whether it is a cold outreach, newsletter, sales email, or transactional message.' },
      { q: 'What makes a good subject line?', a: 'The best subject lines are under 60 characters, create curiosity or convey clear value, avoid spam trigger words, and match the email content. The AI is trained on these principles.' },
    ],
  },
  {
    id: 'metadesc', slug: 'meta-description-generator', name: 'Meta Description Generator', desc: 'Generate SEO meta descriptions for any page with AI',
    emoji: '🔍', tags: ['seo', 'meta', 'description', 'ai', 'google', 'search', 'marketing'], category: 'Text Tools',
    componentPath: 'text/MetaDescriptionGenerator',
    seo: {
      title: 'Meta Description Generator - Free SEO Tool | Neetab',
      description: 'Free AI meta description generator. Enter your page topic and target keyword to get 3 SEO-optimized meta descriptions under 160 characters.',
      h1: 'AI Meta Description Generator',
    },
    howTo: [
      'Describe your page content or paste a summary into the input box.',
      'Optionally add your target keyword for better SEO alignment.',
      'Click "Generate Meta Descriptions". Get 3 options, each with a character count indicator. Green = 150-160 chars (ideal).',
    ],
    faq: [
      { q: 'What is the ideal meta description length?', a: 'Google typically displays 150-160 characters in search results. Descriptions in this range are unlikely to be cut off. The tool color-codes each option: green (ideal), yellow (acceptable), red (too short or long).' },
      { q: 'Does the meta description directly affect rankings?', a: 'Meta descriptions are not a direct Google ranking factor, but they significantly impact click-through rate (CTR). A compelling meta description gets more clicks, which can indirectly improve rankings.' },
      { q: 'Should I include my keyword in the meta description?', a: 'Yes. Google bolds matching keywords in search snippets, making your listing more visible. Always include your primary keyword naturally in the description.' },
    ],
  },
  {
    id: 'paraphrase', slug: 'paraphrasing-tool', name: 'Paraphrasing Tool', desc: 'Rewrite text in a different style with AI',
    emoji: '✏️', tags: ['paraphrase', 'rewrite', 'ai', 'text', 'writing', 'style'], category: 'Text Tools',
    componentPath: 'text/ParaphrasingTool',
    seo: {
      title: 'Paraphrasing Tool - Free AI Text Rewriter | Neetab',
      description: 'Free AI paraphrasing tool. Paste any text and rewrite it in formal, casual, creative, concise, or academic style instantly.',
      h1: 'Free AI Paraphrasing Tool',
    },
    howTo: [
      'Paste the text you want to paraphrase into the input box.',
      'Select a style: Formal, Casual, Creative, Concise, or Academic.',
      'Click "Paraphrase". The AI rewrites the text while preserving the original meaning.',
    ],
    faq: [
      { q: 'What is paraphrasing?', a: 'Paraphrasing means restating someone\'s ideas in your own words with a different structure and vocabulary, while keeping the same meaning. It is commonly used in academic writing, content creation, and avoiding plagiarism.' },
      { q: 'Will this make my content unique?', a: 'Yes. The AI rewrites text with different word choices and sentence structures, producing unique content that conveys the same ideas. Always review and personalize the output.' },
      { q: 'What styles are available?', a: 'Formal (professional and polished), Casual (relaxed and conversational), Creative (expressive and vivid), Concise (shorter and to the point), and Academic (scholarly and structured).' },
    ],
  },
  {
    id: 'summarizer', slug: 'text-summarizer', name: 'Text Summarizer', desc: 'Summarize long text into key points with AI',
    emoji: '📋', tags: ['summarize', 'ai', 'text', 'summary', 'reading', 'tldr'], category: 'Text Tools',
    componentPath: 'text/Summarizer',
    seo: {
      title: 'Text Summarizer - Free AI Summarizer Online | Neetab',
      description: 'Free AI text summarizer. Paste any article or document and get a summary in one sentence, a short paragraph, or a detailed overview.',
      h1: 'AI Text Summarizer',
    },
    howTo: [
      'Paste the article, document, or text you want to summarize.',
      'Choose a summary length: 1 Sentence (ultra-brief), Short (2-3 sentences), Paragraph, or Detailed (3-4 paragraphs).',
      'Click "Summarize". The AI extracts and condenses the key information.',
    ],
    faq: [
      { q: 'What types of text can I summarize?', a: 'Articles, research papers, blog posts, news stories, reports, emails, and any long-form text. The AI works best on well-structured written content.' },
      { q: 'How long can the input text be?', a: 'Up to 8,000 characters (roughly 1,200-1,500 words). This covers most articles and short documents.' },
      { q: 'What is the difference between the summary lengths?', a: '1 Sentence gives the single most important point. Short gives a 2-3 sentence overview. Paragraph provides a concise single paragraph. Detailed gives a thorough 3-4 paragraph breakdown of the main sections.' },
    ],
  },
  // ═══ PRODUCTIVITY ═══
  {
    id: 'countdown', slug: 'countdown-timer', name: 'Countdown Timer', desc: 'Set a timer for any duration',
    emoji: '⏳', tags: ['countdown', 'timer', 'alarm', 'clock', 'stopwatch'], category: 'Productivity',
    componentPath: 'generators/CountdownTimer',
    seo: {
      title: 'Countdown Timer - Free Online Timer | Neetab',
      description: 'Set a countdown timer for any duration free online. Audible alert when it finishes. Perfect for cooking, study sessions, and time management.',
      h1: 'Free Online Countdown Timer',
    },
    howTo: [
      'Set your desired time using the hour, minute, and second input fields, or tap one of the quick-preset buttons (1 min, 5 min, 10 min, etc.).',
      'Click Start. The countdown shows a visual progress ring and the remaining time is reflected in the browser tab title.',
      'An audio alarm plays three times when the countdown reaches zero. Click Reset to clear and set a new timer.',
    ],
    faq: [
      { q: 'Will the timer still run if I switch tabs?', a: 'Yes. The countdown continues in the background and the browser tab title updates with the remaining time, so you can monitor progress without switching back to this tab.' },
      { q: 'Will I hear an alarm when it finishes?', a: 'Yes. Three short beeps play when the countdown reaches zero. Make sure your device volume is not muted. Some browsers require a user interaction on the page before audio can play.' },
      { q: 'What are the quick presets?', a: 'One-click buttons for 1, 5, 10, 15, and 30 minutes, plus 1 hour. Tap any preset to instantly set that duration, then click Start.' },
      { q: 'Can I pause and resume?', a: 'Yes. Click Pause to freeze the countdown, then Resume to continue from exactly where it stopped. The progress ring and tab title remain accurate throughout.' },
    ],
  },
  {
    id: 'pomodoro', slug: 'pomodoro-timer', name: 'Pomodoro Timer', desc: '25-minute focus timer with breaks',
    emoji: '🍅', tags: ['timer', 'pomodoro', 'focus', 'productivity', 'time'], category: 'Productivity',
    componentPath: 'generators/PomodoroTimer',
    seo: {
      title: 'Pomodoro Timer - Focus and Break Timer | Neetab',
      description: 'Free Pomodoro timer for focused work sessions. 25-minute work intervals with 5-minute short breaks and 15-minute long breaks. No sign-up needed.',
      h1: 'Pomodoro Focus Timer',
    },
    howTo: [
      'Click Start to begin a 25-minute focused work session. Minimize distractions and focus on one task.',
      'When the timer ends, a notification sound plays. A 5-minute short break begins automatically.',
      'After completing 4 Pomodoro sessions, a 15-minute long break is triggered. Your session count is tracked on screen.',
    ],
    faq: [
      { q: 'What is the Pomodoro Technique?', a: 'A time management method created by Francesco Cirillo in the late 1980s, using 25-minute focused work sessions followed by 5-minute breaks. After 4 sessions, take a longer 15-minute break. The technique helps maintain focus and reduces mental fatigue.' },
      { q: 'Will I hear a sound when the timer ends?', a: 'Yes. A short notification sound plays when each session ends, alerting you to take a break or start the next focus session even if you are looking at a different tab.' },
      { q: 'Does the timer work in the background?', a: 'Yes. The timer continues running even if you switch tabs or minimize your browser. The page title updates with the remaining time so you can glance at your tab bar without switching back.' },
      { q: 'Can I customize the Pomodoro interval?', a: 'The standard Pomodoro Technique uses fixed 25-minute work sessions and 5-minute breaks - this timer follows that original specification. The fixed intervals are intentional to the technique\'s effectiveness.' },
    ],
  },
  {
    id: 'stopwatch', slug: 'stopwatch', name: 'Stopwatch', desc: 'Stopwatch with lap times',
    emoji: '⏱️', tags: ['stopwatch', 'timer', 'lap', 'time', 'measure'], category: 'Productivity',
    componentPath: 'generators/Stopwatch',
    seo: {
      title: 'Stopwatch - Free Online with Lap Times | Neetab',
      description: 'Free online stopwatch with lap times. Centisecond precision, best/slowest lap highlighting, and tab title updates while running. No sign-up.',
      h1: 'Free Online Stopwatch',
    },
    howTo: [
      'Click Start to begin timing.',
      'Click Lap to record a split time without stopping the stopwatch.',
      'Click Pause to freeze the time. Click Reset to clear everything and start over.',
    ],
    faq: [
      { q: 'Does the stopwatch work in the background?', a: 'Yes. The stopwatch continues running if you switch tabs. The page title updates with the current time so you can monitor it from the tab bar.' },
      { q: 'How accurate is the timing?', a: 'The stopwatch uses JavaScript setInterval with 10ms updates, providing centisecond precision. It is accurate enough for most practical timing purposes.' },
    ],
  },

];

// ─── Categories ───
export const categories: Category[] = [
  { name: 'File Tools', emoji: '📄', slug: 'file-tools', tools: tools.filter(t => t.category === 'File Tools') },
  { name: 'Calculators', emoji: '🧮', slug: 'calculators', tools: tools.filter(t => t.category === 'Calculators') },
  { name: 'Design Tools', emoji: '🎨', slug: 'design-tools', tools: tools.filter(t => t.category === 'Design Tools') },
  { name: 'Dev Tools', emoji: '🛠️', slug: 'dev-tools', tools: tools.filter(t => t.category === 'Dev Tools') },
  { name: 'Converters', emoji: '🔄', slug: 'converters', tools: tools.filter(t => t.category === 'Converters') },
  { name: 'Text Tools', emoji: '📝', slug: 'text-tools', tools: tools.filter(t => t.category === 'Text Tools') },
  { name: 'Productivity', emoji: '🍅', slug: 'productivity', tools: tools.filter(t => t.category === 'Productivity') },
];

export const allTools = tools;
const popularOrder = ['pdf2word','word2pdf','imgcompress','qr','password','json','unit','currency','wordcount','palette','tip','colorfrompic'];
export const popularTools = popularOrder.map(id => tools.find(t => t.id === id)!).filter(Boolean);
export const toolBySlug = (slug: string) => tools.find(t => t.slug === slug);
export const totalToolCount = tools.length;
