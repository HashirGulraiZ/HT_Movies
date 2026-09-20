import Link from "next/link";
import { ArrowRight, Radio } from "lucide-react";

const channelTags = ["24/7 news", "Sports", "Movie channels", "Music"];

export function LiveTvPromo() {
	return (
		<section className="section-sm">
			<div className="container-page">
				<div className="relative isolate overflow-hidden rounded-card border border-white/10 bg-[#170609] px-6 py-10 sm:px-10 sm:py-12">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(225,29,72,0.35),transparent_45%)]" />
					<div className="absolute inset-0 bg-[linear-gradient(100deg,#09090b_30%,rgba(9,9,11,0.4))]" />
					<div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
						<div className="max-w-xl">
							<p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand-300">
								<span className="relative flex h-2.5 w-2.5">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
									<span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-500" />
								</span>
								Live now
							</p>
							<h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Live TV, around the clock</h2>
							<p className="mt-4 leading-7 text-zinc-300">News, sports, and cinema streaming in real time. Jump into a channel and never miss a moment.</p>
							<div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-zinc-300">
								{channelTags.map((tag) => <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5" key={tag}>{tag}</span>)}
							</div>
						</div>
						<div className="flex flex-wrap items-center gap-4">
							<span className="grid h-14 w-14 place-items-center rounded-full border border-brand-500/40 bg-brand-600/20 text-brand-300"><Radio size={26} /></span>
							<Link className="inline-flex items-center gap-2 rounded-button bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-500" href="/live-tv">Open Live TV <ArrowRight size={17} /></Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
