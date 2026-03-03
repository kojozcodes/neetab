import { lazy, Suspense } from 'react';

// Map every componentPath to its lazy import
const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  'file/PDFtoWord': lazy(() => import('../tools/file/PDFtoWord')),
  'file/WordToPDF': lazy(() => import('../tools/file/WordToPDF')),
  'file/ImageCompressor': lazy(() => import('../tools/file/ImageCompressor')),
  'file/PDFtoImage': lazy(() => import('../tools/file/PDFtoImage')),
  'file/ImageToPDF': lazy(() => import('../tools/file/ImageToPDF')),
  'file/InvoiceGenerator': lazy(() => import('../tools/file/InvoiceGenerator')),
  'calculators/TipCalculator': lazy(() => import('../tools/calculators/TipCalculator')),
  'calculators/BMICalculator': lazy(() => import('../tools/calculators/BMICalculator')),
  'calculators/PercentageCalculator': lazy(() => import('../tools/calculators/PercentageCalculator')),
  'calculators/DiscountCalculator': lazy(() => import('../tools/calculators/DiscountCalculator')),
  'calculators/AgeCalculator': lazy(() => import('../tools/calculators/AgeCalculator')),
  'design/ColorPalette': lazy(() => import('../tools/design/ColorPalette')),
  'design/GradientMaker': lazy(() => import('../tools/design/GradientMaker')),
  'design/ColorConverter': lazy(() => import('../tools/design/ColorConverter')),
  'design/FaviconGenerator': lazy(() => import('../tools/design/FaviconGenerator')),
  'generators/JSONFormatter': lazy(() => import('../tools/generators/JSONFormatter')),
  'generators/QRCodeGenerator': lazy(() => import('../tools/generators/QRCodeGenerator')),
  'generators/PasswordGenerator': lazy(() => import('../tools/generators/PasswordGenerator')),
  'devtools/Base64Tool': lazy(() => import('../tools/devtools/Base64Tool')),
  'devtools/HashGenerator': lazy(() => import('../tools/devtools/HashGenerator')),
  'devtools/UUIDGenerator': lazy(() => import('../tools/devtools/UUIDGenerator')),
  'devtools/URLEncoderDecoder': lazy(() => import('../tools/devtools/URLEncoderDecoder')),
  'devtools/TextDiff': lazy(() => import('../tools/devtools/TextDiff')),
  'devtools/TimestampConverter': lazy(() => import('../tools/devtools/TimestampConverter')),
  'devtools/RegexTester': lazy(() => import('../tools/devtools/RegexTester')),
  'devtools/MarkdownPreview': lazy(() => import('../tools/devtools/MarkdownPreview')),
  'devtools/CSSMinifier': lazy(() => import('../tools/devtools/CSSMinifier')),
  'converters/UnitConverter': lazy(() => import('../tools/converters/UnitConverter')),
  'converters/CurrencyConverter': lazy(() => import('../tools/converters/CurrencyConverter')),
  'text/WordCounter': lazy(() => import('../tools/text/WordCounter')),
  'text/LoremIpsumGenerator': lazy(() => import('../tools/text/LoremIpsumGenerator')),
  'text/TextToSpeech': lazy(() => import('../tools/text/TextToSpeech')),
  'generators/PomodoroTimer': lazy(() => import('../tools/generators/PomodoroTimer')),
  'generators/CountdownTimer': lazy(() => import('../tools/generators/CountdownTimer')),
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