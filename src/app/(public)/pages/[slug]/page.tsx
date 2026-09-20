import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/db/queries/pages";
import { getPublicContentSections } from "@/lib/db/queries/homepage";
import { ContentSectionRenderer } from "@/components/cms/ContentSectionRenderer";

export const dynamic = "force-dynamic";

export default async function CMSPage({ params }: { params: Promise<{ slug: string }> }) {
	const slug = (await params).slug;
	const page = await getPageBySlug(slug, true);
	if (!page) notFound();
	const sections = await getPublicContentSections(slug);
	return <main className="container-page section"><header className="mb-12 max-w-3xl"><p className="text-sm uppercase tracking-[0.2em] text-brand-400">HTMovie</p><h1 className="mt-3 text-5xl font-semibold text-white">{page.title}</h1>{page.description && <p className="mt-4 text-lg leading-8 text-muted">{page.description}</p>}</header><div className="grid gap-8">{sections.map((section) => <ContentSectionRenderer section={section} key={section.id} />)}</div></main>;
}
