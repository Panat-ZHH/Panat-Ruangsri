'use client';

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { useEffect, useRef, useState } from 'react';
import { useSmoothScroll } from '@/components/smooth-scroll';
import { PORTFOLIO_DETAIL_EVENT, PORTFOLIO_NAVIGATE_EVENT } from '@/components/portfolio-navigation';

const REFLECTION_WIDTH = 96;
const REFLECTION_HEIGHT = 54;

function extrudeLetter(shape: THREE.Shape) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.42,
    bevelEnabled: true,
    bevelSegments: 16,
    bevelSize: 0.065,
    bevelThickness: 0.07,
    curveSegments: 32,
  });
  geometry.computeVertexNormals();
  return geometry;
}

function createLetterP() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.5, -1.2);
  shape.lineTo(-0.05, -1.2);
  shape.lineTo(-0.05, -0.2);
  shape.lineTo(0.35, -0.2);
  shape.bezierCurveTo(1.12, -0.2, 1.12, 1.2, 0.35, 1.2);
  shape.lineTo(-0.5, 1.2);
  shape.closePath();

  const counter = new THREE.Path();
  counter.moveTo(0.04, 0.25);
  counter.lineTo(0.04, 0.75);
  counter.lineTo(0.34, 0.75);
  counter.bezierCurveTo(0.73, 0.75, 0.73, 0.25, 0.34, 0.25);
  counter.closePath();
  shape.holes.push(counter);
  return shape;
}

function createLetterR() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.5, -1.2);
  shape.lineTo(-0.05, -1.2);
  shape.lineTo(-0.05, -0.22);
  shape.lineTo(0.12, -0.22);
  shape.lineTo(0.72, -1.2);
  shape.lineTo(1.28, -1.2);
  shape.lineTo(0.62, -0.08);
  shape.bezierCurveTo(1.12, 0.22, 1.1, 1.2, 0.38, 1.2);
  shape.lineTo(-0.5, 1.2);
  shape.closePath();

  const counter = new THREE.Path();
  counter.moveTo(0.04, 0.25);
  counter.lineTo(0.04, 0.75);
  counter.lineTo(0.34, 0.75);
  counter.bezierCurveTo(0.73, 0.75, 0.73, 0.25, 0.34, 0.25);
  counter.closePath();
  shape.holes.push(counter);
  return shape;
}

function createRoomGrid() {
  const radius = 7.4;
  const roomHeight = 9.2;
  const meridianCount = 36;
  const ringCount = 7;
  const positions: number[] = [];
  const pointOnWall = (angle: number, height: number) => [
    radius * Math.sin(angle),
    height,
    -radius * Math.cos(angle),
  ];

  for (let meridian = 0; meridian < meridianCount; meridian += 1) {
    const angle = (meridian / meridianCount) * Math.PI * 2;
    for (let segment = 0; segment < ringCount; segment += 1) {
      const lower = -roomHeight / 2 + (segment / ringCount) * roomHeight;
      const upper = -roomHeight / 2 + ((segment + 1) / ringCount) * roomHeight;
      positions.push(...pointOnWall(angle, lower), ...pointOnWall(angle, upper));
    }
  }

  for (let ring = 1; ring < ringCount; ring += 1) {
    const height = -roomHeight / 2 + (ring / ringCount) * roomHeight;
    for (let segment = 0; segment < 128; segment += 1) {
      const start = (segment / 128) * Math.PI * 2;
      const end = ((segment + 1) / 128) * Math.PI * 2;
      positions.push(...pointOnWall(start, height), ...pointOnWall(end, height));
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

function createLedTextTexture(labels = ['PANAT RUANGSRI']) {
  const canvas = document.createElement('canvas');
  canvas.width = 36 * 30;
  canvas.height = 7 * 30;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#f6f8f5';
    context.font = '600 17px monospace';
    context.textBaseline = 'middle';
    const labelPitch = 240;
    for (let row = 0; row < 7; row += 1) {
      const label = `${labels[row % labels.length]}     `;
      const stagger = row % 2 === 0 ? 0 : labelPitch * 0.5;
      for (let x = -labelPitch; x < canvas.width + labelPitch; x += labelPitch) {
        context.fillText(label, x + stagger, row * 30 + 15);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

function createPanatTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (context) {
    context.font = '800 360px "Avenir Next", sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#ffffff';
    context.shadowColor = '#ffffff';
    context.shadowBlur = 28;
    context.fillText('PANAT', 1024, 272);
    context.shadowBlur = 0;
    context.fillText('PANAT', 1024, 272);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function getNextCardStop(progress: number, direction: number, stops: readonly number[]) {
  const tolerance = 0.025;
  return direction > 0
    ? stops.find((stop) => stop > progress + tolerance)
    : [...stops].reverse().find((stop) => stop < progress - tolerance);
}

function randomizeLedCells(cells: THREE.Vector2[]) {
  const selectedCells = new Set<number>();

  for (let slot = 0; slot < cells.length; slot += 1) {
    const column = Math.random() < 0.5
      ? 9 + Math.floor(Math.random() * 6)
      : 21 + Math.floor(Math.random() * 6);
    const row = Math.floor(Math.random() * 7);
    let index = row * 36 + column;
    while (selectedCells.has(index)) {
      const nextColumn = Math.random() < 0.5
        ? 9 + Math.floor(Math.random() * 6)
        : 21 + Math.floor(Math.random() * 6);
      index = Math.floor(Math.random() * 7) * 36 + nextColumn;
    }
    selectedCells.add(index);

    cells[slot].set(index % 36, Math.floor(index / 36));
  }
}

function createLedReflectionTexture(image?: CanvasImageSource) {
  const canvas = document.createElement('canvas');
  canvas.width = REFLECTION_WIDTH;
  canvas.height = REFLECTION_HEIGHT;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    if (image) {
      context.filter = 'blur(3px)';
      context.drawImage(image, -3, -3, canvas.width + 6, canvas.height + 6);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createCardTitleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1536;
  canvas.height = 768;
  const context = canvas.getContext('2d');
  if (context) {
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ffffff';
    context.font = '700 112px "Avenir Next", sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    ['SOFTWARE DEVELOPER', 'FOUNDER', 'SIDE JOBS', 'HOBBYS'].forEach((title, index) => {
      context.fillText(title, canvas.width / 2, index * 192 + 96, canvas.width * 0.92);
    });
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createLedScreenMaterial(textTexture: THREE.CanvasTexture, introTexture: THREE.CanvasTexture, reflections: THREE.CanvasTexture[], titleTexture: THREE.CanvasTexture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uFlickerTime: { value: 0 },
      uEffectTime: { value: 0 },
      uLedText: { value: textTexture },
      uIntroText: { value: introTexture },
      uSceneActive: { value: 0 },
      uCardReflectionBlend: { value: 0 },
      uCardReflectionPhase: { value: 0 },
      uCardReflection0: { value: reflections[0] },
      uCardReflection1: { value: reflections[1] },
      uCardReflection2: { value: reflections[2] },
      uCardReflection3: { value: reflections[3] },
      uCardTitles: { value: titleTexture },
      uCardTitleColors: { value: Array.from({ length: 4 }, () => new THREE.Vector3(1, 1, 1)) },
      uAccentCells: { value: Array.from({ length: 5 }, () => new THREE.Vector2()) },
    },
    vertexShader: `
      varying vec2 vScreenUv;
      void main() {
        vScreenUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform float uFlickerTime;
      uniform float uEffectTime;
      uniform sampler2D uLedText;
      uniform sampler2D uIntroText;
      uniform float uSceneActive;
      uniform float uCardReflectionBlend;
      uniform float uCardReflectionPhase;
      uniform sampler2D uCardReflection0;
      uniform sampler2D uCardReflection1;
      uniform sampler2D uCardReflection2;
      uniform sampler2D uCardReflection3;
      uniform sampler2D uCardTitles;
      uniform vec3 uCardTitleColors[4];
      uniform vec2 uAccentCells[5];
      varying vec2 vScreenUv;
      float diagonalTitle(float index, float line, vec2 wallUv) {
        vec2 wall = vec2((0.5 - wallUv.x) * 2.2 + 0.5, wallUv.y) - 0.5;
        vec2 direction = normalize(vec2(1.0, 0.36));
        vec2 perpendicular = vec2(-direction.y, direction.x);
        float vertical = (dot(wall, perpendicular) - mix(-0.24, 0.24, line)) / 0.3 + 0.5;
        float horizontal = fract(dot(wall, direction) * 0.9 + uEffectTime * 0.035 * mix(1.0, -1.0, line) + line * 0.5);
        float mask = step(0.0, vertical) * step(vertical, 1.0);
        return texture2D(uCardTitles, vec2(horizontal, (3.0 - index + clamp(vertical, 0.0, 1.0)) / 4.0)).r * mask;
      }
      vec3 reflectedCard(sampler2D image, float index, vec2 wallUv) {
        float phase = clamp(uCardReflectionPhase, 0.0, 3.0);
        float weight = max(0.0, 1.0 - abs(phase - index));
        vec2 imageUv = vec2((0.5 - wallUv.x) * 2.2 + 0.5 + (phase - index) * 0.06, wallUv.y);
        vec3 color = texture2D(image, clamp(imageUv, vec2(0.001), vec2(0.999))).rgb;
        vec3 tint = (texture2D(image, vec2(0.25, 0.25)).rgb + texture2D(image, vec2(0.75, 0.25)).rgb
          + texture2D(image, vec2(0.25, 0.75)).rgb + texture2D(image, vec2(0.75, 0.75)).rgb) * 0.25;
        color = mix(tint, color, 0.78);
        float luminance = dot(color, vec3(0.2126, 0.7152, 0.0722));
        return mix(vec3(luminance), color, 0.75) * weight;
      }
      vec3 backgroundColor(float index) {
        if (index < 0.5) return vec3(0.006, 0.007, 0.006);
        if (index < 1.5) return vec3(0.003, 0.01, 0.006);
        if (index < 2.5) return vec3(0.004, 0.006, 0.012);
        if (index < 3.5) return vec3(0.011, 0.004, 0.006);
        return vec3(0.003, 0.009, 0.01);
      }
      vec2 snakePath(float phase) {
        return vec2(
          18.0 + 8.0 * sin(phase * 0.83) + 2.0 * sin(phase * 1.91),
          3.5 + 2.6 * sin(phase * 0.64)
        );
      }
      void main() {
        vec2 ledGrid = vScreenUv * vec2(36.0 * 30.0, 7.0 * 30.0);
        vec2 ledPosition = fract(ledGrid) - 0.5;
        float led = 1.0 - smoothstep(0.28, 0.44, length(ledPosition));
        float row = floor(vScreenUv.y * 7.0);
        float direction = mod(row, 2.0) < 1.0 ? 1.0 : -1.0;
        float diagonalStagger = row * 0.075;
        float textScroll = direction * uTime + diagonalStagger;
        vec2 textUv = vec2(fract(1.0 - vScreenUv.x + textScroll), vScreenUv.y);
        float textPixel = mix(texture2D(uIntroText, textUv).r, texture2D(uLedText, textUv).r, uSceneActive);
        vec2 cellUv = fract(vScreenUv * vec2(36.0, 7.0));
        vec2 ledCell = floor(vScreenUv * vec2(36.0, 7.0));
        float cellInterior = step(0.035, cellUv.x) * step(cellUv.x, 0.965)
          * step(0.035, cellUv.y) * step(cellUv.y, 0.965);
        float backgroundStep = floor(uEffectTime / 5.0);
        float backgroundBlend = smoothstep(0.0, 0.8, mod(uEffectTime, 5.0));
        vec3 screenBase = mix(
          backgroundColor(mod(max(backgroundStep - 1.0, 0.0), 5.0)),
          backgroundColor(mod(backgroundStep, 5.0)),
          backgroundBlend
        );
        screenBase = mix(vec3(0.012, 0.012, 0.014), screenBase, uSceneActive);
        vec3 whiteText = vec3(1.35) * textPixel;
        float selectedCell = 0.0;
        for (int i = 0; i < 5; i++) {
          float accentCell = 1.0 - step(0.5, max(abs(ledCell.x - uAccentCells[i].x), abs(ledCell.y - uAccentCells[i].y)));
          selectedCell += accentCell;
        }
        selectedCell *= uSceneActive * (1.0 - uCardReflectionBlend);
        float flickerPhase = dot(ledCell, vec2(0.37, 0.61));
        float flicker = mod(floor(uFlickerTime * 4.0 + flickerPhase), 2.0);
        vec2 reflectionUv = (floor(ledGrid) + 0.5) / vec2(1080.0, 210.0);
        vec3 reflection = reflectedCard(uCardReflection0, 0.0, reflectionUv)
          + reflectedCard(uCardReflection1, 1.0, reflectionUv)
          + reflectedCard(uCardReflection2, 2.0, reflectionUv)
          + reflectedCard(uCardReflection3, 3.0, reflectionUv);
        screenBase = mix(screenBase, reflection * 0.085, uCardReflectionBlend);
        vec3 emission = whiteText * (1.0 - uCardReflectionBlend)
          + reflection * uCardReflectionBlend * 0.75;
        for (int title = 0; title < 4; title++) {
          float weight = max(0.0, 1.0 - abs(clamp(uCardReflectionPhase, 0.0, 3.0) - float(title)));
          float lettering = diagonalTitle(float(title), 0.0, reflectionUv) + diagonalTitle(float(title), 1.0, reflectionUv);
          emission += uCardTitleColors[title] * lettering * weight * uCardReflectionBlend * 1.3;
        }
        vec3 cellColor = mix(screenBase + emission * led, vec3(0.8) * flicker * led, selectedCell);
        vec2 screenPosition = (floor(ledGrid) + 0.5) / 30.0;
        float snakeMask = 0.0;
        if (uSceneActive > 0.001) {
        for (int snakeIndex = 0; snakeIndex < 2; snakeIndex++) {
          float phase = snakeIndex == 0 ? uEffectTime * 0.65 : uEffectTime * 0.57 + 4.2;
          vec2 previousPoint = snakePath(phase);
          for (int segment = 1; segment <= 28; segment++) {
            float trail = float(segment) / 28.0;
            vec2 nextPoint = snakePath(phase - trail * 2.5);
            vec2 segmentVector = nextPoint - previousPoint;
            float projection = clamp(dot(screenPosition - previousPoint, segmentVector)
              / max(dot(segmentVector, segmentVector), 0.0001), 0.0, 1.0);
            float distanceToSnake = length(screenPosition - previousPoint - segmentVector * projection);
            float thickness = mix(0.28, 0.055, trail);
            snakeMask = max(snakeMask, 1.0 - smoothstep(thickness, thickness + 0.035, distanceToSnake));
            previousPoint = nextPoint;
          }
        }
        }
        cellColor *= 1.0 - snakeMask * uSceneActive * (1.0 - uCardReflectionBlend);
        vec3 color = mix(vec3(0.0), cellColor, cellInterior);
        gl_FragColor = vec4(color, 1.0);
        #include <colorspace_fragment>
      }
    `,
    side: THREE.BackSide,
    depthTest: true,
    depthWrite: true,
    toneMapped: false,
  });
}

function createReflectionEnvironment(renderer: THREE.WebGLRenderer) {
  const environmentScene = new THREE.Scene();
  const room = new RoomEnvironment();
  environmentScene.add(room);

  const softboxes = [
    { color: 0xffffff, position: [-3.2, 1.5, 1.2], size: [4, 5.4] },
    { color: 0xffffff, position: [3.5, 0.5, -0.2], size: [3.8, 5] },
    { color: 0xffffff, position: [-0.9, -3.4, 1.5], size: [4.6, 1.8] },
    { color: 0xffffff, position: [0.3, 3.6, -1], size: [4.4, 1.4] },
  ];
  const panels = softboxes.map(({ color, position, size }) => {
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(size[0], size[1]),
      new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, toneMapped: false }),
    );
    panel.position.set(position[0], position[1], position[2]);
    panel.lookAt(0, 0, 0);
    environmentScene.add(panel);
    return panel;
  });

  const generator = new THREE.PMREMGenerator(renderer);
  const target = generator.fromScene(environmentScene, 0.04);
  panels.forEach((panel) => {
    panel.geometry.dispose();
    (panel.material as THREE.Material).dispose();
  });
  room.dispose();
  generator.dispose();
  return target;
}

export default function BrandScene() {
  const smoothScroll = useSmoothScroll();
  const hostRef = useRef<HTMLDivElement>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const sceneReadyRef = useRef(false);
  const loaderTimerRef = useRef(0);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const nativeTouchScrolling = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const loaderSafetyTimeout = window.setTimeout(() => {
      sceneReadyRef.current = true;
      setSceneReady(true);
    }, 5000);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      const fallbackFrame = window.requestAnimationFrame(() => {
        sceneReadyRef.current = true;
        window.clearTimeout(loaderSafetyTimeout);
        setWebglUnavailable(true);
        setSceneReady(true);
      });
      return () => {
        window.cancelAnimationFrame(fallbackFrame);
        window.clearTimeout(loaderSafetyTimeout);
      };
    }

    const scene = new THREE.Scene();
    RectAreaLightUniformsLib.init();
    const environmentTarget = createReflectionEnvironment(renderer);
    scene.environment = environmentTarget.texture;
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    camera.position.set(0, 0, 6.4);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    host.appendChild(renderer.domElement);
    const refractionTarget = new THREE.WebGLRenderTarget(1, 1, {
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
      stencilBuffer: false,
    });
    refractionTarget.texture.generateMipmaps = false;
    const refractionResolution = new THREE.Vector2(1, 1);
    const floatTargets = renderer.extensions.has('EXT_color_buffer_float');
    const sceneTarget = new THREE.WebGLRenderTarget(1, 1, {
      type: floatTargets ? THREE.HalfFloatType : THREE.UnsignedByteType,
      samples: nativeTouchScrolling ? 0 : Math.min(4, renderer.capabilities.maxSamples),
      depthBuffer: true,
    });
    const waveTargets = Array.from({ length: 2 }, () => new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
    }));
    const waveTexel = new THREE.Vector2(1, 1);
    const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const postScene = new THREE.Scene();
    const postVertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `;
    const waveMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uState: { value: null },
        uTexel: { value: waveTexel },
        uAspect: { value: 1 },
        uFrom: { value: new THREE.Vector2() },
        uTo: { value: new THREE.Vector2() },
        uForce: { value: 0 },
      },
      vertexShader: postVertexShader,
      fragmentShader: `
        uniform sampler2D uState;
        uniform vec2 uTexel;
        uniform float uAspect;
        uniform vec2 uFrom;
        uniform vec2 uTo;
        uniform float uForce;
        varying vec2 vUv;
        void main() {
          vec4 state = texture2D(uState, vUv);
          float average = (
            texture2D(uState, vUv - vec2(uTexel.x, 0.0)).r +
            texture2D(uState, vUv + vec2(uTexel.x, 0.0)).r +
            texture2D(uState, vUv - vec2(0.0, uTexel.y)).r +
            texture2D(uState, vUv + vec2(0.0, uTexel.y)).r
          ) * 0.25;
          state.g += (average - state.r) * 2.0;
          state.g *= 0.93;
          state.r += state.g;
          state.r *= 0.94;
          vec2 point = vUv * vec2(uAspect, 1.0);
          vec2 start = uFrom * vec2(uAspect, 1.0);
          vec2 segment = uTo * vec2(uAspect, 1.0) - start;
          float along = clamp(dot(point - start, segment) / max(dot(segment, segment), 1e-6), 0.0, 1.0);
          float drop = max(0.0, 1.0 - length(point - start - segment * along) / 0.035);
          state.r -= (0.5 - cos(drop * 3.14159265) * 0.5) * uForce;
          gl_FragColor = state;
        }
      `,
      depthTest: false,
      depthWrite: false,
    });
    const compositeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uScene: { value: sceneTarget.texture },
        uWave: { value: waveTargets[0].texture },
        uTexel: { value: waveTexel },
        uStrength: { value: floatTargets ? 0.9 : 0 },
      },
      vertexShader: postVertexShader,
      fragmentShader: `
        uniform sampler2D uScene;
        uniform sampler2D uWave;
        uniform vec2 uTexel;
        uniform float uStrength;
        varying vec2 vUv;
        void main() {
          vec2 slope = vec2(
            texture2D(uWave, vUv + vec2(uTexel.x, 0.0)).r - texture2D(uWave, vUv - vec2(uTexel.x, 0.0)).r,
            texture2D(uWave, vUv + vec2(0.0, uTexel.y)).r - texture2D(uWave, vUv - vec2(0.0, uTexel.y)).r
          ) * uStrength;
          vec4 color = texture2D(uScene, clamp(vUv - slope, vec2(0.001), vec2(0.999)));
          color.rgb *= 1.0 + (slope.y - slope.x) * 3.0;
          gl_FragColor = color;
          #include <colorspace_fragment>
        }
      `,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), compositeMaterial);
    postQuad.frustumCulled = false;
    postScene.add(postQuad);
    const cardScene = new THREE.Scene();
    const clearWaves = () => waveTargets.forEach((target) => {
      renderer.setRenderTarget(target);
      renderer.clear(true, false, false);
    });
    let waveIndex = 0;
    let waveAccumulator = 0;
    let waveForce = 0;
    let wavePointerActive = false;
    const stepWaves = (delta: number) => {
      if (!floatTargets) return;
      waveAccumulator = Math.min(waveAccumulator + delta, 0.05);
      postQuad.material = waveMaterial;
      while (waveAccumulator >= 1 / 60) {
        waveAccumulator -= 1 / 60;
        waveMaterial.uniforms.uState.value = waveTargets[waveIndex].texture;
        waveMaterial.uniforms.uForce.value = waveForce;
        waveIndex = 1 - waveIndex;
        renderer.setRenderTarget(waveTargets[waveIndex]);
        renderer.render(postScene, postCamera);
        waveForce = 0;
        waveMaterial.uniforms.uFrom.value.copy(waveMaterial.uniforms.uTo.value);
      }
      postQuad.material = compositeMaterial;
      compositeMaterial.uniforms.uWave.value = waveTargets[waveIndex].texture;
    };

    const roomGrid = new THREE.LineSegments(
      createRoomGrid(),
      new THREE.LineBasicMaterial({ color: 0x26352d, depthWrite: true, toneMapped: false }),
    );
    roomGrid.renderOrder = -1;
    scene.add(roomGrid);

    const ledTextTexture = createLedTextTexture();
    const ledIntroTexture = createLedTextTexture(['SOFTWARE DEVELOPER', 'FOUNDER', 'STUDENT', 'LEADER', 'FINANCE']);
    const ledReflectionTextures = Array.from({ length: 4 }, () => createLedReflectionTexture());
    const cardTitleTexture = createCardTitleTexture();
    const ledScreenMaterial = createLedScreenMaterial(ledTextTexture, ledIntroTexture, ledReflectionTextures, cardTitleTexture);
    const cardTitleColors = ledScreenMaterial.uniforms.uCardTitleColors.value as THREE.Vector3[];
    const ledAccentCells = ledScreenMaterial.uniforms.uAccentCells.value as THREE.Vector2[];
    randomizeLedCells(ledAccentCells);
    let nextLedColorChange = performance.now() + 3000;
    const ledScreen = new THREE.Mesh(
      new THREE.CylinderGeometry(7.48, 7.48, 9.2, 144, 28, true),
      ledScreenMaterial,
    );
    ledScreen.renderOrder = 0;
    scene.add(ledScreen);

    const panatTexture = createPanatTexture();
    const panatMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uWordmark: { value: panatTexture },
        uDissolve: ledScreenMaterial.uniforms.uSceneActive,
      },
      vertexShader: `
        varying vec2 vWordmarkUv;
        void main() {
          vWordmarkUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uWordmark;
        uniform float uDissolve;
        varying vec2 vWordmarkUv;
        void main() {
          vec2 blur = vec2(0.008, 0.032) * uDissolve;
          vec4 wordmark = texture2D(uWordmark, vWordmarkUv) * 0.4;
          wordmark += texture2D(uWordmark, vWordmarkUv + vec2(blur.x, 0.0)) * 0.15;
          wordmark += texture2D(uWordmark, vWordmarkUv - vec2(blur.x, 0.0)) * 0.15;
          wordmark += texture2D(uWordmark, vWordmarkUv + vec2(0.0, blur.y)) * 0.15;
          wordmark += texture2D(uWordmark, vWordmarkUv - vec2(0.0, blur.y)) * 0.15;
          gl_FragColor = vec4(vec3(1.0), wordmark.a * (1.0 - smoothstep(0.0, 1.0, uDissolve)));
          #include <colorspace_fragment>
        }
      `,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    });
    const panatWordmark = new THREE.Mesh(new THREE.PlaneGeometry(9.2, 2.3), panatMaterial);
    panatWordmark.position.set(0, 0, -1.3);
    scene.add(panatWordmark);

    const group = new THREE.Group();
    scene.add(group);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.13,
      transmission: 0,
      thickness: 1.45,
      ior: 1.46,
      envMapIntensity: 1.35,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
      iridescence: 0,
      attenuationColor: new THREE.Color(0xffffff),
      attenuationDistance: Infinity,
      side: THREE.DoubleSide,
    });
    glassMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.prBackgroundMap = { value: refractionTarget.texture };
      shader.uniforms.prRenderSize = { value: refractionResolution };
      shader.uniforms.prProjectionMatrix = { value: camera.projectionMatrix };
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          '#include <common>\nvarying vec3 vPrSurfacePosition;\nvarying vec3 vPrSurfaceNormal;',
        )
        .replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\nvPrSurfacePosition = position;\nvPrSurfaceNormal = normalize(objectNormal);',
        );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `#include <common>
        varying vec3 vPrSurfacePosition;
        varying vec3 vPrSurfaceNormal;
        uniform sampler2D prBackgroundMap;
        uniform vec2 prRenderSize;
        uniform mat4 prProjectionMatrix;
        vec3 prAcesToneMapping(vec3 color) {
          const mat3 inputMatrix = mat3(
            vec3(0.59719, 0.07600, 0.02840), vec3(0.35458, 0.90834, 0.13383), vec3(0.04823, 0.01566, 0.83777));
          const mat3 outputMatrix = mat3(
            vec3(1.60475, -0.10208, -0.00327), vec3(-0.53108, 1.10813, -0.07276), vec3(-0.07367, -0.00605, 1.07602));
          color = inputMatrix * (color * 1.15 / 0.6);
          color = (color * (color + 0.0245786) - 0.000090537) / (color * (0.983729 * color + 0.4329510) + 0.238081);
          return clamp(outputMatrix * color, 0.0, 1.0);
        }
        float prRoundBox(vec2 point, vec2 halfSize, float radius) {
          vec2 q = abs(point) - halfSize + radius;
          return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
        }
        float prStamp(vec2 surfacePoint) {
          const float prScale = 0.5;
          vec2 cell = vec2(0.44, 0.36) * prScale;
          vec2 tile = mod(surfacePoint + cell * 0.5, cell) - cell * 0.5;
          float pStem = prRoundBox(tile - vec2(-0.15, 0.0) * prScale, vec2(0.025, 0.125) * prScale, 0.008 * prScale);
          float pBowl = prRoundBox(tile - vec2(-0.09, 0.075) * prScale, vec2(0.082, 0.072) * prScale, 0.03 * prScale);
          float pCounter = prRoundBox(tile - vec2(-0.09, 0.075) * prScale, vec2(0.043, 0.035) * prScale, 0.016 * prScale);
          float letterP = min(pStem, max(pBowl, -pCounter));
          float rStem = prRoundBox(tile - vec2(0.035, 0.0) * prScale, vec2(0.025, 0.125) * prScale, 0.008 * prScale);
          float rBowl = prRoundBox(tile - vec2(0.08, 0.075) * prScale, vec2(0.078, 0.072) * prScale, 0.03 * prScale);
          float rCounter = prRoundBox(tile - vec2(0.08, 0.075) * prScale, vec2(0.04, 0.035) * prScale, 0.016 * prScale);
          vec2 legPoint = mat2(0.89, -0.45, 0.45, 0.89) * (tile - vec2(0.105, -0.045) * prScale);
          float rLeg = prRoundBox(legPoint, vec2(0.025, 0.11) * prScale, 0.008 * prScale);
          float letterR = min(min(rStem, max(rBowl, -rCounter)), rLeg);
          return min(letterP, letterR);
        }`,
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <normal_fragment_maps>',
        `#include <normal_fragment_maps>
        vec3 prViewDirection = normalize(vViewPosition);
        float prFacing = clamp(abs(dot(normalize(normal), normalize(prViewDirection))), 0.0, 1.0);
        vec3 prWeights = pow(abs(normalize(vPrSurfaceNormal)), vec3(5.0));
        prWeights /= max(prWeights.x + prWeights.y + prWeights.z, 0.0001);
        float prPatternX = prStamp(vPrSurfacePosition.yz);
        float prPatternY = prStamp(vPrSurfacePosition.xz);
        float prPatternZ = prStamp(vPrSurfacePosition.xy);
        float prPatternDistance = prPatternX * prWeights.x + prPatternY * prWeights.y + prPatternZ * prWeights.z;
        float prPatternAa = max(fwidth(prPatternDistance) * 0.85, 0.002);
        float prSurfaceMarks = 1.0 - smoothstep(-prPatternAa, prPatternAa, prPatternDistance);
        roughnessFactor = mix(roughnessFactor, 0.34, prSurfaceMarks * 0.88);`,
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <transmission_fragment>',
        `#include <transmission_fragment>
        vec2 prSurfaceWave = vec2(
          sin(vPrSurfacePosition.y * 2.4 + vPrSurfacePosition.x * 1.6),
          cos(vPrSurfacePosition.x * 2.1 - vPrSurfacePosition.y * 1.3)
        );
        vec3 prOpticalNormal = normalize(normal + vec3(prSurfaceWave * 0.12, 0.0));
        vec3 prIncidentDirection = refract(-prViewDirection, prOpticalNormal, 1.0 / 1.46);
        float prOpticalThickness = 1.5 + 2.0 * pow(1.0 - prFacing, 0.8);
        vec3 prSurfacePositionView = -vViewPosition;
        vec3 prExitPositionView = prSurfacePositionView + prIncidentDirection * prOpticalThickness;
        vec4 prExitClip = prProjectionMatrix * vec4(prExitPositionView, 1.0);
        vec2 prBaseUv = gl_FragCoord.xy / prRenderSize;
        vec2 prExitUv = prExitClip.xy / prExitClip.w * 0.5 + 0.5;
        vec2 prRefractionUv = clamp(mix(prBaseUv, prExitUv, 1.25), vec2(0.001), vec2(0.999));
        vec3 prTransmittedScene = texture2D(prBackgroundMap, prRefractionUv).rgb;
        totalDiffuse = mix(totalDiffuse, prTransmittedScene, 0.98);
        float prReflectionStrength = mix(0.065, 0.9, pow(1.0 - prFacing, 5.0));
        totalSpecular *= prReflectionStrength;
        #ifdef USE_CLEARCOAT
          clearcoatSpecularDirect *= prReflectionStrength;
          clearcoatSpecularIndirect *= prReflectionStrength;
        #endif`,
      );
      // The scene is rendered into an offscreen target, where three.js skips tone mapping.
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <tonemapping_fragment>',
        'gl_FragColor.rgb = prAcesToneMapping(gl_FragColor.rgb);',
      );
    };
    glassMaterial.customProgramCacheKey = () => 'panat-pr-clear-screen-space-refraction-v3';

    const monogram = new THREE.Group();
    monogram.scale.setScalar(0.78);
    group.add(monogram);
    const letterPShape = createLetterP();
    const letterRShape = createLetterR();
    const letterP = new THREE.Mesh(extrudeLetter(letterPShape), glassMaterial);
    letterP.position.x = -1.42;
    monogram.add(letterP);
    const letterR = new THREE.Mesh(extrudeLetter(letterRShape), glassMaterial);
    letterR.position.x = 0.42;
    monogram.add(letterR);

    scene.add(new THREE.AmbientLight(0x858585, 0.18));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.75);
    keyLight.position.set(-2, 3, 4);
    scene.add(keyLight);
    const acidLight = new THREE.PointLight(0xffffff, 1.2, 9);
    acidLight.position.set(-2.8, -1.2, 2.2);
    scene.add(acidLight);
    const cyanLight = new THREE.PointLight(0xffffff, 1.5, 10);
    cyanLight.position.set(2.8, 1.8, 1.4);
    scene.add(cyanLight);
    const blueLight = new THREE.PointLight(0xffffff, 0.7, 8);
    blueLight.position.set(-1.2, 3, -1.5);
    scene.add(blueLight);
    const mintSoftbox = new THREE.RectAreaLight(0xffffff, 1.1, 3.4, 5.2);
    mintSoftbox.position.set(-3.4, 1.8, 2.8);
    mintSoftbox.lookAt(0, 0, 0);
    scene.add(mintSoftbox);
    const blueSoftbox = new THREE.RectAreaLight(0xffffff, 0.8, 3.1, 4.6);
    blueSoftbox.position.set(3.2, 0.8, 2.4);
    blueSoftbox.lookAt(0, 0, 0);
    scene.add(blueSoftbox);
    const limeSoftbox = new THREE.RectAreaLight(0xffffff, 0.5, 4.4, 1.2);
    limeSoftbox.position.set(0, -3.4, 2.2);
    limeSoftbox.lookAt(0, 0, 0);
    scene.add(limeSoftbox);
    const readTextPixels = (texture: THREE.CanvasTexture) => {
      const canvas = texture.image as HTMLCanvasElement;
      return canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height).data;
    };
    const namePixels = readTextPixels(ledTextTexture);
    const introPixels = readTextPixels(ledIntroTexture);
    const titlePixels = readTextPixels(cardTitleTexture);
    const reflectionPixels = ledReflectionTextures.map(readTextPixels);
    const linearChannels = Float32Array.from({ length: 256 }, (_, value) => {
      const channel = value / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    const snakePaths = Array.from({ length: 2 }, () => Array.from({ length: 29 }, () => new THREE.Vector2()));
    const sampleColor = new THREE.Vector3();
    const textLights = Array.from({ length: 7 }, () => {
      const light = new THREE.RectAreaLight(0xffffff, 0, 1.3, 1.05);
      scene.add(light);
      return light;
    });
    const flickerLights = ledAccentCells.map(() => {
      const light = new THREE.RectAreaLight(0xffffff, 0, 1.15, 1.15);
      scene.add(light);
      return light;
    });
    const updateLedLighting = () => {
      const textTime = ledScreenMaterial.uniforms.uTime.value as number;
      const flickerTime = ledScreenMaterial.uniforms.uFlickerTime.value as number;
      const sceneBlend = ledScreenMaterial.uniforms.uSceneActive.value as number;
      const reflectionBlend = ledScreenMaterial.uniforms.uCardReflectionBlend.value as number;
      const reflectionPhase = ledScreenMaterial.uniforms.uCardReflectionPhase.value as number;
      const effectTime = ledScreenMaterial.uniforms.uEffectTime.value as number;
      if (sceneBlend > 0 && reflectionBlend < 1) {
        snakePaths.forEach((path, index) => {
          const head = index === 0 ? effectTime * 0.65 : effectTime * 0.57 + 4.2;
          path.forEach((point, segment) => {
            const phase = head - segment / 28 * 2.5;
            point.set(18 + 8 * Math.sin(phase * 0.83) + 2 * Math.sin(phase * 1.91), 3.5 + 2.6 * Math.sin(phase * 0.64));
          });
        });
      }
      const sampleEmission = (horizontal: number, vertical: number, row: number, direction: number) => {
        const textUv = THREE.MathUtils.euclideanModulo(1 - horizontal + direction * textTime + row * 0.075, 1);
        const pixel = (Math.min(209, Math.floor((1 - vertical) * 210)) * 1080 + Math.floor(textUv * 1080)) * 4;
        const text = (linearChannels[introPixels?.[pixel] ?? 0] * (1 - sceneBlend)
          + linearChannels[namePixels?.[pixel] ?? 0] * sceneBlend) * 1.35 * (1 - reflectionBlend);
        sampleColor.setScalar(text);
        if (reflectionBlend > 0) {
          reflectionPixels.forEach((pixels, index) => {
            const phase = THREE.MathUtils.clamp(reflectionPhase, 0, 3);
            const weight = Math.max(0, 1 - Math.abs(phase - index));
            const horizontalUv = (0.5 - horizontal) * 2.2 + 0.5 + (phase - index) * 0.06;
            const verticalUv = vertical;
            if (!pixels || weight === 0) return;
            const imagePixel = (THREE.MathUtils.clamp(Math.floor((1 - verticalUv) * REFLECTION_HEIGHT), 0, REFLECTION_HEIGHT - 1) * REFLECTION_WIDTH
              + THREE.MathUtils.clamp(Math.floor(horizontalUv * REFLECTION_WIDTH), 0, REFLECTION_WIDTH - 1)) * 4;
            const tintPixels = [0.25, 0.75].flatMap((vertical) => [0.25, 0.75].map((horizontal) =>
              (Math.floor((1 - vertical) * REFLECTION_HEIGHT) * REFLECTION_WIDTH + Math.floor(horizontal * REFLECTION_WIDTH)) * 4));
            const tint = (channel: number) => tintPixels.reduce((sum, pixelIndex) => sum + linearChannels[pixels[pixelIndex + channel]], 0) * 0.25;
            const red = linearChannels[pixels[imagePixel]] * 0.78 + tint(0) * 0.22;
            const green = linearChannels[pixels[imagePixel + 1]] * 0.78 + tint(1) * 0.22;
            const blue = linearChannels[pixels[imagePixel + 2]] * 0.78 + tint(2) * 0.22;
            const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
            const strength = weight * reflectionBlend * 0.75;
            sampleColor.x += (luminance * 0.25 + red * 0.75) * strength;
            sampleColor.y += (luminance * 0.25 + green * 0.75) * strength;
            sampleColor.z += (luminance * 0.25 + blue * 0.75) * strength;
            if (titlePixels) {
              const wallX = (0.5 - horizontal) * 2.2;
              const wallY = vertical - 0.5;
              const length = Math.hypot(1, 0.36);
              const along = (wallX + wallY * 0.36) / length;
              const across = (-wallX * 0.36 + wallY) / length;
              for (let line = 0; line < 2; line += 1) {
                const verticalTitle = (across - (line === 0 ? -0.24 : 0.24)) / 0.3 + 0.5;
                if (verticalTitle < 0 || verticalTitle > 1) continue;
                const horizontalTitle = THREE.MathUtils.euclideanModulo(along * 0.9 + effectTime * 0.035 * (line === 0 ? 1 : -1) + line * 0.5, 1);
                const titlePixel = (THREE.MathUtils.clamp(Math.floor((1 - (3 - index + verticalTitle) / 4) * 768), 0, 767) * 1536
                  + Math.floor(horizontalTitle * 1536)) * 4;
                const titleStrength = linearChannels[titlePixels[titlePixel]] * weight * reflectionBlend * 1.3;
                sampleColor.x += cardTitleColors[index].x * titleStrength;
                sampleColor.y += cardTitleColors[index].y * titleStrength;
                sampleColor.z += cardTitleColors[index].z * titleStrength;
              }
            }
          });
        }
        const column = Math.floor(horizontal * 36);
        const cellRow = Math.floor(vertical * 7);
        if (ledAccentCells.some((cell) => cell.x === column && cell.y === cellRow)) {
          const flash = THREE.MathUtils.euclideanModulo(Math.floor(flickerTime * 4 + column * 0.37 + cellRow * 0.61), 2);
          sampleColor.lerp(new THREE.Vector3().setScalar(flash * 0.8), sceneBlend * (1 - reflectionBlend));
        }
        if (sceneBlend > 0 && reflectionBlend < 1) {
          const horizontalPosition = (Math.floor(horizontal * 1080) + 0.5) / 30;
          const verticalPosition = (Math.floor(vertical * 210) + 0.5) / 30;
          let mask = 0;
          snakePaths.forEach((path) => {
            for (let segment = 1; segment < path.length; segment += 1) {
              const previous = path[segment - 1];
              const next = path[segment];
              const differenceX = next.x - previous.x;
              const differenceY = next.y - previous.y;
              const projection = THREE.MathUtils.clamp(((horizontalPosition - previous.x) * differenceX
                + (verticalPosition - previous.y) * differenceY) / Math.max(differenceX ** 2 + differenceY ** 2, 0.0001), 0, 1);
              const distance = Math.hypot(horizontalPosition - previous.x - differenceX * projection,
                verticalPosition - previous.y - differenceY * projection);
              const thickness = THREE.MathUtils.lerp(0.28, 0.055, segment / 28);
              mask = Math.max(mask, 1 - THREE.MathUtils.smoothstep(distance, thickness, thickness + 0.035));
            }
          });
          sampleColor.multiplyScalar(1 - mask * sceneBlend * (1 - reflectionBlend));
        }
        return sampleColor;
      };
      textLights.forEach((light, row) => {
        let brightness = 0;
        let weightedColumn = 0;
        let red = 0;
        let green = 0;
        let blue = 0;
        const direction = row % 2 === 0 ? 1 : -1;
        for (let column = 10; column < 26; column += 1) {
          let emission = 0;
          for (const offset of [-0.18, 0, 0.18]) {
            const horizontal = (column + 0.5) / 36;
            const vertical = (row + 0.5 + offset) / 7;
            const color = sampleEmission(horizontal, vertical, row, direction);
            red += color.x / 3;
            green += color.y / 3;
            blue += color.z / 3;
            emission += (color.x + color.y + color.z) / 9;
          }
          brightness += emission;
          weightedColumn += (column + 0.5) * emission;
        }
        const horizontal = brightness > 0.001 ? weightedColumn / brightness / 36 : 0.5;
        const angle = horizontal * Math.PI * 2;
        light.position.set(7.3 * Math.sin(angle), ((row + 0.5) / 7 - 0.5) * 9.2, 7.3 * Math.cos(angle));
        light.lookAt(0, 0, 0);
        const peak = Math.max(red, green, blue);
        if (peak > 0.001) light.color.setRGB(red / peak, green / peak, blue / peak);
        light.intensity = peak / 16 * 95;
      });
      flickerLights.forEach((light, index) => {
        const cell = ledAccentCells[index];
        const flash = THREE.MathUtils.euclideanModulo(Math.floor(flickerTime * 4 + cell.x * 0.37 + cell.y * 0.61), 2) * sceneBlend;
        const angle = (cell.x + 0.5) / 36 * Math.PI * 2;
        light.position.set(7.3 * Math.sin(angle), ((cell.y + 0.5) / 7 - 0.5) * 9.2, 7.3 * Math.cos(angle));
        light.lookAt(0, 0, 0);
        light.intensity = flash * (1 - reflectionBlend) * 18;
      });
    };

    const prEnvelope = new THREE.Box3().setFromObject(monogram).getBoundingSphere(new THREE.Sphere());
    const prRadius = (prEnvelope.radius + prEnvelope.center.length()) / monogram.scale.x;
    const cardAspect = 1672 / 941;
    const cardHeight = 4 / cardAspect;
    const cardGeometry = new THREE.PlaneGeometry(4, cardHeight, 64, 16);
    const cardPositions = cardGeometry.getAttribute('position');
    for (let vertex = 0; vertex < cardPositions.count; vertex += 1) {
      const horizontal = cardPositions.getX(vertex);
      cardPositions.setX(vertex, Math.sin(horizontal * 0.3) / 0.3);
      cardPositions.setZ(vertex, (Math.cos(horizontal * 0.3) - 1) / 0.3);
    }
    cardGeometry.computeVertexNormals();
    const cardMaterialParameters: THREE.ShaderMaterialParameters = {
      uniforms: {
        uCardBackground: { value: refractionTarget.texture },
        uCardRenderSize: { value: refractionResolution },
        uCardAspect: { value: cardAspect },
        uCardSolid: { value: window.matchMedia('(prefers-reduced-transparency: reduce)').matches ? 1 : 0 },
      },
      vertexShader: `
        varying vec2 vCardUv;
        varying vec3 vCardNormal;
        varying vec3 vCardView;
        void main() {
          vCardUv = uv;
          vCardNormal = normalize(normalMatrix * normal);
          vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
          vCardView = -viewPosition.xyz;
          gl_Position = projectionMatrix * viewPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uCardBackground;
        uniform vec2 uCardRenderSize;
        uniform float uCardSolid;
        uniform float uCardAspect;
        uniform sampler2D uCardPhoto;
        uniform float uCardPhotoReady;
        varying vec2 vCardUv;
        varying vec3 vCardNormal;
        varying vec3 vCardView;
        void main() {
          vec2 point = (vCardUv - 0.5) * vec2(uCardAspect, 1.0);
          vec2 rounded = abs(point) - vec2(uCardAspect * 0.5 - 0.022, 0.5 - 0.022);
          float distanceToEdge = length(max(rounded, 0.0)) + min(max(rounded.x, rounded.y), 0.0) - 0.022;
          float antialias = max(fwidth(distanceToEdge), 0.0005);
          float surface = 1.0 - smoothstep(-antialias, antialias, distanceToEdge);
          if (surface < 0.001) discard;
          float rim = 1.0 - smoothstep(0.003, 0.009, abs(distanceToEdge));
          vec3 normalDirection = normalize(vCardNormal);
          float fresnel = pow(1.0 - abs(dot(normalDirection, normalize(vCardView))), 3.0);
          vec2 screenUv = clamp(gl_FragCoord.xy / uCardRenderSize + normalDirection.xy * 0.015, vec2(0.001), vec2(0.999));
          vec3 background = texture2D(uCardBackground, screenUv).rgb;
          vec3 glass = background * 0.45 + vec3(0.08 + rim * 0.62 + fresnel * 0.18);
          float opacity = 0.18 + rim * 0.6 + fresnel * 0.18;
          vec3 photo = texture2D(uCardPhoto, vCardUv).rgb;
          vec3 imageGlass = photo * 0.95 + vec3(rim * 0.3 + fresnel * 0.08);
          vec3 color = mix(mix(glass, vec3(0.08), uCardSolid), imageGlass, uCardPhotoReady);
          float imageOpacity = mix(opacity, 1.0, uCardPhotoReady);
          gl_FragColor = vec4(color, surface * mix(imageOpacity, 1.0, uCardSolid));
          #include <colorspace_fragment>
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    };
    const cardGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();
    const cardTextures: THREE.Texture[] = [];
    let sceneDisposed = false;
    const cards = ['/software-card.webp', '/founder-card.webp', '/sideJobs-card.webp', '/more-card.webp'].map((source, index) => {
      const material = new THREE.ShaderMaterial({
        ...cardMaterialParameters,
        uniforms: {
          ...cardMaterialParameters.uniforms,
          uCardPhoto: { value: null },
          uCardPhotoReady: { value: 0 },
        },
      });
      const texture = textureLoader.load(source, () => {
        if (sceneDisposed) {
          texture.dispose();
          return;
        }
        material.uniforms.uCardPhotoReady.value = 1;
        const reflection = createLedReflectionTexture(texture.image as HTMLImageElement);
        ledReflectionTextures[index].dispose();
        ledReflectionTextures[index] = reflection;
        reflectionPixels[index] = readTextPixels(reflection);
        const pixels = reflectionPixels[index];
        if (pixels) {
          let red = 0;
          let green = 0;
          let blue = 0;
          for (let pixel = 0; pixel < REFLECTION_WIDTH * Math.floor(REFLECTION_HEIGHT * 0.4) * 4; pixel += 4) {
            const channels = [linearChannels[pixels[pixel]], linearChannels[pixels[pixel + 1]], linearChannels[pixels[pixel + 2]]];
            const saturation = Math.max(...channels) - Math.min(...channels);
            red += channels[0] * saturation;
            green += channels[1] * saturation;
            blue += channels[2] * saturation;
          }
          const peak = Math.max(red, green, blue);
          if (peak > 0.001) cardTitleColors[index].set(0.25 + red / peak * 0.75, 0.25 + green / peak * 0.75, 0.25 + blue / peak * 0.75);
        }
        ledScreenMaterial.uniforms[`uCardReflection${index}`].value = reflection;
        renderWithRefraction();
      });
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      material.uniforms.uCardPhoto.value = texture;
      cardTextures.push(texture);
      const card = new THREE.Mesh(cardGeometry, material);
      cardGroup.add(card);
      return card;
    });
    cardGroup.visible = false;
    cardScene.add(cardGroup);

    const renderWithRefraction = () => {
      updateLedLighting();
      group.visible = false;
      renderer.setRenderTarget(refractionTarget);
      renderer.clear(true, true, true);
      renderer.render(scene, camera);
      group.visible = true;
      renderer.setRenderTarget(sceneTarget);
      renderer.clear(true, true, true);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.clear(true, true, true);
      renderer.render(postScene, postCamera);
      if (cardGroup.visible) {
        renderer.autoClear = false;
        renderer.render(cardScene, camera);
        renderer.autoClear = true;
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.position.z = width < 600 ? 7.8 : 6.4;
      const visibleWidth = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
      monogram.scale.setScalar(Math.min(0.78, visibleWidth * 0.9 / 4.12));
      panatWordmark.scale.setScalar(Math.min(1, visibleWidth * (camera.position.z + 1.3) / camera.position.z * 1.18 / 9.2));
      camera.updateProjectionMatrix();
      const pixelBudget = nativeTouchScrolling ? 1_800_000 : 4_000_000;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3, Math.sqrt(pixelBudget / (width * height))));
      renderer.setSize(width, height, false);
      renderer.getDrawingBufferSize(refractionResolution);
      refractionTarget.setSize(refractionResolution.x, refractionResolution.y);
      sceneTarget.setSize(refractionResolution.x, refractionResolution.y);
      const waveHeight = Math.max(1, Math.round(200 * height / width));
      waveTargets.forEach((target) => target.setSize(200, waveHeight));
      waveTexel.set(1 / 200, 1 / waveHeight);
      waveMaterial.uniforms.uAspect.value = width / height;
      clearWaves();
      updateCards();
      renderWithRefraction();
    });
    resizeObserver.observe(host);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const raycaster = new THREE.Raycaster();
    const pointerPosition = new THREE.Vector2();
    const previousPointer = new THREE.Vector2();
    const pendingDrag = new THREE.Vector2();
    const dragAxis = new THREE.Vector3();
    const rotationStep = new THREE.Quaternion();
    const manualRotation = new THREE.Quaternion();
    const initialRotation = new THREE.Quaternion();
    const targetRotation = new THREE.Quaternion();
    const cardEntryRotation = new THREE.Quaternion();
    const topReturnRotation = new THREE.Quaternion();
    const heroOffsetRotation = new THREE.Quaternion();
    const handoffRotation = new THREE.Quaternion();
    const scrollRotation = new THREE.Euler(0, 0, 0, 'YXZ');
    let scrollProgress = 0;
    let sceneBlendTarget = 0;
    let idleRotation = 0;
    let cardEntryProgress = 1.5;
    let returningToTop = false;
    let inCardSection = false;
    let dragPointerId: number | null = null;
    let captureElement: Element | null = null;
    let modelActive = false;
    const applyDrag = (maxAngle: number) => {
      const distance = pendingDrag.length();
      if (distance < 0.00001) return;
      const angle = Math.min(distance, maxAngle);
      dragAxis.set(pendingDrag.y, pendingDrag.x, 0).normalize().applyQuaternion(camera.quaternion);
      rotationStep.setFromAxisAngle(dragAxis, angle);
      manualRotation.premultiply(rotationStep);
      pendingDrag.multiplyScalar(1 - angle / distance);
    };
    const setHeroRotation = (progress: number) => {
      const handoff = THREE.MathUtils.clamp((progress - 1.1) / 0.4, 0, 1);
      const pitchProgress = THREE.MathUtils.lerp(Math.min(progress, 1.1) + 0.4 * (handoff - handoff ** 3 + handoff ** 4 * 0.5),
        0.3, THREE.MathUtils.smoothstep(progress, 5.9, 6.5));
      scrollRotation.set(-pitchProgress * 0.8 + idleRotation * 0.35, -progress * 1.4 + idleRotation, 0);
      targetRotation.setFromEuler(scrollRotation).multiply(manualRotation);
    };
    const updateModelRotation = (blend: number) => {
      if (scrollProgress === 0) {
        targetRotation.copy(initialRotation);
        group.quaternion.copy(initialRotation);
        return;
      }
      if (returningToTop) {
        targetRotation.copy(initialRotation).slerp(topReturnRotation,
          THREE.MathUtils.smoothstep(scrollProgress, 0, transitionEnd));
        group.quaternion.copy(targetRotation);
        return;
      }
      if (!inCardSection) {
        setHeroRotation(scrollProgress);
        targetRotation.multiply(heroOffsetRotation);
        // Turn the monogram towards the camera while it grows into the screen.
        if (outroGrow > 0) targetRotation.slerp(initialRotation, THREE.MathUtils.smoothstep(outroGrow, 0, 0.7));
      } else {
        targetRotation.copy(cardEntryRotation);
        scrollRotation.set(0, -(scrollProgress - cardEntryProgress) * 1.4, 0);
        rotationStep.setFromEuler(scrollRotation);
        targetRotation.premultiply(rotationStep);
      }
      group.quaternion.slerp(targetRotation, blend);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      if (!modelActive || inCardSection || event.button !== 0 || dragPointerId !== null) return;
      if (event.target instanceof Element && event.target.closest('a, button, input, select, textarea')) return;
      const bounds = host.getBoundingClientRect();
      pointerPosition.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
      group.updateWorldMatrix(true, true);
      raycaster.setFromCamera(pointerPosition, camera);
      if (raycaster.intersectObjects([letterP, letterR]).length === 0) return;
      dragPointerId = event.pointerId;
      previousPointer.set(event.clientX, event.clientY);
      pendingDrag.set(0, 0);
      captureElement = event.target instanceof Element ? event.target : null;
      captureElement?.setPointerCapture(event.pointerId);
      event.preventDefault();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!modelActive || event.pointerId !== dragPointerId) return;
      pendingDrag.x += (event.clientX - previousPointer.x) * 0.002;
      pendingDrag.y += (event.clientY - previousPointer.y) * 0.002;
      previousPointer.set(event.clientX, event.clientY);
      event.preventDefault();
      if (reduceMotion) {
        applyDrag(0.015);
        updateModelRotation(1);
        renderWithRefraction();
      }
    };
    const endDrag = () => {
      if (dragPointerId !== null && captureElement?.hasPointerCapture(dragPointerId)) {
        captureElement.releasePointerCapture(dragPointerId);
      }
      dragPointerId = null;
      captureElement = null;
      pendingDrag.set(0, 0);
    };
    const onPointerUp = (event: PointerEvent) => {
      if (event.pointerId === dragPointerId) endDrag();
    };
    const heroContainer = host.closest('.home');
    const transitionEnd = 0.2;
    const cardStops = [1.5, 2.2, 3.2, 4.2, 5.2, 6.2, 7.8];
    const outroGrowStart = 6.6;
    const outroGrowEnd = 7.6;
    let outroGrow = 0;
    const snapRanges = [[0, transitionEnd], ...cardStops.slice(0, -1).map((start, index) => [start, cardStops[index + 1]])];
    const cardActions = Array.from(host.closest('.hero')?.querySelectorAll<HTMLElement>('.hero-card-action') ?? []);
    const actionPosition = new THREE.Vector3();
    const updateCards = () => {
      const firstEntry = THREE.MathUtils.smoothstep(scrollProgress, 1.5, 2.2);
      const exit = THREE.MathUtils.smoothstep(scrollProgress, 5.2, 6.2);
      const cardPhase = THREE.MathUtils.smoothstep(scrollProgress, 2.2, 3.2)
        + THREE.MathUtils.smoothstep(scrollProgress, 3.2, 4.2)
        + THREE.MathUtils.smoothstep(scrollProgress, 4.2, 5.2)
        + exit * 1.4;
      ledScreenMaterial.uniforms.uCardReflectionBlend.value = firstEntry * (1 - THREE.MathUtils.smoothstep(scrollProgress, 5.5, 6.2));
      ledScreenMaterial.uniforms.uCardReflectionPhase.value = Math.min(cardPhase, 3) + firstEntry - 1;
      const fieldOfView = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const prFrontLimit = prRadius * monogram.scale.x + 0.12;
      const frontDepth = prFrontLimit + 0.65;
      const visibleHeight = 2 * (camera.position.z - frontDepth) * fieldOfView;
      const visibleWidth = visibleHeight * camera.aspect;
      const cardWidth = Math.min(visibleWidth * 0.86, visibleHeight * 1.04, 4.8);
      const scale = cardWidth / 4;
      const radius = Math.max(visibleWidth * 0.58, cardWidth * 0.9);
      const spacing = window.innerWidth < 600 ? 1.6 : Math.min(1.5, (cardWidth * 1.5) / radius);
      cardGroup.visible = scrollProgress > 1.5 && exit < 1;
      let visibleCardFound = false;
      cards.forEach((card, index) => {
        const angle = 1.5 * (1 - firstEntry) + spacing * (index - cardPhase);
        card.visible = Math.abs(angle) < 1.85;
        card.scale.setScalar(scale);
        card.position.set(radius * Math.sin(angle), visibleHeight * 0.15 * Math.sin(angle),
          frontDepth - radius * 0.65 * (1 - Math.cos(angle)));
        card.rotation.set(0, angle * 0.55, -angle * 0.06);
        const orientation = new THREE.Matrix4().makeRotationFromEuler(card.rotation);
        const point = new THREE.Vector3();
        let minimumDepth = 0;
        for (let vertex = 0; vertex < cardPositions.count; vertex += 1) {
          point.fromBufferAttribute(cardPositions, vertex).multiplyScalar(scale).applyMatrix4(orientation);
          minimumDepth = Math.min(minimumDepth, point.z);
        }
        card.position.z = Math.max(card.position.z, prFrontLimit - minimumDepth);
        card.updateWorldMatrix(true, false);
        if (cardGroup.visible && card.visible) {
          let left = Infinity;
          let right = -Infinity;
          let top = Infinity;
          let bottom = -Infinity;
          for (let vertex = 0; vertex < cardPositions.count; vertex += 1) {
            point.fromBufferAttribute(cardPositions, vertex).applyMatrix4(card.matrixWorld).project(camera);
            left = Math.min(left, point.x);
            right = Math.max(right, point.x);
            top = Math.min(top, point.y);
            bottom = Math.max(bottom, point.y);
          }
          visibleCardFound ||= Math.min(right, 1) - Math.max(left, -1) > 0.08
            && Math.min(bottom, 1) - Math.max(top, -1) > 0.08;
        }
        const action = cardActions[index];
        if (action) {
          actionPosition.set(0, -cardHeight / 2 - 0.16, 0).applyMatrix4(card.matrixWorld).project(camera);
          const horizontal = (actionPosition.x * 0.5 + 0.5) * host.clientWidth;
          const vertical = (-actionPosition.y * 0.5 + 0.5) * host.clientHeight;
          action.hidden = !cardGroup.visible || !card.visible || actionPosition.z < -1 || actionPosition.z > 1
            || horizontal < 80 || horizontal > host.clientWidth - 80 || vertical < 0 || vertical > host.clientHeight - 50;
          action.style.left = `${horizontal}px`;
          action.style.top = `${vertical}px`;
        }
      });
      const wasInCardSection = inCardSection;
      inCardSection = visibleCardFound;
      if (!wasInCardSection && inCardSection) {
        cardEntryRotation.copy(group.quaternion);
        cardEntryProgress = scrollProgress;
        endDrag();
      }
      if (wasInCardSection && !inCardSection) {
        handoffRotation.copy(group.quaternion);
        setHeroRotation(scrollProgress);
        heroOffsetRotation.copy(targetRotation).invert().multiply(handoffRotation);
      }
    };
    let lastScrollChange = performance.now();
    let lastScrollInput = performance.now();
    let snapTarget: number | null = null;
    let snapStartPosition = 0;
    let snapStartedAt = 0;
    let snapStartTangent = 0;
    let scrollDirection = 0;
    let scrollVelocity = 0;
    let previousTouchY = 0;
    let cardGestureTarget: number | null = null;
    let gestureLastInput = -Infinity;
    let gestureDirection = 0;
    let gestureDistance = 0;
    let gestureReady = true;
    let gestureMagnitude = 0;
    let queuedDirection = 0;
    let stepStartedAt = -Infinity;
    let touchFresh = false;
    let touchActive = false;
    let gestureTouchY = 0;
    let pointerHeld = false;
    let stepDuration = 650;
    let pendingDetailSlug: string | null = null;
    let wakeRenderFrame = () => {};
    const cardSlugs = ['software-developer', 'founder', 'side-jobs', 'hobbys'];
    const scrollImmediately = (top: number) => {
      if (smoothScroll?.current) smoothScroll.current.scrollTo(top, { immediate: true });
      else window.scrollTo({ top, behavior: 'instant' });
    };
    const startCardStep = (direction: number, time: number) => {
      const containerTop = window.scrollY + (heroContainer?.getBoundingClientRect().top ?? 0);
      const current = Math.max(0, (window.scrollY - containerTop) / window.innerHeight);
      const destination = direction > 0 && current < cardStops[0]
        ? cardStops[1] : getNextCardStop(current, direction, cardStops);
      if (destination === undefined) return false;
      scrollImmediately(window.scrollY);
      snapTarget = containerTop + destination * window.innerHeight;
      cardGestureTarget = destination;
      stepDuration = Math.max(destination, current) > 6.25 ? 1500 : 650;
      snapStartPosition = window.scrollY;
      snapStartTangent = 0;
      snapStartedAt = time;
      stepStartedAt = time;
      gestureReady = false;
      return true;
    };
    const consumeCardGesture = (movement: number, time: number, source: 'wheel' | 'touch' | 'key' = 'wheel') => {
      if (nativeTouchScrolling) return false;
      const containerTop = window.scrollY + (heroContainer?.getBoundingClientRect().top ?? 0);
      const current = Math.max(0, (window.scrollY - containerTop) / window.innerHeight);
      if (cardGestureTarget === null && current < 1.45
        && (movement <= 0 || current + movement * 0.4 / window.innerHeight < cardStops[0])) return false;
      if (current > cardStops[cardStops.length - 1] + 0.01) {
        cardGestureTarget = null;
        queuedDirection = 0;
        gestureReady = true;
        gestureDistance = 0;
        return false;
      }
      const direction = Math.sign(movement);
      if (direction === 0) return true;
      const magnitude = Math.abs(movement);
      // Trackpad inertia decays steadily; a new swipe shows up as a gap, reversal or sudden acceleration.
      const newImpulse = source === 'key'
        || (source === 'touch' ? touchFresh : time - gestureLastInput > 140 || magnitude > gestureMagnitude * 1.6 + 4)
        || direction !== gestureDirection;
      gestureMagnitude = magnitude;
      gestureLastInput = time;
      lastScrollInput = time;
      if (snapTarget !== null) {
        if (newImpulse && time - stepStartedAt > 180) {
          queuedDirection = direction;
          touchFresh = false;
        }
        return true;
      }
      if (!gestureReady && newImpulse) {
        gestureReady = true;
        gestureDistance = 0;
      }
      if (!gestureReady) return true;
      if (gestureDirection !== direction) gestureDistance = 0;
      gestureDirection = direction;
      gestureDistance += magnitude;
      if (gestureDistance >= 18) {
        touchFresh = false;
        if (!startCardStep(direction, time)) return false;
      }
      return true;
    };
    const onCardWheel = (event: WheelEvent) => {
      if (document.documentElement.classList.contains('details-open')) return;
      resetModelAtTop();
      if (event.ctrlKey || event.deltaY === 0) return;
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [data-lenis-prevent]')) return;
      const movement = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
      if (consumeCardGesture(movement, performance.now())) {
        if (event.cancelable) event.preventDefault();
        event.stopImmediatePropagation();
      } else {
        cancelScrollSnap(event);
      }
    };
    const cancelScrollSnap = (event?: Event) => {
      if (event instanceof WheelEvent && event.deltaY !== 0) scrollDirection = Math.sign(event.deltaY);
      if (snapTarget !== null) scrollImmediately(window.scrollY);
      snapTarget = null;
      lastScrollChange = performance.now();
      lastScrollInput = lastScrollChange;
    };
    const onSnapPointerDown = (event: PointerEvent) => {
      resetModelAtTop();
      pointerHeld = true;
      previousTouchY = event.clientY;
      if (event.target instanceof Element && event.target.closest('a[href^="#"]')) {
        cardGestureTarget = null;
        gestureReady = true;
        gestureDistance = 0;
        scrollDirection = -1;
      }
      if (cardGestureTarget === null) cancelScrollSnap();
    };
    const onSnapPointerMove = (event: PointerEvent) => {
      if (!pointerHeld || event.pointerType !== 'touch') return;
      const movement = previousTouchY - event.clientY;
      if (cardGestureTarget === null && Math.abs(movement) > 1) {
        scrollDirection = Math.sign(movement);
        lastScrollInput = performance.now();
      }
      previousTouchY = event.clientY;
    };
    const onSnapPointerUp = () => {
      pointerHeld = false;
      lastScrollChange = performance.now();
      lastScrollInput = lastScrollChange;
    };
    const onSnapKeyDown = (event: KeyboardEvent) => {
      if (document.documentElement.classList.contains('details-open')) return;
      resetModelAtTop();
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target instanceof Element && event.target.closest('a, button, input, textarea, select, [contenteditable="true"]')) return;
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) {
        scrollDirection = ['ArrowUp', 'PageUp', 'Home'].includes(event.key) || (event.key === ' ' && event.shiftKey) ? -1 : 1;
        if (event.key !== 'Home' && event.key !== 'End' && consumeCardGesture(scrollDirection * 40, performance.now(), 'key')) {
          event.preventDefault();
          event.stopImmediatePropagation();
          return;
        }
        if (event.key === 'Home' || event.key === 'End') cardGestureTarget = null;
        cancelScrollSnap();
      }
    };
    const onCardTouchStart = (event: TouchEvent) => {
      resetModelAtTop();
      if (event.touches.length !== 1) return;
      touchActive = true;
      touchFresh = true;
      gestureTouchY = event.touches[0].clientY;
    };
    const onCardTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1 || document.documentElement.classList.contains('details-open')) return;
      const movement = gestureTouchY - event.touches[0].clientY;
      gestureTouchY = event.touches[0].clientY;
      if (consumeCardGesture(movement, performance.now(), 'touch')) {
        if (event.cancelable) event.preventDefault();
        event.stopImmediatePropagation();
      }
    };
    const onCardTouchEnd = () => {
      touchActive = false;
      gestureLastInput = performance.now();
    };
    const onNavigateDetail = (event: Event) => {
      const request = event as CustomEvent<{ slug: string }>;
      const cardIndex = cardSlugs.indexOf(request.detail.slug);
      if (cardIndex < 0) return;
      request.preventDefault();
      const containerTop = window.scrollY + (heroContainer?.getBoundingClientRect().top ?? 0);
      const current = Math.max(0, (window.scrollY - containerTop) / window.innerHeight);
      const destination = 2.2 + cardIndex;
      const now = performance.now();
      scrollImmediately(window.scrollY);
      snapTarget = containerTop + destination * window.innerHeight;
      snapStartPosition = window.scrollY;
      snapStartTangent = 0;
      snapStartedAt = now;
      stepDuration = Math.max(650, Math.min(1100, Math.abs(destination - current) * 220));
      cardGestureTarget = destination;
      gestureLastInput = now;
      queuedDirection = 0;
      pendingDetailSlug = request.detail.slug;
      wakeRenderFrame();
    };
    function resetModelAtTop() {
      const distance = Math.max(0, -(heroContainer?.getBoundingClientRect().top ?? 0));
      if (distance > 1) return;
      const needsRender = modelActive || scrollProgress !== 0 || !group.quaternion.equals(initialRotation);
      endDrag();
      scrollProgress = 0;
      modelActive = false;
      inCardSection = false;
      sceneBlendTarget = 0;
      idleRotation = 0;
      pendingDrag.set(0, 0);
      cardGestureTarget = null;
      gestureReady = true;
      gestureDistance = 0;
      queuedDirection = 0;
      scrollDirection = 0;
      scrollVelocity = 0;
      snapTarget = null;
      snapStartTangent = 0;
      returningToTop = false;
      cardEntryProgress = 1.5;
      for (const rotation of [manualRotation, cardEntryRotation, topReturnRotation, heroOffsetRotation,
        handoffRotation, rotationStep, targetRotation, group.quaternion]) {
        rotation.copy(initialRotation);
      }
      scrollRotation.set(0, 0, 0);
      outroGrow = 0;
      group.scale.setScalar(1);
      ledScreenMaterial.uniforms.uSceneActive.value = 0;
      updateCards();
      if (needsRender) renderWithRefraction();
    }
    const updateModelActivation = () => {
      const scrollDistance = Math.max(0, -(heroContainer?.getBoundingClientRect().top ?? 0));
      const nextProgress = scrollDistance <= 1 ? 0 : scrollDistance / window.innerHeight;
      if (nextProgress === 0) {
        resetModelAtTop();
        return;
      }
      if (nextProgress === scrollProgress) return;
      scrollVelocity = (nextProgress - scrollProgress) * window.innerHeight
        / Math.max((performance.now() - lastScrollChange) / 1000, 0.016);
      if (snapTarget === null && (scrollDirection === 0 || pointerHeld || performance.now() - lastScrollInput > 120)) {
        scrollDirection = Math.sign(nextProgress - scrollProgress);
      }
      lastScrollChange = performance.now();
      if (nextProgress < scrollProgress && nextProgress < transitionEnd) {
        if (!returningToTop) topReturnRotation.copy(group.quaternion);
        returningToTop = true;
      } else if (nextProgress > scrollProgress || nextProgress >= transitionEnd) {
        returningToTop = false;
      }
      scrollProgress = nextProgress;
      updateCards();
      outroGrow = THREE.MathUtils.smoothstep(scrollProgress, outroGrowStart, outroGrowEnd);
      group.scale.setScalar(1 + outroGrow ** 3 * 14);
      sceneBlendTarget = THREE.MathUtils.smoothstep(scrollProgress, 0, transitionEnd);
      const nextActive = scrollProgress > 0;
      if (!nextActive && modelActive) endDrag();
      modelActive = nextActive;
      if (reduceMotion) {
        ledScreenMaterial.uniforms.uSceneActive.value = sceneBlendTarget;
        if (!modelActive) {
          manualRotation.copy(initialRotation);
          idleRotation = 0;
        }
        updateModelRotation(1);
        renderWithRefraction();
      }
    };
    updateModelActivation();
    updateCards();
    window.addEventListener('panat:scroll-top', resetModelAtTop);
    window.addEventListener('resize', updateModelActivation);
    window.addEventListener('resize', updateCards);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('blur', endDrag);
    window.addEventListener('wheel', onCardWheel, { passive: false, capture: true });
    window.addEventListener('pointerdown', onSnapPointerDown);
    window.addEventListener('pointermove', onSnapPointerMove, { passive: true });
    window.addEventListener('pointerup', onSnapPointerUp);
    window.addEventListener('pointercancel', onSnapPointerUp);
    window.addEventListener('keydown', onSnapKeyDown, { capture: true });
    if (!nativeTouchScrolling) {
      window.addEventListener('touchstart', onCardTouchStart, { passive: true, capture: true });
      window.addEventListener('touchmove', onCardTouchMove, { passive: false, capture: true });
      window.addEventListener('touchend', onCardTouchEnd, { passive: true, capture: true });
      window.addEventListener('touchcancel', onCardTouchEnd, { passive: true, capture: true });
    }
      window.addEventListener(PORTFOLIO_NAVIGATE_EVENT, onNavigateDetail);
    window.addEventListener('blur', onSnapPointerUp);
    window.addEventListener('resize', cancelScrollSnap);

    let frameId = 0;
    let visible = true;
    let previousTime = 0;
    const parallaxTarget = new THREE.Vector2();
    const parallax = new THREE.Vector2();
    const onParallaxMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      parallaxTarget.set(event.clientX / window.innerWidth * 2 - 1, event.clientY / window.innerHeight * 2 - 1);
      const bounds = host.getBoundingClientRect();
      const pointer = new THREE.Vector2((event.clientX - bounds.left) / bounds.width, 1 - (event.clientY - bounds.top) / bounds.height);
      const waveTo = waveMaterial.uniforms.uTo.value as THREE.Vector2;
      if (wavePointerActive) {
        const travel = Math.hypot((pointer.x - waveTo.x) * bounds.width / bounds.height, pointer.y - waveTo.y);
        waveForce = Math.min(waveForce + travel * 1.2, 0.06);
      } else {
        (waveMaterial.uniforms.uFrom.value as THREE.Vector2).copy(pointer);
        wavePointerActive = true;
      }
      waveTo.copy(pointer);
    };
    const onParallaxLeave = () => {
      parallaxTarget.set(0, 0);
      wavePointerActive = false;
    };
    window.addEventListener('pointermove', onParallaxMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onParallaxLeave);
    const effectStartedAt = performance.now();
    const renderFrame = (time: number) => {
      if (!visible || document.hidden) return;
      updateModelActivation();
      const scrollDistance = scrollProgress * window.innerHeight;
      const snapRange = nativeTouchScrolling ? undefined : snapRanges.find(([start, end]) =>
        scrollDistance > window.innerHeight * start + 1 && scrollDistance < window.innerHeight * end - 1);
      const containerTop = window.scrollY + (heroContainer?.getBoundingClientRect().top ?? 0);
      const intendedProgress = smoothScroll?.current?.isScrolling === 'smooth'
        ? (smoothScroll.current.targetScroll - containerTop) / window.innerHeight : scrollProgress;
      if (snapTarget !== null && Math.abs(window.scrollY - snapTarget) <= 1) snapTarget = null;
      const outroStop = cardStops[cardStops.length - 1];
      // Momentum scrolling up out of the quote hands over to the outro step instead of stalling mid-transition.
      if (snapTarget === null && cardGestureTarget === null && smoothScroll?.current?.isScrolling === 'smooth'
        && scrollProgress > outroGrowStart && scrollProgress <= outroStop + 0.02
        && intendedProgress < outroStop - 0.02 && intendedProgress < scrollProgress) {
        gestureLastInput = time;
        startCardStep(-1, time);
      }
      if (snapTarget === null && queuedDirection !== 0 && cardGestureTarget !== null) {
        const direction = queuedDirection;
        queuedDirection = 0;
        startCardStep(direction, time);
      }
      if (cardGestureTarget !== null && snapTarget === null && !touchActive && time - gestureLastInput > 160) {
        cardGestureTarget = null;
        gestureReady = true;
        gestureDistance = 0;
      }
      if (snapTarget === null && cardGestureTarget === null && !pointerHeld && time - lastScrollInput > 120
        && (time - lastScrollChange > 20 || time - lastScrollInput > 100)
        && !(smoothScroll?.current?.isScrolling === 'smooth' && scrollDirection < 0 && intendedProgress < cardStops[0])
        && snapRange && (snapRange[0] >= 1.5 || (intendedProgress >= snapRange[0] && intendedProgress <= snapRange[1]))) {
        const [start, end] = snapRange;
        const endpoint = start >= 1.5 && scrollDirection !== 0
          ? scrollDirection > 0 ? end : start
          : intendedProgress < (start + end) / 2 ? start : end;
        if (start >= 1.5) {
          gestureLastInput = time;
          startCardStep(endpoint > scrollProgress ? 1 : -1, time);
        } else {
          snapTarget = containerTop + window.innerHeight * endpoint;
          snapStartPosition = window.scrollY;
          const distance = snapTarget - snapStartPosition;
          const velocity = smoothScroll?.current?.isScrolling === 'smooth'
            ? smoothScroll.current.velocity * 60 : scrollVelocity;
          snapStartTangent = Math.sign(velocity) === Math.sign(distance)
            ? Math.sign(distance) * Math.min(Math.abs(velocity) * 0.36, Math.abs(distance) * 2) : 0;
          snapStartedAt = time;
        }
      }
      if (snapTarget !== null) {
        const progress = reduceMotion ? 1 : THREE.MathUtils.clamp((time - snapStartedAt) / (cardGestureTarget !== null ? stepDuration : 360), 0, 1);
        const eased = progress * progress * (3 - 2 * progress);
        const carry = snapStartTangent * progress * (1 - progress) ** 2;
        scrollImmediately(THREE.MathUtils.lerp(snapStartPosition, snapTarget, eased) + carry);
        updateModelActivation();
        if (progress === 1) {
          snapTarget = null;
          if (pendingDetailSlug !== null) {
            const slug = pendingDetailSlug;
            pendingDetailSlug = null;
            window.dispatchEvent(new CustomEvent(PORTFOLIO_DETAIL_EVENT, { detail: slug }));
          }
        }
      }
      if (snapTarget === null && queuedDirection !== 0) {
        const direction = queuedDirection;
        queuedDirection = 0;
        if (cardGestureTarget !== null) startCardStep(direction, time);
      }
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      if (!reduceMotion) {
        if (time >= nextLedColorChange) {
          randomizeLedCells(ledAccentCells);
          nextLedColorChange = time + 3000;
        }
        ledScreenMaterial.uniforms.uTime.value = time * 0.00008;
        ledScreenMaterial.uniforms.uFlickerTime.value = time * 0.001;
        ledScreenMaterial.uniforms.uEffectTime.value = (time - effectStartedAt) * 0.001;
        const smoothing = 1 - Math.exp(-delta * 12);
        const sceneBlend = ledScreenMaterial.uniforms.uSceneActive;
        sceneBlend.value = THREE.MathUtils.lerp(sceneBlend.value, sceneBlendTarget, smoothing);
        if (Math.abs(sceneBlend.value - sceneBlendTarget) < 0.0001) sceneBlend.value = sceneBlendTarget;
        // Rotating the enclosing room shifts it like a distant backdrop; nearer layers translate less.
        parallax.lerp(parallaxTarget, 1 - Math.exp(-delta * 3));
        ledScreen.rotation.set(parallax.y * 0.019, parallax.x * 0.019, 0);
        roomGrid.rotation.copy(ledScreen.rotation);
        panatWordmark.position.set(-parallax.x * 0.07, parallax.y * 0.048, -1.3);
        group.position.set(-parallax.x * 0.028, parallax.y * 0.019, 0);
        if (modelActive) {
          if (!inCardSection && !returningToTop) {
            idleRotation -= delta * 0.32 * THREE.MathUtils.smoothstep(scrollProgress, 0, transitionEnd)
              * (scrollProgress > 6 ? 1 - outroGrow : Math.max(0.2, 1 - THREE.MathUtils.smoothstep(scrollProgress, 1.1, 1.5)));
          }
          applyDrag(delta * 0.35);
        } else {
          manualRotation.slerp(initialRotation, smoothing);
          idleRotation *= 1 - smoothing;
        }
        updateModelRotation(smoothing);
        stepWaves(delta);
      }
      // Past this point the quote page fully covers the scene, so skip the expensive full-screen glass render.
      if (!reduceMotion && scrollProgress < 7.72) renderWithRefraction();
      if (!sceneReadyRef.current) {
        sceneReadyRef.current = true;
        window.clearTimeout(loaderTimerRef.current);
        loaderTimerRef.current = window.setTimeout(() => setSceneReady(true), 500);
      }
      frameId = window.requestAnimationFrame(renderFrame);
    };
    wakeRenderFrame = () => {
      visible = true;
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(renderFrame);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting || pendingDetailSlug !== null;
      window.cancelAnimationFrame(frameId);
      if (!visible) window.clearTimeout(loaderTimerRef.current);
      if (visible) {
        if (reduceMotion) renderWithRefraction();
        frameId = window.requestAnimationFrame(renderFrame);
      }
    }, { threshold: 0.01 });
    observer.observe(host);
    const onVisibilityChange = () => {
      window.cancelAnimationFrame(frameId);
      if (!document.hidden && visible) frameId = window.requestAnimationFrame(renderFrame);
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    frameId = window.requestAnimationFrame(renderFrame);

    return () => {
      sceneDisposed = true;
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(loaderTimerRef.current);
      window.clearTimeout(loaderSafetyTimeout);
      endDrag();
      window.removeEventListener('panat:scroll-top', resetModelAtTop);
      window.removeEventListener('resize', updateModelActivation);
      window.removeEventListener('resize', updateCards);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointermove', onParallaxMove);
      document.documentElement.removeEventListener('mouseleave', onParallaxLeave);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('blur', endDrag);
      window.removeEventListener('wheel', onCardWheel, { capture: true });
      window.removeEventListener('pointerdown', onSnapPointerDown);
      window.removeEventListener('pointermove', onSnapPointerMove);
      window.removeEventListener('pointerup', onSnapPointerUp);
      window.removeEventListener('pointercancel', onSnapPointerUp);
      window.removeEventListener('keydown', onSnapKeyDown, { capture: true });
      window.removeEventListener('touchstart', onCardTouchStart, { capture: true });
      window.removeEventListener('touchmove', onCardTouchMove, { capture: true });
      window.removeEventListener('touchend', onCardTouchEnd, { capture: true });
      window.removeEventListener('touchcancel', onCardTouchEnd, { capture: true });
      window.removeEventListener(PORTFOLIO_NAVIGATE_EVENT, onNavigateDetail);
      window.removeEventListener('blur', onSnapPointerUp);
      window.removeEventListener('resize', cancelScrollSnap);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      observer.disconnect();
      resizeObserver.disconnect();
      [scene, cardScene].forEach((root) => root.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points || object instanceof THREE.LineSegments) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      }));
      postQuad.geometry.dispose();
      waveMaterial.dispose();
      compositeMaterial.dispose();
      sceneTarget.dispose();
      waveTargets.forEach((target) => target.dispose());
      renderer.dispose();
      ledTextTexture.dispose();
      ledIntroTexture.dispose();
      ledReflectionTextures.forEach((texture) => texture.dispose());
      cardTitleTexture.dispose();
      panatTexture.dispose();
      cardTextures.forEach((texture) => texture.dispose());
      refractionTarget.dispose();
      environmentTarget.dispose();
      renderer.domElement.remove();
    };
  }, [smoothScroll]);

  return (
    <div ref={hostRef} className="brand-scene" data-ready={sceneReady} aria-hidden="true">
      <div className="brand-loader" data-ready={sceneReady}>
        <svg className="brand-loader__mark" viewBox="-2.25 -1.5 4.5 3" fill="none" role="presentation">
          <g transform="scale(1 -1)">
            <path className="brand-loader__outline" fillRule="evenodd" d="M-1.92-1.2H-1.37V-0.2H-1.07C-0.3-0.2-0.3 1.2-1.07 1.2H-1.92V-1.2ZM-1.37 0.25V0.75H-1.08C-0.69 0.75-0.69 0.25-1.08 0.25H-1.37Z" />
            <path className="brand-loader__outline" fillRule="evenodd" d="M-0.08-1.2H0.37V-0.22H0.54L1.14-1.2H1.7L1.04-0.08C1.54 0.22 1.52 1.2 0.8 1.2H-0.08V-1.2ZM0.46 0.25V0.75H0.76C1.15 0.75 1.15 0.25 0.76 0.25H0.46Z" />
            <path className="brand-loader__trace" d="M-1.92-1.2H-1.37V-0.2H-1.07C-0.3-0.2-0.3 1.2-1.07 1.2H-1.92V-1.2ZM-1.37 0.25V0.75H-1.08C-0.69 0.75-0.69 0.25-1.08 0.25H-1.37Z" />
            <path className="brand-loader__trace" d="M-0.08-1.2H0.37V-0.22H0.54L1.14-1.2H1.7L1.04-0.08C1.54 0.22 1.52 1.2 0.8 1.2H-0.08V-1.2ZM0.46 0.25V0.75H0.76C1.15 0.75 1.15 0.25 0.76 0.25H0.46Z" />
          </g>
        </svg>
      </div>
      {webglUnavailable && <span className="brand-scene__fallback">PR</span>}
    </div>
  );
}