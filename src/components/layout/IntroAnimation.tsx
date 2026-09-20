"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const INTRO_SESSION_KEY = "hasSeenIntro";
const FADE_DURATION_MS = 700;

type IntroState = "idle" | "playing" | "leaving" | "done";

export function IntroAnimation({ enabled, videoUrl }: { enabled: boolean; videoUrl: string }) {
	const pathname = usePathname();
	const videoRef = useRef<HTMLVideoElement>(null);
	const closeTimerRef = useRef<number | null>(null);
	const bodyStylesRef = useRef<{ overflow: string; touchAction: string } | null>(null);
	const [state, setState] = useState<IntroState>("idle");

	const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

	const close = useCallback(() => {
		setState((current) => {
			if (current !== "playing") return current;
			return "leaving";
		});
		try {
			window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
		} catch {
			// Storage can be unavailable in private browsing; the animation still closes.
		}
		if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
		closeTimerRef.current = window.setTimeout(() => setState("done"), FADE_DURATION_MS);
	}, []);

	useEffect(() => {
		if (isAdminRoute || !enabled || !videoUrl) {
			setState("done");
			return;
		}
		try {
			if (window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1") {
				setState("done");
				return;
			}
		} catch {
			// Continue when storage is blocked.
		}
		setState("playing");
	}, [enabled, isAdminRoute, videoUrl]);

	useEffect(() => {
		if (state === "playing") {
			bodyStylesRef.current = {
				overflow: document.body.style.overflow,
				touchAction: document.body.style.touchAction,
			};
			document.body.style.overflow = "hidden";
			document.body.style.touchAction = "none";
		} else if (state === "done" && bodyStylesRef.current) {
			document.body.style.overflow = bodyStylesRef.current.overflow;
			document.body.style.touchAction = bodyStylesRef.current.touchAction;
			bodyStylesRef.current = null;
		}

		if (state !== "playing") return;

		const video = videoRef.current;
		if (video) {
			video.muted = false;
			void video.play().catch(() => {
				video.muted = true;
				return video.play();
			}).catch(() => close());
		}
	}, [close, state]);

	useEffect(() => () => {
		if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
		if (bodyStylesRef.current) {
			document.body.style.overflow = bodyStylesRef.current.overflow;
			document.body.style.touchAction = bodyStylesRef.current.touchAction;
		}
	}, []);

	if (isAdminRoute || state === "idle" || state === "done") return null;
	return <div className={`intro-animation ${state === "leaving" ? "intro-animation--leaving" : ""}`} role="status" aria-label="Loading HTMovie">
		<video
			ref={videoRef}
			autoPlay
			playsInline
			preload="auto"
			src={videoUrl}
			onEnded={close}
			onError={close}
		/>
		<div className="intro-animation__veil" />
		{/* <div className="intro-animation__brand" aria-hidden="true"><span className="intro-animation__mark">HT</span><span>HTMovie</span></div> */}
		<button type="button" className="intro-animation__skip" onClick={close}>Skip</button>
	</div>;
}
