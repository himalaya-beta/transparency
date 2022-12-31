import {z} from 'zod'
import {RouterOutputs} from 'utils/trpc'

const criteriaCreateSchema = z.object({
	criteriaId: z.string(),
	explanation: z.string().nullable(),
	assignedBy: z.string(),
})

export const appCreateSchema = z.object({
	name: z.string().min(3, 'Provide more descriptive app name'),
	company: z.string().min(3, 'Provide more descriptive company name'),
	headquarter: z.string().optional(),
	registeredIn: z.string().optional(),
	offices: z.string().optional(),
	about: z.string().min(80, 'Provide more meaningful description'),
	criteria: z.array(criteriaCreateSchema).min(1),
})

export const appUpdateSchema = appCreateSchema
	.extend({
		id: z.string(),
	})
	.omit({criteria: true})

export type AppCreateType = z.infer<typeof appCreateSchema>
export type AppUpdateType = z.infer<typeof appUpdateSchema>
export type AppType = Exclude<RouterOutputs['app']['fetchOne'], null>
