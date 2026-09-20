export type TVShow = {
	id: number;
	title: string;
	slug: string;
	description: string | null;
	poster_url: string | null;
	backdrop_url: string | null;
	trailer_url: string | null;
	release_year: number | null;
	rating: number | null;
	age_rating: string | null;
	director: string | null;
	cast_members: string | null;
	quality: string | null;
	status: "draft" | "published" | "archived";
	featured: number;
	views: number;
	likes: number;
};
