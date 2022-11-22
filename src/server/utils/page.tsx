export const BASE_URL = process.env.VERCEL_URL
	? `https://${process.env.VERCEL_URL}`
	: 'http://localhost:3000'

export async function revalidate(
	page: string,
	urlParam?: string
): Promise<{
	revalidated: boolean
	path: string
}> {
	return fetch(`${BASE_URL}/api/revalidate`, {
		method: 'POST',
		body: JSON.stringify({
			path: `/${page}/${urlParam ?? ''}`,
		}),
	}).then((response) => {
		return response.json()
	})
}
