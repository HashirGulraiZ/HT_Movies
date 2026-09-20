import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PublicChrome } from "@/components/layout/PublicChrome";
import { IntroAnimation } from "@/components/layout/IntroAnimation";
import { getSiteSettings } from "@/lib/db/queries/siteSettings";

export const metadata: Metadata = {
	title: {
		default: "HTMovie | Watch what moves you",
		template: "%s | HTMovie",
	},
	description: "A cinematic home for movies, series, live television, and games.",
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
	const settings = await getSiteSettings();
	return (
		<html lang="en">
			<body>
				<PublicChrome>
					<div className="public-header">
						<Header />
					</div>
					<div className="min-h-screen pt-16">{children}</div>
					<div className="public-footer">
						<Footer />
					</div>
					<div className="public-animation">
						<IntroAnimation enabled={settings.intro_animation_enabled === "1"} videoUrl={settings.intro_animation_video_url} />
					</div>
				</PublicChrome>
			</body>
		</html>
	);
}
