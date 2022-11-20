import {z} from 'zod'

export const createExampleSchema = z.object({
	title: z.string().min(1),
	content: z.string().min(1),
})

export type createExampleType = z.infer<typeof createExampleSchema>
