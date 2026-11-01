import { HomeHero, ServiceStrip, CategoryShowcase, FeaturedProducts, PromoFeature } from "@/components/store/home-sections";
import { getProducts } from "@/lib/catalog";
import { getStoreSettings } from "@/lib/store-settings";

export default async function HomePage() {
  const [products, settings] = await Promise.all([getProducts(), getStoreSettings()]);
  const featured = products.find((product) => product.featured);
  return <>
    <HomeHero />
    <ServiceStrip />
    <CategoryShowcase />
    <FeaturedProducts products={products} />
    <PromoFeature product={featured} />
    <section className="page-shell pb-20 pt-4">
      <div className="rounded-[22px] border border-black/[.045] bg-white p-6 sm:flex sm:items-center sm:justify-between sm:p-9"><div><p className="eyebrow">Une expérience plus simple</p><h2 className="font-display mt-3 text-2xl font-extrabold tracking-[-.05em]">Un doute avant de choisir ?</h2><p className="mt-2 max-w-xl text-sm text-muted">Notre équipe est là pour vous aider à trouver le produit qui vous correspond.</p></div><a href={`mailto:${settings.supportEmail}`} className="mt-5 inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-xs font-bold transition hover:border-brand hover:text-brand sm:mt-0">Parler à l’équipe <span aria-hidden="true">↗</span></a></div>
    </section>
  </>;
}
