/* eslint-disable unicorn/no-null */
import React from 'react'
import {useAutoAnimate} from '@formkit/auto-animate/react'
import dayjs from 'dayjs'

import {prisma} from 'server/db/client'
import {trpc} from 'utils/trpc'
import {extractIdFromSlug, slugify} from 'utils/literal'

import NavbarLayout from 'layouts/navbar'
import MetaHead from 'components/meta-head'
import QueryWrapper from 'components/query-wrapper'
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
					<div className='flex justify-between text-opacity-75 child:italic'>
						<p>{app.company}</p>
						<p>Last updated: {dayjs(app.updatedAt).format('MMM D, YYYY')}</p>
					</div>
					<p className='mt-4 text-lg'>{app.about}</p>
				</div>

				<QueryWrapper {...criteriaQ}>
					{(data) => (
						<ul className='relative space-y-0'>
							<div className='absolute right-0 h-full w-[37.5%] rounded bg-dark-bg/10'></div>
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

	const [refAnimate] = useAutoAnimate<HTMLUListElement>()

	const onExpand = () => {
		if (hasChildren) {
			setIsExpanded(!isExpanded)
		}
	}

	return (
		<li
			className={`group relative flex list-none items-start gap-2 ${
				sub ? 'group/sub py-0.5 first:mt-1 last:mb-2' : 'py-2'
			}`}
		>
			<TriangleSymbol
				onClick={onExpand}
				className={`
					w-fit transition-transform hover:cursor-pointer
					${hasChildren ? 'visible' : 'invisible'}
					${isExpanded ? '-rotate-90' : '-rotate-180'}
				`}
			/>
			<div className='w-full'>
				<div
					className={`
						grid grid-cols-8 border-b-[1px] border-brand-100 border-opacity-50 transition-all
						${sub ? 'rounded border-dashed hover:pl-2 group-hover/sub:bg-brand-100/50' : ''}
					`}
				>
					<h3
						onClick={onExpand}
						className={`
							col-span-5 transition-all
							${
								sub
									? 'text-sm font-normal'
									: 'text-lg font-medium group-hover:pl-2 group-hover:text-xl group-hover:font-semibold'
							}
							${hasChildren ? 'hover:cursor-pointer' : ''}
						`}
					>
						{criteria.value}
					</h3>

					<div className='col-span-3 flex h-full justify-center px-2'>
						{criteria.type === 'TRUE_FALSE' && criteria.checked && (
							<div
								className={`${
									sub ? 'mr-2 h-6 w-8' : 'h-8 w-8'
								} flex justify-center `}
							>
								<CheckIcon
									className={`
										transition-all
										${
											sub
												? 'w-5 text-brand-400 group-hover/sub:text-white'
												: 'w-6 text-brand-200 group-hover:w-8 group-hover:text-white'
										}
									`}
								/>
							</div>
						)}
						{criteria.type === 'EXPLANATION' && (
							<p className='text-center text-sm group-hover:font-semibold'>
								{criteria.explanation}
							</p>
						)}
					</div>
				</div>

				<ul ref={refAnimate}>
					{isExpanded &&
						hasChildren &&
						!sub &&
						criteria.children.map((child) => (
							<CriteriaList key={child.id} criteria={child} sub />
						))}
				</ul>
			</div>
		</li>
	)
}

export default AppDetailsPage

AppDetailsPage.getLayout = (page: React.ReactElement) => (
	<NavbarLayout>{page}</NavbarLayout>
)
