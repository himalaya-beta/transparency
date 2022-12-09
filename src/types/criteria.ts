import {z} from 'zod'
import {RouterOutputs} from 'utils/trpc'

export const criteriaCreateSchema = z.object({
	value: z.string().min(5, 'not long enough'),
	parentId: z.string().nullish(),
})

export const criteriaUpdateSchema = criteriaCreateSchema.extend({
	id: z.string(),
})

export type CriteriaCreateType = z.infer<typeof criteriaCreateSchema>
export type CriteriaUpdateType = z.infer<typeof criteriaUpdateSchema>
export type CriteriaType = Exclude<RouterOutputs['criteria']['fetchOne'], null>
