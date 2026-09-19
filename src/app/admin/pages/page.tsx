import { PageBuilder } from "@/components/admin/PageBuilder";

export default function AdminPagesPage() {
	return <main className="py-4"><div className="mb-8"><p className="text-sm uppercase tracking-[0.2em] text-brand-400">Visual CMS</p><h1 className="mt-2 text-4xl font-semibold text-white">Pages</h1><p className="mt-3 text-muted">Edit existing pages or create new published pages with reorderable sections.</p></div><PageBuilder /></main>;
}
