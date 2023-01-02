/* eslint-disable unicorn/no-null */
import {adminProcedure, protectedProcedure, router} from '../trpc'

import {
	criteriaCreateSchema,
	criteriaFetchSchema,
	criteriaUpdateSchema,
} from 'types/criteria'
import {requiredIdSchema} from 'types/general'
import {z} from 'zod'

export const criteriaRouter = router({
	fetchRoot: protectedProcedure
		.input(criteriaFetchSchema)
		.query(({ctx, input}) =>
			ctx.prisma.criteria.findMany({
				...(input.noParent && {where: {parent: null}}),
				include: {children: true},
				orderBy: {order: 'asc'},
			})
		),
	fetchOne: protectedProcedure.input(requiredIdSchema).query(({ctx, input}) =>
		ctx.prisma.criteria.findUnique({
			where: {id: input.id},
			include: {children: true},
		})
	),
	fetchByApp: protectedProcedure
		.input(z.object({appId: z.string()}))
		.query(({ctx, input}) => {
			const criteria = ctx.prisma.criteria.findMany({
				where: {parentId: null},
				include: {children: true},
				orderBy: {order: 'asc'},
			})

			const appCriteria = ctx.prisma.appCriteria.findMany({
				where: {appId: input.appId},
			})

			return Promise.all([criteria, appCriteria]).then((data) => {
				const [criteriaData, appCriteriaData] = data

				return criteriaData.map((criteria) => {
					const checked = appCriteriaData.find(
						(c) => c.criteriaId === criteria.id
					)
					return {
						...criteria,
						checked: !!checked,
						explanation: checked?.explanation ?? null,
					}
				})
			})
		}),

	create: adminProcedure.input(criteriaCreateSchema).mutation(({ctx, input}) =>
		ctx.prisma.criteria.create({
			data: input,
		})
	),
	update: adminProcedure
		.input(criteriaUpdateSchema)
		.mutation(({ctx, input: {id, ...input}}) =>
			ctx.prisma.criteria.update({where: {id}, data: input})
		),
	delete: adminProcedure
		.input(requiredIdSchema)
		.mutation(({ctx, input}) =>
			ctx.prisma.$transaction([
				ctx.prisma.criteria.deleteMany({where: {parentId: input.id}}),
				ctx.prisma.criteria.delete({where: {id: input.id}}),
			])
		),
})
