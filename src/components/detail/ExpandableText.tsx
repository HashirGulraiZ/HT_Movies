"use client";

import { useState } from "react";

type ExpandableTextProps = {
	text: string | null;
	limit?: number;
};

export default function ExpandableText({ text, limit = 3 }: ExpandableTextProps) {
	const [expanded, setExpanded] = useState(false);

	if (!text || !text.trim()) return <span className="text-zinc-200">N/A</span>;

	const parts = text.split(",").map((part) => part.trim()).filter(Boolean);
	const visible = expanded ? parts : parts.slice(0, limit);

	return (
		<span className="inline-flex flex-wrap items-center gap-x-1 gap-y-1 text-zinc-200">
			{visible.map((part, index) => (
				<span key={`${part}-${index}`}>
					{part}
					{index < visible.length - 1 ? "," : ""}
				</span>
			))}
			{parts.length > limit && (
				<button
					type="button"
					onClick={() => setExpanded((current) => !current)}
					className="ml-1 rounded-button bg-brand-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white transition hover:bg-brand-500"
				>
					{expanded ? "Less" : "View more"}
				</button>
			)}
		</span>
	);
}
