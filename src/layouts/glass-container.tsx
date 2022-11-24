import React from 'react'

export default function GlassContainerLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='glass mx-auto max-w-screen-lg space-y-8 rounded-b-xl border-r-0  border-l-0 p-8 lg:px-16 xl:rounded-xl xl:border-2'>
			{children}
		</div>
	)
}
