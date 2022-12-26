import React from 'react'

export const SectionSeparator = ({
	children,
	className,
}: {
	children: string
	className?: string
}) => {
	return (
		<div
			className={`flex items-center justify-center gap-4 text-light-head ${className}`}
		>
			<div className='h-[1px] w-auto grow rounded-full bg-brand-500/50' />
			<TriangleSymbol />
			<p className='w-fit text-lg'>{children}</p>
			<TriangleSymbol className='rotate-180' />
			<div className='h-[1px] w-auto grow rounded-full bg-brand-500/50' />
		</div>
	)
}

export const TriangleSymbol = ({className}: {className?: string}) => {
	return <span className={`${className} text-brand-300`}>⨞</span>
}
