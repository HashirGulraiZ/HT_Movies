"use client";

import { useEffect, useState } from "react";

type Section = { id?: number; section_type: "hero" | "media_row" | "rich_text" | "spacer"; title: string; content: string; enabled: boolean | number };
type Page = { id: number; title: string; slug: string; description: string | null; status: "draft" | "published" };

const blankSection = (): Section => ({ section_type: "rich_text", title: "", content: "", enabled: true });

export function PageBuilder() {
	const [pages, setPages] = useState<Page[]>([]);
	const [selected, setSelected] = useState<Page | null>(null);
	const [sections, setSections] = useState<Section[]>([]);
	const [form, setForm] = useState({ title: "", slug: "", description: "", status: "draft" });
	const [message, setMessage] = useState("");
	const [dragIndex, setDragIndex] = useState<number | null>(null);

	useEffect(() => { void loadPages(); }, []);
	async function loadPages() {
		const response = await fetch("/api/admin/pages");
		const body = await response.json();
		setPages(body.data ?? []);
	}
	async function selectPage(page: Page) {
		setSelected(page);
		setForm({ title: page.title, slug: page.slug, description: page.description ?? "", status: page.status });
		const response = await fetch(`/api/admin/pages/${page.slug}/sections`);
		const body = await response.json();
		setSections(body.data ?? []);
	}
	function updateSection(index: number, patch: Partial<Section>) { setSections((current) => current.map((section, itemIndex) => itemIndex === index ? { ...section, ...patch } : section)); }
	function moveSection(target: number) {
		if (dragIndex === null || dragIndex === target) return;
		const next = [...sections];
		const [item] = next.splice(dragIndex, 1);
		next.splice(target, 0, item);
		setSections(next);
		setDragIndex(null);
	}
	async function save() {
		setMessage("");
		const pageResponse = selected
			? await fetch(`/api/admin/pages/${selected.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
			: await fetch("/api/admin/pages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
		if (!pageResponse.ok) { setMessage("Unable to save page details."); return; }
		const savedPage = selected ? selected : (await pageResponse.json(), (await (await fetch("/api/admin/pages")).json()).data.find((page: Page) => page.slug === form.slug));
		if (!savedPage) { setMessage("Page saved, but could not be loaded."); return; }
		await fetch(`/api/admin/pages/${savedPage.slug}/sections`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sections }) });
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
		<section className="card-surface-elevated p-6"><div className="grid gap-4 md:grid-cols-2"><label className="grid gap-2 text-sm text-white">Page title<input className="rounded-button border border-white/10 bg-black/20 px-3 py-2" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} /></label><label className="grid gap-2 text-sm text-white">Slug<input className="rounded-button border border-white/10 bg-black/20 px-3 py-2" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} disabled={Boolean(selected)} /></label><label className="grid gap-2 text-sm text-white md:col-span-2">Description<textarea className="min-h-20 rounded-button border border-white/10 bg-black/20 px-3 py-2" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label><label className="grid gap-2 text-sm text-white">Status<select className="rounded-button border border-white/10 bg-black/20 px-3 py-2" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="draft">Draft</option><option value="published">Published</option></select></label></div><div className="my-8 border-t border-white/10 pt-6"><div className="flex items-center justify-between"><h2 className="text-xl font-semibold text-white">Sections</h2><button className="rounded-button border border-white/10 px-3 py-2 text-sm text-white" onClick={() => setSections([...sections, blankSection()])}>Add section</button></div><div className="mt-4 grid gap-3">{sections.map((section, index) => <div className="rounded-button border border-white/10 bg-black/20 p-4" draggable onDragStart={() => setDragIndex(index)} onDragOver={(event) => event.preventDefault()} onDrop={() => moveSection(index)} key={section.id ?? index}><div className="grid gap-3 md:grid-cols-[1fr_180px_auto]"><input className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" placeholder="Section title" value={section.title} onChange={(event) => updateSection(index, { title: event.target.value })} /><select className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={section.section_type} onChange={(event) => updateSection(index, { section_type: event.target.value as Section["section_type"] })}><option value="hero">Hero</option><option value="media_row">Media row</option><option value="rich_text">Rich text</option><option value="spacer">Spacer</option></select><label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" checked={Boolean(section.enabled)} onChange={(event) => updateSection(index, { enabled: event.target.checked })} /> Enabled</label><textarea className="min-h-24 rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white md:col-span-3" placeholder="Section content" value={section.content} onChange={(event) => updateSection(index, { content: event.target.value })} /></div></div>)}</div></div><div className="flex gap-3"><button className="rounded-button bg-brand-600 px-5 py-3 font-semibold text-white" onClick={() => void save()}>Save page</button>{selected && selected.slug !== "home" && <button className="rounded-button border border-red-500/30 px-5 py-3 text-red-200" onClick={() => void remove(selected)}>Delete page</button>}{message && <p className="self-center text-sm text-muted">{message}</p>}</div></section>
	</div>;
}
