export interface PayloadPost {
	id: number;
	title: string;
	content: string;
	updatedAt: string;
	createdAt: string;
}

export interface PayloadMedia {
	id: number;
	alt: string;
	url?: string | null;
	thumbnailURL?: string | null;
	filename?: string | null;
	mimeType?: string | null;
	filesize?: number | null;
	width?: number | null;
	height?: number | null;
}

export interface PayloadUser {
	id: number;
	email: string;
	updatedAt: string;
	createdAt: string;
}

export interface PaginatedResponse<T> {
	docs: T[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
	pagingCounter: number;
	hasPrevPage: boolean;
	hasNextPage: boolean;
	prevPage: number | null;
	nextPage: number | null;
}
