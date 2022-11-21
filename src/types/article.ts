import {z} from 'zod'
import {RouterOutputs} from '@utils/trpc'

export const createArticleInputSchema = z.object({
	title: z.string().min(1),
	content: z.string().min(1),
})

export type CreateArticleInputType = z.infer<typeof createArticleInputSchema>

export type ArticleType = Exclude<RouterOutputs['article']['getArticle'], null>
