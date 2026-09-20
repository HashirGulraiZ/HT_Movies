"use client";

import { useMemo, useState } from "react";

type EmbedPlayerProps = {
	src: string | null;
	title: string;
	poster?: string | null;
};

type ResolvedMedia = { type: "iframe" | "video"; url: string };

export function resolveMediaUrl(raw: string): ResolvedMedia {
	const url = raw.trim();
	if (!url) return { type: "iframe", url: "" };

	const youtube = url.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/);
	if (youtube) return { type: "iframe", url: `https://www.youtube.com/embed/${youtube[1]}` };

	const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
	if (vimeo) return { type: "iframe", url: `https://player.vimeo.com/video/${vimeo[1]}` };

	const dailymotion = url.match(/dailymotion\.com\/video\/([\w]+)/);
	if (dailymotion) return { type: "iframe", url: `https://www.dailymotion.com/embed/video/${dailymotion[1]}` };

	if (/\.(mp4|webm|ogv|ogg|mov|m4v)(\?.*)?$/i.test(url)) return { type: "video", url };

	return { type: "iframe", url };
}

export default function EmbedPlayer({ src, title, poster }: EmbedPlayerProps) {
	const [active, setActive] = useState(false);
	const resolved = useMemo(() => (src ? resolveMediaUrl(src) : null), [src]);

	if (!resolved || !resolved.url) {
		return (
			<div className="flex aspect-video w-full items-center justify-center rounded-card border border-white/10 bg-black/40">
				<p className="px-6 text-center text-sm text-muted">No video URL has been added for this title yet.</p>
			</div>
		);
	}

	if (!active) {
		return (
			<button
				type="button"
				onClick={() => setActive(true)}
				aria-label={`Play ${title}`}
				className="group relative block aspect-video w-full overflow-hidden rounded-card border border-white/10 bg-black text-left"
			>
				{poster ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img src={poster} alt="" className="h-full w-full object-cover opacity-70 transition duration-300 group-hover:scale-[1.02] group-hover:opacity-90" />
				) : (
					<div className="h-full w-full bg-gradient-to-br from-zinc-900 via-black to-zinc-900" />
				)}
				<span className="absolute inset-0 grid place-items-center">
					<span className="grid h-20 w-20 place-items-center rounded-full bg-brand-600/95 text-white shadow-lg shadow-brand-600/40 transition duration-300 group-hover:scale-110">
						<svg viewBox="0 0 24 24" className="ml-1 h-8 w-8 fill-current" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
					</span>
				</span>
				<span className="absolute bottom-4 left-4 rounded-full bg-black/70 px-4 py-2 text-sm font-semibold text-white backdrop-blur">Play {title}</span>
			</button>
		);
	}

	return (
		<div className="aspect-video w-full overflow-hidden rounded-card border border-white/10 bg-black">
			{resolved.type === "video" ? (
				<video src={resolved.url} poster={poster ?? undefined} controls autoPlay playsInline className="h-full w-full" />
			) : (
				<iframe
					src={`${resolved.url}${resolved.url.includes("?") ? "&" : "?"}autoplay=1`}
					title={title}
					className="h-full w-full"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
					allowFullScreen
				/>
			)}
		</div>
	);
}
