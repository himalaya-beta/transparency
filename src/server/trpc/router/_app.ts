// src/server/trpc/router/_app.ts
import {router} from '../trpc'
import {authRouter} from './auth'
import {articleRouter} from './article'
import {criteriaRouter} from './criteria'
import {appRouter as appPolicyRouter} from './app'
import {appCriteriaRouter} from './app-criteria'

export const appRouter = router({
	auth: authRouter,
	article: articleRouter,
	criteria: criteriaRouter,
	app: appPolicyRouter,
	appCriteria: appCriteriaRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
