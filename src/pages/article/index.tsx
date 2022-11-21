import Link from 'next/link'

import {trpc} from '@utils/trpc'

import PlainLayout from 'layouts/plain'
import GlassContainerLayout from 'layouts/glass-container'
import QueryWrapper from '@components/query-wrapper'
import CreateArticleForm from '@components/article-form'

import {ArticleType} from '@type/article'

export default function ArticlePage() {
	const articlesQuery = trpc.article.getArticles.useQuery()

	return (
		<div className='space-y-8'>
			<h1 className='text-3xl text-gray-50'>Articles</h1>
			<QueryWrapper {...articlesQuery}>
				{(articles) => (
					<div className='grid grid-cols-3 gap-4'>
						{articles.map((article) => (
							<Card key={article.id} {...article} />
						))}
					</div>
				)}
			</QueryWrapper>
			<CreateArticleForm />
		</div>
	)
}

const Card = ({slug, title, content}: ArticleType) => {
	return (
		<Link
			href={`./article/${slug}`}
			className={`hover:glass max-h-72 space-y-4 rounded-lg border-2 border-white/25 bg-white/10 p-6 transition-colors`}
		>
			<h2 className='text-xl text-gray-50'>{title}</h2>
			<p className='text-gray-200 line-clamp-6'>{content}</p>
		</Link>
	)
}

ArticlePage.getLayout = function getLayout(page: React.ReactElement) {
	return (
		<PlainLayout>
			<GlassContainerLayout>{page}</GlassContainerLayout>
		</PlainLayout>
	)
}
