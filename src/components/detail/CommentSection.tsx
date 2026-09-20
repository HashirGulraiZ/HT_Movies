"use client";

import { useState } from "react";

export type CommentItem = {
	id: number;
	name: string;
	website: string | null;
	body: string;
	created_at: string | Date;
};

type CommentSectionProps = {
	contentType: "movie" | "tv_show";
	contentId: number;
	initialComments: CommentItem[];
};

export default function CommentSection({ contentType, contentId, initialComments }: CommentSectionProps) {
	const [comments, setComments] = useState<CommentItem[]>(initialComments);
	const [form, setForm] = useState({ name: "", email: "", website: "", body: "" });
	const [error, setError] = useState("");
	const [submitting, setSubmitting] = useState(false);

	function update(key: keyof typeof form, value: string) {
		setForm((current) => ({ ...current, [key]: value }));
	}

	async function submit(event: React.FormEvent) {
		event.preventDefault();
		setSubmitting(true);
		setError("");
		try {
			const response = await fetch("/api/comments", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content_type: contentType, content_id: contentId, ...form }),
			});
			const body = await response.json();
			if (!response.ok) {
				setError(body.error ?? "Unable to post comment");
				return;
			}
			setComments((current) => [
				{ id: body.id, name: form.name, website: form.website || null, body: form.body, created_at: new Date().toISOString() },
				...current,
			]);
			setForm({ name: "", email: "", website: "", body: "" });
		} catch {
			setError("Unable to post comment");
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div>
			{comments.length > 0 && (
				<ul className="mb-8 grid gap-4">
					{comments.map((comment) => (
						<li key={comment.id} className="rounded-card border border-white/10 bg-white/[0.03] p-4">
							<div className="flex flex-wrap items-center justify-between gap-2">
								<p className="text-sm font-semibold text-white">{comment.name}</p>
								<p className="text-xs text-muted">{new Date(comment.created_at).toLocaleDateString()}</p>
							</div>
							<p className="mt-2 whitespace-pre-line text-sm leading-6 text-zinc-300">{comment.body}</p>
						</li>
					))}
				</ul>
			)}

			<form onSubmit={submit} className="grid gap-4">
				<div className="flex items-start gap-3 rounded-button border border-brand-500/30 bg-brand-600/10 p-3 text-sm text-zinc-300">
					<span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-brand-400 text-xs text-brand-400">i</span>
					<p>
						Your email address will not be published. Required fields are marked *
					</p>
				</div>
				{error && <p className="rounded-button border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
				<label className="grid gap-2 text-sm font-medium text-white">
					Comment *
					<textarea
						required
						className="min-h-28 rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white placeholder:text-zinc-500"
						placeholder="Comment..."
						value={form.body}
						onChange={(event) => update("body", event.target.value)}
					/>
				</label>
				<div className="grid gap-4 sm:grid-cols-3">
					<label className="grid gap-2 text-sm font-medium text-white">
						Name *
						<input required className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={form.name} onChange={(event) => update("name", event.target.value)} />
					</label>
					<label className="grid gap-2 text-sm font-medium text-white">
						Email *
						<input required type="email" className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={form.email} onChange={(event) => update("email", event.target.value)} />
					</label>
					<label className="grid gap-2 text-sm font-medium text-white">
						Website
						<input className="rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={form.website} onChange={(event) => update("website", event.target.value)} />
					</label>
				</div>
				<button
					type="submit"
					disabled={submitting}
					className="justify-self-start rounded-button bg-brand-600 px-5 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-500 disabled:opacity-60"
				>
					{submitting ? "Posting…" : "Post comment"}
				</button>
			</form>
		</div>
	);
}
