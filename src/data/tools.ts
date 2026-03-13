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
}

export interface Category {
  name: string;
  emoji: string;
  slug: string;
  tools: ToolMeta[];
}

// ─── Tool Definitions (ordered by traffic potential within each category) ───
const tools: ToolMeta[] = [
  // ═══ FILE TOOLS (highest traffic) ═══
  {
    id: 'pdf2word', slug: 'pdf-to-word', name: 'PDF to Word', desc: 'Convert PDF to editable DOCX',
    emoji: '📝', tags: ['pdf', 'word', 'docx', 'convert'], category: 'File Tools', popular: true,
    componentPath: 'file/PDFtoWord',
    seo: {
      title: 'PDF to Word Converter | Free Online | Neetab',
      description: 'Convert PDF files to editable Word documents for free. Preserves layout, tables, images & formatting. No sign-up required.',
      h1: 'PDF to Word Converter',
    },
    howTo: [
      'Upload your PDF by clicking the upload area or dragging and dropping the file onto it.',
      'Click Convert. The tool attempts server-side conversion first for best quality, then falls back to browser-based extraction if the server is unavailable.',
      'Once conversion is complete, click Download to save your editable .docx file. Open it in Microsoft Word, Google Docs, or LibreOffice.',
    ],
    faq: [
      { q: 'Is my PDF file uploaded to a server?', a: 'When server conversion is available, your file is sent securely over HTTPS, processed immediately, and deleted right after conversion. It is never stored, read by humans, or shared with any third party.' },
      { q: 'What quality can I expect from the conversion?', a: 'Server-side conversion uses pdf2docx and LibreOffice, which preserve layout, tables, images, headers, footers, and text formatting with high accuracy. Complex PDFs with unusual fonts or heavy graphics may require minor manual cleanup after conversion.' },
      { q: 'Is there a file size limit?', a: 'You can convert PDFs up to 50MB. For best results, keep files under 20MB. Very large PDFs with many pages can take longer to process.' },
      { q: 'What if the server is not available?', a: 'If the conversion server is offline, the tool automatically falls back to browser-side text extraction using PDF.js, which produces a plain-text DOCX. For complex layouts, wait and try again when the server is back online.' },
    ],
  },
  {
    id: 'word2pdf', slug: 'word-to-pdf', name: 'Word to PDF', desc: 'Convert DOCX to PDF',
    emoji: '📃', tags: ['word', 'pdf', 'docx', 'convert'], category: 'File Tools', popular: true,
    componentPath: 'file/WordToPDF',
    seo: {
      title: 'Word to PDF Converter | Free Online | Neetab',
      description: 'Convert Word documents to PDF for free. Preserves formatting, tables, and images. Runs entirely in your browser.',
      h1: 'Word to PDF Converter',
    },
    howTo: [
      'Upload your .docx or .doc Word file by clicking the upload area or dragging it in.',
      'Click Convert to PDF. Server-side conversion via LibreOffice preserves your fonts, tables, images, headers, footers, and page layout.',
      'Download the resulting PDF when conversion is complete. The PDF is universally readable on any device without needing Microsoft Word.',
    ],
    faq: [
      { q: 'Will my Word document formatting be preserved?', a: 'Yes. Server conversion uses LibreOffice, which preserves fonts, tables, images, headers, footers, and page layout with near-perfect accuracy. Complex documents with embedded objects may occasionally need minor formatting adjustments.' },
      { q: 'Can I convert .doc files or only .docx?', a: 'Both .doc (older Word format) and .docx (modern Word format) are fully supported for conversion to PDF.' },
      { q: 'Is there a file size limit?', a: 'You can convert Word documents up to 50MB. Most documents are well under this limit. Very long documents with many images may take a few extra seconds to process.' },
      { q: 'Is my document uploaded to a server?', a: 'When server conversion is used, your file is sent securely over HTTPS, processed immediately, and deleted right after conversion. It is never stored, read, or shared.' },
      { q: 'Can I convert multiple documents at once?', a: 'Currently one document can be converted at a time. Simply upload another file after each conversion completes — there is no limit on how many you can convert in a session.' },
    ],
  },
  {
    id: 'imgcompress', slug: 'image-compressor', name: 'Image Compressor', desc: 'Reduce image file size instantly',
    emoji: '🗜️', tags: ['image', 'compress', 'resize', 'optimize'], category: 'File Tools', popular: true,
    componentPath: 'file/ImageCompressor',
    seo: {
      title: 'Image Compressor | Reduce Image Size Free | Neetab',
      description: 'Compress images online for free. Reduce file size while keeping quality. Before/after preview. Private - runs in your browser.',
      h1: 'Image Compressor',
    },
    howTo: [
      'Upload a PNG, JPG, or WebP image by clicking the upload area or dragging and dropping it.',
      'Adjust the quality slider to your preference — 80% is recommended as a sweet spot between file size and visual quality.',
      'Compare the before and after file sizes in the preview, then click Download to save your compressed image.',
    ],
    faq: [
      { q: 'Does compression reduce image quality?', a: 'You control the quality slider. At 80%, most images look identical to the original while being 60–80% smaller in file size. For photos shared on social media or websites, 70–85% quality is generally indistinguishable from the original.' },
      { q: 'Is my image uploaded anywhere?', a: 'No. Compression runs entirely in your browser using the HTML Canvas API. Your images never leave your device and are never sent to any server.' },
      { q: 'What image formats are supported?', a: 'You can compress PNG, JPG, and WebP images. You can also convert between these formats during compression — for example, converting a large PNG to a smaller WebP.' },
      { q: 'How much can I reduce the file size?', a: 'Typical results are 50–80% file size reduction. A 5MB photo often compresses to under 1MB with no visible quality loss at 80% quality. PNGs with large areas of solid color compress especially well.' },
    ],
  },
  {
    id: 'pdf2img', slug: 'pdf-to-image', name: 'PDF to Image', desc: 'Convert PDF pages to PNG/JPG',
    emoji: '📑', tags: ['pdf', 'image', 'convert', 'png', 'jpg'], category: 'File Tools',
    componentPath: 'file/PDFtoImage',
    seo: {
      title: 'PDF to Image | Convert PDF to PNG/JPG Free | Neetab',
      description: 'Convert PDF pages to high-quality PNG or JPG images for free. Private - files never leave your browser.',
      h1: 'PDF to Image Converter',
    },
    howTo: [
      'Upload a PDF file by clicking the upload area or dragging it in.',
      'Select your preferred output format — PNG for lossless quality or JPG for smaller file sizes.',
      'Each page is converted and shown as a separate image. Click Download under any page to save it, or download all pages.',
    ],
    faq: [
      { q: 'What image formats can I export to?', a: 'You can export PDF pages as high-quality PNG or JPG images. PNG is best for preserving sharp text and graphics. JPG is better when you need smaller file sizes and the content is photographic.' },
      { q: 'Can I convert a multi-page PDF?', a: 'Yes. Each page is converted to a separate image that you can download individually. There is no practical limit on the number of pages, though very large PDFs may take more time to render.' },
      { q: 'Is my PDF uploaded to a server?', a: 'No. PDF to image conversion runs entirely in your browser using PDF.js, the same library used by Firefox and Chrome. Your files never leave your device.' },
      { q: 'What resolution are the output images?', a: 'Images are rendered at the PDF native resolution, which is typically 72–150 DPI. The result is sharp for screen use. For high-resolution print output, a dedicated desktop tool may produce better results at 300+ DPI.' },
    ],
  },
  {
    id: 'img2pdf', slug: 'image-to-pdf', name: 'Image to PDF', desc: 'Combine images into one PDF',
    emoji: '🖼️', tags: ['image', 'pdf', 'convert', 'combine'], category: 'File Tools',
    componentPath: 'file/ImageToPDF',
    seo: {
      title: 'Image to PDF | Combine Images into PDF Free | Neetab',
      description: 'Combine multiple images into a single PDF document. Reorder, choose size and orientation. Free and private.',
      h1: 'Image to PDF Converter',
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
      { q: 'Is my data private?', a: 'Yes. The entire conversion happens in your browser using jsPDF. No images are uploaded to any server — everything stays on your device.' },
    ],
  },
  {
    id: 'invoice', slug: 'invoice-generator', name: 'Invoice Generator', desc: 'Create professional PDF invoices',
    emoji: '🧾', tags: ['invoice', 'bill', 'pdf', 'business', 'receipt', 'freelance'], category: 'File Tools',
    componentPath: 'file/InvoiceGenerator',
    seo: {
      title: 'Free Invoice Generator | Create PDF Invoices Online | Neetab',
      description: 'Create professional PDF invoices for free. Add line items, tax, notes. Download instantly. No sign-up, no watermarks.',
      h1: 'Free Invoice Generator',
    },
    howTo: [
      'Fill in your business name and contact details in the "From" section, and your client\'s details in the "Bill To" section.',
      'Add line items with descriptions, quantities, and unit prices. Set a tax rate and any notes or payment terms at the bottom.',
      'Click Download PDF to instantly save a professional, print-ready invoice to your device — no sign-up required.',
    ],
    faq: [
      { q: 'Is this invoice generator really free?', a: 'Yes, completely free with no watermarks, no sign-up, and no limits on how many invoices you can create. Download as many PDFs as you need.' },
      { q: 'Are my invoices saved or stored?', a: 'No. Everything runs in your browser using jsPDF. Your business information and invoice data never leave your device and are never sent to any server.' },
      { q: 'Can I add tax to my invoices?', a: 'Yes. Set a tax percentage (e.g., 10% VAT or 8.5% sales tax) and it will be automatically calculated and shown as a separate line on the invoice.' },
      { q: 'What currencies are supported?', a: 'You can choose from common currency symbols including USD ($), EUR (€), GBP (£), JPY (¥), INR (₹), NGN (₦), CAD (C$), and AUD (A$).' },
      { q: 'Can I customize the invoice number?', a: 'Yes. The invoice number is auto-generated but fully editable. Use any numbering scheme you prefer — sequential numbers, date-based codes, or client-specific prefixes.' },
    ],
  },

  // ═══ CALCULATORS ═══
  {
    id: 'tip', slug: 'tip-calculator', name: 'Tip Calculator', desc: 'Split bills & calculate tips',
    emoji: '💰', tags: ['money', 'restaurant', 'bill', 'split'], category: 'Calculators', popular: true,
    componentPath: 'calculators/TipCalculator',
    seo: {
      title: 'Tip Calculator | Split Bills & Calculate Tips | Neetab',
      description: 'Free online tip calculator. Calculate tip amount, total bill, and split between friends instantly.',
      h1: 'Tip Calculator',
    },
    howTo: [
      'Enter your total bill amount in the Bill field.',
      'Select a tip percentage from the preset buttons (15%, 18%, 20%) or type a custom percentage.',
      'Enter the number of people splitting the bill to see each person\'s share, including their portion of the tip.',
    ],
    faq: [
      { q: 'How do I calculate a tip?', a: 'Enter your bill amount, select a tip percentage (15%, 18%, 20%, or custom), and optionally split between multiple people. The calculator shows the tip amount, total bill, and per-person cost instantly.' },
      { q: 'What is the standard tip percentage?', a: 'In the US, 15–20% is standard for restaurant service. 18% is a common middle ground. For exceptional service, 25% or more is appreciated. For quick-service or counter service, 10–15% is typical.' },
      { q: 'Can I split the bill between multiple people?', a: 'Yes. Enter the number of people and the calculator divides the total evenly, showing each person\'s exact share including tip. Ideal for group dinners where everyone wants to pay their fair share.' },
      { q: 'Does this work for non-restaurant tips?', a: 'Absolutely. Use it for any tipping situation — delivery drivers, hairdressers, hotel staff, taxi rides, or any service where you want to calculate a percentage of a bill.' },
    ],
  },
  {
    id: 'bmi', slug: 'bmi-calculator', name: 'BMI Calculator', desc: 'Body mass index check',
    emoji: '⚖️', tags: ['health', 'fitness', 'weight', 'body'], category: 'Calculators',
    componentPath: 'calculators/BMICalculator',
    seo: {
      title: 'BMI Calculator | Body Mass Index | Neetab',
      description: 'Free BMI calculator. Check your body mass index with imperial or metric units. Instant results with health categories.',
      h1: 'BMI Calculator',
    },
    howTo: [
      'Select your unit system — imperial (feet/inches and pounds) or metric (centimeters and kilograms).',
      'Enter your height and weight in the corresponding fields.',
      'Your BMI is calculated instantly and displayed alongside your weight category (underweight, normal, overweight, or obese).',
    ],
    faq: [
      { q: 'What is a healthy BMI range?', a: 'A BMI between 18.5 and 24.9 is considered normal weight. Below 18.5 is underweight, 25–29.9 is overweight, and 30 or above is considered obese. These ranges apply to adults aged 18 and over and are the same for both men and women.' },
      { q: 'Does BMI apply to athletes?', a: 'BMI may overestimate body fat in athletes and muscular individuals because muscle weighs more than fat. A heavily muscled person may have a high BMI while being very lean. It is best used as a general population screening tool, not a definitive individual health measure.' },
      { q: 'Does BMI work the same for men and women?', a: 'The same BMI scale applies to adult men and women, though body composition naturally differs between sexes. Women typically carry a higher body fat percentage at the same BMI as men. For a fuller picture of health, consider waist circumference and body fat percentage alongside your BMI result.' },
    ],
  },
  {
    id: 'percentage', slug: 'percentage-calculator', name: 'Percentage Calculator', desc: 'All percentage calculations',
    emoji: '📊', tags: ['math', 'percent', 'discount'], category: 'Calculators',
    componentPath: 'calculators/PercentageCalculator',
    seo: {
      title: 'Percentage Calculator | What is X% of Y? | Neetab',
      description: 'Free percentage calculator. Find what percent of a number, percentage change, or what X is as a percentage of Y.',
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
    id: 'discount', slug: 'discount-calculator', name: 'Discount Calculator', desc: 'Sale price & savings',
    emoji: '🏷️', tags: ['shopping', 'sale', 'savings'], category: 'Calculators',
    componentPath: 'calculators/DiscountCalculator',
    seo: {
      title: 'Discount Calculator | Sale Price & Savings | Neetab',
      description: 'Calculate sale price and savings instantly. Enter original price and discount percentage to see final price.',
      h1: 'Discount Calculator',
    },
    howTo: [
      'Enter the original price of the item in the Price field.',
      'Enter the discount percentage — for example, 25 for a 25% off sale.',
      'The discount amount and the final sale price are shown instantly so you know exactly what you will pay.',
    ],
    faq: [
      { q: 'How do I calculate a sale price?', a: 'Enter the original price and the discount percentage. The calculator instantly shows the discount amount in dollars (or your currency) and the final price you will pay.' },
      { q: 'Can I calculate double discounts?', a: 'Enter the combined effective discount percentage. Note that a 20% off sale followed by an additional 10% off is not 30% — it is approximately 28%, because the second discount applies to the already-reduced price, not the original.' },
      { q: 'Does this include sales tax?', a: 'The calculator shows the discounted price before tax. Sales tax rates vary by location and are not included. Add your local tax percentage to the final discounted price for the actual total.' },
    ],
  },
  {
    id: 'age', slug: 'age-calculator', name: 'Age Calculator', desc: 'Exact age from birthdate',
    emoji: '🎂', tags: ['date', 'birthday', 'days'], category: 'Calculators',
    componentPath: 'calculators/AgeCalculator',
    seo: {
      title: 'Age Calculator | Exact Age from Date of Birth | Neetab',
      description: 'Calculate your exact age in years, months, and days. Find total days lived and days until your next birthday.',
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
      { q: 'Can I calculate age between two dates?', a: 'The calculator uses today as the end date. To find the age or duration between two custom dates, enter the earlier date as the birth date — the result will represent the elapsed time between the two dates.' },
    ],
  },

  // ═══ DESIGN TOOLS ═══
  {
    id: 'palette', slug: 'color-palette-generator', name: 'Color Palette', desc: 'Generate beautiful color schemes',
    emoji: '🎨', tags: ['design', 'color', 'css', 'palette'], category: 'Design Tools', popular: true,
    componentPath: 'design/ColorPalette',
    seo: {
      title: 'Color Palette Generator | Beautiful Color Schemes | Neetab',
      description: 'Generate stunning color palettes instantly. Random, complementary, analogous, triadic, and more. Export CSS variables.',
      h1: 'Color Palette Generator',
    },
    howTo: [
      'Click Generate for a random palette, or enter a specific base hex color to start from a particular hue.',
      'Choose a color harmony — complementary, analogous, triadic, split-complementary — to shape the mood of your palette.',
      'Lock any colors you want to keep, then click Generate again to refresh only the unlocked swatches. Click any color to copy its hex code.',
    ],
    faq: [
      { q: 'How are the color palettes generated?', a: 'Palettes are generated using color theory algorithms including complementary (opposite hues), analogous (adjacent hues), triadic (three evenly spaced hues), and split-complementary harmonies based on your chosen base color.' },
      { q: 'Can I export the palette?', a: 'Yes. Click any color swatch to copy its HEX code to your clipboard. Use the Export button to copy the full palette as CSS custom properties or as a list of hex values.' },
      { q: 'Can I lock a color and regenerate the rest?', a: 'Yes. Click the lock icon on any swatch to pin it, then click Generate. Locked colors stay fixed while the unlocked ones refresh — great for building around a brand color.' },
      { q: 'Are the palettes free for commercial use?', a: 'Yes. All generated palettes are free to use in personal and commercial projects with no attribution required. Colors themselves are not copyrightable.' },
    ],
  },
  {
    id: 'gradient', slug: 'css-gradient-generator', name: 'Gradient Maker', desc: 'Create CSS gradients visually',
    emoji: '🌈', tags: ['design', 'css', 'background', 'gradient'], category: 'Design Tools',
    componentPath: 'design/GradientMaker',
    seo: {
      title: 'CSS Gradient Generator | Linear, Radial & Conic | Neetab',
      description: 'Create beautiful CSS gradients visually. Linear, radial, conic. Preset palettes, custom colors, one-click CSS copy.',
      h1: 'CSS Gradient Generator',
    },
    howTo: [
      'Choose a gradient type — linear (directional), radial (circular), or conic (angular sweep).',
      'Click the color stops on the gradient bar to edit them. Add new stops by clicking on the bar; delete stops by dragging them off.',
      'Copy the generated CSS code with one click and paste it as a background property in your stylesheet.',
    ],
    faq: [
      { q: 'What gradient types are supported?', a: 'Linear, radial, and conic gradients are all supported. You can customize the angle or position, adjust color stops, and copy the complete CSS background property code.' },
      { q: 'Can I use more than two colors?', a: 'Yes. Add multiple color stops anywhere along the gradient bar to create complex multi-color transitions. Each stop\'s position can be adjusted precisely by dragging.' },
      { q: 'How do I use the generated CSS?', a: 'Click the Copy CSS button to copy the gradient declaration, then paste it as a background or background-image property in your CSS. It works in all modern browsers without any prefix.' },
    ],
  },
  {
    id: 'color', slug: 'color-converter', name: 'Color Converter', desc: 'HEX ↔ RGB ↔ HSL',
    emoji: '🔵', tags: ['design', 'css', 'color', 'hex', 'rgb'], category: 'Design Tools',
    componentPath: 'design/ColorConverter',
    seo: {
      title: 'Color Converter | HEX to RGB to HSL | Neetab',
      description: 'Convert colors between HEX, RGB, HSL, and RGBA. Visual color picker with instant conversion and one-click copy.',
      h1: 'Color Converter',
    },
    howTo: [
      'Type a color value in any supported format — HEX (#ff5733), RGB (255, 87, 51), or HSL (11, 100%, 60%).',
      'All other format representations update instantly as you type.',
      'Click the copy icon next to any format to copy it for use in CSS, design tools, or code.',
    ],
    faq: [
      { q: 'What color formats are supported?', a: 'Convert between HEX, RGB, and HSL formats instantly. Enter any format and see all the equivalent values in real time.' },
      { q: 'Can I use the visual color picker?', a: 'Yes. Click the color swatch or picker area to open a visual color chooser. Drag the picker to any hue and saturation, and all format values update automatically.' },
      { q: 'How do I copy a color value?', a: 'Click the copy icon next to any color format — HEX, RGB, or HSL — to instantly copy it to your clipboard, ready to paste into your CSS, Figma, Sketch, or any other tool.' },
    ],
  },
  {
    id: 'favicon', slug: 'favicon-generator', name: 'Favicon Generator', desc: 'Generate all favicon sizes from one image',
    emoji: '⭐', tags: ['favicon', 'icon', 'website', 'pwa', 'apple-touch'], category: 'Design Tools',
    componentPath: 'design/FaviconGenerator',
    seo: {
      title: 'Favicon Generator | Create All Sizes from One Image | Neetab',
      description: 'Generate favicons in all sizes (16x16 to 512x512) from one image. Download PNG icons for browsers, Apple Touch, Android, and PWA.',
      h1: 'Favicon Generator',
    },
    howTo: [
      'Upload a square PNG or SVG image. For best results, use a 512×512 pixel image or larger with a simple, bold design.',
      'All required favicon sizes are generated automatically: 16×16, 32×32, 48×48, 180×180 (Apple Touch), 192×192, and 512×512.',
      'Download individual sizes as PNG files, or use the Download All button to get a ZIP containing every size at once.',
    ],
    faq: [
      { q: 'What sizes do I need for a favicon?', a: 'At minimum: 16×16 and 32×32 for browser tabs, 180×180 for Apple Touch Icon (iOS home screen), and 192×192 and 512×512 for Android and PWA manifest icons. This tool generates all of them from a single upload.' },
      { q: 'What image format should I upload?', a: 'PNG or SVG work best. Use a square image for optimal results — the tool will resize and center automatically. Avoid complex photographs; simple logos and icons look much cleaner at small sizes.' },
      { q: 'Are the favicons generated locally?', a: 'Yes. All processing happens in your browser using the HTML Canvas API. No images are uploaded to any server.' },
      { q: 'How do I add favicons to my website?', a: 'Place the generated files in your site\'s root directory (or /public folder), then add the appropriate link tags in your HTML <head>: <link rel="icon" sizes="32x32" href="/favicon-32x32.png"> for each size, and <link rel="apple-touch-icon" href="/apple-touch-icon.png"> for iOS.' },
    ],
  },

  // ═══ DEV TOOLS ═══
  {
    id: 'json', slug: 'json-formatter', name: 'JSON Formatter', desc: 'Format, validate & minify JSON',
    emoji: '{ }', tags: ['json', 'format', 'validate', 'minify', 'dev'], category: 'Dev Tools', popular: true,
    componentPath: 'generators/JSONFormatter',
    seo: {
      title: 'JSON Formatter & Validator | Free Online | Neetab',
      description: 'Format, validate, and minify JSON online for free. Syntax highlighting, error detection, and one-click copy.',
      h1: 'JSON Formatter & Validator',
    },
    howTo: [
      'Paste your JSON into the input box. It is validated and formatted automatically with syntax highlighting.',
      'If your JSON has errors, they are highlighted with a message showing the exact location of the problem.',
      'Use the Minify button to compress JSON for production use, or adjust indentation (2 spaces, 4 spaces, tabs) using the format options.',
    ],
    faq: [
      { q: 'Does this validate my JSON?', a: 'Yes. Invalid JSON is highlighted with an error message showing exactly where the problem is — missing commas, unquoted keys, trailing commas, and other common mistakes are all detected.' },
      { q: 'Can I minify JSON?', a: 'Yes. Use the Minify button to remove all whitespace and produce compact JSON, ideal for reducing payload size in API responses or configuration files.' },
      { q: 'Is my JSON data private?', a: 'Yes. All formatting and validation happens in your browser using JavaScript\'s JSON.parse. Your data is never sent to any server.' },
      { q: 'What indentation options are available?', a: 'You can format JSON with 2 spaces, 4 spaces, or tab indentation depending on your preference or the coding standards of your project.' },
    ],
  },
  {
    id: 'qrscanner', slug: 'qr-code-scanner', name: 'QR Code Scanner', desc: 'Scan QR codes from camera or image',
    emoji: '🔍', tags: ['qr', 'scan', 'camera', 'decode', 'reader'], category: 'Dev Tools',
    componentPath: 'devtools/QRCodeScanner',
    seo: {
      title: 'QR Code Scanner | Scan from Camera or Image | Neetab',
      description: 'Scan QR codes using your camera or upload an image. Detects URLs, text, and more. Free and private - runs in your browser.',
      h1: 'QR Code Scanner',
    },
    howTo: [
      'Choose Camera to scan using your device\'s camera in real time, or Upload Image to decode a QR code from a saved photo or screenshot.',
      'Point your camera at the QR code and hold steady, or upload an image file containing the code.',
      'The decoded content — URL, plain text, Wi-Fi credentials, or other data — appears below the scanner instantly.',
    ],
    faq: [
      { q: 'Can I scan a QR code without a camera?', a: 'Yes. Use the Upload Image tab to scan a QR code from any image file saved on your device, including screenshots and downloaded images.' },
      { q: 'Is my camera feed uploaded anywhere?', a: 'No. Scanning happens entirely in your browser. Your camera feed and any uploaded images never leave your device.' },
      { q: 'Why does the camera not work?', a: 'Camera access requires HTTPS and explicit browser permission. If denied, go to your browser settings, find camera permissions for this site, set it to Allow, and refresh the page.' },
      { q: 'What can a QR code contain?', a: 'QR codes can store URLs, plain text, phone numbers, Wi-Fi network credentials, email addresses, contact cards (vCard), and more. The type and content are detected and displayed automatically.' },
    ],
  },
  {
    id: 'qr', slug: 'qr-code-generator', name: 'QR Code Generator', desc: 'Generate QR codes for any text or URL',
    emoji: '📱', tags: ['qr', 'barcode', 'link', 'generator'], category: 'Dev Tools', popular: true,
    componentPath: 'generators/QRCodeGenerator',
    seo: {
      title: 'QR Code Generator | Free Online | Neetab',
      description: 'Generate QR codes for URLs, text, email, phone numbers. Custom colors and sizes. Free download as PNG.',
      h1: 'QR Code Generator',
    },
    howTo: [
      'Type or paste the content you want to encode — a URL, plain text, phone number, email address, or any other data.',
      'Customize the QR code size, error correction level, and foreground/background colors if desired.',
      'Click Download to save the QR code as a PNG image ready for print, web, or digital use.',
    ],
    faq: [
      { q: 'Can I customize the QR code?', a: 'Yes. You can adjust the size, error correction level (Low, Medium, Quartile, High), and foreground and background colors to match your brand or design.' },
      { q: 'What can I encode in a QR code?', a: 'Any text, URL, phone number, email, or Wi-Fi credentials. The QR code is generated instantly as you type. For URLs, higher error correction is recommended so the code still scans even if slightly damaged.' },
      { q: 'What format is the downloaded QR code?', a: 'QR codes are downloaded as PNG images. PNG is the most universally compatible format for print, web, and digital presentations.' },
      { q: 'Is the QR code generated locally?', a: 'Yes. QR codes are generated entirely in your browser. Your input data is not sent to any server unless the browser library fails to load, in which case a fallback API may be used as a last resort.' },
    ],
  },
  {
    id: 'barcode', slug: 'barcode-generator', name: 'Barcode Generator', desc: 'Create barcodes in multiple formats',
    emoji: '|||', tags: ['barcode', 'code128', 'ean', 'upc', 'generator'], category: 'Dev Tools',
    componentPath: 'generators/BarcodeGenerator',
    seo: {
      title: 'Barcode Generator | Code 128, EAN, UPC & More | Neetab',
      description: 'Generate barcodes in Code 128, Code 39, EAN-13, EAN-8, UPC-A, ITF-14, and MSI formats. Download as PNG. Free and private.',
      h1: 'Barcode Generator',
    },
    howTo: [
      'Select the barcode format you need — Code 128 for general-purpose alphanumeric content, EAN-13 or UPC-A for retail products.',
      'Enter your barcode data in the input field. Note that EAN-13 requires exactly 12 digits (the 13th check digit is added automatically).',
      'Click Download PNG to save a high-quality barcode image ready for print labels, packaging, or digital use.',
    ],
    faq: [
      { q: 'What barcode formats are supported?', a: 'Code 128, Code 39, EAN-13, EAN-8, UPC-A, ITF-14, and MSI. Code 128 is the most versatile and supports all alphanumeric characters with high data density.' },
      { q: 'What format should I use for product barcodes?', a: 'Use EAN-13 for international retail products (found on most global consumer goods), UPC-A for US and Canada retail, and EAN-8 for smaller packages where space is limited. These formats require specific digit counts.' },
      { q: 'Can I download the barcode?', a: 'Yes. Click Download PNG to save a high-quality, scalable PNG image of your barcode suitable for both print and digital applications.' },
      { q: 'Is the barcode generated locally?', a: 'Yes. All barcode generation runs in your browser using the JsBarcode library. Nothing is sent to any server.' },
      { q: 'Why does EAN-13 require exactly 12 digits?', a: 'EAN-13 has a 13th check digit that is automatically calculated from the first 12 digits using the Luhn-like algorithm. You only need to enter the first 12 digits — the tool adds the check digit for you.' },
    ],
  },
  {
    id: 'password', slug: 'password-generator', name: 'Password Generator', desc: 'Secure random passwords',
    emoji: '🔐', tags: ['security', 'random', 'strong', 'password'], category: 'Dev Tools', popular: true,
    componentPath: 'generators/PasswordGenerator',
    seo: {
      title: 'Password Generator | Secure Random Passwords | Neetab',
      description: 'Generate strong, secure passwords. Customize length, uppercase, numbers, symbols. Cryptographically secure.',
      h1: 'Password Generator',
    },
    howTo: [
      'Set your desired password length using the slider — 16 characters is recommended as a minimum for strong passwords.',
      'Toggle the character types you want included: uppercase letters, lowercase letters, numbers, and special symbols.',
      'Click Generate to create a new password, then click Copy to copy it to your clipboard. Store it in a password manager.',
    ],
    faq: [
      { q: 'How secure are the generated passwords?', a: 'Passwords are generated using your browser\'s cryptographic random number generator (crypto.getRandomValues), which is the same API used by security-critical applications. They are never sent to any server.' },
      { q: 'What makes a strong password?', a: 'A strong password is at least 16 characters long and includes a mix of uppercase letters, lowercase letters, numbers, and special symbols. Length is the most important factor — a 20-character password is far stronger than a complex 8-character one.' },
      { q: 'Can I generate multiple passwords at once?', a: 'You can generate new passwords by clicking the Generate button repeatedly. Each result is cryptographically random and statistically independent of the previous ones.' },
      { q: 'Should I use a password manager?', a: 'Yes. Store generated passwords in a password manager like Bitwarden (free, open-source), 1Password, or KeePass. Never reuse passwords across different accounts — a data breach on one site should not compromise others.' },
    ],
  },
  {
    id: 'base64', slug: 'base64-encoder-decoder', name: 'Base64 Encoder', desc: 'Encode & decode Base64 strings',
    emoji: '🔡', tags: ['base64', 'encode', 'decode', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/Base64Tool',
    seo: {
      title: 'Base64 Encoder & Decoder | Free Online | Neetab',
      description: 'Encode text to Base64 or decode Base64 to text instantly. Free online Base64 tool with swap functionality.',
      h1: 'Base64 Encoder & Decoder',
    },
    howTo: [
      'Enter or paste the text you want to encode in the input box. The Base64-encoded output appears instantly.',
      'To decode, switch to Decode mode and paste a Base64 string — the original text is revealed immediately.',
      'Use the Swap button to quickly reverse direction, or Copy to copy the output to your clipboard.',
    ],
    faq: [
      { q: 'What is Base64 encoding?', a: 'Base64 is a way of encoding binary data as ASCII text using 64 printable characters (A-Z, a-z, 0-9, +, /). It is widely used to safely transmit binary content through systems that only handle text.' },
      { q: 'When would I need Base64?', a: 'Common uses include embedding images in HTML/CSS as data URLs (data:image/png;base64,...), sending binary data in JSON API payloads, encoding email attachments in MIME format, and creating Basic Auth headers (username:password encoded as Base64).' },
      { q: 'Is Base64 encryption?', a: 'No. Base64 is encoding, not encryption. It makes data safe to transport through text-based systems but provides zero security. Anyone can instantly decode a Base64 string. Never use it to protect sensitive data — use proper encryption instead.' },
    ],
  },
  {
    id: 'hash', slug: 'hash-generator', name: 'Hash Generator', desc: 'MD5, SHA-1, SHA-256, SHA-512',
    emoji: '#️⃣', tags: ['hash', 'md5', 'sha', 'checksum', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/HashGenerator',
    seo: {
      title: 'Hash Generator | MD5, SHA-256 & More | Neetab',
      description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly. Free online hash generator. Real-time as you type.',
      h1: 'Hash Generator',
    },
    howTo: [
      'Type or paste the text you want to hash into the input field.',
      'All hash formats — MD5, SHA-1, SHA-256, and SHA-512 — are generated simultaneously and update in real time as you type.',
      'Click the copy icon next to any hash to copy it to your clipboard.',
    ],
    faq: [
      { q: 'What is the difference between MD5 and SHA-256?', a: 'MD5 produces a 128-bit hash and is fast but cryptographically broken — it should not be used for security purposes. SHA-256 produces a 256-bit hash and is the current standard for secure hashing, used in TLS certificates, code signing, and blockchain.' },
      { q: 'What are hashes used for?', a: 'Hashes verify file integrity (checksums), store passwords securely, create digital signatures, and detect data tampering. A hash is a fixed-size fingerprint of any input — even a single character change produces a completely different hash.' },
      { q: 'Is my data sent to a server?', a: 'No. All hashing runs in your browser using the Web Crypto API (for SHA family) and pure JavaScript (for MD5). Your input never leaves your device.' },
    ],
  },
  {
    id: 'uuid', slug: 'uuid-generator', name: 'UUID Generator', desc: 'Generate random UUID v4 strings',
    emoji: '🆔', tags: ['uuid', 'guid', 'random', 'id', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/UUIDGenerator',
    seo: {
      title: 'UUID Generator | Random UUID v4 | Neetab',
      description: 'Generate random UUID v4 strings. Bulk generate, uppercase, no-dash formats. Free online UUID generator.',
      h1: 'UUID Generator',
    },
    howTo: [
      'Click Generate to create a new random UUID v4 string.',
      'Toggle options for uppercase format or no-dash format (e.g., for database IDs that don\'t support hyphens).',
      'Use Bulk Generate to create multiple UUIDs at once and copy them all with a single click.',
    ],
    faq: [
      { q: 'What is a UUID?', a: 'A UUID (Universally Unique Identifier) is a 128-bit identifier standardized in RFC 4122. UUID v4 uses random numbers and is the most commonly used version — it looks like: 550e8400-e29b-41d4-a716-446655440000.' },
      { q: 'Can I generate multiple UUIDs?', a: 'Yes. Use Bulk Generate to create a list of UUIDs at once. Options include uppercase, lowercase, and no-dash formats to match your system\'s requirements.' },
      { q: 'Are UUIDs truly unique?', a: 'With 2^122 possible values (about 5.3 × 10^36), the probability of generating the same UUID v4 twice is astronomically small — effectively zero for any practical application, even at massive scale.' },
    ],
  },
  {
    id: 'urlencode', slug: 'url-encoder-decoder', name: 'URL Encoder', desc: 'Encode & decode URLs',
    emoji: '🔗', tags: ['url', 'encode', 'decode', 'percent', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/URLEncoderDecoder',
    seo: {
      title: 'URL Encoder & Decoder | Free Online | Neetab',
      description: 'Encode and decode URLs online. Supports encodeURIComponent and encodeURI. Free URL encoding tool.',
      h1: 'URL Encoder & Decoder',
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
    id: 'textdiff', slug: 'text-diff', name: 'Text Diff', desc: 'Compare two texts side by side',
    emoji: '📋', tags: ['diff', 'compare', 'text', 'merge', 'dev'], category: 'Dev Tools', wide: true,
    componentPath: 'devtools/TextDiff',
    seo: {
      title: 'Text Diff | Compare Text Online Free | Neetab',
      description: 'Compare two texts and see differences highlighted. Added, removed, and unchanged lines. Free online diff tool.',
      h1: 'Text Diff & Compare',
    },
    howTo: [
      'Paste the original text into the left panel.',
      'Paste the new or modified version into the right panel.',
      'Differences are highlighted immediately — green for lines that were added and red for lines that were removed.',
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
      title: 'Unix Timestamp Converter | Epoch to Date | Neetab',
      description: 'Convert Unix timestamps to human-readable dates and vice versa. Live clock, auto-detect seconds/milliseconds.',
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

  // ═══ CONVERTERS ═══
  {
    id: 'unit', slug: 'unit-converter', name: 'Unit Converter', desc: 'Length, weight, temp, volume & more',
    emoji: '📏', tags: ['measurement', 'science', 'length', 'weight', 'temperature'], category: 'Converters',
    componentPath: 'converters/UnitConverter',
    seo: {
      title: 'Unit Converter | Length, Weight, Temperature & More | Neetab',
      description: 'Convert between units of length, weight, temperature, volume, area, speed, and data. Free and instant.',
      h1: 'Unit Converter',
    },
    howTo: [
      'Select the measurement category — length, weight, temperature, volume, speed, area, or data storage.',
      'Enter a value and select the source unit from the dropdown.',
      'All equivalent values in other units are shown instantly. Select a different output unit to focus on a specific conversion.',
    ],
    faq: [
      { q: 'What units can I convert?', a: 'Length (meters, feet, inches, miles, km), weight (kg, lbs, oz, grams), temperature (Celsius, Fahrenheit, Kelvin), volume (liters, gallons, ml, cups), speed (km/h, mph, m/s), area (m², ft², acres), and data storage (bytes, KB, MB, GB, TB).' },
      { q: 'Is the conversion accurate?', a: 'Yes. All conversions use precise mathematical formulas and standard conversion factors. Results are accurate to multiple decimal places.' },
      { q: 'Can I convert temperature?', a: 'Yes. Convert between Celsius, Fahrenheit, and Kelvin. The tool correctly handles the non-linear formulas: °F = (°C × 9/5) + 32 and K = °C + 273.15.' },
    ],
  },
  {
    id: 'currency', slug: 'currency-converter', name: 'Currency Converter', desc: 'Real-time exchange rates',
    emoji: '💱', tags: ['currency', 'money', 'exchange', 'forex', 'rate', 'dollar', 'euro'], category: 'Converters',
    componentPath: 'converters/CurrencyConverter',
    seo: {
      title: 'Currency Converter | Live Exchange Rates | Neetab',
      description: 'Convert between 30+ world currencies with live exchange rates. Free currency calculator with real-time data from the European Central Bank.',
      h1: 'Currency Converter',
    },
    howTo: [
      'Select the currency you want to convert from and the currency you want to convert to using the dropdowns.',
      'Enter the amount you want to convert.',
      'The converted amount is shown instantly based on today\'s exchange rate from the European Central Bank.',
    ],
    faq: [
      { q: 'Where do the exchange rates come from?', a: 'Rates are sourced from the European Central Bank (ECB) via the Frankfurter API, a free and open-source exchange rate service. ECB rates are published daily on business days and are widely used as a reliable reference rate.' },
      { q: 'How many currencies are supported?', a: 'Over 30 currencies including USD, EUR, GBP, JPY, CAD, AUD, CHF, INR, NGN, BRL, MXN, KRW, and many more.' },
      { q: 'Are the rates real-time?', a: 'Rates are updated once per business day by the European Central Bank. For live intraday trading rates, use a dedicated forex platform — ECB rates are reference rates, not live market rates.' },
      { q: 'Is my conversion data saved?', a: 'No. Conversions happen in real time in your browser. No amounts or currency selections are stored or tracked.' },
    ],
  },

  // ═══ TEXT TOOLS ═══
  {
    id: 'wordcount', slug: 'word-counter', name: 'Word Counter', desc: 'Characters, words, sentences & read time',
    emoji: '🔤', tags: ['writing', 'content', 'characters', 'count'], category: 'Text Tools',
    componentPath: 'text/WordCounter',
    seo: {
      title: 'Word Counter | Characters, Words & Reading Time | Neetab',
      description: 'Count words, characters, sentences, and paragraphs. Estimate reading time. Free online word counter.',
      h1: 'Word Counter',
    },
    howTo: [
      'Type or paste your text into the input box.',
      'Word count, character count (with and without spaces), sentence count, and estimated reading time all update live as you type.',
      'Use the stats panel for additional details including paragraph count and average word length.',
    ],
    faq: [
      { q: 'What does this tool count?', a: 'Characters (with and without spaces), words, sentences, paragraphs, and estimated reading time. All counts update in real time as you type or paste.' },
      { q: 'How is reading time calculated?', a: 'Reading time is estimated at 200 words per minute, which is the average reading speed for an adult. The result gives a practical estimate for articles, essays, and blog posts.' },
      { q: 'Is this useful for SEO and content writing?', a: 'Yes. Knowing your word count helps meet content length guidelines for SEO and publishing platforms. Most SEO experts recommend 300+ words for basic pages and 1,500+ for in-depth articles to rank well in search results.' },
    ],
  },
  {
    id: 'regex', slug: 'regex-tester', name: 'Regex Tester', desc: 'Test regular expressions with live highlighting',
    emoji: '🔎', tags: ['regex', 'regular expression', 'pattern', 'test', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/RegexTester',
    seo: {
      title: 'Regex Tester | Test Regular Expressions Online | Neetab',
      description: 'Test regular expressions with real-time highlighting and match details. Supports all JavaScript regex flags. Free online regex tester.',
      h1: 'Regex Tester',
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
    id: 'markdown', slug: 'markdown-preview', name: 'Markdown Preview', desc: 'Write Markdown and preview it live',
    emoji: '📝', tags: ['markdown', 'preview', 'editor', 'dev'], category: 'Dev Tools', wide: true,
    componentPath: 'devtools/MarkdownPreview',
    seo: {
      title: 'Markdown Preview | Live Editor | Neetab',
      description: 'Write Markdown and see a live preview side by side. Supports headings, bold, italic, code blocks, links, lists, and more.',
      h1: 'Markdown Preview',
    },
    howTo: [
      'Type Markdown syntax in the left editor panel.',
      'The rendered HTML preview updates live in the right panel as you type — no button press needed.',
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
    id: 'cssminify', slug: 'css-minifier', name: 'CSS Minifier', desc: 'Minify or beautify CSS code',
    emoji: '🎨', tags: ['css', 'minify', 'beautify', 'compress', 'dev'], category: 'Dev Tools', wide: true,
    componentPath: 'devtools/CSSMinifier',
    seo: {
      title: 'CSS Minifier & Beautifier | Free Online | Neetab',
      description: 'Minify CSS to reduce file size or beautify minified CSS for readability. Shows size savings. Free online CSS tool.',
      h1: 'CSS Minifier & Beautifier',
    },
    howTo: [
      'Paste your CSS code into the input box.',
      'Click Minify to compress your CSS by removing whitespace, comments, and redundant characters — or click Beautify to expand minified CSS into readable, indented code.',
      'The size savings or expansion are displayed above the output. Click Copy to copy the result.',
    ],
    faq: [
      { q: 'How much can CSS minification save?', a: 'Typically 20–50% of file size by removing comments, whitespace between rules, and unnecessary characters. Highly commented or loosely formatted CSS can see even greater savings. Every kilobyte saved improves page load speed.' },
      { q: 'Does minification change how my CSS works?', a: 'No. Minification only removes formatting and comments. The CSS selectors, properties, and values — and therefore the visual rendering — remain completely identical to the original.' },
      { q: 'What is the difference between minification and compression?', a: 'Minification removes whitespace and comments from the source code itself, permanently reducing the file size. HTTP compression (gzip or brotli) is applied by the web server at transfer time, compressing the file for transmission without changing the stored file. Both techniques are complementary and can be used together.' },
    ],
  },
  {
    id: 'lorem', slug: 'lorem-ipsum-generator', name: 'Lorem Ipsum', desc: 'Generate placeholder text',
    emoji: '📄', tags: ['lorem', 'ipsum', 'placeholder', 'text', 'dummy'], category: 'Text Tools',
    componentPath: 'text/LoremIpsumGenerator',
    seo: {
      title: 'Lorem Ipsum Generator | Placeholder Text | Neetab',
      description: 'Generate lorem ipsum placeholder text. Choose paragraphs, sentences, or words. Customizable count. Free online generator.',
      h1: 'Lorem Ipsum Generator',
    },
    howTo: [
      'Choose the type of output you need: paragraphs, sentences, or a specific word count.',
      'Enter the desired count — for example, 3 paragraphs or 50 words.',
      'Click Generate and copy the Lorem Ipsum placeholder text for use in your designs, mockups, or prototypes.',
    ],
    faq: [
      { q: 'What is Lorem Ipsum?', a: 'Lorem Ipsum is dummy placeholder text derived from Cicero\'s "de Finibus Bonorum et Malorum" (45 BC). It has been the standard dummy text in the printing and typesetting industry since the 1500s and is used to fill layouts without distracting with real content.' },
      { q: 'Can I generate a specific number of words?', a: 'Yes. Switch to Words mode and enter any number from 1 upward to get an exact word count. Paragraphs and Sentences modes are also available for different layout needs.' },
      { q: 'Does it always start with "Lorem ipsum"?', a: 'The traditional Lorem Ipsum always begins with "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." — our generator uses this standard opening for the first paragraph to match the classic placeholder text everyone recognizes.' },
    ],
  },
  {
    id: 'tts', slug: 'text-to-speech', name: 'Text to Speech', desc: 'Read text aloud with natural voices',
    emoji: '🔊', tags: ['speech', 'voice', 'read', 'tts', 'audio', 'accessibility'], category: 'Text Tools',
    componentPath: 'text/TextToSpeech',
    seo: {
      title: 'Text to Speech | Free Online TTS Reader | Neetab',
      description: 'Convert text to speech free online. Multiple voices and languages. Adjustable speed and pitch. No sign-up required.',
      h1: 'Text to Speech',
    },
    howTo: [
      'Type or paste the text you want to hear in the input box.',
      'Select a voice from the dropdown and adjust the speed and pitch sliders to your preference.',
      'Click Speak to start playback. Click Stop to pause, and Resume to continue from where you left off.',
    ],
    faq: [
      { q: 'What voices are available?', a: 'The available voices depend on your browser and operating system. Most modern browsers offer dozens of voices in multiple languages — Chrome and Edge tend to have the widest selection, including high-quality neural voices on Windows.' },
      { q: 'Does this work offline?', a: 'Yes. Text-to-speech uses your browser\'s built-in Web Speech API speech synthesis engine, which runs locally. No internet connection is needed after the page loads.' },
      { q: 'Is there a text length limit?', a: 'The input is limited to 10,000 characters. For very long texts, split the content into sections for best results, as some browsers have limits on single synthesis utterances.' },
      { q: 'Can I adjust the reading speed?', a: 'Yes. The Speed slider goes from 0.25× (very slow, useful for language learning) up to 2× (double speed, useful for proofreading). The Pitch slider adjusts the voice tone from deep to high.' },
    ],
  },
  {
    id: 'pomodoro', slug: 'pomodoro-timer', name: 'Pomodoro Timer', desc: '25-minute focus timer with breaks',
    emoji: '🍅', tags: ['timer', 'pomodoro', 'focus', 'productivity', 'time'], category: 'Productivity',
    componentPath: 'generators/PomodoroTimer',
    seo: {
      title: 'Pomodoro Timer | Focus Timer Online | Neetab',
      description: 'Free online Pomodoro timer. 25-minute focus sessions with short and long breaks. Track completed sessions. Audio notifications.',
      h1: 'Pomodoro Timer',
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
      { q: 'Can I customize the Pomodoro interval?', a: 'The standard Pomodoro Technique uses fixed 25-minute work sessions and 5-minute breaks — this timer follows that original specification. The fixed intervals are intentional to the technique\'s effectiveness.' },
    ],
  },
  // ═══ FILE TOOLS (new) ═══
  {
    id: 'imgresizer', slug: 'image-resizer', name: 'Image Resizer', desc: 'Resize images to exact dimensions',
    emoji: '📐', tags: ['image', 'resize', 'dimensions', 'scale'], category: 'File Tools',
    componentPath: 'file/ImageResizer',
    seo: {
      title: 'Image Resizer | Resize Images Online Free | Neetab',
      description: 'Resize images to any dimensions online for free. Lock aspect ratio, choose format and quality. Runs in your browser.',
      h1: 'Image Resizer',
    },
    howTo: [
      'Upload a PNG, JPG, or WebP image by clicking the upload area or dragging it in.',
      'Enter your desired width or height. Toggle the lock icon to maintain the original aspect ratio automatically.',
      'Choose an output format (JPEG, PNG, or WebP) and quality, then click Resize & Download.',
    ],
    faq: [
      { q: 'Does the aspect ratio lock work automatically?', a: 'Yes. When the lock is enabled, changing the width automatically recalculates the height to maintain the original proportions, and vice versa. Toggle the lock icon to resize freely without constraints.' },
      { q: 'What formats can I export to?', a: 'JPEG (best for photos), PNG (best for transparency and graphics), and WebP (best for web — smaller files with great quality). WebP is supported in all modern browsers.' },
      { q: 'Is my image uploaded to a server?', a: 'No. Resizing runs entirely in your browser using the HTML Canvas API. Your images never leave your device.' },
      { q: 'Can I upscale an image?', a: 'Yes, you can enter dimensions larger than the original. Note that upscaling increases file size and does not add detail — the result may appear soft or pixelated. For best quality, resize down rather than up.' },
    ],
  },
  {
    id: 'heic2jpg', slug: 'heic-to-jpg', name: 'HEIC to JPG', desc: 'Convert iPhone HEIC photos to JPEG',
    emoji: '📸', tags: ['heic', 'heif', 'jpg', 'jpeg', 'iphone', 'convert'], category: 'File Tools',
    componentPath: 'file/HEICtoJPG',
    seo: {
      title: 'HEIC to JPG Converter | Free Online | Neetab',
      description: 'Convert HEIC and HEIF photos (iPhone/iPad) to JPEG for free. No app needed. Runs in your browser, files stay private.',
      h1: 'HEIC to JPG Converter',
    },
    howTo: [
      'Upload your HEIC or HEIF photo files — drag and drop or click to select. Multiple files are supported.',
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
    id: 'svg2png', slug: 'svg-to-png', name: 'SVG to PNG', desc: 'Convert SVG vector files to PNG images',
    emoji: '🎭', tags: ['svg', 'png', 'vector', 'convert', 'export'], category: 'File Tools',
    componentPath: 'file/SVGtoPNG',
    seo: {
      title: 'SVG to PNG Converter | Free Online | Neetab',
      description: 'Convert SVG vector files to PNG images at any scale. Free and private — runs entirely in your browser.',
      h1: 'SVG to PNG Converter',
    },
    howTo: [
      'Upload an SVG file by clicking the upload area or dragging it in.',
      'Use the scale slider to set your desired output resolution — 2× gives double the source dimensions, great for retina displays.',
      'Click Export as PNG to download the rasterized image at your chosen resolution.',
    ],
    faq: [
      { q: 'What does scale mean for SVG to PNG?', a: 'SVG files are resolution-independent vectors. The scale multiplier determines the output PNG dimensions. At 2×, a 512×512 SVG produces a 1024×1024 PNG. Higher scales produce larger, sharper images suitable for print or retina displays.' },
      { q: 'Will the PNG have a transparent background?', a: 'Yes, if your SVG has a transparent background, the exported PNG will preserve that transparency. PNG natively supports alpha channel transparency.' },
      { q: 'Is my SVG file uploaded to a server?', a: 'No. The conversion runs entirely in your browser using the HTML Canvas API. Your SVG file never leaves your device.' },
      { q: 'Why would I convert SVG to PNG?', a: 'SVG is not supported everywhere — some apps, word processors, and email clients cannot display SVG. PNG is universally supported and is the best format when you need a raster version of a vector graphic.' },
    ],
  },
  {
    id: 'mergepdf', slug: 'merge-pdf', name: 'Merge PDF', desc: 'Combine multiple PDFs into one',
    emoji: '📎', tags: ['pdf', 'merge', 'combine', 'join'], category: 'File Tools',
    componentPath: 'file/MergePDF',
    seo: {
      title: 'Merge PDF | Combine PDF Files Online Free | Neetab',
      description: 'Merge multiple PDF files into one. Reorder pages, drag and drop. Free and private — runs in your browser with pdf-lib.',
      h1: 'Merge PDF Files',
    },
    howTo: [
      'Upload two or more PDF files by clicking the upload area or dragging them in.',
      'Reorder the files by dragging them into your preferred sequence — the merged PDF will follow this order.',
      'Click Merge & Download to combine all PDFs into a single file and save it to your device.',
    ],
    faq: [
      { q: 'How many PDFs can I merge at once?', a: 'There is no hard limit on the number of files. However, very large PDFs may require more memory and time to process. For best performance, keep total combined size under 100MB.' },
      { q: 'Is my PDF uploaded to a server?', a: 'No. Merging runs entirely in your browser using pdf-lib, a pure JavaScript PDF library. Your files never leave your device.' },
      { q: 'Can I reorder pages before merging?', a: 'Yes. Drag the file thumbnails to set the order before merging. Each file\'s pages are inserted in sequence.' },
      { q: 'Will the PDF quality be affected?', a: 'No. pdf-lib merges PDFs at the binary level, preserving the original quality, formatting, fonts, and embedded content of each source file.' },
    ],
  },

  // ═══ DEV TOOLS (new) ═══
  {
    id: 'textcase', slug: 'text-case-converter', name: 'Text Case Converter', desc: 'Convert text between all cases',
    emoji: 'Aa', tags: ['text', 'case', 'camelcase', 'snake_case', 'uppercase', 'title'], category: 'Dev Tools',
    componentPath: 'devtools/TextCaseConverter',
    seo: {
      title: 'Text Case Converter | camelCase, snake_case & More | Neetab',
      description: 'Convert text between uppercase, lowercase, title case, camelCase, PascalCase, snake_case, kebab-case, and more.',
      h1: 'Text Case Converter',
    },
    howTo: [
      'Type or paste your text into the input box.',
      'All case conversions are shown simultaneously — UPPER CASE, lower case, Title Case, camelCase, PascalCase, snake_case, kebab-case, and more.',
      'Click Copy next to any variant to copy it to your clipboard.',
    ],
    faq: [
      { q: 'What case formats are supported?', a: 'UPPER CASE, lower case, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and aLtErNaTiNg case — all generated simultaneously from a single input.' },
      { q: 'What is camelCase?', a: 'camelCase joins words with no separators, where the first word is lowercase and each subsequent word starts with a capital letter. Example: "myVariableName". Used widely in JavaScript, Java, and Swift.' },
      { q: 'What is snake_case?', a: 'snake_case uses underscores between words with all letters in lowercase. Example: "my_variable_name". Common in Python, Ruby, and database column names.' },
      { q: 'What is kebab-case?', a: 'kebab-case uses hyphens between words with all lowercase letters. Example: "my-component-name". Standard for HTML attributes, CSS class names, and URL slugs.' },
    ],
  },
  {
    id: 'jwt', slug: 'jwt-decoder', name: 'JWT Decoder', desc: 'Decode and inspect JWT tokens',
    emoji: '🔓', tags: ['jwt', 'token', 'auth', 'decode', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/JWTDecoder',
    seo: {
      title: 'JWT Decoder | Decode JSON Web Tokens Online | Neetab',
      description: 'Decode and inspect JWT tokens instantly. View header, payload, and expiry. Free and private — runs in your browser.',
      h1: 'JWT Decoder',
    },
    howTo: [
      'Paste your JWT token (the long string with two dots separating three parts) into the input box.',
      'The header and payload are decoded and displayed as formatted JSON. Timestamps (iat, exp) are shown as human-readable dates.',
      'Check the validity indicator to see if the token has expired based on the exp claim.',
    ],
    faq: [
      { q: 'What is a JWT?', a: 'A JSON Web Token (JWT) is a compact, URL-safe token format used to represent claims between parties. It consists of three Base64Url-encoded parts separated by dots: a header, a payload, and a signature.' },
      { q: 'Can this verify the JWT signature?', a: 'No. Signature verification requires the secret key or public key, which this tool does not have access to. The decoder shows the header and payload contents but cannot confirm whether the token was issued by a trusted source.' },
      { q: 'Is it safe to paste a JWT here?', a: 'This tool runs entirely in your browser — your token is never sent to any server. However, never share JWTs that grant access to sensitive systems in any external tool if you are unsure. Inspect tokens in development environments only.' },
      { q: 'What claims does the payload typically contain?', a: 'Common JWT claims include: sub (subject/user ID), iat (issued at timestamp), exp (expiration timestamp), aud (audience), iss (issuer), and custom application-specific claims.' },
    ],
  },
  {
    id: 'numbase', slug: 'number-base-converter', name: 'Number Base Converter', desc: 'Binary, Octal, Decimal, Hex',
    emoji: '🔢', tags: ['binary', 'hex', 'octal', 'decimal', 'base', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/NumberBaseConverter',
    seo: {
      title: 'Number Base Converter | Binary, Hex, Octal, Decimal | Neetab',
      description: 'Convert numbers between binary, octal, decimal, and hexadecimal instantly. Free online base converter.',
      h1: 'Number Base Converter',
    },
    howTo: [
      'Type a number in any of the four fields — binary (base 2), octal (base 8), decimal (base 10), or hexadecimal (base 16).',
      'All other bases update instantly as you type.',
      'Click Copy next to any field to copy that representation to your clipboard.',
    ],
    faq: [
      { q: 'What is binary?', a: 'Binary is base 2, using only digits 0 and 1. It is the fundamental language of computers, where every bit is either off (0) or on (1). The decimal number 10 is 1010 in binary.' },
      { q: 'What is hexadecimal used for?', a: 'Hexadecimal (base 16) uses digits 0–9 and letters A–F. It is widely used in programming for memory addresses, color codes (#FF5733), byte values, and representing binary data compactly — 1 hex digit = 4 binary bits.' },
      { q: 'What is octal?', a: 'Octal (base 8) uses digits 0–7. It appears in Unix file permissions (e.g., chmod 755) and was historically used in early computing as a compact representation of binary groups of 3 bits.' },
    ],
  },
  {
    id: 'json2csv', slug: 'json-to-csv', name: 'JSON to CSV', desc: 'Convert JSON arrays to CSV files',
    emoji: '📊', tags: ['json', 'csv', 'convert', 'data', 'export'], category: 'Dev Tools',
    componentPath: 'devtools/JSONtoCSV',
    seo: {
      title: 'JSON to CSV Converter | Free Online | Neetab',
      description: 'Convert JSON arrays to CSV format instantly. Handles nested objects, special characters, and large datasets. Download as .csv.',
      h1: 'JSON to CSV Converter',
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
    id: 'img2base64', slug: 'image-to-base64', name: 'Image to Base64', desc: 'Encode images as Base64 data URLs',
    emoji: '🖼️', tags: ['base64', 'image', 'encode', 'data-url', 'dev'], category: 'Dev Tools',
    componentPath: 'devtools/ImageToBase64',
    seo: {
      title: 'Image to Base64 Encoder | Free Online | Neetab',
      description: 'Convert images to Base64 data URLs. Get the full data URL for HTML/CSS or the raw Base64 string. Free and private.',
      h1: 'Image to Base64 Encoder',
    },
    howTo: [
      'Upload a PNG, JPG, WebP, GIF, or SVG image by clicking the upload area or dragging it in.',
      'The full data URL (for use in <img src="..."> or CSS background-image) and the raw Base64 string are shown immediately.',
      'Click Copy next to either output to copy it for use in your code.',
    ],
    faq: [
      { q: 'What is a Base64 data URL?', a: 'A data URL embeds the image directly into HTML or CSS as a Base64-encoded string instead of referencing an external file. Format: data:image/png;base64,iVBORw0KGgo... — the browser renders it without a network request.' },
      { q: 'When should I use Base64 images?', a: 'Base64 images are useful for small icons and logos that should be bundled with HTML/CSS, email templates (which cannot use external images reliably), and offline-first web apps that need to embed assets.' },
      { q: 'Does Base64 increase file size?', a: 'Yes. Base64 encoding increases the data size by approximately 33% compared to the binary image file. Use it selectively for small images — large images are better served as external files.' },
      { q: 'Is my image uploaded to a server?', a: 'No. The encoding uses the browser\'s built-in FileReader API. Your image never leaves your device.' },
    ],
  },

  {
    id: 'countdown', slug: 'countdown-timer', name: 'Countdown Timer', desc: 'Set a timer for any duration',
    emoji: '⏳', tags: ['countdown', 'timer', 'alarm', 'clock', 'stopwatch'], category: 'Productivity',
    componentPath: 'generators/CountdownTimer',
    seo: {
      title: 'Countdown Timer | Free Online Timer with Alarm | Neetab',
      description: 'Free online countdown timer. Set hours, minutes, and seconds. Visual progress ring and audio alarm. Quick presets for common durations.',
      h1: 'Countdown Timer',
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
];

// ─── Categories ordered by traffic potential ───
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
export const popularTools = tools.filter(t => t.popular);
export const toolBySlug = (slug: string) => tools.find(t => t.slug === slug);
export const totalToolCount = tools.length;
