import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
	title: {
		default: "HTMovie | Watch what moves you",
		template: "%s | HTMovie",
	},
	description: "A cinematic home for movies, series, live television, and games.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<body>
				<Header />
				<div className="min-h-screen pt-16">{children}</div>
				<Footer />
			</body>
		</html>
	);
}
