import React from 'react'
import {useRouter} from 'next/router'
import PlainLayout from 'layouts/plain'
import GlassContainerLayout from 'layouts/glass-container'

const ArticleDetailsPage = () => {
	const {query} = useRouter()

	return (
		<div>
			<p className='text-white'>Article #{query.slug}</p>
		</div>
	)
}

export default ArticleDetailsPage

ArticleDetailsPage.getLayout = (page: React.ReactElement) => (
	<PlainLayout>
		<GlassContainerLayout>{page}</GlassContainerLayout>
	</PlainLayout>
)
