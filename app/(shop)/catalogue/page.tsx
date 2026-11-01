import type { Metadata } from "next";
import { CatalogBrowser } from "@/components/store/catalog-browser";
import { getProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Catalogue", description: "Parcourez la sélection iPhone, PlayStation et accessoires Nova." };
type SearchParams = Promise<{ q?: string; categorie?: string; offres?: string }>;

export default async function CataloguePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const products = await getProducts();
  const selectedCategory = params.categorie && ["smartphones", "consoles", "audio", "accessoires"].includes(params.categorie) ? params.categorie : "tous";
  return <div className="page-shell pb-20 pt-12 sm:pt-16">
    <div className="mb-9 max-w-3xl"><p className="eyebrow">La sélection Nova</p><h1 className="font-display mt-4 text-[clamp(40px,7vw,68px)] font-extrabold leading-[.98] tracking-[-.07em]">Le bon produit,<br className="hidden sm:block" /> au bon moment.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-muted">Une sélection soigneusement composée pour le quotidien, les loisirs et tout ce qui vous inspire.</p></div>
    <CatalogBrowser products={products} initialQuery={params.q ?? ""} initialCategory={selectedCategory} offersOnly={params.offres === "1"} />
  </div>;
}
