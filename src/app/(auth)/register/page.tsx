import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
	return <main className="container-page flex min-h-[calc(100vh-12rem)] items-center justify-center py-16"><section className="card-surface-elevated w-full max-w-md p-8 sm:p-10"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">Join HTMovie</p><h1 className="mt-3 text-4xl font-semibold text-white">Create your account</h1><p className="mt-3 mb-8 text-muted">Build your watchlist and keep your viewing history in sync.</p><RegisterForm /></section></main>;
}
