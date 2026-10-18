import type { CSSProperties } from 'react';
import SoftwareDetails from '@/components/software-details';
import FounderDetails from '@/components/founder-details';
import SideJobDetails from '@/components/side-job-details';
import HobbyDetails from '@/components/hobby-details';

export const portfolioPages = [
  {
    slug: 'software-developer', title: 'Software Developer', eyebrow: 'Swisscom',
    description: 'Panat Ruangsri absolviert bei Swisscom in Zürich die Ausbildung zum Informatiker EFZ Applikationsentwicklung, 2023 bis voraussichtlich Sommer 2027. Stationen, Technologien und Projekte.',
    content: <SoftwareDetails />,
    theme: {
      '--theme-accent': '#3d9bff', '--theme-accent-rgb': '61,155,255', '--theme-on-accent': '#ffffff',
      '--theme-top': '#0b1528', '--theme-bottom': '#03060d', '--theme-surface': '9,16,30',
      '--theme-title': 'linear-gradient(180deg, #6fd0ff 0%, #2f86ff 55%, #1f55f0 100%)',
    } as CSSProperties,
  },
  {
    slug: 'founder', title: 'Founder & CEO', eyebrow: 'Wendico KLG',
    description: 'Panat Ruangsri is Co-Founder and CEO of Wendico KLG. He leads strategy, client projects, business development and a five-person team building websites and digital systems.',
    content: <FounderDetails />,
    theme: {
      '--theme-accent': '#9db495', '--theme-accent-rgb': '157,180,149', '--theme-on-accent': '#0c0e0b',
      '--theme-top': '#171612', '--theme-bottom': '#080807', '--theme-surface': '22,22,18',
      '--theme-title': 'linear-gradient(180deg, #b3c6ad 0%, #8aa283 50%, #667f60 100%)',
    } as CSSProperties,
  },
  {
    slug: 'side-jobs', title: 'Side Jobs', eyebrow: 'Reb-Thai',
    description: 'Neben seiner Ausbildung und Wendico unterstützt Panat Ruangsri das Familienrestaurant Reb-Thai in Andelfingen: Take-away, Buffet, Restaurantbetrieb und Gästekontakt.',
    content: <SideJobDetails />,
    theme: {
      '--theme-accent': '#e39d5c', '--theme-accent-rgb': '227,157,92', '--theme-on-accent': '#1a0f08',
      '--theme-top': '#26160d', '--theme-bottom': '#0c0705', '--theme-surface': '32,20,13',
      '--theme-title': 'linear-gradient(180deg, #b9ccb3 0%, #91aa8b 55%, #6f8a69 100%)',
    } as CSSProperties,
  },
  {
    slug: 'hobbys', title: 'Hobbys', eyebrow: 'Beyond work',
    description: 'Panat Ruangsri über Tennis, Gym und Speedcubing: R8 im ersten Tennisjahr, ein Turniersieg, ein Cube-Rekord von 11 Sekunden und über 500.000 TikTok-Follower.',
    content: <HobbyDetails />,
    theme: {
      '--theme-accent': '#a8c293', '--theme-accent-rgb': '168,194,147', '--theme-on-accent': '#0b0d0a',
      '--theme-top': '#151613', '--theme-bottom': '#060606', '--theme-surface': '21,22,19',
      '--theme-title': 'linear-gradient(180deg, #f2efe6 0%, #c9d8bd 45%, #8faa7f 100%)',
    } as CSSProperties,
  },
];