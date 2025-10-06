'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
    const router = useRouter();

    const handleStart = () => {
        try {
            localStorage.setItem('dd_seen_onboarding', '1');
        } catch { }
        router.push('/');
    };

    return (
        <div style={{ display: 'grid', placeItems: 'center', width: '100%' }}>
            <div className="panel" style={{ padding: 24, maxWidth: 720, width: '100%' }}>
                <h2 style={{ marginTop: 0 }}>Let’s set up your space</h2>
                <div className="col">
                    <div className="card" style={{ alignItems: 'flex-start' }}>
                        <div className="grow">
                            <b>1. Pick your dorm</b>
                            <div className="small">Choose a UT Austin dorm layout that matches your room.</div>
                        </div>
                        <Link href="/"><button>Browse dorms</button></Link>
                    </div>
                    <div className="card" style={{ alignItems: 'flex-start' }}>
                        <div className="grow">
                            <b>2. Add items</b>
                            <div className="small">Click an item in the catalog to drop it into the room.</div>
                        </div>
                        <span className="badge">Tip</span>
                    </div>
                    <div className="card" style={{ alignItems: 'flex-start' }}>
                        <div className="grow">
                            <b>3. Move and rotate</b>
                            <div className="small">Drag to move. Use Q/E to rotate by 15°. Delete to remove.</div>
                        </div>
                        <span className="badge">Shortcuts</span>
                    </div>
                    <div className="card" style={{ alignItems: 'flex-start' }}>
                        <div className="grow">
                            <b>4. Buy what you love</b>
                            <div className="small">Click Buy on any item to view the product page.</div>
                        </div>
                        <span className="badge">Shoppable</span>
                    </div>
                </div>
                <div className="row" style={{ justifyContent: 'flex-end', marginTop: 12 }}>
                    <button onClick={handleStart}>Start designing</button>
                </div>
            </div>
        </div>
    );
}


