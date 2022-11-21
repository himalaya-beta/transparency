import React from 'react'
import {useRouter} from 'next/router'
import PlainLayout from 'layouts/plain'

const ExampleDetailsPage = () => {
	const {query} = useRouter()

	return <div>Example #{query.id}</div>
}

export default ExampleDetailsPage

ExampleDetailsPage.getLayout = (page: React.ReactElement) => (
	<PlainLayout>{page}</PlainLayout>
)
