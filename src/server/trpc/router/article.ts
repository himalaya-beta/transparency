import {TRPCError} from '@trpc/server'
import cuid from 'cuid'
import {z} from 'zod'

import {router, publicProcedure, protectedProcedure} from '../trpc'
import {revalidate} from 'server/utils/route'
import {slugify} from 'utils/literal'

import {articleCreateSchema, articleUpdateSchema} from 'types/article'
import {requiredIdSchema} from 'types/general'

const requiredIdAuthorIdSchema = requiredIdSchema.extend({authorId: z.string()})

export const articleRouter = router({
	fetchAll: publicProcedure
		.input(
			z
				.object({
					dataPerPage: z.number(),
					cursorId: z.string().optional(),
				})
				.optional()
		)
		.query(({ctx, input}) =>
			ctx.prisma.article.findMany({
				include: {author: {select: {name: true, image: true}}},
				...(input?.cursorId && {
					cursor: {id: input.cursorId},
					skip: 1,
				}),
				...(input?.dataPerPage && {
					take: input.dataPerPage,
				}),
				orderBy: {
					updatedAt: 'desc',
				},
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
					data: input,
				})
				.then(async (updated) => {
					// TODO: Revert update on revalidation error
					await revalidate('article', slugify(updated.title, updated.id))
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
