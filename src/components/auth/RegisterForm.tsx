"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function RegisterForm() {
	const router = useRouter();
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
	async function submit(event: React.FormEvent) {
		event.preventDefault();
		setLoading(true);
		setError("");
		try {
			const response = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
			const body = await response.json();
			if (!response.ok) { setError(body.error ?? "Unable to create account."); return; }
			router.push("/");
			router.refresh();
		} catch { setError("Unable to create your account right now."); } finally { setLoading(false); }
	}
	return <form onSubmit={submit} className="grid gap-5">
		<label className="grid gap-2 text-sm font-medium text-white">Name<input required minLength={2} autoComplete="name" className="rounded-button border border-white/10 bg-black/20 px-3 py-3 text-white" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
		<label className="grid gap-2 text-sm font-medium text-white">Email<input required type="email" autoComplete="email" className="rounded-button border border-white/10 bg-black/20 px-3 py-3 text-white" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
		<label className="grid gap-2 text-sm font-medium text-white">Password<input required minLength={8} type="password" autoComplete="new-password" className="rounded-button border border-white/10 bg-black/20 px-3 py-3 text-white" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /><span className="text-xs text-muted">Use at least 8 characters.</span></label>
		{error && <p role="alert" className="rounded-button border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
		<button disabled={loading} className="rounded-button bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-500 disabled:opacity-60" type="submit">{loading ? "Creating account…" : "Create account"}</button>
		<p className="text-center text-sm text-muted">Already have an account? <Link className="text-brand-300 hover:text-white" href="/login">Sign in</Link></p>
	</form>;
}