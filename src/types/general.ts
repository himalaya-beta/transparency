import {z} from 'zod'

export const requiredIdSchema = z.object({id: z.string()})

export type ArrayElement<ArrayType extends readonly unknown[]> =
	ArrayType extends readonly (infer ElementType)[] ? ElementType : never
