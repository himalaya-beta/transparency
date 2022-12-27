import {publicProcedure, protectedProcedure, router} from '../trpc'
import {appCreateSchema} from 'types/app'
import {requiredIdSchema} from 'types/general'

export const appRouter = router({
	fetchAll: publicProcedure.query(({ctx}) => ctx.prisma.app.findMany()),
	fetchOne: publicProcedure
		.input(requiredIdSchema)
		.query(({ctx, input}) =>
			ctx.prisma.app.findUnique({where: {id: input.id}})
		),
	create: protectedProcedure
		.input(appCreateSchema)
		.mutation(({ctx, input: {criteria, ...input}}) => {
			const assigned = criteria.map((item) => ({
				criteriaId: item.id,
				note: item.explanation,
				assignedBy: ctx.session.user.id,
			}))

			return ctx.prisma.app.create({
				data: {
					...input,
					AppCriteria: {
						createMany: {
							data: assigned,
						},
					},
				},
			})
		}),
})
