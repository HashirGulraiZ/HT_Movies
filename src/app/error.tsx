"use client";

import { useEffect } from "react";

type ErrorPageProps = {
	error: Error & { digest?: string };
	reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<main className="flex min-h-screen items-center justify-center px-6 py-16">
			<section className="card-surface-elevated w-full max-w-lg p-8 text-center">
				<p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-brand-400">
					Playback interrupted
				</p>
				<h1 className="text-3xl font-semibold text-white">Something went wrong</h1>
				<p className="mt-3 text-muted">
					We could not load this page. Try again, or return to the home screen.
				</p>
				<button
					className="mt-8 rounded-button bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-500"
					onClick={() => reset()}
					type="button"
				>
					Try again
				</button>
			</section>
		</main>
	);
}
