import {useAutoAnimate} from '@formkit/auto-animate/react'
import cN from 'clsx'

export const DetailsPage = ({
	children,
	className,
}: {
	className?: string
	children: React.ReactNode
}) => {
	const [toggleAnimation] = useAutoAnimate<HTMLDivElement>()

	return (
		<main
			className={cN(
				'container mx-auto max-w-screen-lg rounded-b-lg border border-white/25 bg-dark-bg/25 px-6 py-8 shadow-lg shadow-brand-900',
				className
			)}
			ref={toggleAnimation}
		>
			<div className='absolute -top-2 left-0 h-2 w-full bg-brand-900' />
			{children}
		</main>
	)
}
