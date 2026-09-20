export function formatRating(value: number | string | null): string | null {
	if (value === null || value === undefined) return null;
	const numeric = Number(value);
	return Number.isFinite(numeric) ? numeric.toFixed(1) : null;
}

export function formatDuration(minutes: number | null): string | null {
	if (!minutes || minutes <= 0) return null;
	const hours = Math.floor(minutes / 60);
	const rest = minutes % 60;
	return [hours ? `${hours}h` : "", rest ? `${rest}m` : ""].filter(Boolean).join(" ");
}
