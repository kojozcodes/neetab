import SEO from '../components/SEO';
import { totalToolCount } from '../tools/registry';

export default function About() {
  return (
    <>
      <SEO
        title="About Neetab | Neat Tools. One Tab."
        description="Neetab is a collection of free online tools — calculators, converters, design tools & file converters. Fast, private, no sign-up required."
        path="/about"
      />
      <div className="max-w-2xl mx-auto px-5 py-10 animate-fade-in">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-100 mb-6">
          About Neetab
        </h1>

        <div className="space-y-6 text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">What is Neetab?</h2>
            <p>
              Neetab is a collection of {totalToolCount} free online tools designed to be fast, private, and beautifully simple.
              From PDF converters and image compressors to calculators, color palette generators, and developer utilities —
              everything you need in one tab.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Why Neetab?</h2>
            <p>
              Most online tool sites are bloated with ads, slow to load, and require sign-ups. We built Neetab because
              we wanted something better: tools that load instantly, respect your privacy, and just work.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Privacy First</h2>
            <p>
              The majority of Neetab tools run entirely in your browser. Your files, calculations, and data stay on your
              device — nothing is uploaded to a server unless absolutely necessary (like high-quality PDF conversion).
              Even then, files are processed and immediately deleted. You can read the full details in our{' '}
              <a href="/privacy" className="text-brand-500 hover:underline">Privacy Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Free to Use</h2>
            <p>
              Every tool on Neetab is free to use with no sign-ups required. We support the site through non-intrusive
              advertising. We believe the core tools should always be free and useful.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Built With</h2>
            <p>
              Neetab is built with React, TypeScript, and Tailwind CSS. File conversion tools are powered by a dedicated
              backend running LibreOffice and pdf2docx. The site is hosted on Vercel with a conversion server on Railway.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Contact</h2>
            <p>
              Got feedback, tool requests, or just want to say hi? Reach us at{' '}
              <a href="mailto:hello@neetab.com" className="text-brand-500 font-medium hover:underline">hello@neetab.com</a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
