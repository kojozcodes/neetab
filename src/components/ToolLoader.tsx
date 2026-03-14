import { lazy, Suspense } from 'react';

// Map every componentPath to its lazy import
const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  // ── File Tools ──
  'file/PDFtoWord': lazy(() => import('../tools/file/PDFtoWord')),
  'file/WordToPDF': lazy(() => import('../tools/file/WordToPDF')),
  'file/ImageCompressor': lazy(() => import('../tools/file/ImageCompressor')),
  'file/PDFtoImage': lazy(() => import('../tools/file/PDFtoImage')),
  'file/ImageToPDF': lazy(() => import('../tools/file/ImageToPDF')),
  'file/InvoiceGenerator': lazy(() => import('../tools/file/InvoiceGenerator')),
  'file/ImageResizer': lazy(() => import('../tools/file/ImageResizer')),
  'file/HEICtoJPG': lazy(() => import('../tools/file/HEICtoJPG')),
  'file/SVGtoPNG': lazy(() => import('../tools/file/SVGtoPNG')),
  'file/MergePDF': lazy(() => import('../tools/file/MergePDF')),
  'file/PDFCompressor': lazy(() => import('../tools/file/PDFCompressor')),
  'file/SplitPDF': lazy(() => import('../tools/file/SplitPDF')),
  'file/ImageRotateFlip': lazy(() => import('../tools/file/ImageRotateFlip')),
  'file/HTMLtoPDF': lazy(() => import('../tools/file/HTMLtoPDF')),
  'file/ImageFormatConverter': lazy(() => import('../tools/file/ImageFormatConverter')),
  // ── Calculators ──
  'calculators/TipCalculator': lazy(() => import('../tools/calculators/TipCalculator')),
  'calculators/BMICalculator': lazy(() => import('../tools/calculators/BMICalculator')),
  'calculators/PercentageCalculator': lazy(() => import('../tools/calculators/PercentageCalculator')),
  'calculators/DiscountCalculator': lazy(() => import('../tools/calculators/DiscountCalculator')),
  'calculators/AgeCalculator': lazy(() => import('../tools/calculators/AgeCalculator')),
  'calculators/AspectRatioCalculator': lazy(() => import('../tools/calculators/AspectRatioCalculator')),
  'calculators/CalorieCalculator': lazy(() => import('../tools/calculators/CalorieCalculator')),
  // ── Design Tools ──
  'design/ColorPalette': lazy(() => import('../tools/design/ColorPalette')),
  'design/GradientMaker': lazy(() => import('../tools/design/GradientMaker')),
  'design/ColorConverter': lazy(() => import('../tools/design/ColorConverter')),
  'design/FaviconGenerator': lazy(() => import('../tools/design/FaviconGenerator')),
  'design/ColorPickerFromImage': lazy(() => import('../tools/design/ColorPickerFromImage')),
  'design/ColorContrastChecker': lazy(() => import('../tools/design/ColorContrastChecker')),
  'design/CSSBoxShadowGenerator': lazy(() => import('../tools/design/CSSBoxShadowGenerator')),
  'design/CSSBorderRadiusGenerator': lazy(() => import('../tools/design/CSSBorderRadiusGenerator')),
  'design/ColorBlindnessSimulator': lazy(() => import('../tools/design/ColorBlindnessSimulator')),
  // ── Generators / Dev Tools ──
  'generators/JSONFormatter': lazy(() => import('../tools/generators/JSONFormatter')),
  'generators/QRCodeGenerator': lazy(() => import('../tools/generators/QRCodeGenerator')),
  'generators/BarcodeGenerator': lazy(() => import('../tools/generators/BarcodeGenerator')),
  'generators/PasswordGenerator': lazy(() => import('../tools/generators/PasswordGenerator')),
  'generators/PomodoroTimer': lazy(() => import('../tools/generators/PomodoroTimer')),
  'generators/CountdownTimer': lazy(() => import('../tools/generators/CountdownTimer')),
  'generators/Stopwatch': lazy(() => import('../tools/generators/Stopwatch')),
  'devtools/QRCodeScanner': lazy(() => import('../tools/devtools/QRCodeScanner')),
  'devtools/Base64Tool': lazy(() => import('../tools/devtools/Base64Tool')),
  'devtools/HashGenerator': lazy(() => import('../tools/devtools/HashGenerator')),
  'devtools/UUIDGenerator': lazy(() => import('../tools/devtools/UUIDGenerator')),
  'devtools/URLEncoderDecoder': lazy(() => import('../tools/devtools/URLEncoderDecoder')),
  'devtools/TextDiff': lazy(() => import('../tools/devtools/TextDiff')),
  'devtools/TimestampConverter': lazy(() => import('../tools/devtools/TimestampConverter')),
  'devtools/RegexTester': lazy(() => import('../tools/devtools/RegexTester')),
  'devtools/MarkdownPreview': lazy(() => import('../tools/devtools/MarkdownPreview')),
  'devtools/CSSMinifier': lazy(() => import('../tools/devtools/CSSMinifier')),
  'devtools/TextCaseConverter': lazy(() => import('../tools/devtools/TextCaseConverter')),
  'devtools/JWTDecoder': lazy(() => import('../tools/devtools/JWTDecoder')),
  'devtools/NumberBaseConverter': lazy(() => import('../tools/devtools/NumberBaseConverter')),
  'devtools/JSONtoCSV': lazy(() => import('../tools/devtools/JSONtoCSV')),
  'devtools/ImageToBase64': lazy(() => import('../tools/devtools/ImageToBase64')),
  'devtools/CSVtoJSON': lazy(() => import('../tools/devtools/CSVtoJSON')),
  'devtools/HTMLFormatter': lazy(() => import('../tools/devtools/HTMLFormatter')),
  'devtools/Base64toImage': lazy(() => import('../tools/devtools/Base64toImage')),
  'devtools/HTMLtoMarkdown': lazy(() => import('../tools/devtools/HTMLtoMarkdown')),
  'devtools/JSONtoXML': lazy(() => import('../tools/devtools/JSONtoXML')),
  'devtools/JSONtoYAML': lazy(() => import('../tools/devtools/JSONtoYAML')),
  'devtools/XMLtoJSON': lazy(() => import('../tools/devtools/XMLtoJSON')),
  'devtools/YAMLtoJSON': lazy(() => import('../tools/devtools/YAMLtoJSON')),
  'devtools/CronParser': lazy(() => import('../tools/devtools/CronParser')),
  'devtools/SQLFormatter': lazy(() => import('../tools/devtools/SQLFormatter')),
  // ── Converters ──
  'converters/UnitConverter': lazy(() => import('../tools/converters/UnitConverter')),
  'converters/CurrencyConverter': lazy(() => import('../tools/converters/CurrencyConverter')),
  'converters/ExcelToCSV': lazy(() => import('../tools/converters/ExcelToCSV')),
  'converters/CSVtoExcel': lazy(() => import('../tools/converters/CSVtoExcel')),
  // ── Text Tools ──
  'text/WordCounter': lazy(() => import('../tools/text/WordCounter')),
  'text/LoremIpsumGenerator': lazy(() => import('../tools/text/LoremIpsumGenerator')),
  'text/TextToSpeech': lazy(() => import('../tools/text/TextToSpeech')),
  'text/TextUtilities': lazy(() => import('../tools/text/TextUtilities')),
  'text/WordFrequencyCounter': lazy(() => import('../tools/text/WordFrequencyCounter')),
  'text/SlugGenerator': lazy(() => import('../tools/text/SlugGenerator')),
  'text/FindAndReplace': lazy(() => import('../tools/text/FindAndReplace')),
  'text/RomanNumeralConverter': lazy(() => import('../tools/text/RomanNumeralConverter')),
  'text/MorseCodeConverter': lazy(() => import('../tools/text/MorseCodeConverter')),
  'text/SpeechToText': lazy(() => import('../tools/text/SpeechToText')),
  'text/CharacterCounter': lazy(() => import('../tools/text/CharacterCounter')),
  'text/ReadabilityChecker': lazy(() => import('../tools/text/ReadabilityChecker')),
  'text/ParaphrasingTool': lazy(() => import('../tools/text/ParaphrasingTool')),
  'text/Summarizer': lazy(() => import('../tools/text/Summarizer')),
  'text/AIHumanizer': lazy(() => import('../tools/text/AIHumanizer')),
  'text/CoverLetterGenerator': lazy(() => import('../tools/text/CoverLetterGenerator')),
  'text/AIEmailWriter': lazy(() => import('../tools/text/AIEmailWriter')),
  'text/EmailSubjectGenerator': lazy(() => import('../tools/text/EmailSubjectGenerator')),
  'text/BulletPointGenerator': lazy(() => import('../tools/text/BulletPointGenerator')),
  'text/MetaDescriptionGenerator': lazy(() => import('../tools/text/MetaDescriptionGenerator')),
};

function ToolSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-10 bg-surface-200 dark:bg-surface-800 rounded-xl" />
      <div className="h-10 bg-surface-200 dark:bg-surface-800 rounded-xl" />
      <div className="h-16 bg-surface-200 dark:bg-surface-800 rounded-xl" />
    </div>
  );
}

export default function ToolLoader({ componentPath }: { componentPath: string }) {
  const Component = componentMap[componentPath];

  if (!Component) {
    return <div className="text-center py-8 text-surface-500">Tool not found</div>;
  }

  return (
    <Suspense fallback={<ToolSkeleton />}>
      <Component />
    </Suspense>
  );
}