'use client';
import Link from 'next/link';
import dorms from '@/lib/dorms';

export default function Home() {
    return (
        <div style={{ display: 'flex', gap: 16, padding: 16, width: '100%' }}>
            <div className="panel sidebar">
                <h3>Choose a UT Austin dorm</h3>
                <p className="small">v0 includes two mocked layouts in scale.</p>
                <div className="hr" />
                <div className="col">
                    {dorms.map(d => (
                        <Link key={d.id} href={`/${d.id}`} className="card">
                            <img src={d.thumbnail} alt={d.name} />
                            <div className="grow">
                                <div><b>{d.name}</b></div>
                                <div className="small">{d.dimensions.w}m × {d.dimensions.d}m × {d.dimensions.h}m</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="panel" style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
                <div className="col" style={{ alignItems: 'center' }}>
                    <h2>Plan your dorm. Buy with confidence.</h2>
                    <p className="small">Drag real items into a to-scale room. Click an item's Buy button to open the product.</p>
                </div>
            </div>
        </div>
    );
}