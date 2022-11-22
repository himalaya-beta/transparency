import {NextApiRequest, NextApiResponse} from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<{
		revalidated: boolean
		path: string
		message?: string
		error?: unknown
	}>
) {
	const body = JSON.parse(req.body)
	const defaultRes = {revalidated: false, path: body.path}

	if (req.method !== 'POST') {
		return res.status(400).json({...defaultRes, message: 'Invalid HTTP method'})
	}

	if (!body.path) {
		return res.status(400).json({...defaultRes, message: 'Path required'})
	}

	try {
		console.log('[REVALIDATE]', body.path)
		const response = await res.revalidate(body.path)
		console.log('api >>>>', response)
		return res.status(200).json({...defaultRes, revalidated: true})
	} catch (error) {
		console.log('[REVALIDATE]', error)
		return res
			.status(500)
			.json({...defaultRes, message: 'Invalidation error', error})
	}
}
