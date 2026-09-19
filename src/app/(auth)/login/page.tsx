import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
	return <main className="container-page flex min-h-[calc(100vh-12rem)] items-center justify-center py-16"><section className="card-surface-elevated w-full max-w-md p-8 sm:p-10"><p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-400">Welcome back</p><h1 className="mt-3 text-4xl font-semibold text-white">Sign in</h1><p className="mt-3 mb-8 text-muted">Access your account and continue watching.</p><LoginForm /></section></main>;
}
