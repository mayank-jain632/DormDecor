export type Dorm = {
    id: string;
    name: string;
    thumbnail: string;
    dimensions: { w: number; d: number; h: number }; // meters
};

export type CatalogItem = {
    id: string;
    name: string;
    imageUrl: string;
    size: { w: number; d: number; h: number }; // meters
    linkUrl: string; // product page (plain URL for MVP)
    price?: number;
    tags: string[];
    isHero3D?: boolean; // reserved for future GLB
};

export type Placement = {
    id: string;
    itemId: string;
    position: [number, number, number];
    rotationY: number; // radians
    scale?: number;
};