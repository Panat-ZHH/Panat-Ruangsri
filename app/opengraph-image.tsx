import { ImageResponse } from 'next/og';

export const alt = 'Ruangsri profiles';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', height: '100%', padding: '64px', background: '#080b0a', color: '#f5f6f2' }}>
      <div style={{ display: 'flex', fontSize: 32, color: '#d7ff00' }}>RUANGSRI</div>
      <div style={{ display: 'flex', gap: 28, fontSize: 34, fontWeight: 700 }}>
        <div>Pawat Ruangsri</div><div>Panat Ruangsri</div><div>Phanuphon Ruangsri</div>
      </div>
      <div style={{ fontSize: 23, color: '#bac4bc' }}>ruangsri.ch</div>
    </div>, size,
  );
}