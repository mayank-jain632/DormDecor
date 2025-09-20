'use client';
import { notFound } from 'next/navigation';
import dorms from '@/lib/dorms';
import { CanvasRoom } from '@/components/CanvasRoom';
import { CatalogPanel } from '@/components/CatalogPanel';
import { Toolbar } from '@/components/Toolbar';
import { useScene } from '@/lib/store';

export default function DormPage({ params }: { params: { dormId: string } }) {
    const dorm = dorms.find(d => d.id === params.dormId);
    const reset = useScene(s => s.reset);
    if (!dorm) return notFound();

    return (
        <div style={{ display: 'flex', gap: 16, padding: 16, width: '100%' }}>
            <div className="panel sidebar">
                <Toolbar dorm={dorm} onReset={reset} />
                <CatalogPanel />
            </div>
            <div className="panel canvasWrap">
                <CanvasRoom dorm={dorm} />
            </div>
        </div>
    );
}
