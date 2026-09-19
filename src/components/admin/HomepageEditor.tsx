"use client";

import { useEffect, useState } from "react";
import { ImageField } from "@/components/admin/MediaField";

type Section = { id?: number; section_type: "hero" | "media_row" | "rich_text" | "spacer"; title: string; content: string; enabled: boolean | number };
type Banner = { id?: number; title: string; slug: string; description: string; image_url: string; cta_label: string; status: "draft" | "published"; movie_id: number | null };

const newSection = (): Section => ({ section_type: "rich_text", title: "New section", content: "", enabled: true });
const newBanner = (): Banner => ({ title: "", slug: "", description: "", image_url: "", cta_label: "Watch now", status: "draft", movie_id: null });

export function HomepageEditor() {
	const [sections, setSections] = useState<Section[]>([]);
	const [banners, setBanners] = useState<Banner[]>([]);
	const [message, setMessage] = useState("");
	const [dragIndex, setDragIndex] = useState<number | null>(null);
	useEffect(() => { fetch("/api/admin/homepage").then((response) => response.json()).then((body) => { setSections(body.sections ?? []); setBanners(body.banners ?? []); }).catch(() => setMessage("Unable to load homepage content.")); }, []);
	function moveSection(target: number) {
		if (dragIndex === null || dragIndex === target) return;
		const next = [...sections];
		const [item] = next.splice(dragIndex, 1);
		next.splice(target, 0, item);
		setSections(next);
		setDragIndex(null);
	}
	function updateSection(index: number, patch: Partial<Section>) { setSections((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item)); }
	function updateBanner(index: number, patch: Partial<Banner>) { setBanners((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item)); }
	async function save() {
		const response = await fetch("/api/admin/homepage", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sections, banners }) });
		setMessage(response.ok ? "Homepage saved." : "Unable to save homepage.");
	}
	return <div className="grid gap-8">
		<section className="card-surface-elevated p-6">
			<div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.2em] text-brand-400">Layout builder</p><h2 className="mt-2 text-2xl font-semibold text-white">Homepage sections</h2><p className="mt-2 text-sm text-muted">Drag a section by its handle to change its order.</p></div><button className="rounded-button border border-white/10 px-4 py-2 text-sm text-white" onClick={() => setSections([...sections, newSection()])}>Add section</button></div>
			<div className="mt-5 grid gap-3">{sections.map((section, index) => <div draggable onDragStart={() => setDragIndex(index)} onDragOver={(event) => event.preventDefault()} onDrop={() => moveSection(index)} className="rounded-button border border-white/10 bg-black/20 p-4" key={section.id ?? index}><div className="flex items-start gap-3"><span className="cursor-grab px-2 py-2 text-muted" title="Drag to reorder">⋮⋮</span><div className="grid flex-1 gap-3 sm:grid-cols-3"><input className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={section.title} onChange={(event) => updateSection(index, { title: event.target.value })} placeholder="Section title" /><select className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={section.section_type} onChange={(event) => updateSection(index, { section_type: event.target.value as Section["section_type"] })}><option value="hero">Hero</option><option value="media_row">Media row</option><option value="rich_text">Rich text</option><option value="spacer">Spacer</option></select><label className="flex items-center gap-2 text-sm text-white"><input type="checkbox" checked={Boolean(section.enabled)} onChange={(event) => updateSection(index, { enabled: event.target.checked })} /> Enabled</label><textarea className="min-h-20 rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white sm:col-span-3" value={section.content} onChange={(event) => updateSection(index, { content: event.target.value })} placeholder="Content or configuration JSON" /></div></div></div>)}</div>
		</section>
		<section className="card-surface-elevated p-6">
			<div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.2em] text-brand-400">Rotating hero</p><h2 className="mt-2 text-2xl font-semibold text-white">Movie banners</h2><p className="mt-2 text-sm text-muted">Published banners slide automatically and link to their movie slug.</p></div><button className="rounded-button border border-white/10 px-4 py-2 text-sm text-white" onClick={() => setBanners([...banners, newBanner()])}>Add banner</button></div>
			<div className="mt-5 grid gap-4">{banners.map((banner, index) => <div className="grid gap-3 rounded-button border border-white/10 bg-black/20 p-4 md:grid-cols-2" key={banner.id ?? index}><input className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" placeholder="Banner title" value={banner.title} onChange={(event) => updateBanner(index, { title: event.target.value })} /><input className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" placeholder="Movie slug" value={banner.slug} onChange={(event) => updateBanner(index, { slug: event.target.value })} /><div className="md:col-span-2"><ImageField label="Banner image" folder="general" value={banner.image_url} onChange={(value) => updateBanner(index, { image_url: value })} /></div><textarea className="min-h-20 rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white md:col-span-2" placeholder="Description" value={banner.description} onChange={(event) => updateBanner(index, { description: event.target.value })} /><div className="flex gap-3"><input className="min-w-0 flex-1 rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" placeholder="Button label" value={banner.cta_label} onChange={(event) => updateBanner(index, { cta_label: event.target.value })} /><select className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={banner.status} onChange={(event) => updateBanner(index, { status: event.target.value as Banner["status"] })}><option value="draft">Draft</option><option value="published">Published</option></select></div></div>)}</div>
		</section>
		<div className="flex items-center gap-4"><button className="rounded-button bg-brand-600 px-5 py-3 font-semibold text-white" onClick={save}>Save homepage</button>{message && <p className="text-sm text-muted">{message}</p>}</div>
	</div>;
}
