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
import {TriangleSymbol, VerticalHighlighter} from 'components/ornaments'
import {CheckIcon, MinusIcon} from '@heroicons/react/24/outline'

import {
	type GetStaticPaths,
	type GetStaticProps,
	type InferGetStaticPropsType,
} from 'next'
import {type AppType} from 'types/app'
import {type CriteriaAppType} from 'types/criteria'
import {type ArrayElement} from 'types/general'
import {DetailsPage} from 'layouts/details'

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
			<DetailsPage>
				<div className='relative'>
					<VerticalHighlighter />
					<h1 className='text-3xl'>{app.name}</h1>
					<p className='italic text-opacity-75'>
						{app.company}
						{app.headquarter && ' - ' + app.headquarter}
					</p>
					<p className='mt-4 max-w-screen-sm leading-5 md:pr-8 md:text-lg md:leading-normal'>
						{app.about}
					</p>
				</div>

				<QueryWrapper {...criteriaQ}>
					{(data) => (
						<ul className='relative'>
							<div className='relative flex w-full flex-row-reverse pt-3 md:py-2'>
								<p className='text-sm md:text-base'>
									Updated: {dayjs(app.updatedAt).format('D MMMM YYYY')}
								</p>
							</div>
							<div className='absolute right-0 h-full w-1/2 rounded bg-dark-bg/10 md:w-[37.5%]'></div>
							{data.map((criteria) => (
								<CriteriaList key={criteria.id} criteria={criteria} />
							))}
						</ul>
					)}
				</QueryWrapper>
			</DetailsPage>
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
	const [isExpanded, setIsExpanded] = React.useState(false)

	const [refAnimate] = useAutoAnimate<HTMLUListElement>()

	const onExpand = () => {
		if (hasChildren) {
			setIsExpanded(!isExpanded)
		}
	}

	return (
		<li
			className={`
				group relative flex list-none items-start gap-2 
				${sub ? 'group/sub py-0.5 first:mt-1 last:mb-2' : 'py-1 md:py-2'}
			`}
		>
			{!sub && (
				<TriangleSymbol
					onClick={onExpand}
					className={`
						-ml-6 w-4 transition-transform hover:cursor-pointer md:ml-0 md:w-6
						${hasChildren ? 'visible' : 'invisible'}
						${isExpanded ? 'mt-5 -rotate-90 md:mt-4' : '-rotate-180 md:mt-0.5'}
					`}
				/>
			)}
			<div className='w-full'>
				<div
					className={`
						grid grid-cols-8 border-b-[1px] border-brand-100 border-opacity-50 pb-1 transition-all
						${sub ? 'rounded border-dashed hover:pl-2 group-hover/sub:bg-brand-100/50' : ''}
					`}
				>
					<h3
						onClick={onExpand}
						className={`
							col-span-4 leading-5 transition-all md:col-span-5 md:whitespace-nowrap md:leading-normal
							${hasChildren ? 'hover:cursor-pointer' : ''}
							${
								sub
									? 'text-xs font-normal md:text-sm'
									: 'font-medium group-hover:font-semibold md:text-lg md:group-hover:text-xl'
							}
						`}
					>
						{criteria.value}
					</h3>

					<div className='col-span-4 flex h-full justify-center px-2 md:col-span-3'>
						{criteria.checked && (
							<>
								{criteria.type === 'TRUE_FALSE' && (
									<div
										className={`
											flex justify-center
											${
												sub
													? 'mr-2 h-6 w-8'
													: `h-8 w-8 ${
															isExpanded && hasChildren
																? 'invisible'
																: 'visible'
													  }`
											} 
										`}
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
									<p className='whitespace-pre-wrap text-center text-sm group-hover:font-semibold'>
										{criteria.explanation?.includes('http') ? (
											<a
												href={criteria.explanation}
												target='_blank'
												rel='noreferrer'
											>
												{criteria.explanation}
											</a>
										) : (
											<span>{criteria.explanation}</span>
										)}
									</p>
								)}
							</>
						)}
						{!criteria.checked && (
							<div
								className={`
									flex justify-center
									${sub ? 'mr-2 h-6 w-8' : `h-8 w-8 ${isExpanded ? 'invisible' : 'visible'}`} 
								`}
							>
								<MinusIcon
									className={`
										transition-all
										${
											sub
												? 'w-5 text-gray-500/75 group-hover/sub:text-gray-300'
												: 'w-6 text-gray-500/75 group-hover:w-8 group-hover:text-gray-300'
										}
									`}
								/>
							</div>
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
