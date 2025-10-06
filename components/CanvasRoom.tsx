'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useMemo, useState, useEffect } from 'react';
import { useScene } from '@/lib/store';
import dorms from '@/lib/dorms';
import catalog from '@/lib/catalog';
import { clampToBounds } from '@/lib/roomBounds';
import type { Dorm } from '@/types';

const GRID = 0.05; // 5cm snap
const ROT_STEP = Math.PI / 12; // 15°

export function CanvasRoom({ dorm }: { dorm: Dorm }) {
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const handleStartDragging = () => setIsDragging(true);
        const handleStopDragging = () => setIsDragging(false);

        document.addEventListener('startDragging', handleStartDragging);
        document.addEventListener('stopDragging', handleStopDragging);

        return () => {
            document.removeEventListener('startDragging', handleStartDragging);
            document.removeEventListener('stopDragging', handleStopDragging);
        };
    }, []);

    return (
        <>
            <Canvas camera={{ position: [dorm.dimensions.w * 0.8, dorm.dimensions.h * 0.8, dorm.dimensions.d * 1.2], fov: 50 }}>
                <color attach="background" args={[0xe0f2fe]} />
                <ambientLight intensity={1.0} color={0xffffff} />
                <directionalLight position={[3, 5, 2]} intensity={0.9} color={0xfff3cd} />
                <RoomShell dorm={dorm} />
                <Placements dorm={dorm} />
                <OrbitControls
                    enablePan={!isDragging}
                    enableRotate={!isDragging}
                    enableZoom={!isDragging}
                    maxPolarAngle={Math.PI / 2.05}
                    minDistance={2}
                    maxDistance={12}
                />
                <GlobalEventHandlers dorm={dorm} />
            </Canvas>
            <div className="gridLabel small">Snap: {GRID * 100}cm • Rotate: 15° • WASD/Arrows move, Q/E rotate, Del delete</div>
        </>
    );
}

function RoomShell({ dorm }: { dorm: Dorm }) {
    const { w, d, h } = dorm.dimensions;
    // Theme-aligned materials
    // Walls: sky tint, Floor: soft yellow, Ceiling: light surface
    const wallMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xe0f2fe, side: THREE.DoubleSide }), []); // sky-100
    const floorMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xfde68a }), []); // soft yellow
    const ceilMat = useMemo(() => new THREE.MeshStandardMaterial({ color: 0xf8fafc }), []); // light

    return (
        <group>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} material={floorMat} receiveShadow>
                <planeGeometry args={[w, d]} />
            </mesh>
            {/* Ceiling */}
            <mesh position={[0, h, 0]} rotation={[Math.PI / 2, 0, 0]} material={ceilMat}>
                <planeGeometry args={[w, d]} />
            </mesh>
            {/* Walls (simple box ring) */}
            <mesh position={[0, h / 2, -d / 2]} material={wallMat}>
                <boxGeometry args={[w, h, 0.05]} />
            </mesh>
            <mesh position={[0, h / 2, d / 2]} material={wallMat}>
                <boxGeometry args={[w, h, 0.05]} />
            </mesh>
            <mesh position={[-w / 2, h / 2, 0]} material={wallMat}>
                <boxGeometry args={[0.05, h, d]} />
            </mesh>
            <mesh position={[w / 2, h / 2, 0]} material={wallMat}>
                <boxGeometry args={[0.05, h, d]} />
            </mesh>
            {/* Grid */}
            <gridHelper args={[Math.max(w, d), Math.max(w, d) / GRID, 0xa7f3d0, 0xfca5a5]} position={[0, 0.001, 0]} />
        </group>
    );
}

function Placements({ dorm }: { dorm: Dorm }) {
    const placements = useScene(s => s.placements);
    return (
        <group>
            {placements.map(p => (
                <PlacedItem key={p.id} pid={p.id} itemId={p.itemId} dorm={dorm} />
            ))}
        </group>
    );
}

function PlacedItem({ pid, itemId, dorm }: { pid: string; itemId: string; dorm: Dorm }) {
    const { selectedId, select, update, remove } = useScene();
    const isSel = selectedId === pid;
    const item = catalog.find(c => c.id === itemId)!;
    const meshRef = useRef<THREE.Mesh>(null!);
    const groupRef = useRef<THREE.Group>(null!);

    // Get current placement data
    const placement = useScene.getState().placements.find(p => p.id === pid);
    const currentPosition = placement?.position || [0, 0, 0];
    const currentRotation = placement?.rotationY || 0;

    const onPointerDown = (e: any) => {
        e.stopPropagation();
        if (typeof e.preventDefault === 'function') {
            e.preventDefault();
        } else if (e?.nativeEvent && typeof e.nativeEvent.preventDefault === 'function') {
            e.nativeEvent.preventDefault();
        }
        select(pid);
        // Trigger global dragging state
        const event = new CustomEvent('startDragging', { detail: { pid } });
        document.dispatchEvent(event);
    };

    // geometry: billboard box (faster than full GLB)
    const tex = useMemo(() => new THREE.TextureLoader().load(item.imageUrl), [item.imageUrl]);

    return (
        <group ref={groupRef} position={currentPosition}>
            <mesh ref={meshRef}
                onPointerDown={onPointerDown}
                onClick={(e) => { e.stopPropagation(); }}>
                {/* Base box approximating size */}
                <meshStandardMaterial color={isSel ? 0x0ea5e9 : 0x64748b} />
                <boxGeometry args={[item.size.w, Math.max(item.size.h, 0.02), item.size.d]} />
            </mesh>
            {/* Top billboard */}
            <mesh position={[0, Math.max(item.size.h / 2, 0.02) + 0.005, 0]}
                rotation={[0, currentRotation, 0]}
                onPointerDown={onPointerDown}>
                <meshStandardMaterial map={tex} transparent={true} color={0xffffff} />
                <planeGeometry args={[Math.max(item.size.w, 0.2), Math.max(item.size.h, 0.2)]} />
            </mesh>
            {/* Selection outline */}
            {isSel && (
                <Html center>
                    <div tabIndex={0} style={{ outline: 'none' }} />
                </Html>
            )}
        </group>
    );
}

// Global event handlers for drag and drop
function GlobalEventHandlers({ dorm }: { dorm: Dorm }) {
    const { camera, gl, raycaster } = useThree();
    const { selectedId, update, remove } = useScene();
    const [dragging, setDragging] = useState(false);
    const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
    const mouse = useMemo(() => new THREE.Vector2(), []);

    useEffect(() => {
        const handleStartDragging = (event: CustomEvent) => {
            setDragging(true);
        };

        const handlePointerMove = (event: PointerEvent) => {
            if (!dragging || !selectedId) return;

            const placements = useScene.getState().placements;
            const placement = placements.find(p => p.id === selectedId);
            if (!placement) return;

            const item = catalog.find(c => c.id === placement.itemId);
            if (!item) return;

            const { w, d } = dorm.dimensions;
            const halfW = item.size.w / 2;
            const halfD = item.size.d / 2;

            const rect = gl.domElement.getBoundingClientRect();
            mouse.set(
                ((event.clientX - rect.left) / rect.width) * 2 - 1,
                -((event.clientY - rect.top) / rect.height) * 2 + 1
            );

            raycaster.setFromCamera(mouse, camera);
            const hit = new THREE.Vector3();

            if (raycaster.ray.intersectPlane(dragPlane, hit)) {
                let [x, z] = clampToBounds(hit.x, hit.z, {
                    xMin: -w / 2,
                    xMax: w / 2,
                    zMin: -d / 2,
                    zMax: d / 2
                }, halfW, halfD);

                x = Math.round(x / GRID) * GRID;
                z = Math.round(z / GRID) * GRID;

                update(selectedId, { position: [x, 0, z] });
            }
        };

        const handlePointerUp = () => {
            setDragging(false);
            // Dispatch stop dragging event to disable OrbitControls
            const event = new CustomEvent('stopDragging');
            document.dispatchEvent(event);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (!selectedId) return;

            const placements = useScene.getState().placements;
            const placement = placements.find(p => p.id === selectedId);
            if (!placement) return;

            const item = catalog.find(c => c.id === placement.itemId);
            if (!item) return;

            const { w, d } = dorm.dimensions;
            const halfW = item.size.w / 2;
            const halfD = item.size.d / 2;

            let [x, y, z] = placement.position;
            let r = placement.rotationY;

            if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') z -= GRID;
            if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') z += GRID;
            if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') x -= GRID;
            if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') x += GRID;
            if (event.key.toLowerCase() === 'q') r -= ROT_STEP;
            if (event.key.toLowerCase() === 'e') r += ROT_STEP;
            if (event.key === 'Delete' || event.key === 'Backspace') {
                remove(selectedId);
                return;
            }

            const [cx, cz] = clampToBounds(x, z, {
                xMin: -w / 2,
                xMax: w / 2,
                zMin: -d / 2,
                zMax: d / 2
            }, halfW, halfD);

            update(selectedId, {
                position: [Math.round(cx / GRID) * GRID, y, Math.round(cz / GRID) * GRID],
                rotationY: r
            });
        };

        if (dragging) {
            document.addEventListener('pointermove', handlePointerMove);
            document.addEventListener('pointerup', handlePointerUp);
        }

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('startDragging', handleStartDragging as EventListener);

        return () => {
            document.removeEventListener('pointermove', handlePointerMove);
            document.removeEventListener('pointerup', handlePointerUp);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('startDragging', handleStartDragging as EventListener);
        };
    }, [dragging, selectedId, camera, gl, raycaster, mouse, dragPlane, dorm, update, remove]);

    // This component doesn't render anything, it just handles events
    return null;
}