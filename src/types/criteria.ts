import {z} from 'zod'
import {RouterOutputs} from 'utils/trpc'

export const criteriaCreateSchema = z.object({
	value: z.string().min(3, 'provide meaningful point'),
	parentId: z.string().nullish(),
	order: z.number(),
	type: z.enum([
		'TRUE_OR_FALSE',
		'EXPLANATION',
		'TRUE_OR_FALSE_WITH_EXPLANATION',
	]),
})

export const criteriaUpdateSchema = criteriaCreateSchema.extend({
	id: z.string(),
})

export type CriteriaTypesEnum = z.infer<typeof criteriaCreateSchema>['type']
export type CriteriaCreateType = z.infer<typeof criteriaCreateSchema>
export type CriteriaUpdateType = z.infer<typeof criteriaUpdateSchema>
export type CriteriaType = Exclude<RouterOutputs['criteria']['fetchOne'], null>
