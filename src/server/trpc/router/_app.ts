// src/server/trpc/router/_app.ts
import {router} from '../trpc'
import {authRouter} from './auth'
import {articleRouter} from './article'
import {criteriaRouter} from './criteria'
import {appRouter as appPolicyRouter} from './app'

export const appRouter = router({
	auth: authRouter,
	article: articleRouter,
	criteria: criteriaRouter,
	app: appPolicyRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
