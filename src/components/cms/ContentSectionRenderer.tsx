import Link from "next/link";
import type { ContentSection } from "@/lib/db/queries/homepage";
import type { Movie } from "@/types/movie";

export function ContentSectionRenderer({ section, movies = [] }: { section: ContentSection; movies?: Movie[] }) {
	if (section.section_type === "spacer") return <div className="h-8" aria-hidden="true" />;
	if (section.section_type === "media_row") return <section className="content-section">
		<div className="mb-5 flex items-end justify-between gap-4">
			<div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">Curated for you</p><h2 className="mt-2 text-2xl font-semibold text-white">{section.title || "Featured titles"}</h2></div>
			<Link className="text-sm text-foreground-muted hover:text-white" href="/movies">Explore all</Link>
		</div>
		{section.content && <p className="mb-4 max-w-2xl text-muted">{section.content}</p>}
		<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
			{movies.map((movie) => <Link className="group" href={`/movies/${movie.slug}`} key={movie.id}>
				<div className="media-poster relative overflow-hidden bg-background-card">
					{movie.poster_url && <img src={movie.poster_url} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105" />}
					<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
					<div className="absolute inset-x-0 bottom-0 p-4"><p className="font-serif text-xl leading-tight text-white group-hover:text-brand-200">{movie.title}</p><p className="mt-2 text-xs text-zinc-300">{movie.release_year ?? "—"} · {movie.rating ?? "NR"}</p></div>
				</div>
			</Link>)}
		</div>
	</section>;
	if (section.section_type === "hero") return <section className="content-section relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-brand-950/60 to-background-card p-8 sm:p-12"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">Featured</p><h2 className="mt-3 max-w-3xl text-3xl font-semibold text-white sm:text-5xl">{section.title}</h2>{section.content && <p className="mt-5 max-w-2xl whitespace-pre-wrap text-lg leading-8 text-muted">{section.content}</p>}</section>;
	return <section className="content-section"><h2 className="text-2xl font-semibold text-white">{section.title}</h2>{section.content && <div className="mt-3 whitespace-pre-wrap leading-7 text-muted">{section.content}</div>}</section>;
}
