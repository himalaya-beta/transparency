/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable unicorn/no-useless-undefined */
import {TRPCError} from '@trpc/server'
import cuid from 'cuid'
import {z} from 'zod'

import {router, publicProcedure, protectedProcedure} from '../trpc'
import {revalidate} from 'server/utils/route'
import {slugify} from 'utils/literal'

import {articleCreateSchema, articleUpdateSchema} from 'types/article'
import {requiredIdSchema} from 'types/general'

const requiredIdAuthorIdSchema = requiredIdSchema.extend({authorId: z.string()})

const PER_PAGE = 10

export const articleRouter = router({
	fetchAll: publicProcedure
		.input(
			z.object({
				query: z.string(),
				dataPerPage: z.number(),
				cursor: z.string().optional(),
			})
		)
		.query(({ctx, input}) => {
			const search = input.query === '' ? undefined : input.query
			const perPage = input?.dataPerPage ?? PER_PAGE
			return ctx.prisma.article
				.findMany({
					where: {
						title: {search},
						content: {search},
					},
					take: perPage + 1,
					...(input?.cursor && {
						cursor: {id: input.cursor},
					}),
					include: {author: {select: {name: true, image: true}}},
					orderBy: {
						updatedAt: 'desc',
					},
				})
				.then((data) => {
					let nextCursor: string | undefined = undefined

					if (data.length > perPage) {
						const lastItem = data.pop()!
						nextCursor = lastItem.id
					}

					return {
						items: data,
						nextCursor,
					}
				})
		}),
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
