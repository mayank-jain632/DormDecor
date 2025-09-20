import { CatalogItem } from '@/types';

const cm = (inches: number) => inches * 0.0254;

const catalog: CatalogItem[] = [
    {
        id: 'mini-fridge-basic',
        name: 'Mini Fridge 3.2 cu ft',
        imageUrl: '/items/minifridge.jpg',
        size: { w: cm(18.5), d: cm(17.5), h: cm(33) },
        linkUrl: 'https://www.amazon.com/',
        tags: ['appliance', 'fridge'],
        price: 179.99
    },
    {
        id: 'desk-lamp-led',
        name: 'LED Desk Lamp',
        imageUrl: '/items/desklamp.jpg',
        size: { w: cm(6), d: cm(6), h: cm(16) },
        linkUrl: 'https://www.amazon.com/',
        tags: ['lighting', 'desk'],
        price: 24.99
    },
    {
        id: 'rolling-chair',
        name: 'Rolling Desk Chair',
        imageUrl: '/items/chair.jpg',
        size: { w: cm(24), d: cm(24), h: cm(36) },
        linkUrl: 'https://www.amazon.com/',
        tags: ['chair', 'seating'],
        price: 69.99
    },
    {
        id: 'area-rug-5x7',
        name: 'Area Rug 5×7',
        imageUrl: '/items/rug.jpg',
        size: { w: cm(60), d: cm(84), h: cm(0.4) },
        linkUrl: 'https://www.amazon.com/',
        tags: ['rug', 'floor'],
        price: 49.99
    },
    {
        id: 'storage-bin',
        name: 'Under‑Bed Storage Bin',
        imageUrl: '/items/bin.jpg',
        size: { w: cm(30), d: cm(24), h: cm(6) },
        linkUrl: 'https://www.amazon.com/',
        tags: ['storage'],
        price: 14.99
    },
    {
        id: 'poster-a2',
        name: 'Wall Poster (A2)',
        imageUrl: '/items/poster.jpg',
        size: { w: 0.42, d: 0.02, h: 0.59 },
        linkUrl: 'https://www.amazon.com/',
        tags: ['decor', 'wall'],
        price: 9.99
    }
];

export default catalog;