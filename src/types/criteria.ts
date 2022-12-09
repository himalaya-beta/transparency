import {z} from 'zod'
import {RouterOutputs} from 'utils/trpc'

export const CreateCriteriaSchema = z.object({
	value: z.string().min(5, 'not long enough'),
	parentId: z.string().nullish(),
})

export type CreateCriteriaType = z.infer<typeof CreateCriteriaSchema>

export const UpdateCriteriaSchema = CreateCriteriaSchema.extend({
	id: z.string(),
})

export type UpdateCriteriaType = z.infer<typeof UpdateCriteriaSchema>

export type CriteriaType = Exclude<RouterOutputs['criteria']['fetchOne'], null>
