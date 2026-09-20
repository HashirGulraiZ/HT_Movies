"use client";

import { useEffect, useState } from "react";
import { SectionListEditor, type EditableSection } from "@/components/admin/SectionListEditor";

type Section = EditableSection;
type Page = { id: number; title: string; slug: string; description: string | null; status: "draft" | "published" };

const blankSection = (): Section => ({ section_type: "rich_text", title: "", content: "", enabled: true });

export function PageBuilder() {
	const [pages, setPages] = useState<Page[]>([]);
	const [selected, setSelected] = useState<Page | null>(null);
	const [sections, setSections] = useState<Section[]>([]);
	const [form, setForm] = useState({ title: "", slug: "", description: "", status: "draft" });
	const [message, setMessage] = useState("");

	useEffect(() => { void loadPages(); }, []);
	async function loadPages() {
		try {
			const response = await fetch("/api/admin/pages", { cache: "no-store" });
			const body = await response.json().catch(() => null) as { data?: Page[]; error?: string } | null;
			if (!response.ok) throw new Error(body?.error ?? "Unable to load pages.");
			setPages(body?.data ?? []);
		} catch (error) {
			setMessage(error instanceof Error ? error.message : "Unable to load pages.");
		}
	}
	async function selectPage(page: Page) {
		setSelected(page);
		setForm({ title: page.title, slug: page.slug, description: page.description ?? "", status: page.status });
		const response = await fetch(`/api/admin/pages/${page.slug}/sections`);
		if (!response.ok) { setMessage("Unable to load page sections."); return; }
		const body = await response.json().catch(() => null) as { data?: Section[]; error?: string } | null;
		if (!body) { setMessage("Unable to read page sections."); return; }
		setSections(body.data ?? []);
	}
	async function save() {
		setMessage("");
		const pageResponse = selected
			? await fetch(`/api/admin/pages/${selected.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
			: await fetch("/api/admin/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
		if (!pageResponse.ok) { setMessage("Unable to save page details."); return; }
		const pagesResponse = selected ? null : await fetch("/api/admin/pages", { cache: "no-store" });
		const pagesBody = pagesResponse ? await pagesResponse.json().catch(() => null) as { data?: Page[] } | null : null;
		const savedPage = selected ?? (pagesBody?.data ?? []).find((page: Page) => page.slug === form.slug);
		if (!savedPage) { setMessage("Page saved, but could not be loaded."); return; }
		const sectionsResponse = await fetch(`/api/admin/pages/${savedPage.slug}/sections`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sections }) });
		if (!sectionsResponse.ok) { setMessage("Page details saved, but sections could not be saved."); return; }
		await loadPages();
		setSelected(savedPage);
		setMessage("Page saved.");
	}
	async function remove(page: Page) {
		if (page.slug === "home" || !window.confirm(`Delete ${page.title}?`)) return;
		await fetch(`/api/admin/pages/${page.id}`, { method: "DELETE" });
		setSelected(null);
		setSections([]);
		await loadPages();
	}
	return <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
		<aside className="card-surface-elevated p-4"><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold text-white">Pages</h2><button className="text-sm text-brand-300" onClick={() => { setSelected(null); setForm({ title: "", slug: "", description: "", status: "draft" }); setSections([]); }}>New</button></div><div className="grid gap-1">{pages.map((page) => <button className={`rounded-button px-3 py-2 text-left text-sm ${selected?.id === page.id ? "bg-brand-600 text-white" : "text-muted hover:bg-white/5 hover:text-white"}`} key={page.id} onClick={() => void selectPage(page)}>{page.title}<span className="block text-xs opacity-60">/{page.slug}</span></button>)}</div></aside>
		<section className="card-surface-elevated p-6"><div className="grid gap-4 md:grid-cols-2"><label className="grid gap-2 text-sm text-white">Page title<input className="rounded-button border border-white/10 bg-black/20 px-3 py-2" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label><label className="grid gap-2 text-sm text-white">Slug<input className="rounded-button border border-white/10 bg-black/20 px-3 py-2" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} disabled={Boolean(selected)} /></label><label className="grid gap-2 text-sm text-white md:col-span-2">Description<textarea className="min-h-20 rounded-button border border-white/10 bg-black/20 px-3 py-2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label><label className="grid gap-2 text-sm text-white">Status<select className="rounded-button border border-white/10 bg-black/20 px-3 py-2" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="draft">Draft</option><option value="published">Published</option></select></label></div><div className="my-8 border-t border-white/10 pt-6"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-white">Sections</h2><button className="rounded-button border border-white/10 px-3 py-2 text-sm text-white" onClick={() => setSections([...sections, blankSection()])}>Add section</button></div>		<div className="mt-4"><SectionListEditor sections={sections} onChange={setSections} /></div></div><div className="flex gap-3"><button className="rounded-button bg-brand-600 px-5 py-3 font-semibold text-white" onClick={() => void save()}>Save page</button>{selected && selected.slug !== "home" && <button className="rounded-button border border-red-500/30 px-5 py-3 text-red-200" onClick={() => void remove(selected)}>Delete page</button>}{message && <p className="self-center text-sm text-muted">{message}</p>}</div></section>
	</div>;
}
