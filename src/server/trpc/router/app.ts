import {publicProcedure, router, adminProcedure} from '../trpc'
import {appCreateSchema} from 'types/app'
import {requiredIdSchema} from 'types/general'

export const appRouter = router({
	fetchAll: publicProcedure.query(({ctx}) => ctx.prisma.app.findMany()),
	fetchOne: publicProcedure
		.input(requiredIdSchema)
		.query(({ctx, input}) =>
			ctx.prisma.app.findUnique({where: {id: input.id}})
		),
	create: adminProcedure
		.input(appCreateSchema)
		.mutation(({ctx, input: {criteria, ...input}}) => {
			const assigned = criteria.map(({id, explanation}) => ({
				criteriaId: id,
				explanation,
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
	delete: adminProcedure.input(requiredIdSchema).mutation(({ctx, input}) =>
		ctx.prisma.$transaction([
			ctx.prisma.appCriteria.deleteMany({where: {appId: input.id}}),
			ctx.prisma.app.delete({
				where: {id: input.id},
			}),
		])
	),
})
