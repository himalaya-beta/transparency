import {adminProcedure, protectedProcedure, router} from '../trpc'
import {slugify} from 'server/utils/route'
import {criteriaCreateSchema, criteriaUpdateSchema} from 'types/criteria'
import {requiredIdSchema} from 'types/general'

export const criteriaRouter = router({
	fetchAll: protectedProcedure.query(({ctx}) => ctx.prisma.criteria.findMany()),
	fetchOne: protectedProcedure
		.input(requiredIdSchema)
		.query(({ctx, input}) =>
			ctx.prisma.criteria.findUnique({where: {id: input.id}})
		),
	create: adminProcedure.input(criteriaCreateSchema).mutation(({ctx, input}) =>
		ctx.prisma.criteria.create({
			data: {...input, slug: slugify(input.value)},
		})
	),
	update: adminProcedure
		.input(criteriaUpdateSchema)
		.mutation(({ctx, input}) =>
			ctx.prisma.criteria.update({where: {id: input.id}, data: input})
		),
	delete: adminProcedure
		.input(requiredIdSchema)
		.mutation(({ctx, input}) =>
			ctx.prisma.criteria.delete({where: {id: input.id}})
		),
})
