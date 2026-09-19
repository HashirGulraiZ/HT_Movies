import Link from "next/link";
import { Search, UserRound } from "lucide-react";

const navigation = [
	{ href: "/movies", label: "Movies" },
	{ href: "/tv-shows", label: "Series" },
	{ href: "/live-tv", label: "Live TV" },
	{ href: "/games", label: "Games" },
];

export function Header() {
	return (
		<header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-background/85 backdrop-blur-xl">
			<div className="container-page flex h-16 items-center justify-between gap-6">
				<Link className="shrink-0 text-xl font-bold tracking-tight text-white" href="/">
					HT<span className="text-brand-500">Movie</span>
				</Link>
				<nav className="hidden items-center gap-7 text-sm text-foreground-muted md:flex" aria-label="Primary navigation">
					{navigation.map((item) => (
						<Link className="transition hover:text-white" href={item.href} key={item.href}>
							{item.label}
						</Link>
					))}
				</nav>
				<div className="flex items-center gap-2">
					<Link className="rounded-full p-2 text-foreground-muted transition hover:bg-white/10 hover:text-white" href="/search" aria-label="Search">
						<Search size={19} />
					</Link>
					<Link className="hidden rounded-button border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:border-brand-500 hover:text-brand-300 sm:inline-flex" href="/login">
						Sign in
					</Link>
					<Link className="rounded-full bg-brand-600 p-2 text-white transition hover:bg-brand-500" href="/profile" aria-label="Profile">
						<UserRound size={18} />
					</Link>
				</div>
			</div>
		</header>
	);
}
