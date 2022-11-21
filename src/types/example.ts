import {z} from 'zod'
import {RouterOutputs} from '@utils/trpc'

export const createExampleInputSchema = z.object({
	title: z.string().min(1),
	content: z.string().min(1),
})

export type createExampleInputType = z.infer<typeof createExampleInputSchema>

export type ExampleType = Exclude<RouterOutputs['example']['getExample'], null>
