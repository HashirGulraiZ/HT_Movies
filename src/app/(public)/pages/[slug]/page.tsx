import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/db/queries/pages";
import { getPublicContentSections } from "@/lib/db/queries/homepage";

export const dynamic = "force-dynamic";

export default async function CMSPage({ params }: { params: Promise<{ slug: string }> }) {
	const slug = (await params).slug;
	const page = await getPageBySlug(slug, true);
	if (!page) notFound();
	const sections = await getPublicContentSections(slug);
	return <main className="container-page section"><header className="mb-12 max-w-3xl"><p className="text-sm uppercase tracking-[0.2em] text-brand-400">HTMovie</p><h1 className="mt-3 text-5xl font-semibold text-white">{page.title}</h1>{page.description && <p className="mt-4 text-lg leading-8 text-muted">{page.description}</p>}</header><div className="grid gap-8">{sections.map((section) => section.section_type === "spacer" ? <div className="h-8" key={section.id} /> : <section className="card-surface-elevated p-6" key={section.id}><h2 className="text-2xl font-semibold text-white">{section.title}</h2><div className="mt-3 whitespace-pre-wrap leading-7 text-muted">{section.content}</div></section>)}</div></main>;
}
