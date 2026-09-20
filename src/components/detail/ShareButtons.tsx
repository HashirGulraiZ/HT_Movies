"use client";

type ShareButtonsProps = {
	title: string;
};

export default function ShareButtons({ title }: ShareButtonsProps) {
	function share(kind: "facebook" | "twitter") {
		const url = typeof window !== "undefined" ? window.location.href : "";
		const target =
			kind === "facebook"
				? `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
				: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
		window.open(target, "_blank", "noopener,noreferrer,width=620,height=520");
	}

	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				onClick={() => share("facebook")}
				aria-label="Share on Facebook"
				className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-white transition hover:bg-brand-500"
			>
				<svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
					<path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8.3v3h2.4v7h2.8z" />
				</svg>
			</button>
			<button
				type="button"
				onClick={() => share("twitter")}
				aria-label="Share on X"
				className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-white transition hover:bg-brand-500"
			>
				<svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden="true">
					<path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.3l7.3-8.3L1.6 2H8l4.4 5.9L18.9 2zm-1.1 18h1.7L7.1 3.9H5.3L17.8 20z" />
				</svg>
			</button>
		</div>
	);
}
