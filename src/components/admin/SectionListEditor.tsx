"use client";

import { Copy, GripVertical, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export type EditableSection = {
	id?: number;
	section_type: "hero" | "media_row" | "rich_text" | "spacer";
	title: string;
	content: string;
	enabled: boolean | number;
};

const sectionLabels: Record<EditableSection["section_type"], string> = {
	hero: "Hero",
	media_row: "Media row",
	rich_text: "Rich text",
	spacer: "Spacer",
};

export function SectionListEditor({
	sections,
	onChange,
}: {
	sections: EditableSection[];
	onChange: (sections: EditableSection[]) => void;
}) {
	const [dragIndex, setDragIndex] = useState<number | null>(null);

	function move(from: number, to: number) {
		if (to < 0 || to >= sections.length || from === to) return;
		const next = [...sections];
		const [item] = next.splice(from, 1);
		next.splice(to, 0, item);
		onChange(next);
		setDragIndex(null);
	}

	function update(index: number, patch: Partial<EditableSection>) {
		onChange(sections.map((section, itemIndex) => itemIndex === index ? { ...section, ...patch } : section));
	}

	function remove(index: number) {
		onChange(sections.filter((_, itemIndex) => itemIndex !== index));
	}

	function duplicate(index: number) {
		const copy = { ...sections[index], id: undefined, title: `${sections[index].title || "Section"} copy` };
		const next = [...sections];
		next.splice(index + 1, 0, copy);
		onChange(next);
	}

	return <div className="grid gap-3">
		{sections.length === 0 && <div className="rounded-xl border border-dashed border-white/15 px-5 py-10 text-center text-sm text-muted">No sections yet. Add one to start building this page.</div>}
		{sections.map((section, index) => <article
			className={`rounded-xl border p-4 transition ${Boolean(section.enabled) ? "border-white/10 bg-black/20" : "border-white/5 bg-black/10 opacity-60"}`}
			draggable
			onDragStart={() => setDragIndex(index)}
			onDragOver={(event) => event.preventDefault()}
			onDrop={() => dragIndex !== null && move(dragIndex, index)}
			key={section.id ?? `new-${index}`}
		>
			<div className="flex items-start gap-3">
				<GripVertical className="mt-2 shrink-0 cursor-grab text-muted" size={18} aria-label="Drag to reorder" />
				<div className="grid min-w-0 flex-1 gap-3">
					<div className="grid gap-3 md:grid-cols-[1fr_170px_auto]">
						<input aria-label="Section title" className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={section.title} onChange={(event) => update(index, { title: event.target.value })} placeholder="Section title" />
						<select aria-label="Section type" className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={section.section_type} onChange={(event) => update(index, { section_type: event.target.value as EditableSection["section_type"] })}>
							{Object.entries(sectionLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
						</select>
						<label className="flex items-center gap-2 px-1 text-sm text-white"><input type="checkbox" checked={Boolean(section.enabled)} onChange={(event) => update(index, { enabled: event.target.checked })} /> Enabled</label>
					</div>
					{section.section_type !== "spacer" && <textarea aria-label="Section content" className="min-h-24 rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={section.content} onChange={(event) => update(index, { content: event.target.value })} placeholder={section.section_type === "media_row" ? "Optional row description or data configuration" : "Section content"} />}
					{section.section_type === "spacer" && <p className="text-xs text-muted">Adds vertical breathing room to the page.</p>}
					<div className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
						<button type="button" className="editor-icon-button" title="Move section up" aria-label="Move section up" disabled={index === 0} onClick={() => move(index, index - 1)}><Plus className="rotate-45" size={15} /></button>
						<button type="button" className="editor-icon-button" title="Move section down" aria-label="Move section down" disabled={index === sections.length - 1} onClick={() => move(index, index + 1)}><Minus className="rotate-45" size={15} /></button>
						<button type="button" className="editor-icon-button" title="Duplicate section" aria-label="Duplicate section" onClick={() => duplicate(index)}><Copy size={15} /></button>
						<button type="button" className="editor-icon-button text-red-200 hover:bg-red-500/10" title="Delete section" aria-label="Delete section" onClick={() => remove(index)}><Trash2 size={15} /></button>
						<span className="ml-auto text-xs text-muted">Section {index + 1}</span>
					</div>
				</div>
			</div>
		</article>)}
	</div>;
}
