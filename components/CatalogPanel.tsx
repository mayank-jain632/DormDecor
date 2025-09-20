'use client';
import catalog from '@/lib/catalog';
import { useScene } from '@/lib/store';

export function CatalogPanel() {
    const add = useScene(s => s.add);
    const handleAdd = (itemId: string) => {
        // Drop new item at room center (y set to floor)
        add({ itemId, position: [0, 0, 0], rotationY: 0, scale: 1 });
    };

    return (
        <div className="col">
            {catalog.map(it => (
                <div key={it.id} className="card">
                    <img src={it.imageUrl} alt={it.name} />
                    <div className="grow">
                        <div><b>{it.name}</b></div>
                        <div className="small">{(it.size.w).toFixed(2)} × {(it.size.d).toFixed(2)} × {(it.size.h).toFixed(2)} m</div>
                        {it.price && <div className="small">${it.price.toFixed(2)}</div>}
                    </div>
                    <div className="col" style={{ gap: 6 }}>
                        <button onClick={() => handleAdd(it.id)}>Add</button>
                        <a href={it.linkUrl} target="_blank" rel="noreferrer"><button>Buy</button></a>
                    </div>
                </div>
            ))}
        </div>
    );
}