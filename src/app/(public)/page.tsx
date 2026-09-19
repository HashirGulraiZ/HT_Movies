import Link from "next/link";
import { ArrowRight, Play, Plus, Sparkles } from "lucide-react";

const collections = [
	{ title: "The quiet between storms", type: "Drama · 2025", image: "/uploads/movies/featured.jpg", accent: "#b91c1c" },
	{ title: "Midnight protocol", type: "Thriller · 2024", image: "/uploads/movies/midnight-protocol.jpg", accent: "#7f1d1d" },
	{ title: "The long way home", type: "Adventure · 2025", image: "/uploads/movies/the-long-way-home.jpg", accent: "#9f1239" },
	{ title: "After the last light", type: "Sci-fi · 2024", image: "/uploads/movies/after-the-last-light.jpg", accent: "#4c0519" },
];

export default function HomePage() {
	return (
		<main>
			<section className="relative isolate overflow-hidden border-b border-white/10 bg-[#170609]">
				<div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(190,18,60,0.38),transparent_36%),linear-gradient(105deg,#09090b_16%,rgba(9,9,11,0.76)_52%,rgba(76,5,25,0.2))]" />
				<div className="container-page relative flex min-h-[620px] items-end py-20 sm:min-h-[680px] lg:items-center">
					<div className="max-w-2xl">
						<div className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">
							<Sparkles size={16} /> New this week
						</div>
						<h1 className="max-w-xl font-serif text-5xl leading-[0.95] text-white sm:text-7xl">Stories worth staying up for.</h1>
						<p className="mt-6 max-w-lg text-base leading-7 text-zinc-300 sm:text-lg">Find a sharper kind of streaming: celebrated films, addictive series, live channels, and a little room for the unexpected.</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<Link className="inline-flex items-center gap-2 rounded-button bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-500" href="/movies"><Play size={18} fill="currentColor" /> Start watching</Link>
							<Link className="inline-flex items-center gap-2 rounded-button border border-white/20 bg-white/5 px-5 py-3 font-semibold text-white transition hover:bg-white/10" href="/movies"><Plus size={18} /> Browse library</Link>
						</div>
						<p className="mt-8 text-sm text-zinc-500">4K where available · No ads on premium titles · Cancel anytime</p>
					</div>
				</div>
			</section>
			<section className="container-page section-sm">
				<div className="mb-6 flex items-end justify-between gap-4">
					<div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">Curated for tonight</p><h2 className="mt-2 text-2xl font-semibold text-white">Keep exploring</h2></div>
					<Link className="inline-flex items-center gap-2 text-sm font-semibold text-foreground-muted transition hover:text-white" href="/movies">See all <ArrowRight size={16} /></Link>
				</div>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
					{collections.map((item) => <Link className="group" href="/movies" key={item.title}>
						<div className="media-poster relative overflow-hidden" style={{ background: `linear-gradient(145deg, ${item.accent}, #111113 72%)` }}>
							<div className="absolute inset-x-0 bottom-0 p-4"><p className="font-serif text-xl leading-tight text-white transition group-hover:text-brand-200">{item.title}</p><p className="mt-2 text-xs text-zinc-300">{item.type}</p></div>
						</div>
					</Link>)}
				</div>
			</section>
			<section className="border-y border-white/10 bg-white/[0.02]">
				<div className="container-page flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-400">Made for the whole room</p><h2 className="mt-2 text-3xl font-semibold text-white">One account. Every kind of night.</h2></div><Link className="inline-flex w-fit items-center gap-2 rounded-button border border-brand-500/50 px-5 py-3 font-semibold text-brand-200 transition hover:bg-brand-600 hover:text-white" href="/register">Create your account <ArrowRight size={17} /></Link></div>
			</section>
		</main>
	);
}
