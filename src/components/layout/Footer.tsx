import Link from "next/link";

export function Footer() {
	return (
		<footer className="border-t border-white/10 bg-black/20">
			<div className="container-page flex flex-col gap-4 py-8 text-sm text-foreground-subtle sm:flex-row sm:items-center sm:justify-between">
				<p>© {new Date().getFullYear()} HTMovie</p>
				<div className="flex gap-5">
					<Link className="transition hover:text-white" href="/about">About</Link>
					<Link className="transition hover:text-white" href="/languages">Languages</Link>
					<Link className="transition hover:text-white" href="/genres">Genres</Link>
				</div>
			</div>
		</footer>
	);
}
