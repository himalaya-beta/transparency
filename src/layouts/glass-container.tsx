import React from 'react'

export default function GlassContainerLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className='glass mx-auto max-w-screen-lg space-y-8 rounded-xl p-8'>
			{children}
		</div>
	)
}
