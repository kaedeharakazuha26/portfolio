import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  CUBE_FACES,
  SKILL_BY_FACE_SLOT,
  type CubeFaceId,
  type CubeSkill,
} from '../data/skills';
import {
  generateScramble,
  getFaceSlot,
  invertSequence,
  randomMove,
  rotateGridCoord,
  type CubeMove,
  type GridCoord,
} from '../lib/cubeLogic';
import { createStickerTexture } from '../lib/stickerTexture';
import { playHoverTick, playSolveChime, playTwistSound } from '../lib/sound';

export interface RubiksCubeHandle {
  twistRandom: () => void;
  enqueueMove: (move: CubeMove) => void;
  scramble: () => void;
  solve: () => void;
  focusFace: (face: CubeFaceId) => void;
  celebrate: () => void;
}

interface RubiksCubeCanvasProps {
  theme: 'dark' | 'light';
  reducedMotion: boolean;
  onHoverSkill: (skill: CubeSkill | null) => void;
  onSelectSkill: (skill: CubeSkill) => void;
  onMoveStats: (totalMoves: number, scrambledDepth: number) => void;
  onReady: () => void;
}

interface QueuedMove {
  move: CubeMove;
  durationMs: number;
  recordHistory: boolean;
  silent?: boolean;
  onDone?: () => void;
}

interface CubieEntry {
  root: THREE.Group;
  body: THREE.Group;
  coord: GridCoord;
  hoverOffset: THREE.Vector3;
  targetHoverOffset: THREE.Vector3;
}

interface SectionPose {
  x: number;
  y: number;
  z: number;
  scale: number;
  rx: number;
  ry: number;
  rz: number;
  ambientSpin: number;
  canvasOpacity: number;
}

function createRoundedStickerGeometry(size = 0.78, radius = 0.13): THREE.ShapeGeometry {
  const half = size / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-half + radius, -half);
  shape.lineTo(half - radius, -half);
  shape.quadraticCurveTo(half, -half, half, -half + radius);
  shape.lineTo(half, half - radius);
  shape.quadraticCurveTo(half, half, half - radius, half);
  shape.lineTo(-half + radius, half);
  shape.quadraticCurveTo(-half, half, -half, half - radius);
  shape.lineTo(-half, -half + radius);
  shape.quadraticCurveTo(-half, -half, -half + radius, -half);

  const geometry = new THREE.ShapeGeometry(shape, 5);
  const pos = geometry.attributes.position;
  const uvs = new Float32Array(pos.count * 2);
  for (let i = 0; i < pos.count; i++) {
    uvs[i * 2] = (pos.getX(i) + half) / size;
    uvs[i * 2 + 1] = (pos.getY(i) + half) / size;
  }
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  return geometry;
}

function snapCubieTransform(root: THREE.Group, coord: GridCoord) {
  root.position.set(coord[0], coord[1], coord[2]);
  root.updateMatrix();
  const m = new THREE.Matrix4().makeRotationFromQuaternion(root.quaternion);
  const e = m.elements;
  // Every 90° orthogonal rotation is a signed permutation matrix (-1, 0, 1).
  for (let i = 0; i < 16; i++) {
    if (i === 12 || i === 13 || i === 14) {
      e[i] = 0;
    } else if (i === 15) {
      e[i] = 1;
    } else {
      e[i] = Math.round(e[i]);
    }
  }
  root.quaternion.setFromRotationMatrix(m);
  root.updateMatrix();
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function isInteractiveDomTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest(
      'button, a, input, textarea, select, [role="dialog"], [data-ui-block="true"]',
    ),
  );
}

const SECTION_IDS = [
  'hero',
  'projects',
  'skills',
  'certifications',
  'experience',
  'contact',
] as const;

const SKILLS_INDEX = 2;
const CONTACT_INDEX = 5;
const isInteractiveCubeSection = (idx: number) =>
  idx === 0 || idx === SKILLS_INDEX || idx === CONTACT_INDEX;

function getPoses(isDesktop: boolean): SectionPose[] {
  if (isDesktop) {
    return [
      // 0: Hero (left centerpiece, interactive)
      { x: -2.15, y: 0.05, z: 0, scale: 0.88, rx: 0.4, ry: 0.56, rz: -0.05, ambientSpin: 0.0, canvasOpacity: 1 },
      // 1: Projects (recedes cleanly out of the way so cards stay crisp)
      { x: -2.1, y: -0.25, z: -3.4, scale: 0.52, rx: 0.36, ry: 1.5, rz: 0.08, ambientSpin: 0.18, canvasOpacity: 0 },
      // 2: Skills (left stage with generous gap from Skill Inspector card)
      { x: -2.05, y: -0.04, z: 0, scale: 0.9, rx: 0.28, ry: -0.45, rz: 0.0, ambientSpin: 0.0, canvasOpacity: 1 },
      // 3: Certifications (recedes cleanly)
      { x: 0.4, y: -0.2, z: -3.4, scale: 0.52, rx: 0.44, ry: 0.9, rz: 0.05, ambientSpin: 0.16, canvasOpacity: 0 },
      // 4: Experience (recedes cleanly, zero peeking behind cards)
      { x: 1.5, y: -0.2, z: -3.2, scale: 0.55, rx: 0.48, ry: 0.55, rz: -0.08, ambientSpin: 0.18, canvasOpacity: 0 },
      // 5: Contact (sweeps onto the right stage beside Contact Form, fully interactive)
      { x: 2.1, y: -0.1, z: 0, scale: 0.86, rx: 0.36, ry: -0.52, rz: 0.04, ambientSpin: 0.0, canvasOpacity: 1 },
    ];
  }
  return [
    { x: 0.0, y: -1.92, z: 0, scale: 0.47, rx: 0.4, ry: 0.56, rz: -0.04, ambientSpin: 0.0, canvasOpacity: 1 },
    { x: 0.0, y: 0.0, z: -3.0, scale: 0.38, rx: 0.36, ry: 1.5, rz: 0.06, ambientSpin: 0.15, canvasOpacity: 0 },
    { x: 0.0, y: 0.35, z: 0, scale: 0.64, rx: 0.28, ry: -0.45, rz: 0.0, ambientSpin: 0.0, canvasOpacity: 1 },
    { x: 0.0, y: 0.0, z: -3.0, scale: 0.38, rx: 0.44, ry: 0.9, rz: 0.04, ambientSpin: 0.14, canvasOpacity: 0 },
    { x: 0.0, y: 0.0, z: -3.0, scale: 0.38, rx: 0.48, ry: 0.55, rz: -0.06, ambientSpin: 0.15, canvasOpacity: 0 },
    { x: 0.0, y: 0.0, z: -3.0, scale: 0.42, rx: 0.36, ry: -0.5, rz: 0.0, ambientSpin: 0.12, canvasOpacity: 0 },
  ];
}

export const RubiksCubeCanvas = forwardRef<RubiksCubeHandle, RubiksCubeCanvasProps>(
  function RubiksCubeCanvas(
    { theme, reducedMotion, onHoverSkill, onSelectSkill, onMoveStats, onReady },
    ref,
  ) {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const callbacksRef = useRef({
      onHoverSkill,
      onSelectSkill,
      onMoveStats,
      onReady,
    });
    callbacksRef.current = { onHoverSkill, onSelectSkill, onMoveStats, onReady };

    const apiRef = useRef<RubiksCubeHandle>({
      twistRandom: () => {},
      enqueueMove: () => {},
      scramble: () => {},
      solve: () => {},
      focusFace: () => {},
      celebrate: () => {},
    });

    useImperativeHandle(ref, () => ({
      twistRandom: () => apiRef.current.twistRandom(),
      enqueueMove: (move) => apiRef.current.enqueueMove(move),
      scramble: () => apiRef.current.scramble(),
      solve: () => apiRef.current.solve(),
      focusFace: (face) => apiRef.current.focusFace(face),
      celebrate: () => apiRef.current.celebrate(),
    }));

    const themeRef = useRef(theme);
    themeRef.current = theme;

    useEffect(() => {
      if (reducedMotion) {
        callbacksRef.current.onReady();
        return;
      }

      const container = mountRef.current;
      if (!container) return;

      // Scene & Camera
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        36,
        window.innerWidth / window.innerHeight,
        0.1,
        100,
      );
      camera.position.set(0, 0, 10.8);

      // Renderer
      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
      } catch {
        callbacksRef.current.onReady();
        return;
      }

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.96;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      container.appendChild(renderer.domElement);

      // Studio environment reflections (restrained so jewel-tone stickers stay deeply saturated)
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const roomEnv = new RoomEnvironment();
      const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
      scene.environment = envRT.texture;
      scene.environmentIntensity = 0.42;
      roomEnv.dispose();
      pmremGenerator.dispose();

      // Cosmic 3-point studio lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.38);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
      keyLight.position.set(6, 9, 8);
      scene.add(keyLight);

      const coolRim = new THREE.DirectionalLight(0x60a5fa, 1.15);
      coolRim.position.set(-8, 4, -5);
      scene.add(coolRim);

      const warmFill = new THREE.DirectionalLight(0xfb923c, 0.65);
      warmFill.position.set(5, -7, 4);
      scene.add(warmFill);

      // Rig hierarchy: rigGroup (scroll pose) -> orbitGroup (drag/focus) -> cubeGroup (27 cubies)
      const rigGroup = new THREE.Group();
      const orbitGroup = new THREE.Group();
      const cubeGroup = new THREE.Group();
      const pivotGroup = new THREE.Group();
      cubeGroup.add(pivotGroup);
      orbitGroup.add(cubeGroup);
      rigGroup.add(orbitGroup);
      scene.add(rigGroup);

      // Solid matte black speedcube core so twisting slices never look hollow
      const coreGeo = new THREE.SphereGeometry(1.18, 24, 24);
      const chassisMat = new THREE.MeshPhysicalMaterial({
        color: 0x0b0f19,
        roughness: 0.34,
        metalness: 0.14,
        clearcoat: 0.7,
        clearcoatRoughness: 0.18,
      });
      const coreMesh = new THREE.Mesh(coreGeo, chassisMat);
      cubeGroup.add(coreMesh);

      // Shared geometries
      const cubieGeo = new RoundedBoxGeometry(0.94, 0.94, 0.94, 4, 0.11);
      const stickerGeo = createRoundedStickerGeometry(0.78, 0.13);

      const cubies: CubieEntry[] = [];
      const stickerMeshes: THREE.Mesh[] = [];
      const texturesToDispose: THREE.Texture[] = [];
      const materialsToDispose: THREE.Material[] = [chassisMat];

      const faceConfigs: Array<{
        face: CubeFaceId;
        match: (x: number, y: number, z: number) => boolean;
        pos: [number, number, number];
        rot: [number, number, number];
        normal: [number, number, number];
      }> = [
        { face: 'F', match: (_, __, z) => z === 1, pos: [0, 0, 0.476], rot: [0, 0, 0], normal: [0, 0, 1] },
        { face: 'B', match: (_, __, z) => z === -1, pos: [0, 0, -0.476], rot: [0, Math.PI, 0], normal: [0, 0, -1] },
        { face: 'R', match: (x) => x === 1, pos: [0.476, 0, 0], rot: [0, Math.PI / 2, 0], normal: [1, 0, 0] },
        { face: 'L', match: (x) => x === -1, pos: [-0.476, 0, 0], rot: [0, -Math.PI / 2, 0], normal: [-1, 0, 0] },
        { face: 'U', match: (_, y) => y === 1, pos: [0, 0.476, 0], rot: [-Math.PI / 2, 0, 0], normal: [0, 1, 0] },
        { face: 'D', match: (_, y) => y === -1, pos: [0, -0.476, 0], rot: [Math.PI / 2, 0, 0], normal: [0, -1, 0] },
      ];

      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const root = new THREE.Group();
            root.position.set(x, y, z);

            const body = new THREE.Group();
            root.add(body);

            const block = new THREE.Mesh(cubieGeo, chassisMat);
            body.add(block);

            const entry: CubieEntry = {
              root,
              body,
              coord: [x, y, z],
              hoverOffset: new THREE.Vector3(),
              targetHoverOffset: new THREE.Vector3(),
            };

            for (const cfg of faceConfigs) {
              if (!cfg.match(x, y, z)) continue;
              const slot = getFaceSlot(cfg.face, x, y, z);
              const skill = SKILL_BY_FACE_SLOT.get(`${cfg.face}-${slot}`);
              if (!skill) continue;

              const texture = createStickerTexture(skill);
              texturesToDispose.push(texture);

              const mat = new THREE.MeshPhysicalMaterial({
                map: texture,
                roughness: 0.2,
                metalness: 0.03,
                clearcoat: 1.0,
                clearcoatRoughness: 0.08,
                emissive: new THREE.Color(skill.color),
                emissiveIntensity: 0.04,
              });
              materialsToDispose.push(mat);

              const sticker = new THREE.Mesh(stickerGeo, mat);
              sticker.position.set(...cfg.pos);
              sticker.rotation.set(...cfg.rot);
              sticker.userData = {
                skill,
                cubieEntry: entry,
                localNormal: new THREE.Vector3(...cfg.normal),
              };
              body.add(sticker);
              stickerMeshes.push(sticker);
            }

            cubeGroup.add(root);
            cubies.push(entry);
          }
        }
      }

      // Move Queue & Slice Rotation Engine
      const moveQueue: QueuedMove[] = [];
      const moveHistory: CubeMove[] = [];
      let totalMoves = 0;

      interface ActiveTurn {
        queued: QueuedMove;
        affected: CubieEntry[];
        elapsedMs: number;
        targetAngle: number;
      }
      let activeTurn: ActiveTurn | null = null;

      const emitStats = () => {
        callbacksRef.current.onMoveStats(totalMoves, moveHistory.length);
      };

      const startNextMove = () => {
        if (activeTurn || moveQueue.length === 0) return;
        const queued = moveQueue.shift()!;
        const { axis, layer, dir } = queued.move;
        const axisIndex = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;

        // Reset hover offsets cleanly before slice twist
        for (const c of cubies) {
          c.targetHoverOffset.set(0, 0, 0);
          c.hoverOffset.set(0, 0, 0);
          c.body.position.set(0, 0, 0);
        }

        pivotGroup.rotation.set(0, 0, 0);
        pivotGroup.position.set(0, 0, 0);
        pivotGroup.updateMatrixWorld(true);

        const affected = cubies.filter((c) => c.coord[axisIndex] === layer);
        for (const c of affected) {
          pivotGroup.attach(c.root);
        }

        if (!queued.silent) {
          playTwistSound();
        }

        activeTurn = {
          queued,
          affected,
          elapsedMs: 0,
          targetAngle: (Math.PI / 2) * dir,
        };
      };

      const enqueueMoveInternal = (
        move: CubeMove,
        durationMs = 260,
        recordHistory = true,
        silent = false,
        onDone?: () => void,
      ) => {
        if (moveQueue.length > 24) return;
        moveQueue.push({ move, durationMs, recordHistory, silent, onDone });
        startNextMove();
      };

      // User Orbit State
      let targetOrbitX = 0;
      let targetOrbitY = 0;
      let currentOrbitX = 0;
      let currentOrbitY = 0;
      let isDragging = false;
      let dragMovedPx = 0;
      let dragLastX = 0;
      let dragLastY = 0;
      let lastPointerMoveTime = performance.now();
      let lastIdleTwistTime = performance.now();
      let idleMovePendingReverse = false;
      let activeSectionIndex = 0;
      let pointerDownHitSticker: THREE.Mesh | null = null;

      // Wire Imperative API for UI Controls & Keyboard
      apiRef.current = {
        twistRandom: () => {
          const prev = moveHistory[moveHistory.length - 1];
          enqueueMoveInternal(randomMove(prev), 240, true);
        },
        enqueueMove: (move) => {
          enqueueMoveInternal(move, 230, true);
        },
        scramble: () => {
          const seq = generateScramble(8);
          seq.forEach((move) => enqueueMoveInternal(move, 145, true));
        },
        solve: () => {
          if (moveHistory.length === 0) {
            // Playful flourish if already solved
            const flourish = generateScramble(3);
            flourish.forEach((m) => enqueueMoveInternal(m, 160, false));
            const back = invertSequence(flourish);
            back.forEach((m, idx) =>
              enqueueMoveInternal(
                m,
                160,
                false,
                false,
                idx === back.length - 1 ? () => playSolveChime() : undefined,
              ),
            );
            return;
          }
          const unwind = invertSequence(moveHistory);
          moveHistory.length = 0;
          emitStats();
          unwind.forEach((move, idx) =>
            enqueueMoveInternal(
              move,
              135,
              false,
              false,
              idx === unwind.length - 1 ? () => playSolveChime() : undefined,
            ),
          );
        },
        focusFace: (face) => {
          const [rx, ry] = CUBE_FACES[face].viewRotation;
          // Offset relative to Skills section base pose [0.28, -0.45]
          targetOrbitX = rx - 0.28;
          targetOrbitY = ry - -0.45;
        },
        celebrate: () => {
          const seq = generateScramble(2);
          const unwind = invertSequence(seq);
          seq.forEach((m) => enqueueMoveInternal(m, 160, false));
          unwind.forEach((m, idx) =>
            enqueueMoveInternal(
              m,
              160,
              false,
              false,
              idx === unwind.length - 1 ? () => playSolveChime() : undefined,
            ),
          );
        },
      };

      // Raycaster for hover/click/drag on cube without blocking DOM UI
      const raycaster = new THREE.Raycaster();
      const pointerNdc = new THREE.Vector2(-99, -99);
      let hoveredSticker: THREE.Mesh | null = null;

      const setStickerEmissive = (mesh: THREE.Mesh | null, intensity: number) => {
        if (!mesh) return;
        const mat = mesh.material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = intensity;
      };

      const raycastCube = (clientX: number, clientY: number): THREE.Mesh | null => {
        pointerNdc.x = (clientX / window.innerWidth) * 2 - 1;
        pointerNdc.y = -(clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointerNdc, camera);
        const hits = raycaster.intersectObjects(stickerMeshes, false);
        return hits.length > 0 ? (hits[0].object as THREE.Mesh) : null;
      };

      const clearHover = () => {
        if (!hoveredSticker) return;
        const prevEntry = hoveredSticker.userData.cubieEntry as CubieEntry;
        prevEntry.targetHoverOffset.set(0, 0, 0);
        setStickerEmissive(hoveredSticker, 0.04);
        hoveredSticker = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        callbacksRef.current.onHoverSkill(null);
      };

      const onPointerMove = (e: PointerEvent) => {
        lastPointerMoveTime = performance.now();

        if (isDragging) {
          const dx = e.clientX - dragLastX;
          const dy = e.clientY - dragLastY;
          dragMovedPx += Math.hypot(dx, dy);
          targetOrbitY += dx * 0.0095;
          targetOrbitX = clamp(targetOrbitX + dy * 0.0095, -1.65, 1.65);
          dragLastX = e.clientX;
          dragLastY = e.clientY;
          return;
        }

        if (!isInteractiveCubeSection(activeSectionIndex) || isInteractiveDomTarget(e.target)) {
          clearHover();
          return;
        }

        const hit = raycastCube(e.clientX, e.clientY);
        if (hit !== hoveredSticker) {
          if (hoveredSticker) {
            const prevEntry = hoveredSticker.userData.cubieEntry as CubieEntry;
            prevEntry.targetHoverOffset.set(0, 0, 0);
            setStickerEmissive(hoveredSticker, 0.04);
          }

          hoveredSticker = hit;
          if (hit) {
            const entry = hit.userData.cubieEntry as CubieEntry;
            const normal = hit.userData.localNormal as THREE.Vector3;
            const skill = hit.userData.skill as CubeSkill;
            if (!activeTurn) {
              entry.targetHoverOffset.copy(normal).multiplyScalar(0.11);
            }
            setStickerEmissive(hit, 0.28);
            document.body.style.cursor = 'grab';
            playHoverTick();
            callbacksRef.current.onHoverSkill(skill);
          } else {
            document.body.style.cursor = '';
        document.body.style.userSelect = '';
            callbacksRef.current.onHoverSkill(null);
          }
        }
      };

      const onPointerDown = (e: PointerEvent) => {
        if (e.button !== 0) return;
        if (isInteractiveDomTarget(e.target)) return;
        if (!isInteractiveCubeSection(activeSectionIndex)) return;

        const hit = raycastCube(e.clientX, e.clientY);
        if (!hit) return;

        isDragging = true;
        dragMovedPx = 0;
        dragLastX = e.clientX;
        dragLastY = e.clientY;
        pointerDownHitSticker = hit;
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
      };

      const onPointerUp = () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.cursor = hoveredSticker ? 'grab' : '';
        document.body.style.userSelect = '';

        // Short tap/click on a sticker selects that skill & triggers a crisp tactile twist!
        if (dragMovedPx < 6 && pointerDownHitSticker) {
          const skill = pointerDownHitSticker.userData.skill as CubeSkill;
          callbacksRef.current.onSelectSkill(skill);
          // Give a subtle playful nudge twist in Hero/Contact, or just select + spin in Skills
          const entry = pointerDownHitSticker.userData.cubieEntry as CubieEntry;
          const normal = pointerDownHitSticker.userData.localNormal as THREE.Vector3;
          entry.hoverOffset.copy(normal).multiplyScalar(0.18);
          playTwistSound();
        }
        pointerDownHitSticker = null;
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointerup', onPointerUp);

      // Scroll Choreography Calculator
      const getScrollPose = (): { pose: SectionPose; sectionIdx: number } => {
        const isDesktop = window.innerWidth >= 1024;
        const poses = getPoses(isDesktop);
        const scrollY = window.scrollY;
        const vh = window.innerHeight || 800;

        const centers = SECTION_IDS.map((id, idx) => {
          const el = document.getElementById(id);
          if (!el) return idx * vh;
          // Anchor choreography to the scrollY where each section visually frames the viewport
          return Math.max(0, el.offsetTop + Math.min(el.offsetHeight, vh) * 0.5 - vh * 0.5);
        });

        const viewCenter = scrollY + vh * 0.5;
        let seg = 0;
        for (let i = 0; i < centers.length - 1; i++) {
          if (scrollY >= centers[i]) seg = i;
        }

        const start = centers[seg];
        const end = centers[Math.min(seg + 1, centers.length - 1)];
        const rawT = end > start ? clamp((scrollY - start) / (end - start), 0, 1) : 0;
        // Smoothstep easing between sections
        const t = rawT * rawT * (3 - 2 * rawT);

        // Determine visually dominant section for crisp opacity gating (no peeking over Projects/Experience)
        let dominantIdx = 0;
        let minDist = Infinity;
        SECTION_IDS.forEach((id, idx) => {
          const el = document.getElementById(id);
          if (!el) return;
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          const dist =
            viewCenter >= top && viewCenter <= bottom
              ? 0
              : Math.min(Math.abs(viewCenter - top), Math.abs(viewCenter - bottom));
          if (dist < minDist) {
            minDist = dist;
            dominantIdx = idx;
          }
        });

        const a = poses[seg];
        const b = poses[Math.min(seg + 1, poses.length - 1)];

        return {
          sectionIdx: dominantIdx,
          pose: {
            x: lerp(a.x, b.x, t),
            y: lerp(a.y, b.y, t),
            z: lerp(a.z, b.z, t),
            scale: lerp(a.scale, b.scale, t),
            rx: lerp(a.rx, b.rx, t),
            ry: lerp(a.ry, b.ry, t),
            rz: lerp(a.rz, b.rz, t),
            ambientSpin: lerp(a.ambientSpin, b.ambientSpin, t),
            canvasOpacity: poses[dominantIdx].canvasOpacity,
          },
        };
      };

      // Resize Handler
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      // Animation Loop
      let rafId = 0;
      let prevTime = performance.now();
      let ambientAngle = 0;
      let firstFrameDone = false;

      // Initialize rig pose cleanly without jump
      const initial = getScrollPose();
      rigGroup.position.set(initial.pose.x, initial.pose.y, initial.pose.z);
      rigGroup.scale.setScalar(initial.pose.scale);
      rigGroup.rotation.set(initial.pose.rx, initial.pose.ry, initial.pose.rz);
      let currentCanvasOpacity = initial.pose.canvasOpacity;

      const animate = (now: number) => {
        rafId = requestAnimationFrame(animate);
        const dtMs = Math.min(now - prevTime, 50);
        const dt = dtMs / 1000;
        prevTime = now;

        // Subtle exposure tweak for light vs dark backdrop
        renderer.toneMappingExposure = themeRef.current === 'dark' ? 0.96 : 0.9;

        // 1. Update scroll choreography smoothly
        const { pose, sectionIdx } = getScrollPose();
        activeSectionIndex = sectionIdx;
        const smooth = 1 - Math.exp(-dt * 6.5);

        rigGroup.position.x = lerp(rigGroup.position.x, pose.x, smooth);
        rigGroup.position.y = lerp(
          rigGroup.position.y,
          pose.y + Math.sin(now * 0.0014) * 0.08,
          smooth,
        );
        rigGroup.position.z = lerp(rigGroup.position.z, pose.z, smooth);
        const nextScale = lerp(rigGroup.scale.x, pose.scale, smooth);
        rigGroup.scale.setScalar(nextScale);

        currentCanvasOpacity = lerp(currentCanvasOpacity, pose.canvasOpacity, smooth);
        container.style.opacity = currentCanvasOpacity.toFixed(3);

        ambientAngle += dt * pose.ambientSpin;
        const breatheY =
          sectionIdx === 0 || sectionIdx === CONTACT_INDEX
            ? Math.sin(now * 0.00055) * 0.22
            : 0;
        const spinY = !isInteractiveCubeSection(sectionIdx) ? ambientAngle : 0;

        rigGroup.rotation.x = lerp(rigGroup.rotation.x, pose.rx, smooth);
        rigGroup.rotation.y = lerp(
          rigGroup.rotation.y,
          pose.ry + breatheY + spinY,
          smooth,
        );
        rigGroup.rotation.z = lerp(rigGroup.rotation.z, pose.rz, smooth);

        if (sectionIdx !== SKILLS_INDEX && sectionIdx !== CONTACT_INDEX && !isDragging) {
          targetOrbitX = lerp(targetOrbitX, 0, dt * 2.8);
          targetOrbitY = lerp(targetOrbitY, 0, dt * 2.8);
        }

        currentOrbitX = lerp(currentOrbitX, targetOrbitX, 1 - Math.exp(-dt * 10));
        currentOrbitY = lerp(currentOrbitY, targetOrbitY, 1 - Math.exp(-dt * 10));
        orbitGroup.rotation.set(currentOrbitX, currentOrbitY, 0);

        // 2. Smooth hover pop-out on individual cubies
        const hoverLerp = 1 - Math.exp(-dt * 14);
        for (const c of cubies) {
          c.hoverOffset.lerp(c.targetHoverOffset, hoverLerp);
          c.body.position.copy(c.hoverOffset);
        }

        // 3. Advance active Rubik's Cube slice rotation
        if (activeTurn) {
          activeTurn.elapsedMs += dtMs;
          const progress = clamp(
            activeTurn.elapsedMs / activeTurn.queued.durationMs,
            0,
            1,
          );
          // Smooth cubic ease-in-out
          const eased =
            progress < 0.5
              ? 4 * progress * progress * progress
              : 1 - Math.pow(-2 * progress + 2, 3) / 2;

          pivotGroup.rotation[activeTurn.queued.move.axis] =
            activeTurn.targetAngle * eased;

          if (progress >= 1) {
            pivotGroup.rotation[activeTurn.queued.move.axis] = activeTurn.targetAngle;
            pivotGroup.updateMatrixWorld(true);

            const { axis, dir } = activeTurn.queued.move;
            for (const c of activeTurn.affected) {
              cubeGroup.attach(c.root);
              c.coord = rotateGridCoord(c.coord, axis, dir);
              snapCubieTransform(c.root, c.coord);
            }

            pivotGroup.rotation.set(0, 0, 0);

            if (activeTurn.queued.recordHistory) {
              moveHistory.push(activeTurn.queued.move);
              totalMoves += 1;
              emitStats();
            } else if (!activeTurn.queued.silent) {
              totalMoves += 1;
              emitStats();
            }

            const doneCb = activeTurn.queued.onDone;
            activeTurn = null;
            doneCb?.();
            startNextMove();
          }
        } else if (
          // Gentle living idle twist in Hero when untouched for 5.5s
          sectionIdx === 0 &&
          !isDragging &&
          moveHistory.length === 0 &&
          now - lastPointerMoveTime > 4200 &&
          now - lastIdleTwistTime > 5200
        ) {
          lastIdleTwistTime = now;
          if (!idleMovePendingReverse) {
            const idleMove = randomMove();
            idleMovePendingReverse = true;
            enqueueMoveInternal(idleMove, 480, false, true, () => {
              window.setTimeout(() => {
                if (moveHistory.length === 0 && !isDragging) {
                  enqueueMoveInternal(
                    {
                      ...idleMove,
                      dir: (idleMove.dir * -1) as 1 | -1,
                      notation: `${idleMove.notation}'`,
                    },
                    480,
                    false,
                    true,
                    () => {
                      idleMovePendingReverse = false;
                    },
                  );
                } else {
                  idleMovePendingReverse = false;
                }
              }, 1100);
            });
          }
        }

        renderer.render(scene, camera);

        if (!firstFrameDone) {
          firstFrameDone = true;
          callbacksRef.current.onReady();
        }
      };

      rafId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointerup', onPointerUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';

        cubieGeo.dispose();
        stickerGeo.dispose();
        coreGeo.dispose();
        texturesToDispose.forEach((t) => t.dispose());
        materialsToDispose.forEach((m) => m.dispose());
        envRT.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      };
    }, [reducedMotion]);

    if (reducedMotion) return null;

    return (
      <div
        ref={mountRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-10"
      />
    );
  },
);
