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
