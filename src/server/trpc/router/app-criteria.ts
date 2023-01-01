import {adminProcedure, router} from '../trpc'

import {z} from 'zod'

const criteriaSchema = z.object({
	appId: z.string(),
	criteriaId: z.string(),
	explanation: z.string().nullable(),
})
export type AppCriteria = z.infer<typeof criteriaSchema>

export const appCriteriaRouter = router({
	fetch: adminProcedure
		.input(z.object({appId: z.string()}))
		.query(({ctx, input}) =>
			ctx.prisma.appCriteria.findMany({where: {appId: input.appId}})
		),
	update: adminProcedure
		.input(
			z.object({
				upsert: z.array(criteriaSchema),
				remove: z.array(criteriaSchema),
			})
		)
		.mutation(({ctx, input: {upsert, remove}}) =>
			ctx.prisma.$transaction([
				...upsert.map((item) =>
					ctx.prisma.appCriteria.upsert({
						where: {
							appId_criteriaId: {
								appId: item.appId,
								criteriaId: item.criteriaId,
							},
						},
						create: {...item, assignedBy: ctx.session.user.id},
						update: {
							explanation: item.explanation,
							assignedBy: ctx.session.user.id,
						},
					})
				),
				...remove.map((item) =>
					ctx.prisma.appCriteria.delete({
						where: {
							appId_criteriaId: {
								appId: item.appId,
								criteriaId: item.criteriaId,
							},
						},
					})
				),
			])
		),
})
