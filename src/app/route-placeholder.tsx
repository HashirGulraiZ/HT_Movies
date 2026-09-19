import Link from "next/link";

export function RoutePlaceholder({ title, description = "This part of HTMovie is ready for its catalog data and controls." }: { title: string; description?: string }) {
  return <main className="container-page flex min-h-[70vh] items-center justify-center py-16"><section className="card-surface-elevated w-full max-w-2xl p-8 sm:p-12"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">HTMovie</p><h1 className="mt-3 text-4xl font-semibold text-white">{title}</h1><p className="mt-4 max-w-xl leading-7 text-muted">{description}</p><Link className="mt-8 inline-flex rounded-button bg-brand-600 px-5 py-3 font-semibold text-white transition hover:bg-brand-500" href="/">Back to home</Link></section></main>;
}

export default function PlaceholderPage() {
  return <RoutePlaceholder title="Your next watch is close." />;
}