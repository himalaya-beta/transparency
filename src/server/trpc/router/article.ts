import cuid from 'cuid'
import {z} from 'zod'

import {TRPCError} from '@trpc/server'
import {router, publicProcedure, protectedProcedure} from '../trpc'
import {revalidate} from 'server/utils/route'
import {slugify} from 'utils/literal'

import {articleCreateSchema, articleUpdateSchema} from 'types/article'
import {requiredIdSchema} from 'types/general'

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
		.input(articleCreateSchema)
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
	update: protectedProcedure
		.input(articleUpdateSchema)
		.mutation(async ({ctx, input}) => {
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
					// TODO: Revert update on revalidation error
					await revalidate('article', updated.slug)
					return updated
				})
		}),
	delete: protectedProcedure
		.input(requiredIdAuthorIdSchema)
		.mutation(({ctx, input}) => {
			const {user} = ctx.session
			if (user.id !== input.authorId && user.role !== 'ADMIN')
				throw new TRPCError({
					code: 'FORBIDDEN',
					message: 'You are not allowed to delete this article',
				})
			return ctx.prisma.article.delete({where: {id: input.id}})
		}),
})
