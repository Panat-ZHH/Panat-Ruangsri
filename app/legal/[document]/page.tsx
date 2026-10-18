import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrivacySettingsButton } from '@/components/privacy-preferences';

const documents = {
  impressum: { title: 'Impressum', description: 'Angaben zum Betreiber und Kontakt für das persönliche Portfolio von Panat Ruangsri.' },
  privacy: { title: 'Datenschutzerklärung', description: 'Informationen zur Bearbeitung von Personendaten auf panat.ruangsri.ch.' },
  cookies: { title: 'Cookies & lokale Speicherung', description: 'Informationen zu Cookies, lokalen Einstellungen und externen Website-Inhalten.' },
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
    alternates: { canonical: `/legal/${document}` }, robots: { index: false, follow: true },
  } : {};
}

export default async function LegalPage({ params }: { params: Promise<{ document: string }> }) {
  const { document } = await params;
  const entry = documents[document as keyof typeof documents];
  if (!entry) notFound();
  return (
    <main id="main-content" className="legal-page">
      <article>
        <Link href="/" className="portfolio-back">Zur Startseite</Link>
        <h1>{entry.title}</h1>
        <p className="legal-date">Stand: 16. Oktober 2026</p>
        {document === 'impressum' ? <>
          <h2>Betreiber & Kontakt</h2>
          <p>Panat Ruangsri<br />Schweiz<br /><a href="mailto:panat@ruangsri.ch">panat@ruangsri.ch</a></p>
          <p className="legal-notice">Die vollständige Betreiberanschrift muss vor der Veröffentlichung ergänzt werden.</p>
          <h2>Domain & Webhosting</h2>
          <p>Die Domain panat.ruangsri.ch wird über Swizzonic verwaltet. Das Webhosting und die Auslieferung dieser Website erfolgen über Netlify.</p>
          <h2>Über diese Website</h2>
          <p>Dieses persönliche Portfolio stellt meine Ausbildung, beruflichen Tätigkeiten und Interessen vor. Erwähnte Unternehmen und Marken gehören ihren jeweiligen Inhabern. Das Portfolio ist keine offizielle Website von Swisscom oder Reb-Thai.</p>
          <h2>Inhalte & Rechte</h2>
          <p>Eigene Inhalte dürfen nur mit Erlaubnis verwendet werden, soweit nicht gesetzlich erlaubt. Rechte an eingebundenen Marken, Logos und anderen fremden Inhalten verbleiben bei den jeweiligen Rechteinhabern.</p>
        </> : document === 'privacy' ? <>
          <h2>Verantwortlicher</h2>
          <p>Panat Ruangsri, Schweiz. Fragen zum Datenschutz: <a href="mailto:panat@ruangsri.ch">panat@ruangsri.ch</a>.</p>
          <p className="legal-notice">Vor Veröffentlichung sind die vollständige Kontaktanschrift sowie die für dieses Netlify-Projekt geltenden Bearbeitungsorte und Aufbewahrungsfristen zu ergänzen.</p>
          <h2>Aufruf der Website</h2>
          <p>Diese Website wird bei Netlify gehostet. Beim Aufruf werden technisch notwendige Verbindungsdaten wie IP-Adresse, Zeitpunkt, angeforderte URL, Browser und Betriebssystem an Netlify übermittelt. Diese Daten dienen der Bereitstellung, Sicherheit und Fehlerbehebung. Netlify kann Daten auch ausserhalb der Schweiz bearbeiten, insbesondere in den USA. Die konkreten Bearbeitungsorte, Unterauftragnehmer, Aufbewahrungsfristen und gegebenenfalls erforderlichen Schutzmassnahmen müssen anhand der verwendeten Dienste und Vertragsbedingungen geprüft werden.</p>
          <p>Weitere Informationen zur Datenbearbeitung durch den Anbieter stehen in den <a href="https://www.netlify.com/privacy/" target="_blank" rel="noopener noreferrer">Datenschutzhinweisen von Netlify</a>.</p>
          <h2>Domain-Anbieter</h2>
          <p>Die Domain wird über Swizzonic verwaltet. Swizzonic ist der Domain-Anbieter; die Inhalte dieses Portfolios werden über Netlify ausgeliefert.</p>
          <h2>Kontakt per E-Mail</h2>
          <p>Wenn du Kontakt aufnimmst, werden deine E-Mail-Adresse und die mitgeteilten Inhalte zur Bearbeitung deiner Anfrage verwendet. Sie werden nur so lange aufbewahrt, wie es die Anfrage oder gesetzliche Pflichten erfordern. E-Mail-Dienste können Daten auch ausserhalb der Schweiz verarbeiten; die konkrete Konfiguration ist vor Veröffentlichung zu prüfen.</p>
          <h2>Externe Inhalte von Wendico</h2>
          <p>Die Live-Website von wendico.ch wird erst nach deiner Zustimmung eingebettet. Dann baut dein Browser eine direkte Verbindung zu Wendico und gegebenenfalls zu dessen Dienstleistern auf. Dabei können IP-Adresse, Browserdaten und Interaktionen übermittelt sowie Cookies und andere Speichertechnologien eingesetzt werden. Es gelten zusätzlich die Datenschutzhinweise auf <a href="https://wendico.ch" target="_blank" rel="noopener noreferrer">wendico.ch</a>.</p>
          <p>Deine Zustimmung kannst du jederzeit über die Cookie-Einstellungen widerrufen. Bereits übermittelte Daten werden dadurch nicht rückwirkend gelöscht.</p>
          <h2>Lokale Einstellungen & Analyse</h2>
          <p>Die Freigabe externer Inhalte wird als lokale Browsereinstellung gespeichert. In der Portfolio-Anwendung sind keine Analyse- oder Werbe-Tracker eingebaut. Bilder und Logos werden vom eigenen Hosting ausgeliefert.</p>
          <h2>Deine Rechte</h2>
          <p>Je nach anwendbarem Datenschutzrecht kannst du Auskunft, Berichtigung, Löschung, Einschränkung oder Herausgabe deiner Daten verlangen und einer Bearbeitung widersprechen. Einwilligungen können für die Zukunft widerrufen werden. Du kannst dich an den Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) oder, falls einschlägig, an eine zuständige EU-Aufsichtsbehörde wenden.</p>
          <h2>Rechtsgrundlagen</h2>
          <p>Massgeblich ist insbesondere das schweizerische Datenschutzgesetz. Soweit die DSGVO anwendbar ist, beruhen technisch notwendige Bearbeitungen auf berechtigten Interessen an einem sicheren Webangebot, die Bearbeitung von Anfragen auf vorvertraglichen Massnahmen oder berechtigten Interessen und optionale Einbettungen auf deiner Einwilligung.</p>
        </> : <>
          <h2>Was wird gespeichert?</h2>
          <p>Die Portfolio-Anwendung setzt keine eigenen Analyse- oder Werbe-Cookies. Für die Entscheidung über externe Inhalte wird der lokale Speichereintrag <code>panat-external-content-v1</code> mit dem Wert <code>allowed</code> oder <code>blocked</code> verwendet.</p>
          <h2>Zweck & Dauer</h2>
          <p>Die Auswahl verhindert, dass externe Inhalte ohne Zustimmung geladen werden, und merkt sich deine Entscheidung über Besuche hinweg. Sie bleibt gespeichert, bis du sie in den Cookie-Einstellungen änderst oder die Browserdaten löschst. Ohne funktionierenden lokalen Speicher gilt die Auswahl nur für den aktuellen Seitenaufruf.</p>
          <h2>Optionale externe Website</h2>
          <p>Nach Zustimmung kann die eingebettete Wendico-Website eigene Cookies oder andere Speichermechanismen verwenden. Diese werden vom externen Anbieter verwaltet. Zum Entfernen bereits gesetzter Drittanbieter-Daten verwende die Website-Dateneinstellungen deines Browsers.</p>
          <h2>Hosting</h2>
          <p>Das Webhosting erfolgt über Netlify, die Domain wird über Swizzonic verwaltet. Ob aktivierte Netlify-Dienste zusätzliche Cookies oder Speichermechanismen einsetzen, muss vor Veröffentlichung anhand der tatsächlichen Projektkonfiguration geprüft werden.</p>
        </>}
        <div className="legal-settings"><PrivacySettingsButton /></div>
      </article>
    </main>
  );
}