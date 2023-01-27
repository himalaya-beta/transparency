import {z} from 'zod'
import {RouterOutputs} from 'utils/trpc'

export const articleCreateSchema = z.object({
	title: z
		.string()
		.max(160, 'Title is too long')
		.refine((input) => input.trim().split(' ').length > 1, {
			message: 'Describe title more clearly',
		}),
	content: z.string().min(1000, 'Too short. Create more informative article'),
	headerImage: z
		.string()
		.url('Provide valid image url')
		.max(255, 'Image url is too long')
		.nullable(),
	contentHighlight: z
		.string()
		.min(1, 'Highlight required')
		.max(255, 'Highlight is too long'),
})

export const articleUpdateSchema = articleCreateSchema.extend({
	id: z.string(),
	authorId: z.string(),
})

export type ArticleCreateType = z.infer<typeof articleCreateSchema>
export type ArticleUpdateType = z.infer<typeof articleUpdateSchema>
export type ArticleType = Exclude<RouterOutputs['article']['fetchOne'], null>
