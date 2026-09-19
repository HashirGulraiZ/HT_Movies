export type Movie = {
	id: number;
	title: string;
	slug: string;
	description: string | null;
	poster_url: string | null;
	backdrop_url: string | null;
	trailer_url: string | null;
	video_url: string | null;
	duration_minutes: number | null;
	release_year: number | null;
	rating: number | null;
	age_rating: string | null;
	status: "draft" | "published" | "archived";
	featured: number;
	views: number;
};
