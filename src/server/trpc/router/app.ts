import {publicProcedure, router, adminProcedure} from '../trpc'
import {appCreateSchema, appUpdateSchema} from 'types/app'
import {requiredIdSchema} from 'types/general'

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
	create: adminProcedure
		.input(appCreateSchema)
		.mutation(({ctx, input: {criteria, ...input}}) =>
			ctx.prisma.app.create({
				data: {
					...input,
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
			ctx.prisma.app.update({where: {id}, data: input})
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
