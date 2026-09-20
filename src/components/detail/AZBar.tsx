import Link from "next/link";

const LETTERS = ["#", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

export default function AZBar() {
	return (
		<nav aria-label="Browse alphabetically" className="border-b border-white/10 bg-black/40">
			<div className="container-page flex flex-wrap gap-1.5 py-4">
				{LETTERS.map((letter) => (
					<Link
						key={letter}
						href={`/movies?letter=${letter === "#" ? "0-9" : letter}`}
						className="grid h-8 min-w-8 place-items-center rounded-button bg-white/[0.06] px-2 text-xs font-bold text-zinc-300 transition hover:bg-brand-600 hover:text-white"
					>
						{letter}
					</Link>
				))}
			</div>
		</nav>
	);
}
