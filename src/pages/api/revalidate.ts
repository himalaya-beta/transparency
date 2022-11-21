import {NextApiRequest, NextApiResponse} from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		return res.status(400).json({message: 'Invalid HTTP method'})
	}

	const body = JSON.parse(req.body)
	if (!body.path) {
		return res.status(400).json({message: 'Path required'})
	}

	try {
		await res.revalidate(body.path)
		console.log('[REVALIDATING]', body.path)
		return res.status(200).json({revalidated: true})
	} catch (error) {
		console.log(error)
		return res.status(500).send('Error revalidating')
	}
}
