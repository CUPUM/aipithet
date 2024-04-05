export const ACCEPTED_IMAGE_TYPES = ['jpeg', 'jpg', 'png', 'webp'] as const;

export const ACCEPTED_IMAGE_MIME_TYPES = ACCEPTED_IMAGE_TYPES.map(
	(type) => `image/${type}` as const
);
