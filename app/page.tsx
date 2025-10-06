'use client';
import Link from 'next/link';
import dorms from '@/lib/dorms';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        try {
            const seen = localStorage.getItem('dd_seen_onboarding');
            if (!seen) {
                router.replace('/onboarding');
            }
        } catch { }
    }, [router]);
    return (
        <div style={{ display: 'flex', gap: 16, padding: 16, width: '100%' }}>
            <div className="panel" style={{ flex: 1, display: 'grid', placeItems: 'center', padding: 24 }}>
                <div className="col" style={{ alignItems: 'center', maxWidth: 640, textAlign: 'center' }}>
                    <h1 style={{ margin: 0 }}>Welcome to DormDecor</h1>
                    <p className="small">Design your room in minutes. Place real products at true scale, then buy what you love.</p>
                    <div className="row" style={{ marginTop: 12 }}>
                        <Link href="/onboarding"><button>Get Started</button></Link>
                        <a href="#dorms"><button>Browse Dorms</button></a>
                    </div>
                </div>
            </div>
            <div id="dorms" className="panel sidebar">
                <h3>Choose a UT Austin dorm</h3>
                <p className="small">Pick a layout to start designing.</p>
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
        </div>
    );
}