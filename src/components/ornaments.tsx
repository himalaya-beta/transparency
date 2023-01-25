import React from 'react'
import clsx from 'clsx'

export const SectionSeparator = ({
	children,
	className,
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={`flex items-center justify-center gap-4 text-light-head ${className}`}
		>
			<div className='h-[1px] w-auto grow rounded-full bg-brand-500/50' />
			<TriangleSymbol />
			{children}
			<TriangleSymbol className='rotate-180' />
			<div className='h-[1px] w-auto grow rounded-full bg-brand-500/50' />
		</div>
	)
}

export const TriangleSymbol = ({
	className,
	...props
}: {className?: string} & React.HTMLAttributes<HTMLSpanElement>) => {
	return (
		<span className={`${className} text-brand-300`} {...props}>
			⨞
		</span>
	)
}

export const VerticalHighlighter = ({className}: {className?: string}) => {
	return <div className={clsx('absolute h-full w-1 bg-brand-300', className)} />
}
