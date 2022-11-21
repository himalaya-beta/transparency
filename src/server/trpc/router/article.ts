import {z} from 'zod'
import {router, publicProcedure} from '../trpc'

import {createArticleInputSchema} from 'types/article'
import {slugify} from '@utils/literal'

export const articleRouter = router({
	getArticles: publicProcedure.query(({ctx}) => {
		return ctx.prisma.article.findMany()
	}),
	getArticle: publicProcedure
		.input(z.object({id: z.string()}))
		.query(({ctx, input}) => {
			return ctx.prisma.article.findUnique({where: {id: input.id}})
		}),
	createArticle: publicProcedure
		.input(createArticleInputSchema)
		.mutation(({ctx, input}) => {
			return ctx.prisma.article.create({
				data: {...input, slug: slugify(input.title)},
			})
		}),
})
