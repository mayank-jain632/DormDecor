'use client';
import { Dorm } from '@/types';
import { useScene } from '@/lib/store';

export function Toolbar({ dorm, onReset }: { dorm: Dorm; onReset: () => void }) {
    const selectedId = useScene(s => s.selectedId);
    const remove = useScene(s => s.remove);
    return (
        <div className="col" style={{ marginBottom: 8 }}>
            <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <b>{dorm.name}</b>
                    <div className="small">{dorm.dimensions.w}m × {dorm.dimensions.d}m × {dorm.dimensions.h}m</div>
                </div>
                <div className="toolbar">
                    <button onClick={onReset}>New design</button>
                    <button disabled={!selectedId} onClick={() => selectedId && remove(selectedId)}>Delete selected</button>
                </div>
            </div>
            <div className="small">Tip: Click a catalog item to add it. Drag in the room to move. Q/E to rotate 15°. Esc to deselect.</div>
            <div className="hr" />
        </div>
    );
}