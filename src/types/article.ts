import {z} from 'zod'
import {RouterOutputs} from '@utils/trpc'

export const createArticleInputSchema = z.object({
	title: z.string().min(1),
	content: z.string().min(1),
})

export type CreateArticleInputType = z.infer<typeof createArticleInputSchema>

export const updateArticleInputSchema = createArticleInputSchema.extend({
	id: z.string(),
})

export type UpdateArticleInputType = z.infer<typeof updateArticleInputSchema>

export type ArticleType = Exclude<RouterOutputs['article']['getArticle'], null>
