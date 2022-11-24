import {z} from 'zod'
import {RouterOutputs} from '@utils/trpc'

export const CreateArticleSchema = z.object({
	title: z.string().min(40, 'Title is not long enough'),
	content: z.string().min(200, 'Description is not long enough'),
})

export type CreateArticleType = z.infer<typeof CreateArticleSchema>

export const UpdateArticleSchema = CreateArticleSchema.extend({
	id: z.string(),
	authorId: z.string(),
})

export type UpdateArticleType = z.infer<typeof UpdateArticleSchema>

export type ArticleType = Exclude<RouterOutputs['article']['fetchOne'], null>
