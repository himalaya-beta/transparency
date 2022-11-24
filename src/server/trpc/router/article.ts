import cuid from 'cuid'
import {z} from 'zod'

import {router, publicProcedure, protectedProcedure} from '../trpc'
import {revalidate, slugify} from '@server/utils/route'

import {CreateArticleSchema, UpdateArticleSchema} from 'types/article'
import {TRPCError} from '@trpc/server'

const requiredIdSchema = z.object({id: z.string()})
const requiredIdAuthorIdSchema = requiredIdSchema.extend({authorId: z.string()})

export const articleRouter = router({
	fetchAll: publicProcedure.query(({ctx}) =>
		ctx.prisma.article.findMany({
			include: {author: {select: {name: true, image: true}}},
		})
	),
	fetchOne: publicProcedure.input(requiredIdSchema).query(({ctx, input}) =>
		ctx.prisma.article.findUnique({
			where: {id: input.id},
			include: {author: {select: {name: true, image: true}}},
		})
	),
	create: protectedProcedure
		.input(CreateArticleSchema)
		.mutation(({ctx, input}) => {
			const id = cuid()
			return ctx.prisma.article.create({
				data: {
					...input,
					id,
					slug: slugify(input.title, id),
					authorId: ctx.session.user.id,
				},
			})
		}),
	update: protectedProcedure.input(UpdateArticleSchema).mutation(
		async ({ctx, input}) => {
			if (ctx.session.user.id !== input.authorId)
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You are not allowed to update this article',
				})
			return ctx.prisma.article
				.update({
					where: {id: input.id},
					data: {
						...input,
						slug: slugify(input.title, input.id),
					},
				})
				.then(async (updated) => {
					const response = await revalidate('article', updated.slug)
					console.log('json >>>', response)
					return updated
				})
		}

		// RETAIN PUBLISHED ARTICLE PATH WHILE UPDATING ITS CONTENT
		// const fetchOldArticles = ctx.prisma.article.findMany({
		// 	where: {id},
		// 	select: {slug: true},
		// })

		// const [updated, olds] = await Promise.all([
		// 	updateCurrentArticle,
		// 	fetchOldArticles,
		// ]).then((data) => {
		// 	console.log('Finish updating current article & fetching old articles')
		// 	console.log('UPDATED >>>')
		// 	console.log(data[0])
		// 	console.log('OLDS >>>>>>')
		// 	console.log(data[1])
		// 	return data
		// })

		// const revalidation: RevalidationResponses = []
		// if (updated.slug === oldSlug) {
		// 	revalidation.push(revalidate('article', updated.slug))
		// } else {
		// 	for (const old of olds) {
		// 		revalidation.push(revalidate('article', old.slug))
		// 	}
		// }

		// const response = new Promise<{
		// 	data: typeof updated
		// 	revalidation: RevalidationResponses
		// }>((resolve) => {
		// 	resolve({
		// 		data: updated,
		// 		revalidation,
		// 	})
		// })

		// Promise.all(revalidation).then((revalidated) => {
		// 	console.log('Finish revalidate all related articles')
		// 	console.log(revalidated)
		// 	Promise.resolve(response)
		// })
	),
	delete: protectedProcedure
		.input(requiredIdAuthorIdSchema)
		.mutation(({ctx, input}) => {
			if (ctx.session.user.id !== input.authorId)
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You are not allowed to delete this article',
				})
			return ctx.prisma.article.delete({where: {id: input.id}})
		}),
})
