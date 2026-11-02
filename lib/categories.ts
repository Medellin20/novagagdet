export const productCategories = [
  { slug: "smartphones", name: "iPhone" },
  { slug: "consoles", name: "Consoles" },
  { slug: "audio", name: "Audio" },
  { slug: "accessoires", name: "Accessoires & Jeux" },
];

export function categoryDisplayName(slug?: string, fallback = "Accessoires & Jeux") {
  return productCategories.find((category) => category.slug === slug)?.name ?? fallback;
}
