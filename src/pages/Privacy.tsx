import SEO from '../components/SEO';

export default function Privacy() {
  return (
    <>
      <SEO
        title="Privacy Policy — Neetab"
        description="Neetab privacy policy. Learn how we handle your data — spoiler: most tools run entirely in your browser."
        path="/privacy"
      />
      <div className="max-w-2xl mx-auto px-5 py-10 animate-fade-in">
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-100 mb-6">
          Privacy Policy
        </h1>
        <p className="text-xs text-surface-400 mb-8">Last updated: February 26, 2026</p>

        <div className="prose-custom space-y-6 text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Overview</h2>
            <p>
              Neetab ("we", "us", "our") operates neetab.com. We are committed to protecting your privacy. 
              The vast majority of our tools run entirely in your browser — your files and data never leave your device.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Data We Collect</h2>
            <p><strong>Analytics:</strong> We use Google Analytics to collect anonymous usage data such as pages visited, 
              browser type, device type, and approximate location (country/city level). This helps us understand which tools 
              are popular and improve the site. No personally identifiable information is collected.</p>
            <p className="mt-2"><strong>Cookies:</strong> Google Analytics uses cookies to distinguish users. You can opt out 
              by disabling cookies in your browser or using the 
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline ml-1">
                Google Analytics Opt-out Browser Add-on
              </a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">File Processing</h2>
            <p><strong>Client-side tools:</strong> Most tools (calculators, converters, design tools, text tools, and developer tools) 
              process everything in your browser. No data is sent to any server.</p>
            <p className="mt-2"><strong>Server-side tools:</strong> PDF to Word and Word to PDF may use our conversion server for 
              higher quality results. Files sent to the server are processed immediately, never stored permanently, and deleted 
              after conversion. We do not read, analyze, or share the contents of your files.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Advertising</h2>
            <p>We may display ads through Google AdSense. Google may use cookies to serve ads based on your prior visits to 
              this or other websites. You can opt out of personalized advertising by visiting 
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-brand-500 hover:underline ml-1">
                Google Ads Settings
              </a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <p className="mt-1"><strong>Google Analytics</strong> — anonymous usage analytics</p>
            <p><strong>Google AdSense</strong> — advertising</p>
            <p><strong>Google Fonts</strong> — web fonts (DM Sans, DM Serif Display, JetBrains Mono)</p>
            <p><strong>Vercel</strong> — website hosting</p>
            <p><strong>Railway</strong> — file conversion server hosting</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Data Retention</h2>
            <p>We do not store any user files or personal data. Analytics data is retained by Google according to their 
              standard retention policies.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Children's Privacy</h2>
            <p>Neetab is a general-purpose tool website. We do not knowingly collect personal information from children under 13.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. Changes will be reflected on this page with an updated date.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-2">Contact</h2>
            <p>If you have questions about this privacy policy, you can reach us at 
              <span className="text-brand-500 font-medium ml-1">hello@neetab.com</span>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
