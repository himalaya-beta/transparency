import React from 'react'

export default function GlassContainerLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='glass mx-auto max-w-screen-lg space-y-8 rounded-xl bg-red-200/50 p-8'>
			{children}
		</div>
	)
}
