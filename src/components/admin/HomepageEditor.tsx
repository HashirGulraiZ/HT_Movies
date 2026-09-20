"use client";

import { useEffect, useState } from "react";
import { ImageField } from "@/components/admin/MediaField";
import { SectionListEditor, type EditableSection } from "@/components/admin/SectionListEditor";

type Section = EditableSection;
type Banner = { id?: number; title: string; slug: string; description: string | null; image_url: string; cta_label: string; status: "draft" | "published"; movie_id: number | null };

const newSection = (): Section => ({ section_type: "rich_text", title: "New section", content: "", enabled: true });
const newBanner = (): Banner => ({ title: "", slug: "", description: "", image_url: "", cta_label: "Watch now", status: "draft", movie_id: null });

export function HomepageEditor() {
	const [sections, setSections] = useState<Section[]>([]);
	const [banners, setBanners] = useState<Banner[]>([]);
	const [message, setMessage] = useState("");
	useEffect(() => { fetch("/api/admin/homepage").then(async (response) => { if (!response.ok) throw new Error("load failed"); return response.json(); }).then((body) => { setSections(body.sections ?? []); setBanners(body.banners ?? []); }).catch(() => setMessage("Unable to load homepage content.")); }, []);
	function updateBanner(index: number, patch: Partial<Banner>) { setBanners((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item)); }
	function removeBanner(index: number) { setBanners((current) => current.filter((_, itemIndex) => itemIndex !== index)); }
	async function save() {
		setMessage("");
		try {
			const response = await fetch("/api/admin/homepage", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sections, banners }) });
			if (!response.ok) throw new Error("save failed");
			const body = await response.json();
			setSections(body.sections ?? sections);
			setBanners(body.banners ?? banners);
			setMessage("Homepage saved.");
		} catch { setMessage("Unable to save homepage. Check the fields and try again."); }
	}
	return <div className="grid gap-8">
		<section className="card-surface-elevated p-6">
			<div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.2em] text-brand-400">Layout builder</p><h2 className="mt-2 text-2xl font-semibold text-white">Homepage sections</h2><p className="mt-2 text-sm text-muted">Drag a section by its handle to change its order.</p></div><button className="rounded-button border border-white/10 px-4 py-2 text-sm text-white" onClick={() => setSections([...sections, newSection()])}>Add section</button></div>
			<div className="mt-5"><SectionListEditor sections={sections} onChange={setSections} /></div>
		</section>
		<section className="card-surface-elevated p-6">
			<div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm uppercase tracking-[0.2em] text-brand-400">Rotating hero</p><h2 className="mt-2 text-2xl font-semibold text-white">Movie banners</h2><p className="mt-2 text-sm text-muted">Published banners slide automatically and link to their movie slug.</p></div><button className="rounded-button border border-white/10 px-4 py-2 text-sm text-white" onClick={() => setBanners([...banners, newBanner()])}>Add banner</button></div>
			<div className="mt-5 grid gap-4">{banners.map((banner, index) => <div className="grid gap-3 rounded-button border border-white/10 bg-black/20 p-4 md:grid-cols-2" key={banner.id ?? index}><div className="flex items-center justify-between md:col-span-2"><span className="text-xs uppercase tracking-[0.18em] text-muted">Banner {index + 1}</span><button type="button" className="text-sm text-red-200 hover:text-red-100" onClick={() => removeBanner(index)}>Remove</button></div><input className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" placeholder="Banner title" value={banner.title} onChange={(event) => updateBanner(index, { title: event.target.value })} /><input className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" placeholder="Movie slug" value={banner.slug} onChange={(event) => updateBanner(index, { slug: event.target.value })} /><div className="md:col-span-2"><ImageField label="Banner image" folder="general" value={banner.image_url} onChange={(value) => updateBanner(index, { image_url: value })} /></div><textarea className="min-h-20 rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white md:col-span-2" placeholder="Description" value={banner.description ?? ""} onChange={(event) => updateBanner(index, { description: event.target.value })} /><div className="flex gap-3"><input className="min-w-0 flex-1 rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" placeholder="Button label" value={banner.cta_label} onChange={(event) => updateBanner(index, { cta_label: event.target.value })} /><select className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={banner.status} onChange={(event) => updateBanner(index, { status: event.target.value as Banner["status"] })}><option value="draft">Draft</option><option value="published">Published</option></select></div></div>)}</div>
		</section>
		<div className="flex items-center gap-4"><button className="rounded-button bg-brand-600 px-5 py-3 font-semibold text-white" onClick={save}>Save homepage</button>{message && <p className="text-sm text-muted">{message}</p>}</div>
	</div>;
}
