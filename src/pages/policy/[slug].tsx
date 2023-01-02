/* eslint-disable unicorn/no-null */
import React from 'react'
import {useAutoAnimate} from '@formkit/auto-animate/react'

import {prisma} from 'server/db/client'
import {trpc} from 'utils/trpc'
import {extractIdFromSlug, slugify} from 'utils/literal'

import NavbarLayout from 'layouts/navbar'
import MetaHead from 'components/meta-head'
import QueryWrapper from 'components/query-wrapper'
import DivAnimate from 'components/div-animate'
import {TriangleSymbol} from 'components/ornaments'
import {CheckIcon} from '@heroicons/react/24/outline'

import {
	type GetStaticPaths,
	type GetStaticProps,
	type InferGetStaticPropsType,
} from 'next'
import {type AppType} from 'types/app'
import {type CriteriaAppType} from 'types/criteria'
import {type ArrayElement} from 'types/general'

export const getStaticProps: GetStaticProps<{
	app: AppType
}> = async ({params}) => {
	if (!params?.slug) return {notFound: true}

	const id = extractIdFromSlug(params.slug as string)

	const app = await prisma.app.findUnique({
		where: {id},
		include: {AppCriteria: {include: {criteria: true}}},
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

	const criteriaQ = trpc.criteria.fetchByApp.useQuery(
		{appId: app.id},
		{refetchOnWindowFocus: false}
	)

	return (
		<>
			<MetaHead
				title={app.name}
				description={app.about}
				imageUrl={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/images/articles.jpg`}
			/>
			<main
				className='container mx-auto max-w-screen-lg space-y-8 px-6 pt-6'
				ref={toggleAnimation}
			>
				<div className='max-w-screen-md'>
					<h1 className='text-3xl'>{app.name}</h1>
					<p className='italic text-opacity-75'>{app.company}</p>
					<p className='mt-4 text-lg'>{app.about}</p>
				</div>

				<QueryWrapper {...criteriaQ}>
					{(data) => (
						<ul className='space-y-4'>
							{data.map((criteria) => (
								<CriteriaList key={criteria.id} criteria={criteria} />
							))}
						</ul>
					)}
				</QueryWrapper>
			</main>
		</>
	)
}

type CriteriaLisProps =
	| {
			criteria: Omit<ArrayElement<CriteriaAppType>, 'children'>
			sub: true
	  }
	| {
			sub?: false
			criteria: ArrayElement<CriteriaAppType>
	  }
const CriteriaList = ({criteria, sub}: CriteriaLisProps) => {
	const hasChildren = sub ? false : criteria.children.length > 0
	const [isExpanded, setIsExpanded] = React.useState(criteria.checked)

	const onExpand = () => {
		if (hasChildren) {
			setIsExpanded(!isExpanded)
		}
	}

	return (
		<li className='flex list-none items-start gap-2'>
			<TriangleSymbol
				onClick={onExpand}
				className={`
					transition-transform hover:cursor-pointer
					${hasChildren ? 'visible' : 'invisible'}
					${isExpanded ? '-rotate-90' : '-rotate-180'}
				`}
			/>
			<div className='w-full'>
				<div
					className={`
						grid grid-cols-8 border-b-[1px] border-brand-100 border-opacity-50 
						${sub && 'border-dashed'}
					`}
				>
					<h3
						onClick={onExpand}
						className={`
							col-span-5 
							${sub ? 'text-sm font-normal' : 'text-lg font-medium'}
							${hasChildren ? 'hover:cursor-pointer' : ''}
						`}
					>
						{criteria.value}
					</h3>

					<div className='col-span-3 flex h-full w-fit justify-center justify-self-end'>
						{criteria.type === 'TRUE_FALSE' && criteria.checked && (
							<CheckIcon
								className={`${
									sub
										? 'mr-[2.125rem] w-5 text-brand-400'
										: 'mr-8 w-6 text-brand-200'
								}`}
							/>
						)}
						{criteria.type === 'EXPLANATION' && (
							<p className='text-right text-sm'>{criteria.explanation}</p>
						)}
					</div>
				</div>

				<DivAnimate className='pt-2'>
					{isExpanded &&
						hasChildren &&
						!sub &&
						criteria.children.map((child) => (
							<CriteriaList key={child.id} criteria={child} sub />
						))}
				</DivAnimate>
			</div>
		</li>
	)
}

export default AppDetailsPage

AppDetailsPage.getLayout = (page: React.ReactElement) => (
	<NavbarLayout>{page}</NavbarLayout>
)
