'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

const places = [
  { id: 'ch', name: 'Schweiz', latitude: 46.82, longitude: 8.23, coordinates: '46.82° N / 8.23° E' },
  { id: 'th', name: 'Thailand', latitude: 15.87, longitude: 100.99, coordinates: '15.87° N / 100.99° E' },
];

export function FamilyGlobe() {
  const hostRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const actionRef = useRef<(action: string) => void>(() => {});
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      try {
        const [THREE, { OrbitControls }] = await Promise.all([
          import('three'), import('three/addons/controls/OrbitControls.js'),
        ]);
        if (disposed) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30);
        const initialPosition = new THREE.Vector3(3.3, 2.1, 2.6).normalize().multiplyScalar(3.55);
        camera.position.copy(initialPosition);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
        renderer.domElement.setAttribute('aria-label', 'Interaktive Punktweltkugel mit Markierungen für die Schweiz und Thailand');
        renderer.domElement.setAttribute('role', 'img');
        host.prepend(renderer.domElement);
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        controls.minDistance = 1.75;
        controls.maxDistance = 6.5;
        controls.zoomSpeed = 0.75;
        controls.zoomToCursor = false;
        controls.enablePan = false;
        controls.enableDamping = true;
        controls.autoRotateSpeed = 0.35;
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        controls.autoRotate = !motionQuery.matches;
        const geometries: InstanceType<typeof THREE.BufferGeometry>[] = [];
        const materials: InstanceType<typeof THREE.Material>[] = [];
        const textures: InstanceType<typeof THREE.Texture>[] = [];
        const surface = new THREE.SphereGeometry(0.994, 64, 48);
        const surfaceMaterial = new THREE.MeshBasicMaterial({ color: 0x080a0a });
        geometries.push(surface);
        materials.push(surfaceMaterial);
        scene.add(new THREE.Mesh(surface, surfaceMaterial));
        const dotCanvas = document.createElement('canvas');
        dotCanvas.width = dotCanvas.height = 32;
        const dotContext = dotCanvas.getContext('2d')!;
        dotContext.fillStyle = '#ffffff';
        dotContext.beginPath();
        dotContext.arc(16, 16, 14, 0, Math.PI * 2);
        dotContext.fill();
        const dotTexture = new THREE.CanvasTexture(dotCanvas);
        textures.push(dotTexture);
        const pointOnEarth = (latitude: number, longitude: number, radius = 1) => {
          const lat = THREE.MathUtils.degToRad(latitude);
          const lon = THREE.MathUtils.degToRad(longitude);
          return new THREE.Vector3(Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)).multiplyScalar(radius);
        };
        const markerPositions = places.map(place => pointOnEarth(place.latitude, place.longitude, 1.025));
        markerPositions.forEach(position => {
          const geometry = new THREE.SphereGeometry(0.015, 16, 16);
          const material = new THREE.MeshBasicMaterial({ color: 0xc8b483 });
          const marker = new THREE.Mesh(geometry, material);
          marker.position.copy(position);
          scene.add(marker);
          const ringGeometry = new THREE.RingGeometry(0.027, 0.032, 40);
          const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xc8b483, side: THREE.DoubleSide });
          const ring = new THREE.Mesh(ringGeometry, ringMaterial);
          ring.position.copy(position);
          ring.lookAt(position.clone().multiplyScalar(2));
          scene.add(ring);
          geometries.push(geometry, ringGeometry);
          materials.push(material, ringMaterial);
        });
        const start = markerPositions[0].clone().normalize();
        const end = markerPositions[1].clone().normalize();
        const angle = start.angleTo(end);
        const arcPoints = Array.from({ length: 101 }, (_, index) => {
          const progress = index / 100;
          return start.clone().multiplyScalar(Math.sin((1 - progress) * angle))
            .add(end.clone().multiplyScalar(Math.sin(progress * angle)))
            .divideScalar(Math.sin(angle)).multiplyScalar(1.025 + Math.sin(progress * Math.PI) * 0.16);
        });
        const arcGeometry = new THREE.BufferGeometry().setFromPoints(arcPoints);
        const arcMaterial = new THREE.LineBasicMaterial({ color: 0xc8b483, transparent: true, opacity: 0.7 });
        geometries.push(arcGeometry);
        materials.push(arcMaterial);
        scene.add(new THREE.Line(arcGeometry, arcMaterial));
        let focusTarget: InstanceType<typeof THREE.Vector3> | null = null;
        const projected = new THREE.Vector3();
        const cameraDirection = new THREE.Vector3();
        let visible = true;
        const resize = new ResizeObserver(() => {
          camera.aspect = host.clientWidth / host.clientHeight;
          camera.fov = Math.max(36, THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(Math.PI / 10) * 1.04 / camera.aspect)));
          camera.updateProjectionMatrix();
          renderer.setSize(host.clientWidth, host.clientHeight);
        });
        resize.observe(host);
        const visibility = new IntersectionObserver(([item]) => { visible = item.isIntersecting; });
        visibility.observe(host);
        const stopFocus = () => { focusTarget = null; };
        controls.addEventListener('start', stopFocus);
        const onMotionChange = () => {
          controls.autoRotate = !motionQuery.matches;
        };
        motionQuery.addEventListener('change', onMotionChange);
        actionRef.current = action => {
          const placeIndex = places.findIndex(place => place.id === action);
          if (placeIndex < 0) return;
          focusTarget = markerPositions[placeIndex].clone().normalize().multiplyScalar(camera.position.length());
          controls.autoRotate = false;
          if (motionQuery.matches) camera.position.copy(focusTarget);
        };
        let previousTime = 0;
        renderer.setAnimationLoop((time: number) => {
          const delta = Math.min((time - previousTime) / 1000, 0.05);
          previousTime = time;
          if (!visible) return;
          if (focusTarget) {
            camera.position.lerp(focusTarget, 1 - Math.exp(-delta * 6));
            if (camera.position.distanceTo(focusTarget) < 0.001) focusTarget = null;
          }
          controls.update(delta);
          cameraDirection.copy(camera.position).normalize();
          markerPositions.forEach((position, index) => {
            const label = labelRefs.current[index];
            if (!label) return;
            projected.copy(position).project(camera);
            const labelX = Math.max(0, Math.min(host.clientWidth - label.offsetWidth - 12, (projected.x * 0.5 + 0.5) * host.clientWidth));
            const labelY = Math.max(48, Math.min(host.clientHeight - 12, (-projected.y * 0.5 + 0.5) * host.clientHeight));
            label.style.transform = `translate(${labelX}px, ${labelY}px)`;
            label.style.opacity = position.dot(cameraDirection) > 1 / camera.position.length() + 0.04 ? '1' : '0';
          });
          renderer.render(scene, camera);
        });
        const onContextLost = (event: Event) => {
          event.preventDefault();
          renderer.setAnimationLoop(null);
          setStatus('error');
        };
        renderer.domElement.addEventListener('webglcontextlost', onContextLost);
        cleanup = () => {
          resize.disconnect();
          visibility.disconnect();
          motionQuery.removeEventListener('change', onMotionChange);
          renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
          renderer.setAnimationLoop(null);
          controls.dispose();
          geometries.forEach(geometry => geometry.dispose());
          materials.forEach(material => material.dispose());
          textures.forEach(texture => texture.dispose());
          renderer.dispose();
          renderer.domElement.remove();
        };
        const image = new Image();
        image.src = '/earth-land-mask.jpg';
        await image.decode();
        if (disposed) return;
        const map = document.createElement('canvas');
        map.width = image.width;
        map.height = image.height;
        const context = map.getContext('2d', { willReadFrequently: true })!;
        context.drawImage(image, 0, 0);
        const pixels = context.getImageData(0, 0, map.width, map.height).data;
        const land: number[] = [];
        const ocean: number[] = [];
        const count = 34000;
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        for (let index = 0; index < count; index += 1) {
          const latitude = Math.asin(1 - 2 * (index + 0.5) / count) * 180 / Math.PI;
          const longitude = ((index * goldenAngle * 180 / Math.PI) % 360) - 180;
          const pixelX = Math.min(map.width - 1, Math.floor((longitude + 180) / 360 * map.width));
          const pixelY = Math.min(map.height - 1, Math.floor((90 - latitude) / 180 * map.height));
          const isLand = pixels[(pixelY * map.width + pixelX) * 4] < 100;
          if (isLand || index % 3 === 0) {
            const position = pointOnEarth(latitude, longitude);
            (isLand ? land : ocean).push(position.x, position.y, position.z);
          }
        }
        [land, ocean].forEach((positions, index) => {
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
          const material = new THREE.PointsMaterial({ color: index === 0 ? 0xb8c8c3 : 0x344741, size: index === 0 ? 0.009 : 0.005, map: dotTexture, alphaTest: 0.5 });
          geometries.push(geometry);
          materials.push(material);
          scene.add(new THREE.Points(geometry, material));
        });
        setStatus('ready');
      } catch {
        cleanup();
        if (!disposed) setStatus('error');
      }
    }, { rootMargin: '300px' });
    observer.observe(host);
    return () => {
      disposed = true;
      observer.disconnect();
      cleanup();
      actionRef.current = () => {};
    };
  }, []);

  return (
    <section className="family-world" aria-labelledby="family-world-title">
      <div className="family-world__heading">
        <h2 id="family-world-title">Zwei Länder.<br /><span>Eine Verbindung.</span></h2>
        <p>Unsere Wurzeln in Thailand. Unser Zuhause in der Schweiz.</p>
      </div>
      <div className="family-world__stage" data-status={status}>
        <div className="family-world__canvas" ref={hostRef}>
          {places.map((place, index) => <span className="family-world__marker" key={place.id} ref={element => { labelRefs.current[index] = element; }} aria-hidden="true">{place.name}</span>)}
        </div>
        {status === 'loading' && <div className="family-world__loading" role="status"><span />Weltkugel wird geladen</div>}
        {status === 'error' && <p className="family-world__error" role="status">Die 3D-Ansicht ist in diesem Browser nicht verfügbar.<br />Verbunden zwischen der Schweiz und Thailand.</p>}
      </div>
      <div className="family-world__places" aria-label="Länder auf der Weltkugel">
        {places.map(place => <button key={place.id} type="button" disabled={status !== 'ready'} aria-pressed={selected === place.id} onClick={() => { setSelected(place.id); actionRef.current(place.id); }}><MapPin size={18} strokeWidth={1.5} aria-hidden="true" /><span>{place.name}<small>{place.coordinates}</small></span><span className={`family-world__flag family-world__flag--${place.id}`} aria-hidden="true" /></button>)}
      </div>
    </section>
  );
}