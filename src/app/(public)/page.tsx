import Link from "next/link";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { getPublishedMovies } from "@/lib/db/queries/movies";
import { getSiteSettings } from "@/lib/db/queries/siteSettings";
import { getContentSections, getPublishedHomepageBanners } from "@/lib/db/queries/homepage";
import { HomeBannerSlider } from "@/components/hero/HomeBannerSlider";
import type { HomepageBanner } from "@/lib/db/queries/homepage";
import type { ContentSection } from "@/lib/db/queries/homepage";
import type { Movie } from "@/types/movie";

export const dynamic = "force-dynamic";

export default async function HomePage() {
	const settings = await getSiteSettings();
	let movies: Movie[] = [];
	let banners: HomepageBanner[] = [];
	let sections: ContentSection[] = [];
	try {
		movies = await getPublishedMovies({ featured: true, limit: 8, offset: 0 });
		if (!movies.length) movies = await getPublishedMovies({ limit: 8, offset: 0 });
		banners = await getPublishedHomepageBanners();
		sections = await getContentSections();
	} catch (error) {
		console.error("Homepage catalog query failed", error);
	}
	return (
		<main>
			{banners.length > 0 && <HomeBannerSlider banners={banners} />}
			<section className="relative isolate overflow-hidden border-b border-white/10 bg-[#170609]">
				{settings.hero_image_url && <div className="absolute inset-0 bg-cover bg-center opacity-45" style={{ backgroundImage: `url(${settings.hero_image_url})` }} />}
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(190,18,60,0.38),transparent_36%),linear-gradient(105deg,#09090b_16%,rgba(9,9,11,0.76)_52%,rgba(76,5,25,0.2))]" />
				<div className="container-page relative flex min-h-[620px] items-end py-20 sm:min-h-[680px] lg:items-center">
					<div className="max-w-2xl">
						<div className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
							<Sparkles size={16} /> {settings.site_name}
						</div>
						<h1 className="max-w-xl font-serif text-5xl leading-[0.95] text-white sm:text-7xl">{settings.hero_title}</h1>
						<p className="mt-6 max-w-lg text-base leading-7 text-zinc-300 sm:text-lg">{settings.hero_description}</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<Link className="inline-flex items-center gap-2 rounded-button bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-500" href={settings.hero_cta_url}><Play size={18} fill="currentColor" /> {settings.hero_cta_label}</Link>
						</div>
						<p className="mt-8 text-sm text-zinc-500">{settings.site_description}</p>
					</div>
				</div>
			</section>
			<section className="container-page section-sm">
				<div className="mb-6 flex items-end justify-between gap-4">
					<div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">{settings.featured_section_description}</p><h2 className="mt-2 text-2xl font-semibold text-white">{settings.featured_section_title}</h2></div>
					<Link className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-muted transition hover:text-white" href="/movies">See all <ArrowRight size={16} /></Link>
				</div>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					{movies.map((movie) => <Link className="group" href={`/movies/${movie.slug}`} key={movie.id}>
						<div className="media-poster relative overflow-hidden bg-background-card">
							{movie.poster_url && <img src={movie.poster_url} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105" />}
							<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
							<div className="absolute inset-x-0 bottom-0 p-4"><p className="font-serif text-xl leading-tight text-white transition group-hover:text-brand-200">{movie.title}</p><p className="mt-2 text-xs text-zinc-300">{movie.release_year ?? "—"} · {movie.rating ?? "NR"}</p></div>
						</div>
					</Link>)}
				</div>
			</section>
			<section className="border-y border-white/10 bg-white/[0.02]">
				<div className="container-page flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">Made for the whole room</p><h2 className="mt-2 text-3xl font-semibold text-white">One account. Every kind of night.</h2></div><Link className="inline-flex w-fit items-center gap-2 rounded-button border border-brand-500/50 px-5 py-3 font-semibold text-brand-200 transition hover:bg-brand-600 hover:text-white" href="/register">Create your account <ArrowRight size={17} /></Link></div>
			</section>
			{sections.filter((section) => section.enabled && section.section_type !== "hero").map((section) => <section className="container-page section-sm" key={section.id}>{section.section_type === "spacer" ? <div className="h-8" /> : <><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">{section.title}</p><div className="mt-3 whitespace-pre-wrap leading-7 text-muted">{section.content}</div></>}</section>)}
		</main>
	);
}
