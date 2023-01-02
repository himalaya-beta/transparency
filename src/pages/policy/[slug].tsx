import React from 'react'
import {
	type GetStaticPaths,
	type GetStaticProps,
	type InferGetStaticPropsType,
} from 'next'

import {prisma} from 'server/db/client'
import {extractIdFromSlug, slugify} from 'utils/literal'

import {useAutoAnimate} from '@formkit/auto-animate/react'
import NavbarLayout from 'layouts/navbar'
import MetaHead from 'components/meta-head'
import {AppType} from 'types/app'

export const getStaticProps: GetStaticProps<{
	app: AppType
}> = async ({params}) => {
	if (!params?.slug) return {notFound: true}

	const id = extractIdFromSlug(params.slug as string)

	const app = await prisma.app.findUnique({
		where: {id},
		include: {AppCriteria: true},
	})

	if (!app) return {notFound: true}

	return {
		props: {app},
		revalidate: true,
	}
}

export const getStaticPaths: GetStaticPaths = async () => {
	const apps = await prisma.app.findMany()
	const appSlugs = apps.map(({name, id}) => ({
		params: {slug: slugify(name, id)},
	}))

	return {
		paths: appSlugs,
		fallback: 'blocking',
	}
}

const AppDetailsPage = ({
	app,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
	const [toggleAnimation] = useAutoAnimate<HTMLDivElement>()

	return (
		<>
			<MetaHead
				title={app.name}
				description={app.about}
				imageUrl={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/images/articles.jpg`}
			/>
			<main
				className='container mx-auto max-w-screen-md space-y-8 px-6 pt-6'
				ref={toggleAnimation}
			>
				<h1 className='text-3xl'>{app.name}</h1>
				<p className='text-lg '>{app.about}</p>
			</main>
		</>
	)
}

export default AppDetailsPage

AppDetailsPage.getLayout = (page: React.ReactElement) => (
	<NavbarLayout>{page}</NavbarLayout>
)
