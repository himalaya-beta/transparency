import {z} from 'zod'
import {RouterOutputs} from '@utils/trpc'

export const CreateArticleSchema = z.object({
	title: z.string().min(1),
	content: z.string().min(1),
})

export type CreateArticleType = z.infer<typeof CreateArticleSchema>

export const UpdateArticleSchema = CreateArticleSchema.extend({
	id: z.string(),
})

export type UpdateArticleType = z.infer<typeof UpdateArticleSchema>

export type ArticleType = Exclude<RouterOutputs['article']['fetchOne'], null>
