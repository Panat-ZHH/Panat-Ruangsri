export function GET() {
  const text = `# Ruangsri

> Profiles of Pawat Ruangsri, Panat Ruangsri, and Phanuphon Ruangsri.

## Profiles
- [Panat Ruangsri](https://ruangsri.ch/panat): software developer apprentice at Swisscom and Co-Founder and CEO of Wendico KLG.

## Contact
- Panat Ruangsri: panat@ruangsri.ch
- Website: https://ruangsri.ch

Only Panat's profile is currently available on this website. This file does not grant rights to reuse photographs, logos or other protected content.
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
