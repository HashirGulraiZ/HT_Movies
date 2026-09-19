"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { HomepageBanner } from "@/lib/db/queries/homepage";

export function HomeBannerSlider({ banners }: { banners: HomepageBanner[] }) {
	const [active, setActive] = useState(0);
	useEffect(() => {
		if (banners.length < 2) return;
		const timer = window.setInterval(() => setActive((current) => (current + 1) % banners.length), 6000);
		return () => window.clearInterval(timer);
	}, [banners.length]);
	if (!banners.length) return null;
	const banner = banners[active];
	return <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#170609]">
		<div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url(${banner.image_url})` }} />
		<div className="absolute inset-0 bg-[linear-gradient(105deg,#09090b_16%,rgba(9,9,11,0.75)_52%,rgba(76,5,25,0.2))]" />
		<div className="container-page relative flex min-h-[620px] items-end py-20 sm:min-h-[680px] lg:items-center">
			<div className="max-w-2xl">
				<p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-300">Featured now</p>
				<h1 className="mt-5 max-w-xl font-serif text-5xl leading-[0.95] text-white sm:text-7xl">{banner.title}</h1>
				{banner.description && <p className="mt-6 max-w-lg text-base leading-7 text-zinc-300 sm:text-lg">{banner.description}</p>}
				<Link className="mt-8 inline-flex rounded-button bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-500" href={`/movies/${banner.slug}`}>{banner.cta_label}</Link>
				<div className="mt-8 flex gap-2" aria-label="Homepage banners">
					{banners.map((item, index) => <button aria-label={`Show ${item.title}`} className={`h-1.5 rounded-full transition-all ${index === active ? "w-10 bg-brand-400" : "w-4 bg-white/30"}`} key={item.id} onClick={() => setActive(index)} />)}
				</div>
			</div>
		</div>
	</section>;
}
