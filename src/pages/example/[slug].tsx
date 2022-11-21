import React from 'react'
import {useRouter} from 'next/router'
import PlainLayout from 'layouts/plain'

const ExampleDetailsPage = () => {
	const {query} = useRouter()

	return (
		<div>
			<p className='text-white'>Example #{query.slug}</p>
		</div>
	)
}

export default ExampleDetailsPage

ExampleDetailsPage.getLayout = (page: React.ReactElement) => (
	<PlainLayout>{page}</PlainLayout>
)
