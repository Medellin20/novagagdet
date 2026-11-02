import Link from "next/link";
import { ArrowRight, ArrowUpRight, BadgeCheck, Box, Headphones, ShieldCheck, Truck } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

const heroImage = "/images/hero-nova.webp";

export function HomeHero() {
  return (
    <section className="page-shell pt-5 sm:pt-7">
      <div className="relative isolate min-h-[540px] overflow-hidden rounded-[28px] bg-[#151722] px-6 py-9 text-white sm:min-h-[590px] sm:px-12 sm:py-12 lg:px-[7.5%]">
        <div className="absolute inset-0 -z-20 bg-cover bg-[center_45%] opacity-[.78]" style={{ backgroundImage: `url('${heroImage}')` }} />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#151722] via-[#151722]/95 to-[#151722]/5" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#151722]/30 via-transparent to-transparent" />
        <div className="animate-rise relative z-10 flex h-full min-h-[450px] max-w-[520px] flex-col justify-center sm:min-h-[490px]">
          <h1 className="font-display text-[clamp(48px,8vw,92px)] font-extrabold leading-[.94] tracking-[-.075em]">Le bon<br /><span className="text-[#aab2ff]">choix.</span><span className="text-[#ff8b6b]"> Point.</span></h1>
          <p className="mt-6 max-w-[420px] text-sm leading-7 text-white/65 sm:text-base">iPhone, PlayStation, accessoires et jeux. Une sélection soignée, sans détour, à prix doux.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/catalogue" className="focus-ring inline-flex min-h-12 items-center gap-3 rounded-full bg-brand px-6 text-sm font-bold text-white transition hover:bg-[#6072ff]">Voir la sélection <ArrowRight size={16} /></Link>
            <span className="inline-flex items-center gap-2 px-2 text-xs font-medium text-white/60"><ShieldCheck size={16} /> Achat en toute clarté</span>
          </div>
        </div>
        <div className="absolute bottom-7 right-7 hidden max-w-[230px] rounded-2xl border border-white/15 bg-[#10121b]/65 p-4 backdrop-blur-md lg:block animate-float">
          <p className="text-[9px] font-bold uppercase tracking-[.15em] text-white/45">Le détail Nova</p><p className="mt-2 font-display text-sm font-semibold leading-5">Une gamme courte.<br />Un choix plus simple.</p>
        </div>
        <div className="absolute bottom-0 right-[12%] top-0 -z-10 w-px bg-white/[.08]" />
      </div>
    </section>
  );
}

export function ServiceStrip() {
  const values = [
    { icon: Truck, title: "Commande en ligne", body: "Un parcours simple et guidé" },
    { icon: ShieldCheck, title: "Données protégées", body: "Traitement côté serveur" },
    { icon: BadgeCheck, title: "Sélection soignée", body: "Des essentiels choisis" },
    { icon: Headphones, title: "Support boutique", body: "Une équipe à votre écoute" },
  ];
  return <div className="page-shell mt-9"><div className="grid grid-cols-2 gap-3 rounded-[22px] border border-black/[.045] bg-white p-4 sm:grid-cols-4 sm:gap-1 sm:px-6 sm:py-5">{values.map(({ icon: Icon, title, body }) => <div key={title} className="flex items-center gap-3 px-2 py-2 sm:px-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f1ff] text-brand"><Icon size={18} strokeWidth={1.7} /></span><div><p className="text-[11px] font-bold sm:text-xs">{title}</p><p className="mt-1 text-[10px] text-muted sm:text-[11px]">{body}</p></div></div>)}</div></div>;
}

export function CategoryShowcase() {
  const categories = [
    { name: "iPhone", label: "Pensé pour suivre votre rythme.", slug: "smartphones", number: "01", icon: "01" },
    { name: "PlayStation", label: "Le jeu prend une autre dimension.", slug: "consoles", number: "02", icon: "02" },
    { name: "Accessoires & Jeux", label: "Les accessoires essentiels et vos jeux préférés.", slug: "accessoires", number: "03", icon: "03" },
  ];
  return <section className="page-shell section-space pb-8">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Les univers Nova</p><h2 className="font-display mt-3 text-3xl font-extrabold tracking-[-.055em] sm:text-[40px]">À chacun son essentiel.</h2></div><Link href="/catalogue" className="inline-flex items-center gap-2 text-xs font-bold text-ink transition hover:text-brand">Explorer le catalogue <ArrowUpRight size={15} /></Link></div>
    <div className="grid gap-3 md:grid-cols-3">{categories.map((category, index) => <Link href={`/catalogue?categorie=${category.slug}`} key={category.slug} className={`group relative isolate flex min-h-[205px] flex-col justify-between overflow-hidden rounded-[22px] p-6 text-white sm:min-h-[230px] sm:p-8 ${index === 1 ? "bg-[#252a43]" : index === 2 ? "bg-[#e6e9ff] !text-ink" : "bg-[#e4e6f0] !text-ink"}`}>
      <span className="absolute -right-6 -top-10 -z-10 font-display text-[180px] font-extrabold leading-none opacity-[.06] transition group-hover:scale-110">{category.icon}</span><span className="text-[10px] font-bold uppercase tracking-[.16em] opacity-55">0{index + 1} / Collection</span><div><h3 className="font-display text-2xl font-extrabold tracking-[-.05em]">{category.name}</h3><p className="mt-2 text-xs opacity-60">{category.label}</p><span className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold">Explorer <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span></div>
    </Link>)}</div>
  </section>;
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  const featured = products.filter((product) => product.featured).slice(0, 4);
  return <section className="page-shell section-space pt-14">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Le choix de la rédaction</p><h2 className="font-display mt-3 text-3xl font-extrabold tracking-[-.055em] sm:text-[40px]">Les pièces du moment.</h2><p className="mt-2 text-sm text-muted">Les bons produits. Les bons détails. Rien de superflu.</p></div><Link href="/catalogue" className="inline-flex items-center gap-2 text-xs font-bold transition hover:text-brand">Tout le catalogue <ArrowRight size={15} /></Link></div>
    {featured.length ? <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">{featured.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}</div> : <div className="rounded-2xl border border-dashed border-line bg-white p-10 text-center text-sm text-muted">Les prochaines références arrivent bientôt.</div>}
  </section>;
}

export function PromoFeature({ product }: { product?: Product }) {
  return <section className="page-shell pb-10 pt-5">
    <div className="relative grid overflow-hidden rounded-[26px] bg-[#e9ebfb] sm:grid-cols-[1.2fr_.8fr]">
      <div className="relative z-10 flex flex-col justify-center p-7 sm:p-10 lg:p-14"><span className="eyebrow">L’offre de la semaine</span><h2 className="font-display mt-4 max-w-[560px] text-3xl font-extrabold leading-[1.05] tracking-[-.06em] sm:text-5xl">Les bons plans<br />sans compromis.</h2><p className="mt-4 max-w-[440px] text-sm leading-6 text-[#656a7c]">Retrouvez une sélection d’essentiels à prix doux, pour la maison, les loisirs et partout entre les deux.</p><Link href="/catalogue?offres=1" className="mt-7 inline-flex w-fit items-center gap-3 rounded-full bg-ink px-5 py-3 text-xs font-bold text-white transition hover:bg-brand">Découvrir les offres <ArrowRight size={15} /></Link></div>
      {product ? <div className="relative min-h-[260px] bg-[#f4f4f8] p-8 sm:min-h-[340px]"><img src={product.imageUrl} alt={product.name} className="absolute inset-0 h-full w-full object-contain p-8 transition duration-500 hover:scale-[1.03]"/><div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3 py-2 text-xs font-bold shadow-sm">{product.name} · dès {formatPrice(product.price)}</div></div> : <div className="min-h-[260px] bg-gradient-to-br from-[#d8ddff] via-[#e6e8fb] to-[#b9c4ff]" />}
    </div>
  </section>;
}
