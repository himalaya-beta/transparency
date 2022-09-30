// src/pages/_app.tsx
import '@styles/globals.scss'
import {SessionProvider} from 'next-auth/react'
import type {AppType} from 'next/dist/shared/lib/utils'
import {trpc} from '@utils/trpc'

const MyApp: AppType = ({Component, pageProps}) => {
	return (
		<SessionProvider session={pageProps.session}>
			<Component {...pageProps} />
		</SessionProvider>
	)
}

export default trpc.withTRPC(MyApp)
