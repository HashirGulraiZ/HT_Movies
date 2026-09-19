import { HomepageEditor } from "@/components/admin/HomepageEditor";

export default function HomepageAdminPage() {
	return <main className="py-4"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">Visual CMS</p><h1 className="mt-2 text-4xl font-semibold text-white">Homepage editor</h1><p className="mt-3 text-muted">Build the home page, rotating banners, and section order without editing code.</p></div><HomepageEditor /></main>;
}
