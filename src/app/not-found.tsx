import Link from "next/link";

export default function NotFound() {
	return <main className="container-page flex min-h-[70vh] flex-col items-center justify-center text-center"><p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-400">404</p><h1 className="mt-3 text-4xl font-semibold text-white">That story is elsewhere.</h1><Link className="mt-7 rounded-button bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-500" href="/">Return home</Link></main>;
}
