import {z} from 'zod'
import {adminProcedure, protectedProcedure, router} from '../trpc'
import {slugify} from 'server/utils/route'
import {CreateCriteriaSchema, UpdateCriteriaSchema} from 'types/criteria'
import {requiredIdSchema} from 'types/general'

export const criteriaRouter = router({
	fetchAll: protectedProcedure.query(({ctx}) => ctx.prisma.criteria.findMany()),
	fetchOne: protectedProcedure
		.input(requiredIdSchema)
		.query(({ctx, input}) =>
			ctx.prisma.criteria.findUnique({where: {id: input.id}})
		),
	create: adminProcedure.input(CreateCriteriaSchema).mutation(({ctx, input}) =>
		ctx.prisma.criteria.create({
			data: {...input, slug: slugify(input.value)},
		})
	),
	update: adminProcedure
		.input(UpdateCriteriaSchema)
		.mutation(({ctx, input}) =>
			ctx.prisma.criteria.update({where: {id: input.id}, data: input})
		),
	delete: adminProcedure
		.input(requiredIdSchema)
		.mutation(({ctx, input}) =>
			ctx.prisma.criteria.delete({where: {id: input.id}})
		),
})
