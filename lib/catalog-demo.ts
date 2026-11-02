import type { Product } from "@/lib/types";

export const demoProducts: Product[] = [
  {
    id: "demo-iphone-16-pro", slug: "iphone-16-pro", name: "iPhone 16 Pro", subtitle: "Titane naturel · Puce A18 Pro",
    description: "La puissance Pro dans un design en titane. Un système caméra avancé, un écran immersif et une autonomie pensée pour suivre votre journée.",
    price: 1229, compareAtPrice: 1329, imageUrl: "/images/iphone-16-pro.png", categorySlug: "smartphones", categoryName: "iPhone", featured: true, stock: 12, badge: "Offre Nova",
    variants: [{ id: "demo-iphone-128", name: "Stockage", value: "128 Go", priceDelta: 0, stock: 4, sku: "NOVA-IP16P-128" }, { id: "demo-iphone-256", name: "Stockage", value: "256 Go", priceDelta: 150, stock: 5, sku: "NOVA-IP16P-256" }, { id: "demo-iphone-512", name: "Stockage", value: "512 Go", priceDelta: 400, stock: 3, sku: "NOVA-IP16P-512" }],
  },
  {
    id: "demo-iphone-16", slug: "iphone-16", name: "iPhone 16", subtitle: "Bleu outremer · 128 Go",
    description: "Une expérience iPhone fluide dans un format léger, avec une puce performante, un superbe écran et une nouvelle façon de capturer vos moments.",
    price: 969, compareAtPrice: 999, imageUrl: "/images/iphone-16.jpg", categorySlug: "smartphones", categoryName: "iPhone", featured: true, stock: 18, badge: null,
    variants: [{ id: "demo-iphone16-128", name: "Stockage", value: "128 Go", priceDelta: 0, stock: 10 }, { id: "demo-iphone16-256", name: "Stockage", value: "256 Go", priceDelta: 130, stock: 8 }],
  },
  {
    id: "demo-ps5", slug: "playstation-5-slim", name: "PlayStation 5 Slim", subtitle: "L’expérience nouvelle génération",
    description: "Des chargements ultra-rapides, des mondes immersifs et une manette DualSense pour ressentir chaque action. Choisissez votre édition.",
    price: 449, compareAtPrice: 499, imageUrl: "/images/ps5-console.png", categorySlug: "consoles", categoryName: "Consoles", featured: true, stock: 8, badge: "Best-seller",
    variants: [{ id: "demo-ps5-digital", name: "Édition", value: "Digital", priceDelta: 0, stock: 3 }, { id: "demo-ps5-disc", name: "Édition", value: "Avec lecteur", priceDelta: 100, stock: 5 }],
  },
  {
    id: "demo-dualsense", slug: "manette-dualsense", name: "Manette DualSense", subtitle: "Midnight Black · PS5",
    description: "Ressentez l’action grâce au retour haptique, aux gâchettes adaptatives et à une prise en main confortable.",
    price: 74.99, compareAtPrice: 79.99, imageUrl: "/images/dualsense-black.jpg", categorySlug: "accessoires", categoryName: "Accessoires & Jeux", featured: true, stock: 21, badge: null,
    variants: [{ id: "demo-pad-black", name: "Coloris", value: "Midnight Black", priceDelta: 0, stock: 12 }, { id: "demo-pad-white", name: "Coloris", value: "Blanc", priceDelta: 0, stock: 9 }],
  },
  {
    id: "demo-airpods", slug: "airpods-pro-2", name: "AirPods Pro 2", subtitle: "Audio immersif · USB-C",
    description: "Une réduction active du bruit remarquable, un mode Transparence adaptatif et un son détaillé pour vous accompagner partout.",
    price: 279, compareAtPrice: 299, imageUrl: "/images/airpods-pro.jpg", categorySlug: "audio", categoryName: "Audio", featured: true, stock: 15, badge: "Prix doux",
    variants: [{ id: "demo-airpods-usbc", name: "Boîtier", value: "USB-C", priceDelta: 0, stock: 15 }],
  },
  {
    id: "demo-charger", slug: "adaptateur-usb-c-20w", name: "Adaptateur USB-C 20 W", subtitle: "Compact · Charge rapide",
    description: "Un adaptateur secteur compact pour recharger rapidement les appareils compatibles, à la maison comme en déplacement.",
    price: 25.99, compareAtPrice: null, imageUrl: "/images/iphone-charger.jpg", categorySlug: "accessoires", categoryName: "Accessoires & Jeux", featured: false, stock: 34, badge: null,
    variants: [{ id: "demo-charger-white", name: "Coloris", value: "Blanc", priceDelta: 0, stock: 34 }],
  },
];
