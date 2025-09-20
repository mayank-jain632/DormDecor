export type Bounds = { xMin: number; xMax: number; zMin: number; zMax: number };

export function clampToBounds(x: number, z: number, bounds: Bounds, halfW: number, halfD: number) {
    const clampedX = Math.min(Math.max(x, bounds.xMin + halfW), bounds.xMax - halfW);
    const clampedZ = Math.min(Math.max(z, bounds.zMin + halfD), bounds.zMax - halfD);
    return [clampedX, clampedZ] as const;
}