import Link from "next/link";
import { getSiteSettings } from "@/lib/db/queries/siteSettings";

export async function Footer() {
	const settings = await getSiteSettings();
	const links = settings.footer_links.split("\n").map((value) => {
		const [label, href] = value.split("|");
		return { label, href };
	}).filter((link) => link.label && link.href);
	return (
		<footer className="border-t border-white/10 bg-black/20">
			<div className="container-page flex flex-col gap-4 py-8 text-sm text-foreground-subtle sm:flex-row sm:items-center sm:justify-between">
				<p>© {new Date().getFullYear()} {settings.footer_text}</p>
				<div className="flex gap-5">
					{(links.length ? links : [{ label: "About", href: "/about" }, { label: "Languages", href: "/languages" }, { label: "Genres", href: "/genres" }]).map((link) => <Link className="transition hover:text-white" href={link.href} key={link.href}>{link.label}</Link>)}
				</div>
			</div>
		</footer>
	);
}
