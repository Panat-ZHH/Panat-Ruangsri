import { ImageResponse } from 'next/og';

export const alt = 'Panat Ruangsri - Software Developer und Founder';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function PanatOpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '64px', background: '#080b0a', color: '#f5f6f2' }}>
      <div style={{ display: 'flex', fontSize: 32, color: '#d7ff00' }}>PR</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ fontSize: 88, fontWeight: 700 }}>Panat Ruangsri</div>
        <div style={{ fontSize: 32, color: '#bac4bc' }}>Software Developer · Founder & CEO</div>
      </div>
      <div style={{ fontSize: 23, color: '#bac4bc' }}>ruangsri.ch/panat</div>
    </div>, size,
  );
}
