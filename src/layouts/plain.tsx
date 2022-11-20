import React from 'react'

export default function PlainLayout({children}: {children: React.ReactNode}) {
	return (
		<div className='min-h-screen bg-gradient-to-br from-purple-900 to-gray-900 py-12'>
			<main className='container mx-auto'>{children}</main>
		</div>
	)
}
