export function GET() {
  const text = `# Panat Ruangsri

> Personal portfolio of Panat Ruangsri, a software developer apprentice at Swisscom and Co-Founder and CEO of Wendico KLG in Switzerland.

## Portfolio
- [Software Developer](https://panat.ruangsri.ch/software-developer): Swisscom apprenticeship in application development, August 2023 to expected summer 2027; team placements and technical experience.
- [Founder and CEO](https://panat.ruangsri.ch/founder): Wendico KLG, digital studio, business development, client projects and leadership of a five-person team.
- [Side Jobs](https://panat.ruangsri.ch/side-jobs): Work at the family restaurant Reb-Thai in Andelfingen, Switzerland.
- [Hobbies](https://panat.ruangsri.ch/hobbys): Tennis, speedcubing, Rubik's Cube tutorial videos on TikTok and gym.

## Contact
- Email: panat@ruangsri.ch
- Canonical website: https://panat.ruangsri.ch

This is a personal portfolio, not an official Swisscom website. Consult the linked pages for current details. This file does not grant rights to reuse photographs, logos or other protected content.
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}