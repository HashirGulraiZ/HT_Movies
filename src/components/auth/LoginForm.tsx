"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function submit(event: React.FormEvent) {
		event.preventDefault();
		setLoading(true);
		setError("");
		try {
			const response = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});
			const body = await response.json();
			if (!response.ok) {
				setError(body.error ?? "Unable to sign in.");
				return;
			}
			router.push(searchParams.get("next") || "/");
			router.refresh();
		} catch {
			setError("Unable to sign in right now.");
		} finally {
			setLoading(false);
		}
	}

	return <form onSubmit={submit} className="grid gap-5">
		<label className="grid gap-2 text-sm font-medium text-white">Email<input required type="email" autoComplete="email" className="rounded-button border border-white/10 bg-black/20 px-3 py-3 text-white" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
		<label className="grid gap-2 text-sm font-medium text-white">Password<input required type="password" autoComplete="current-password" className="rounded-button border border-white/10 bg-black/20 px-3 py-3 text-white" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
		{error && <p role="alert" className="rounded-button border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
		<button disabled={loading} className="rounded-button bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-500 disabled:opacity-60" type="submit">{loading ? "Signing in…" : "Sign in"}</button>
		<p className="text-center text-sm text-muted">New to HTMovie? <Link className="text-brand-300 hover:text-white" href="/register">Create an account</Link></p>
	</form>;
}