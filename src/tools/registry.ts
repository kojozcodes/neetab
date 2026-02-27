import { lazy, ComponentType } from 'react';

export interface Tool {
  id: string;
  slug: string;
  name: string;
  desc: string;
  emoji: string;
  tags: string[];
  category: string;
  popular?: boolean;        // shown in "Popular" row on home
  seo: {
    title: string;
    description: string;
    h1: string;
  };
  faq?: { q: string; a: string }[];
  component: React.LazyExoticComponent<ComponentType>;
}

export interface Category {
  name: string;
  emoji: string;
  slug: string;
  tools: Tool[];
}

// Lazy-load every tool for code splitting
const PDF2Image = lazy(() => import('./file/PDFtoImage'));
const Image2PDF = lazy(() => import('./file/ImageToPDF'));
const ImageCompress = lazy(() => import('./file/ImageCompressor'));
const PDF2Word = lazy(() => import('./file/PDFtoWord'));
const Word2PDF = lazy(() => import('./file/WordToPDF'));

const TipCalc = lazy(() => import('./calculators/TipCalculator'));
const PercentCalc = lazy(() => import('./calculators/PercentageCalculator'));
const DiscountCalc = lazy(() => import('./calculators/DiscountCalculator'));
const BMICalc = lazy(() => import('./calculators/BMICalculator'));
const AgeCalc = lazy(() => import('./calculators/AgeCalculator'));
const LoanCalc = lazy(() => import('./calculators/LoanCalculator'));

const PaletteGen = lazy(() => import('./design/ColorPalette'));
const GradientMaker = lazy(() => import('./design/GradientMaker'));
const ColorConvert = lazy(() => import('./design/ColorConverter'));

const UnitConvert = lazy(() => import('./converters/UnitConverter'));

const WordCount = lazy(() => import('./text/WordCounter'));

const PasswordGen = lazy(() => import('./generators/PasswordGenerator'));
const QRCodeGen = lazy(() => import('./generators/QRCodeGenerator'));
const JSONFormat = lazy(() => import('./generators/JSONFormatter'));

const Base64 = lazy(() => import('./devtools/Base64Tool'));
const HashGen = lazy(() => import('./devtools/HashGenerator'));
const UUIDGen = lazy(() => import('./devtools/UUIDGenerator'));
const URLEncode = lazy(() => import('./devtools/URLEncoderDecoder'));
const TextDiffTool = lazy(() => import('./devtools/TextDiff'));
const TimestampConvert = lazy(() => import('./devtools/TimestampConverter'));

// ─── Tool Definitions (ordered by traffic potential within each category) ───
const tools: Tool[] = [
  // ═══ FILE TOOLS (highest traffic) ═══
  {
    id: 'pdf2word', slug: 'pdf-to-word', name: 'PDF to Word', desc: 'Convert PDF to editable DOCX',
    emoji: '📝', tags: ['pdf', 'word', 'docx', 'convert'], category: 'File Tools', popular: true,
    seo: {
      title: 'PDF to Word Converter | Free Online | Neetab',
      description: 'Convert PDF files to editable Word documents for free. Preserves layout, tables, images & formatting. No sign-up required.',
      h1: 'PDF to Word Converter',
    },
    component: PDF2Word,
    faq: [
      { q: 'Is my PDF file uploaded to a server?', a: 'When server conversion is available, your file is sent securely, processed immediately, and deleted right after. It is never stored or shared.' },
      { q: 'What quality can I expect from the conversion?', a: 'Server conversion preserves layout, tables, images, and formatting. The output opens perfectly in Microsoft Word, Google Docs, and LibreOffice.' },
      { q: 'Is there a file size limit?', a: 'You can convert PDFs up to 50MB. For best results, keep files under 20MB.' },
    ],
  },
  {
    id: 'word2pdf', slug: 'word-to-pdf', name: 'Word to PDF', desc: 'Convert DOCX to PDF',
    emoji: '📃', tags: ['word', 'pdf', 'docx', 'convert'], category: 'File Tools', popular: true,
    seo: {
      title: 'Word to PDF Converter | Free Online | Neetab',
      description: 'Convert Word documents to PDF for free. Preserves formatting, tables, and images. Runs entirely in your browser.',
      h1: 'Word to PDF Converter',
    },
    component: Word2PDF,
    faq: [
      { q: 'Will my Word document formatting be preserved?', a: 'Yes. Server conversion uses LibreOffice which preserves fonts, tables, images, headers, footers, and page layout with near-perfect accuracy.' },
      { q: 'Can I convert .doc files or only .docx?', a: 'Both .doc and .docx formats are supported for conversion to PDF.' },
    ],
  },
  {
    id: 'imgcompress', slug: 'image-compressor', name: 'Image Compressor', desc: 'Reduce image file size instantly',
    emoji: '🗜️', tags: ['image', 'compress', 'resize', 'optimize'], category: 'File Tools', popular: true,
    seo: {
      title: 'Image Compressor | Reduce Image Size Free | Neetab',
      description: 'Compress images online for free. Reduce file size while keeping quality. Before/after preview. Private - runs in your browser.',
      h1: 'Image Compressor',
    },
    component: ImageCompress,
    faq: [
      { q: 'Does compression reduce image quality?', a: 'You control the quality slider. At 80% quality, most images look identical to the original while being 60-80% smaller in file size.' },
      { q: 'Is my image uploaded anywhere?', a: 'No. Compression runs entirely in your browser. Your images never leave your device.' },
    ],
  },
  {
    id: 'pdf2img', slug: 'pdf-to-image', name: 'PDF to Image', desc: 'Convert PDF pages to PNG/JPG',
    emoji: '📑', tags: ['pdf', 'image', 'convert', 'png', 'jpg'], category: 'File Tools',
    seo: {
      title: 'PDF to Image | Convert PDF to PNG/JPG Free | Neetab',
      description: 'Convert PDF pages to high-quality PNG or JPG images for free. Private - files never leave your browser.',
      h1: 'PDF to Image Converter',
    },
    component: PDF2Image,
    faq: [
      { q: 'What image formats can I export to?', a: 'You can export PDF pages as high-quality PNG or JPG images.' },
      { q: 'Can I convert a multi-page PDF?', a: 'Yes. Each page is converted to a separate image that you can download individually.' },
    ],
  },
  {
    id: 'img2pdf', slug: 'image-to-pdf', name: 'Image to PDF', desc: 'Combine images into one PDF',
    emoji: '🖼️', tags: ['image', 'pdf', 'convert', 'combine'], category: 'File Tools',
    seo: {
      title: 'Image to PDF | Combine Images into PDF Free | Neetab',
      description: 'Combine multiple images into a single PDF document. Reorder, choose size and orientation. Free and private.',
      h1: 'Image to PDF Converter',
    },
    component: Image2PDF,
    faq: [
      { q: 'Can I combine multiple images into one PDF?', a: 'Yes. Upload multiple images and they will be combined into a single PDF document, one image per page.' },
    ],
  },

  // ═══ CALCULATORS ═══
  {
    id: 'tip', slug: 'tip-calculator', name: 'Tip Calculator', desc: 'Split bills & calculate tips',
    emoji: '💰', tags: ['money', 'restaurant', 'bill', 'split'], category: 'Calculators', popular: true,
    seo: {
      title: 'Tip Calculator | Split Bills & Calculate Tips | Neetab',
      description: 'Free online tip calculator. Calculate tip amount, total bill, and split between friends instantly.',
      h1: 'Tip Calculator',
    },
    component: TipCalc,
    faq: [
      { q: 'How do I calculate a tip?', a: 'Enter your bill amount, select a tip percentage (15%, 18%, 20%, or custom), and optionally split between multiple people. The calculator shows tip amount, total, and per-person cost instantly.' },
      { q: 'What is the standard tip percentage?', a: 'In the US, 15-20% is standard for restaurant service. 18% is a common middle ground.' },
    ],
  },
  {
    id: 'bmi', slug: 'bmi-calculator', name: 'BMI Calculator', desc: 'Body mass index check',
    emoji: '⚖️', tags: ['health', 'fitness', 'weight', 'body'], category: 'Calculators',
    seo: {
      title: 'BMI Calculator | Body Mass Index | Neetab',
      description: 'Free BMI calculator. Check your body mass index with imperial or metric units. Instant results with health categories.',
      h1: 'BMI Calculator',
    },
    component: BMICalc,
    faq: [
      { q: 'What is a healthy BMI range?', a: 'A BMI between 18.5 and 24.9 is considered normal weight. Below 18.5 is underweight, 25-29.9 is overweight, and 30+ is obese. BMI is a screening tool and does not account for muscle mass or body composition.' },
      { q: 'Does BMI apply to athletes?', a: 'BMI may overestimate body fat in athletes and muscular individuals. It is best used as a general screening tool, not a definitive health measure.' },
    ],
  },
  {
    id: 'loan', slug: 'loan-calculator', name: 'Loan Calculator', desc: 'Monthly payments & total interest',
    emoji: '🏦', tags: ['finance', 'mortgage', 'interest', 'payment'], category: 'Calculators',
    seo: {
      title: 'Loan Calculator | Monthly Payment & Interest | Neetab',
      description: 'Free loan calculator. Calculate monthly payments, total interest, and total cost for mortgages, car loans, or personal loans.',
      h1: 'Loan Calculator',
    },
    component: LoanCalc,
    faq: [
      { q: 'How is monthly payment calculated?', a: 'The calculator uses the standard amortization formula based on your loan amount, interest rate, and loan term to compute exact monthly payments, total interest, and total cost.' },
    ],
  },
  {
    id: 'percentage', slug: 'percentage-calculator', name: 'Percentage Calculator', desc: 'All percentage calculations',
    emoji: '📊', tags: ['math', 'percent', 'discount'], category: 'Calculators',
    seo: {
      title: 'Percentage Calculator | What is X% of Y? | Neetab',
      description: 'Free percentage calculator. Find what percent of a number, percentage change, or what X is as a percentage of Y.',
      h1: 'Percentage Calculator',
    },
    component: PercentCalc,
    faq: [
      { q: 'How do I calculate what percent X is of Y?', a: 'Enter X and Y, and the calculator instantly shows the percentage. For example, 25 is 50% of 50.' },
    ],
  },
  {
    id: 'discount', slug: 'discount-calculator', name: 'Discount Calculator', desc: 'Sale price & savings',
    emoji: '🏷️', tags: ['shopping', 'sale', 'savings'], category: 'Calculators',
    seo: {
      title: 'Discount Calculator | Sale Price & Savings | Neetab',
      description: 'Calculate sale price and savings instantly. Enter original price and discount percentage to see final price.',
      h1: 'Discount Calculator',
    },
    component: DiscountCalc,
    faq: [
      { q: 'How do I calculate a sale price?', a: 'Enter the original price and discount percentage. The calculator shows you the discount amount and the final price you will pay.' },
    ],
  },
  {
    id: 'age', slug: 'age-calculator', name: 'Age Calculator', desc: 'Exact age from birthdate',
    emoji: '🎂', tags: ['date', 'birthday', 'days'], category: 'Calculators',
    seo: {
      title: 'Age Calculator | Exact Age from Date of Birth | Neetab',
      description: 'Calculate your exact age in years, months, and days. Find total days lived and days until your next birthday.',
      h1: 'Age Calculator',
    },
    component: AgeCalc,
    faq: [
      { q: 'How accurate is the age calculation?', a: 'The calculator computes your exact age in years, months, and days from your date of birth to today, accounting for leap years.' },
    ],
  },

  // ═══ DESIGN TOOLS ═══
  {
    id: 'palette', slug: 'color-palette-generator', name: 'Color Palette', desc: 'Generate beautiful color schemes',
    emoji: '🎨', tags: ['design', 'color', 'css', 'palette'], category: 'Design Tools', popular: true,
    seo: {
      title: 'Color Palette Generator | Beautiful Color Schemes | Neetab',
      description: 'Generate stunning color palettes instantly. Random, complementary, analogous, triadic, and more. Export CSS variables.',
      h1: 'Color Palette Generator',
    },
    component: PaletteGen,
    faq: [
      { q: 'How are the color palettes generated?', a: 'Palettes are generated using color theory algorithms including complementary, analogous, triadic, and split-complementary harmonies based on your chosen base color.' },
      { q: 'Can I export the palette?', a: 'Yes. You can copy individual HEX codes or the full palette with one click.' },
    ],
  },
  {
    id: 'gradient', slug: 'css-gradient-generator', name: 'Gradient Maker', desc: 'Create CSS gradients visually',
    emoji: '🌈', tags: ['design', 'css', 'background', 'gradient'], category: 'Design Tools',
    seo: {
      title: 'CSS Gradient Generator | Linear, Radial & Conic | Neetab',
      description: 'Create beautiful CSS gradients visually. Linear, radial, conic. Preset palettes, custom colors, one-click CSS copy.',
      h1: 'CSS Gradient Generator',
    },
    component: GradientMaker,
    faq: [
      { q: 'What gradient types are supported?', a: 'Linear, radial, and conic gradients are supported. You can customize colors, angle, and position, then copy the CSS code directly.' },
    ],
  },
  {
    id: 'color', slug: 'color-converter', name: 'Color Converter', desc: 'HEX ↔ RGB ↔ HSL',
    emoji: '🔵', tags: ['design', 'css', 'color', 'hex', 'rgb'], category: 'Design Tools',
    seo: {
      title: 'Color Converter | HEX to RGB to HSL | Neetab',
      description: 'Convert colors between HEX, RGB, HSL, and RGBA. Visual color picker with instant conversion and one-click copy.',
      h1: 'Color Converter',
    },
    component: ColorConvert,
    faq: [
      { q: 'What color formats are supported?', a: 'Convert between HEX, RGB, and HSL color formats instantly. Enter any format and see all others in real time.' },
    ],
  },

  // ═══ DEV TOOLS (new category) ═══
  {
    id: 'json', slug: 'json-formatter', name: 'JSON Formatter', desc: 'Format, validate & minify JSON',
    emoji: '{ }', tags: ['json', 'format', 'validate', 'minify', 'dev'], category: 'Dev Tools', popular: true,
    seo: {
      title: 'JSON Formatter & Validator | Free Online | Neetab',
      description: 'Format, validate, and minify JSON online for free. Syntax highlighting, error detection, and one-click copy.',
      h1: 'JSON Formatter & Validator',
    },
    component: JSONFormat,
    faq: [
      { q: 'Does this validate my JSON?', a: 'Yes. Invalid JSON is highlighted with an error message showing exactly where the problem is. Valid JSON is formatted with proper indentation.' },
      { q: 'Can I minify JSON?', a: 'Yes. Use the minify button to remove all whitespace and produce compact JSON.' },
    ],
  },
  {
    id: 'qr', slug: 'qr-code-generator', name: 'QR Code Generator', desc: 'Generate QR codes for any text or URL',
    emoji: '📱', tags: ['qr', 'barcode', 'link', 'generator'], category: 'Dev Tools', popular: true,
    seo: {
      title: 'QR Code Generator | Free Online | Neetab',
      description: 'Generate QR codes for URLs, text, email, phone numbers. Custom colors and sizes. Free download as PNG.',
      h1: 'QR Code Generator',
    },
    component: QRCodeGen,
    faq: [
      { q: 'Can I customize the QR code?', a: 'Yes. You can adjust the size, error correction level, and foreground/background colors.' },
      { q: 'What can I encode in a QR code?', a: 'Any text, URL, phone number, email, or WiFi credentials. The QR code is generated instantly as you type.' },
    ],
  },
  {
    id: 'password', slug: 'password-generator', name: 'Password Generator', desc: 'Secure random passwords',
    emoji: '🔐', tags: ['security', 'random', 'strong', 'password'], category: 'Dev Tools',
    seo: {
      title: 'Password Generator | Secure Random Passwords | Neetab',
      description: 'Generate strong, secure passwords. Customize length, uppercase, numbers, symbols. Cryptographically secure.',
      h1: 'Password Generator',
    },
    component: PasswordGen,
    faq: [
      { q: 'How secure are the generated passwords?', a: 'Passwords are generated using your browser\'s cryptographic random number generator. They are never sent to any server.' },
      { q: 'What makes a strong password?', a: 'A strong password is at least 16 characters long and includes uppercase, lowercase, numbers, and symbols. Our generator creates passwords that meet all these criteria.' },
    ],
  },
  {
    id: 'base64', slug: 'base64-encoder-decoder', name: 'Base64 Encoder', desc: 'Encode & decode Base64 strings',
    emoji: '🔡', tags: ['base64', 'encode', 'decode', 'dev'], category: 'Dev Tools',
    seo: {
      title: 'Base64 Encoder & Decoder | Free Online | Neetab',
      description: 'Encode text to Base64 or decode Base64 to text instantly. Free online Base64 tool with swap functionality.',
      h1: 'Base64 Encoder & Decoder',
    },
    component: Base64,
    faq: [
      { q: 'What is Base64 encoding?', a: 'Base64 is a method of encoding binary data as ASCII text. It is commonly used in emails, data URLs, and API payloads.' },
    ],
  },
  {
    id: 'hash', slug: 'hash-generator', name: 'Hash Generator', desc: 'MD5, SHA-1, SHA-256, SHA-512',
    emoji: '#️⃣', tags: ['hash', 'md5', 'sha', 'checksum', 'dev'], category: 'Dev Tools',
    seo: {
      title: 'Hash Generator | MD5, SHA-256 & More | Neetab',
      description: 'Generate MD5, SHA-1, SHA-256, and SHA-512 hashes instantly. Free online hash generator. Real-time as you type.',
      h1: 'Hash Generator',
    },
    component: HashGen,
    faq: [
      { q: 'What is the difference between MD5 and SHA-256?', a: 'MD5 produces a 128-bit hash and is faster but considered insecure for cryptographic use. SHA-256 produces a 256-bit hash and is the current standard for secure hashing.' },
    ],
  },
  {
    id: 'uuid', slug: 'uuid-generator', name: 'UUID Generator', desc: 'Generate random UUID v4 strings',
    emoji: '🆔', tags: ['uuid', 'guid', 'random', 'id', 'dev'], category: 'Dev Tools',
    seo: {
      title: 'UUID Generator | Random UUID v4 | Neetab',
      description: 'Generate random UUID v4 strings. Bulk generate, uppercase, no-dash formats. Free online UUID generator.',
      h1: 'UUID Generator',
    },
    component: UUIDGen,
    faq: [
      { q: 'What is a UUID?', a: 'A UUID (Universally Unique Identifier) is a 128-bit identifier that is guaranteed to be unique. UUID v4 uses random numbers and is the most commonly used version.' },
    ],
  },
  {
    id: 'urlencode', slug: 'url-encoder-decoder', name: 'URL Encoder', desc: 'Encode & decode URLs',
    emoji: '🔗', tags: ['url', 'encode', 'decode', 'percent', 'dev'], category: 'Dev Tools',
    seo: {
      title: 'URL Encoder & Decoder | Free Online | Neetab',
      description: 'Encode and decode URLs online. Supports encodeURIComponent and encodeURI. Free URL encoding tool.',
      h1: 'URL Encoder & Decoder',
    },
    component: URLEncode,
    faq: [
      { q: 'When should I URL encode?', a: 'URL encoding is needed when passing special characters (spaces, &, =, ?) in URLs, query parameters, or form data. It converts unsafe characters to percent-encoded format.' },
    ],
  },
  {
    id: 'textdiff', slug: 'text-diff', name: 'Text Diff', desc: 'Compare two texts side by side',
    emoji: '📋', tags: ['diff', 'compare', 'text', 'merge', 'dev'], category: 'Dev Tools',
    seo: {
      title: 'Text Diff | Compare Text Online Free | Neetab',
      description: 'Compare two texts and see differences highlighted. Added, removed, and unchanged lines. Free online diff tool.',
      h1: 'Text Diff & Compare',
    },
    component: TextDiffTool,
    faq: [
      { q: 'How does the text comparison work?', a: 'The tool uses a longest common subsequence algorithm to find differences between two texts, highlighting added, removed, and unchanged lines.' },
    ],
  },
  {
    id: 'timestamp', slug: 'timestamp-converter', name: 'Timestamp Converter', desc: 'Unix timestamp ↔ human date',
    emoji: '🕐', tags: ['time', 'unix', 'epoch', 'date', 'dev'], category: 'Dev Tools',
    seo: {
      title: 'Unix Timestamp Converter | Epoch to Date | Neetab',
      description: 'Convert Unix timestamps to human-readable dates and vice versa. Live clock, auto-detect seconds/milliseconds.',
      h1: 'Unix Timestamp Converter',
    },
    component: TimestampConvert,
    faq: [
      { q: 'What is a Unix timestamp?', a: 'A Unix timestamp is the number of seconds that have elapsed since January 1, 1970 (UTC). It is the standard way computers track time.' },
      { q: 'Does it handle milliseconds?', a: 'Yes. The converter auto-detects whether your input is in seconds or milliseconds and converts accordingly.' },
    ],
  },

  // ═══ CONVERTERS ═══
  {
    id: 'unit', slug: 'unit-converter', name: 'Unit Converter', desc: 'Length, weight, temp, volume & more',
    emoji: '📏', tags: ['measurement', 'science', 'length', 'weight', 'temperature'], category: 'Converters',
    seo: {
      title: 'Unit Converter | Length, Weight, Temperature & More | Neetab',
      description: 'Convert between units of length, weight, temperature, volume, area, speed, and data. Free and instant.',
      h1: 'Unit Converter',
    },
    component: UnitConvert,
    faq: [
      { q: 'What units can I convert?', a: 'Length, weight, temperature, volume, speed, area, and data storage. All common units within each category are supported.' },
    ],
  },

  // ═══ TEXT TOOLS ═══
  {
    id: 'wordcount', slug: 'word-counter', name: 'Word Counter', desc: 'Characters, words, sentences & read time',
    emoji: '🔤', tags: ['writing', 'content', 'characters', 'count'], category: 'Text Tools',
    seo: {
      title: 'Word Counter | Characters, Words & Reading Time | Neetab',
      description: 'Count words, characters, sentences, and paragraphs. Estimate reading time. Free online word counter.',
      h1: 'Word Counter',
    },
    component: WordCount,
    faq: [
      { q: 'What does this tool count?', a: 'Characters (with and without spaces), words, sentences, paragraphs, and estimated reading time.' },
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
];

export const allTools = tools;
export const popularTools = tools.filter(t => t.popular);
export const toolBySlug = (slug: string) => tools.find(t => t.slug === slug);
export const totalToolCount = tools.length;
