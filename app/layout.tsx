import './globals.css';
import type { ReactNode } from 'react';


export const metadata = { title: 'DormDecor MVP', description: 'UT dorm layout + shoppable items' };


export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                    <header style={{ padding: '12px 16px', borderBottom: '1px solid #2b3041' }}>
                        <b>DormDecor</b> <span className="badge">MVP</span>
                    </header>
                    <main style={{ display: 'flex', flex: 1, minHeight: 0 }}>{children}</main>
                </div>
            </body>
        </html>
    );
}