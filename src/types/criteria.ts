import {z} from 'zod'
import {RouterOutputs} from 'utils/trpc'

export const CreateCriteriaSchema = z.object({
	value: z.string().min(3),
	parentId: z.string().nullish(),
})

export type CreateCriteriaType = z.infer<typeof CreateCriteriaSchema>

export const UpdateCriteriaSchema = CreateCriteriaSchema.extend({
	id: z.string(),
})

export type UpdateCriteriaType = z.infer<typeof UpdateCriteriaSchema>

export type ArticleType = Exclude<RouterOutputs['article']['fetchOne'], null>
