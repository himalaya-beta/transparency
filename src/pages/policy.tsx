import React from 'react'
import NavbarLayout from 'layouts/navbar'

export default function PolicyPage() {
	return (
		<main className='container mx-auto max-w-screen-lg space-y-8 px-8 pb-10 pt-6 md:pb-8'>
			<h1 className='text-2xl'>Search for app policy</h1>
		</main>
	)
}

PolicyPage.getLayout = (page: React.ReactElement) => (
	<NavbarLayout>{page}</NavbarLayout>
)
