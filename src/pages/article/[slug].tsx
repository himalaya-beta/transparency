import React from 'react'
import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType} from 'next'

import {prisma} from '@server/db/client'

import PlainLayout from 'layouts/plain'
import GlassContainerLayout from 'layouts/glass-container'

import {type ArticleType} from '@type/article'

type ArticleSimplifiedType = Omit<ArticleType, 'createdAt' | 'updatedAt'>

export const getStaticProps: GetStaticProps<{
	article: ArticleSimplifiedType
}> = async ({params}) => {
	if (!params?.slug) return {notFound: true}

	const article = await prisma.article.findFirst({
		where: {slug: params.slug as string},
		select: {
			id: true,
			slug: true,
			title: true,
			content: true,
		},
	})

	if (!article) return {notFound: true}

	return {
		props: {
			article,
			// cannot send date on json :(
		},
	}
}

export const getStaticPaths: GetStaticPaths = async () => {
	const articles = await prisma.article.findMany({select: {slug: true}})
	const articleSlugs = articles.map(({slug}) => ({params: {slug}}))

	return {
		paths: articleSlugs,
		fallback: 'blocking',
	}
}

const ArticleDetailsPage = ({
	article,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
	return (
		<div className='space-y-8'>
			<h1 className='text-3xl text-gray-50'>{article.title}</h1>
			<p className='text-white'>{article.content}</p>
		</div>
	)
}

export default ArticleDetailsPage

ArticleDetailsPage.getLayout = (page: React.ReactElement) => (
	<PlainLayout>
		<GlassContainerLayout>{page}</GlassContainerLayout>
	</PlainLayout>
)
