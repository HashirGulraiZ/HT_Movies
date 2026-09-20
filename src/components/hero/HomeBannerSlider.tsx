"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Info, Play, Volume2, VolumeX } from "lucide-react";
import type { HomepageBanner } from "@/lib/db/queries/homepage";

const SLIDE_INTERVAL_MS = 7000;

export function HomeBannerSlider({ banners }: { banners: HomepageBanner[] }) {
	const [active, setActive] = useState(0);
	const [paused, setPaused] = useState(false);
	const [muted, setMuted] = useState(true);

	const go = useCallback((index: number) => {
		if (!banners.length) return;
		setActive((index + banners.length) % banners.length);
	}, [banners.length]);

	useEffect(() => {
		if (banners.length < 2 || paused) return;
		const timer = window.setInterval(() => setActive((current) => (current + 1) % banners.length), SLIDE_INTERVAL_MS);
		return () => window.clearInterval(timer);
	}, [banners.length, paused]);

	if (!banners.length) return null;
	const banner = banners[active];
	const metaParts = [banner.description, "2026"].filter(Boolean).slice(0, 3);

	return (
		<section aria-label="Featured titles" aria-roledescription="carousel" className="relative isolate overflow-hidden bg-black pb-6" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
			<div className="mx-3 overflow-hidden rounded-xl sm:mx-5 lg:mx-7">
				<div className="relative min-h-[560px] sm:min-h-[660px] lg:min-h-[720px]">
					{banners.map((item, index) => (
						<div aria-hidden={index !== active} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${index === active ? "ken-burns opacity-100" : "opacity-0"}`} key={item.id} style={{ backgroundImage: `url(${item.image_url})` }} />
					))}
					<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.62)_35%,transparent_65%)]" />
					<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
					<button aria-label={muted ? "Unmute preview" : "Mute preview"} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition hover:bg-black/70" onClick={() => setMuted((value) => !value)} type="button">
						{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
					</button>
					<div className="absolute inset-x-0 bottom-0 px-6 pb-10 sm:px-10 sm:pb-14 lg:px-14">
						<div className="hero-animate max-w-2xl" key={active}>
							<p className="text-sm font-bold uppercase tracking-[0.35em] text-red-500">{banner.cta_label || "Original Series"}</p>
							<h2 className="mt-2 font-serif text-5xl font-bold uppercase leading-[0.95] tracking-tight text-red-500 sm:text-7xl lg:text-8xl" style={{ textShadow: "0 4px 30px rgba(0,0,0,0.7)" }}>{banner.title}</h2>
							<div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-medium text-white sm:text-base">
								<span>Series</span>
								{metaParts.map((part) => <span className="flex items-center gap-2.5" key={part}><span className="h-1 w-1 rounded-full bg-red-500" />{part}</span>)}
								<span className="rounded border border-white/40 px-1.5 text-xs font-semibold">TV-MA</span>
							</div>
							<div className="mt-6 flex flex-wrap gap-3">
								<Link className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-3 font-bold text-black transition hover:bg-red-700" href={`/movies/${banner.slug}`}><Play fill="currentColor" size={20} /> Play</Link>
								<Link className="inline-flex items-center gap-2 rounded-full bg-white/25 px-7 py-3 font-bold text-white backdrop-blur transition hover:bg-white/35" href={`/movies/${banner.slug}`}><Info size={20} /> More Info</Link>
							</div>
						</div>
					</div>
					<div className="absolute bottom-10 right-6 hidden items-center gap-3 sm:flex sm:right-10 lg:right-14">
						<span className="flex items-center gap-1.5 rounded bg-red-600 px-2 py-1 text-xs font-extrabold leading-none text-white"><span className="text-[9px]">TOP</span><span className="text-sm">10</span></span>
						<span className="rounded bg-black/60 px-2 py-1.5 text-xs font-bold text-white backdrop-blur">#{active + 1} In Shows Today</span>
						<span className="rounded border border-white/30 bg-black/50 px-2 py-1 text-xs font-bold text-white backdrop-blur">TV-MA</span>
					</div>
				</div>
			</div>
			{banners.length > 1 && (
				<>
					<button aria-label="Previous slide" className="absolute left-1 top-1/2 hidden h-14 w-10 -translate-y-1/2 place-items-center rounded-md bg-black/40 text-white opacity-0 transition hover:bg-black/70 hover:opacity-100 sm:grid sm:opacity-100" onClick={() => go(active - 1)} type="button"><ChevronLeft size={22} /></button>
					<button aria-label="Next slide" className="absolute right-1 top-1/2 hidden h-14 w-10 -translate-y-1/2 place-items-center rounded-md bg-black/40 text-white opacity-0 transition hover:bg-black/70 hover:opacity-100 sm:grid sm:opacity-100" onClick={() => go(active + 1)} type="button"><ChevronRight size={22} /></button>
					<div aria-label="Homepage banners" className="mt-4 flex justify-center gap-2">
						{banners.map((item, index) => (
							<button aria-label={`Show ${item.title}`} className={`h-0.5 w-8 rounded-full transition ${index === active ? "bg-white" : "bg-white/30"}`} key={item.id} onClick={() => go(index)} type="button" />
						))}
					</div>
				</>
			)}
		</section>
	);
}


