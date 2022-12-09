import {z} from 'zod'

export const requiredIdSchema = z.object({id: z.string()})
