/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable unicorn/no-useless-undefined */
import {z} from 'zod'
import {publicProcedure, router, adminProcedure} from '../trpc'
import {appCreateSchema, appUpdateSchema} from 'types/app'
import {requiredIdSchema} from 'types/general'

import {revalidate} from 'server/utils/route'
import {slugify} from 'utils/literal'

const DEFAULT_PER_PAGE = 10

export const appRouter = router({
	fetchAll: publicProcedure.query(({ctx}) =>
		ctx.prisma.app.findMany({include: {AppCriteria: true}})
	),
	fetchOne: publicProcedure.input(requiredIdSchema).query(({ctx, input}) =>
		ctx.prisma.app.findUnique({
			where: {id: input.id},
			include: {AppCriteria: true},
		})
	),
	search: publicProcedure
		.input(
			z.object({
				query: z.string(),
				dataPerPage: z.number().optional(),
				includeCriteria: z.boolean().optional(),
				cursor: z.string().optional(),
			})
		)
		.query(({ctx, input}) => {
			const search = input.query === '' ? undefined : input.query
			const perPage = input.dataPerPage ?? DEFAULT_PER_PAGE

			return ctx.prisma.app
				.findMany({
					where: {
						name: {search},
						company: {search},
						about: {search},
					},
					include: {AppCriteria: !!input.includeCriteria},
					take: perPage + 1,
					orderBy: {
						updatedAt: 'desc',
					},
					...(input.cursor && {cursor: {id: input.cursor}}),
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

	create: adminProcedure
		.input(appCreateSchema)
		.mutation(({ctx, input: {criteria, ...input}}) =>
			ctx.prisma.app.create({
				data: {
					...input,
					logo: input.logo ? input.logo.split('=')[0] : input.logo,
					AppCriteria: {
						createMany: {
							data: criteria,
						},
					},
				},
			})
		),
	update: adminProcedure
		.input(appUpdateSchema)
		.mutation(({ctx, input: {id, ...input}}) =>
			ctx.prisma.app
				.update({
					where: {id},
					data: {
						...input,
						logo: input.logo ? input.logo.split('=')[0] : input.logo,
					},
				})
				.then(async (updated) => {
					await revalidate('policy', slugify(updated.name, updated.id))
					return updated
				})
		),
	delete: adminProcedure.input(requiredIdSchema).mutation(({ctx, input}) =>
		ctx.prisma.$transaction([
			ctx.prisma.appCriteria.deleteMany({where: {appId: input.id}}),
			ctx.prisma.app.delete({
				where: {id: input.id},
			}),
		])
	),
})
