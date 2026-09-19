"use client";

import { useState } from "react";

type MediaFieldProps = {
	label: string;
	value: string;
	onChange: (value: string) => void;
	folder: string;
	accept: string;
	kind: "image" | "video";
};

export function MediaField({ label, value, onChange, folder, accept, kind }: MediaFieldProps) {
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState("");
	async function upload(file: File) {
		setUploading(true);
		setError("");
		try {
			const form = new FormData();
			form.append("file", file);
			form.append("folder", folder);
			const response = await fetch("/api/upload", { method: "POST", body: form });
			const body = await response.json();
			if (!response.ok) throw new Error(body.error ?? "Upload failed");
			onChange(body.url);
		} catch (uploadError) {
			setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
		} finally {
			setUploading(false);
		}
	}
	return <label className="grid gap-2 text-sm font-medium text-white">
		{label}
		<div className="flex flex-wrap gap-2">
			<input className="min-w-0 flex-1 rounded-button border border-white/10 bg-black/20 px-3 py-2 text-white" value={value} onChange={(event) => onChange(event.target.value)} placeholder={`Paste ${kind} URL`} />
			<label className="cursor-pointer rounded-button border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/10">
				{uploading ? "Uploading..." : "Upload"}
				<input className="hidden" type="file" accept={accept} disabled={uploading} onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} />
			</label>
		</div>
		{error && <span className="text-xs text-red-300">{error}</span>}
		{value && kind === "image" && <img src={value} alt={`${label} preview`} className="h-32 w-full rounded-button object-cover" />}
		{value && kind === "video" && <video src={value} controls className="max-h-48 w-full rounded-button bg-black" />}
	</label>;
}

export function ImageField(props: Omit<MediaFieldProps, "accept" | "kind">) {
	return <MediaField {...props} accept="image/jpeg,image/png,image/webp,image/svg+xml" kind="image" />;
}

export function VideoField(props: Omit<MediaFieldProps, "accept" | "kind">) {
	return <MediaField {...props} accept="video/mp4,video/webm" kind="video" />;
}
