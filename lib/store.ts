import { create } from 'zustand';
import type { Placement } from '@/types';

type SceneState = {
    placements: Placement[];
    selectedId: string | null;
    draggingId: string | null;
    add: (p: Omit<Placement, 'id'>) => void;
    update: (id: string, patch: Partial<Placement>) => void;
    remove: (id: string) => void;
    select: (id: string | null) => void;
    startDrag: (id: string) => void;
    stopDrag: () => void;
    reset: () => void;
};

export const useScene = create<SceneState>((set) => ({
    placements: [],
    selectedId: null,
    draggingId: null,
    add: (p) => set((s) => ({ placements: [...s.placements, { id: crypto.randomUUID(), ...p }] })),
    update: (id, patch) =>
        set((s) => ({ placements: s.placements.map(x => x.id === id ? { ...x, ...patch } : x) })),
    remove: (id) =>
        set((s) => ({
            placements: s.placements.filter(x => x.id !== id),
            selectedId: s.selectedId === id ? null : s.selectedId,
            draggingId: s.draggingId === id ? null : s.draggingId
        })),
    select: (id) => set({ selectedId: id }),
    startDrag: (id) => set({ draggingId: id, selectedId: id }),
    stopDrag: () => set({ draggingId: null }),
    reset: () => set({ placements: [], selectedId: null, draggingId: null })
}));
