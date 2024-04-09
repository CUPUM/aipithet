import { authorizeRequest } from '@lib/auth/auth';
import { validateFormData } from '@lib/crud/validation';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

const schema = z.object({
	images: z
		.object({
			prompt: z.string(),
			files: z.instanceof(Blob).array(),
		})
		.array(),
});

/**
 * Upload images to storage and store related metadata appropriately.
 */
export async function POST(request: NextRequest, route: { params: { poolId: string } }) {
	try {
		const { user } = await authorizeRequest('images.create');
		const parsed = validateFormData(await request.formData(), schema);
		if (!parsed.success) {
			return Response.json(parsed.error.flatten(), { status: 400 });
		}
	} catch (err) {
		if (err instanceof Response) {
			return err;
		}
		return new Response('Error', { status: 500 });
	}
}
