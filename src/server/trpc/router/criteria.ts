/* eslint-disable unicorn/no-null */
import {adminProcedure, protectedProcedure, router} from '../trpc'
import {slugify} from 'server/utils/route'
import {
	criteriaCreateSchema,
	criteriaFetchSchema,
	criteriaUpdateSchema,
} from 'types/criteria'
import {requiredIdSchema} from 'types/general'

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
	create: adminProcedure.input(criteriaCreateSchema).mutation(({ctx, input}) =>
		ctx.prisma.criteria.create({
			data: {...input, slug: slugify(input.value)},
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
