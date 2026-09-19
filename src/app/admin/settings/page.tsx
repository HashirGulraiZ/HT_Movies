"use client";

import { useEffect, useState } from "react";
import { ImageField } from "@/components/admin/MediaField";

const fields = [
	["site_name", "Site name"], ["site_description", "Site description"], ["hero_title", "Hero title"],
	["hero_description", "Hero description"], ["hero_image_url", "Hero image URL"], ["hero_cta_label", "Hero button label"],
	["hero_cta_url", "Hero button URL"], ["featured_section_title", "Featured section title"],
	["featured_section_description", "Featured section eyebrow"],
	["header_logo_url", "Header logo URL"],
	["header_favicon_url", "Favicon URL"],
	["header_navigation", "Header navigation (comma separated labels)"],
	["footer_text", "Footer text"],
	["footer_links", "Footer links (label|url, one per line)"],
] as const;

export default function AdminSettingsPage() {
	const [settings, setSettings] = useState<Record<string, string>>({});
	const [message, setMessage] = useState("");
	useEffect(() => { fetch("/api/admin/settings").then((response) => response.json()).then((body) => setSettings(body.data ?? {})).catch(() => setMessage("Unable to load settings")); }, []);
	async function save(event: React.FormEvent) {
		event.preventDefault();
		setMessage("");
		const response = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
		setMessage(response.ok ? "Settings saved. Refresh the public site to see the changes." : "Unable to save settings.");
	}
	return <main className="py-4"><div className="mb-8"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">Configuration</p><h1 className="mt-2 text-4xl font-semibold text-white">Homepage settings</h1><p className="mt-3 text-muted">Control the public branding, hero, and featured section without editing code.</p></div><form onSubmit={save} className="card-surface-elevated grid gap-5 p-6">{fields.map(([key, label]) => key === "header_logo_url" || key === "header_favicon_url" || key === "hero_image_url" ? <ImageField key={key} label={label} folder={key === "hero_image_url" ? "general" : "branding"} value={settings[key] ?? ""} onChange={(value) => setSettings({ ...settings, [key]: value })} /> : <label key={key} className="grid gap-2 text-sm font-medium text-white">{label}{key.includes("description") || key === "footer_links" ? <textarea className="min-h-24 rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={settings[key] ?? ""} onChange={(event) => setSettings({ ...settings, [key]: event.target.value })} /> : <input className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={settings[key] ?? ""} onChange={(event) => setSettings({ ...settings, [key]: event.target.value })} />}</label>)}<div className="flex items-center gap-4"><button className="rounded-button bg-brand-600 px-5 py-3 font-semibold text-white" type="submit">Save settings</button>{message && <p className="text-sm text-muted">{message}</p>}</div></form></main>;
}
