/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable unicorn/no-null */
import {z} from 'zod'
import {adminProcedure, publicProcedure, router} from '../trpc'

import {
	criteriaCreateSchema,
	criteriaFetchSchema,
	criteriaUpdateSchema,
} from 'types/criteria'
import {requiredIdSchema} from 'types/general'

import {type PrismaPromise, type AppCriteria} from '@prisma/client'

export const criteriaRouter = router({
	fetchRoot: adminProcedure.input(criteriaFetchSchema).query(({ctx, input}) =>
		ctx.prisma.criteria.findMany({
			...(input.noParent && {where: {parent: null}}),
			include: {children: true},
			orderBy: {order: 'asc'},
		})
	),
	fetchOne: adminProcedure.input(requiredIdSchema).query(({ctx, input}) =>
		ctx.prisma.criteria.findUnique({
			where: {id: input.id},
			include: {children: true},
		})
	),
	fetchByApp: publicProcedure
		.input(z.object({appId: z.string()}))
		.query(({ctx, input}) => {
			const criteriaRes = ctx.prisma.criteria.findMany({
				where: {parentId: null},
				include: {children: true},
				orderBy: {order: 'asc'},
			})

			const appCriteriaRes = ctx.prisma.appCriteria.findMany({
				where: {appId: input.appId},
			})

			return Promise.all([criteriaRes, appCriteriaRes]).then((data) => {
				const [criteriaData, appCriteriaData] = data

				return criteriaData.map((criteria) => {
					const children = criteria.children.map((child) => {
						const childFound = appCriteriaData.find(
							(c) => c.criteriaId === child.id
						)
						return {
							...child,
							checked: !!childFound,
							explanation: childFound?.explanation ?? null,
						}
					})

					const found = appCriteriaData.find(
						(c) => c.criteriaId === criteria.id
					)

					return {
						...criteria,
						children,
						checked: !!found,
						explanation: found?.explanation ?? null,
					}
				})
			})
		}),

	compareApps: publicProcedure
		.input(z.object({appIds: z.string().array()}))
		.query(({ctx, input}) => {
			const criteriaPromise = ctx.prisma.criteria.findMany({
				where: {parentId: null},
				include: {children: true},
				orderBy: {order: 'asc'},
			})

			const appCriteriaPromises: PrismaPromise<AppCriteria[]>[] = []
			for (const appId of input.appIds) {
				appCriteriaPromises.push(
					ctx.prisma.appCriteria.findMany({
						where: {appId},
					})
				)
			}

			return Promise.all([criteriaPromise, ...appCriteriaPromises]).then(
				(data) => {
					const [criteriaData, ...appsCriteriaData] = data

					type status = {
						appId: string
						checked: boolean
						explanation: string | null
					}
					const getComparison = (criteriaId: string) => {
						const comparison: status[] = []
						appsCriteriaData.map((appCriteria, i) => {
							const found = appCriteria.find((c) => c.criteriaId === criteriaId)
							comparison.push({
								appId: input.appIds[i]!,
								checked: !!found,
								explanation: found?.explanation ?? null,
							})
						})
						return comparison
					}

					return criteriaData.map((criteria) => {
						const children = criteria.children.map((child) => ({
							...child,
							comparison: getComparison(child.id),
						}))

						return {
							...criteria,
							comparison: getComparison(criteria.id),
							children,
						}
					})
				}
			)
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
