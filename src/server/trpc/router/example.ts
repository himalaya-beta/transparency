import {z} from 'zod'
import {router, publicProcedure} from '../trpc'

import {createExampleInputSchema} from 'types/example'

export const exampleRouter = router({
	getExamples: publicProcedure.query(({ctx}) => {
		return ctx.prisma.example.findMany()
	}),
	getExample: publicProcedure
		.input(z.object({id: z.string()}))
		.query(({ctx, input}) => {
			return ctx.prisma.example.findUnique({where: {id: input.id}})
		}),
	createExample: publicProcedure
		.input(createExampleInputSchema)
		.mutation(({ctx, input}) => {
			return ctx.prisma.example.create({data: input})
		}),
})
