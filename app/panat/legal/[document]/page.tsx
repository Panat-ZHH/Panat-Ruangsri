import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrivacySettingsButton } from '@/components/privacy-preferences';

const documents = {
  impressum: { title: 'Legal notice', description: 'Operator information and contact details for Panat Ruangsri’s personal portfolio.' },
  privacy: { title: 'Privacy notice', description: 'Information about the processing of personal data on ruangsri.ch/panat.' },
  cookies: { title: 'Cookies and local storage', description: 'Information about cookies, local settings and external website content.' },
};

export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(documents).map((document) => ({ document }));
}
export async function generateMetadata({ params }: { params: Promise<{ document: string }> }): Promise<Metadata> {
  const { document } = await params;
  const entry = documents[document as keyof typeof documents];
  return entry ? {
    title: entry.title, description: entry.description,
    alternates: { canonical: `/panat/legal/${document}` }, robots: { index: false, follow: true },
  } : {};
}

export default async function LegalPage({ params }: { params: Promise<{ document: string }> }) {
  const { document } = await params;
  const entry = documents[document as keyof typeof documents];
  if (!entry) notFound();
  return (
    <main id="main-content" className="legal-page" lang="en">
      <article>
        <Link href="/panat" className="portfolio-back">Back to Panat’s portfolio</Link>
        <h1>{entry.title}</h1>
        <p className="legal-date">Last updated: 16 October 2026</p>
        {document === 'impressum' ? <>
          <h2>Operator and contact</h2>
          <p>Panat Ruangsri<br />Switzerland<br /><a href="mailto:panat@ruangsri.ch">panat@ruangsri.ch</a></p>
          <p className="legal-notice">The operator’s full postal address must be added before publication.</p>
          <h2>Domain and web hosting</h2>
          <p>The ruangsri.ch domain is managed by Swizzonic. Web hosting and delivery of ruangsri.ch/panat are provided by Netlify.</p>
          <h2>About this website</h2>
          <p>This personal portfolio presents my education, professional work and interests. Mentioned companies and brands belong to their respective owners. This portfolio is not an official website of Swisscom or Reb-Thai.</p>
          <h2>Content and rights</h2>
          <p>Original content may only be reused with permission, unless otherwise permitted by law. Rights to embedded brands, logos and other third-party content remain with their respective rights holders.</p>
        </> : document === 'privacy' ? <>
          <h2>Data controller</h2>
          <p>Panat Ruangsri, Switzerland. For privacy enquiries: <a href="mailto:panat@ruangsri.ch">panat@ruangsri.ch</a>.</p>
          <p className="legal-notice">Before publication, add the full postal address and confirm the processing locations and retention periods applicable to this Netlify project.</p>
          <h2>Visiting this website</h2>
          <p>This website is hosted by Netlify. When you visit, technically necessary connection data such as your IP address, timestamp, requested URL, browser and operating system is sent to Netlify. This data is used to deliver and secure the site and to troubleshoot errors. Netlify may process data outside Switzerland, particularly in the United States. The actual processing locations, subprocessors, retention periods and any required safeguards must be checked against the services in use and their contractual terms.</p>
          <p>More information about the provider’s data processing is available in <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer">Netlify’s Privacy Policy</a>.</p>
          <h2>Domain provider</h2>
          <p>The domain is managed by Swizzonic. Swizzonic is the domain provider; the portfolio content is delivered by Netlify.</p>
          <h2>Contact by email</h2>
          <p>If you contact me, your email address and the information you provide will be used to handle your enquiry. They will be retained only for as long as needed to respond or to meet legal obligations. Email services may process data outside Switzerland; the actual configuration must be checked before publication.</p>
          <h2>External content from Wendico</h2>
          <p>The live website at wendico.ch is embedded only after you consent. Your browser then connects directly to Wendico and, where applicable, its service providers. Your IP address, browser data and interactions may be transmitted, and cookies or other storage technologies may be used. The <a href="https://wendico.ch" target="_blank" rel="noopener noreferrer">privacy information on wendico.ch</a> also applies.</p>
          <p>You can withdraw your consent at any time using Cookie settings. Data already transmitted will not be deleted retroactively.</p>
          <h2>Local settings and analytics</h2>
          <p>Your permission to load external content is stored as a local browser setting. The portfolio does not use analytics or advertising trackers. Images and logos are served by this site’s own hosting provider.</p>
          <h2>Your rights</h2>
          <p>Depending on the applicable data protection law, you may request access to, correction, deletion, restriction or transfer of your data, and object to its processing. You may withdraw consent for the future. You can contact the Swiss Federal Data Protection and Information Commissioner (FDPIC) or, where applicable, a competent EU supervisory authority.</p>
          <h2>Legal bases</h2>
          <p>The Swiss Federal Act on Data Protection (FADP) is particularly relevant. Where the GDPR applies, technically necessary processing is based on the legitimate interest in providing a secure website; handling enquiries is based on pre-contractual steps or legitimate interests; and optional embeds are based on your consent.</p>
        </> : <>
          <h2>What is stored?</h2>
          <p>The portfolio does not use its own analytics or advertising cookies. Your choice about external content is stored locally under <code>panat-external-content-v1</code> with the value <code>allowed</code> or <code>blocked</code>.</p>
          <h2>Purpose and duration</h2>
          <p>This choice prevents external content from loading without your consent and remembers your preference between visits. It remains stored until you change it in Cookie settings or clear your browser data. If local storage is unavailable, the choice applies only to the current page view.</p>
          <h2>Optional external website</h2>
          <p>After you consent, the embedded Wendico website may use its own cookies or other storage technologies. These are managed by the external provider. To remove third-party data already stored, use your browser’s site data settings.</p>
          <h2>Hosting</h2>
          <p>The website is hosted by Netlify and the domain is managed by Swizzonic. Before publication, check the actual project configuration to determine whether enabled Netlify services use additional cookies or storage mechanisms.</p>
        </>}
        <div className="legal-settings"><PrivacySettingsButton /></div>
      </article>
    </main>
  );
}
