import {z} from 'zod'
import {router, publicProcedure} from '../trpc'

import {createArticleInputSchema, updateArticleInputSchema} from 'types/article'
import {slugify} from '@utils/literal'
import {BASE_URL} from '@utils/route'

const requiredIdSchema = z.object({id: z.string()})

export const articleRouter = router({
	getArticles: publicProcedure.query(({ctx}) => ctx.prisma.article.findMany()),
	getArticle: publicProcedure
		.input(requiredIdSchema)
		.query(({ctx, input}) =>
			ctx.prisma.article.findUnique({where: {id: input.id}})
		),
	createArticle: publicProcedure
		.input(createArticleInputSchema)
		.mutation(async ({ctx, input}) => {
			const articleNew = await ctx.prisma.article.create({
				data: {...input, slug: slugify(input.title)},
			})
			// embed id to slug for getStaticProps and any other fetching
			return ctx.prisma.article.update({
				where: {id: articleNew.id},
				data: {
					slug: articleNew.slug + '_' + articleNew.id,
				},
			})
		}),
	updateArticle: publicProcedure
		.input(updateArticleInputSchema)
		.mutation(async ({ctx, input}) => {
			const updated = await ctx.prisma.article.update({
				where: {id: input.id},
				data: {
					title: input.title,
					content: input.content,
					slug: slugify(input.title) + '_' + input.id,
				},
			})
			await fetch(`${BASE_URL}/api/revalidate`, {
				method: 'POST',
				body: JSON.stringify({
					path: `/article/${updated.slug}`,
				}),
			})
			return updated
		}),
	deleteArticle: publicProcedure
		.input(requiredIdSchema)
		.mutation(({ctx, input}) =>
			ctx.prisma.article.delete({where: {id: input.id}})
		),
})
