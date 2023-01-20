import React from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'

import {prisma} from 'server/db/client'
import {extractIdFromSlug, slugify} from 'utils/literal'

import NavbarLayout from 'layouts/navbar'
import MetaHead from 'components/meta-head'
import {DetailsPage} from 'layouts/details'
import {VerticalHighlighter} from 'components/ornaments'

import {
	type GetStaticPaths,
	type GetStaticProps,
	type InferGetStaticPropsType,
} from 'next'
import {type NextPageWithLayout} from 'pages/_app'
import {type ArticleType} from 'types/article'

export const getStaticProps: GetStaticProps<{
	article: ArticleType
}> = async ({params}) => {
	if (!params?.slug) return {notFound: true}

	const id = extractIdFromSlug(params.slug as string)

	const article = await prisma.article.findUnique({
		where: {id},
		include: {author: {select: {name: true, image: true}}},
	})

	if (!article) return {notFound: true}

	return {
		props: {article},
		revalidate: true,
	}
}

export const getStaticPaths: GetStaticPaths = async () => {
	const articles = await prisma.article.findMany()
	const articleSlugs = articles.map(({title, id}) => ({
		params: {slug: slugify(title, id)},
	}))

	return {
		paths: articleSlugs,
		fallback: 'blocking',
	}
}

const ArticleDetailsPage: NextPageWithLayout<
	InferGetStaticPropsType<typeof getStaticProps>
> = ({article}) => {
	return (
		<>
			<MetaHead
				title={article.title}
				description={article.content}
				imageUrl={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}/images/articles.jpg`}
			/>
			<DetailsPage>
				<div className='relative space-y-2'>
					<VerticalHighlighter />
					<h1 className='text-3xl'>{article.title}</h1>
					<div className='flex items-end justify-between'>
						<div className='flex items-center gap-3'>
							{article.author.image && (
								<div className='z-10 h-10 w-10 shadow-xl'>
									<Image
										className='h-full w-full rounded-l-lg border-0 border-l-0 border-brand-300 object-cover'
										src={article.author.image}
										alt='author picture'
										width={48}
										height={48}
									/>
								</div>
							)}
							<p className='rounded-lg border-r-2 border-brand-300 pr-4 italic leading-5 text-opacity-90'>
								<span className='italic'>written by</span>
								<br />
								<span className='font-bold'>{article.author.name}</span>
							</p>
						</div>
						<p className='text-right text-sm italic md:text-base'>
							{dayjs(article.updatedAt).format('D MMMM YYYY')}
						</p>
					</div>
				</div>

				<div className='mt-6'>
					<p className='whitespace-pre-wrap md:text-lg'>{article.content}</p>
				</div>
			</DetailsPage>
		</>
	)
}

ArticleDetailsPage.getLayout = (page) => <NavbarLayout>{page}</NavbarLayout>

export default ArticleDetailsPage
