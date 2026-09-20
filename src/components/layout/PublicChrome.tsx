"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function PublicChrome({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
	useEffect(() => {
		document.documentElement.classList.toggle("admin-route", isAdminRoute);
		return () => document.documentElement.classList.remove("admin-route");
	}, [isAdminRoute]);
	return <>{children}</>;
}
