import cN from 'clsx'
import DivAnimate from 'components/div-animate'

export const DetailsPage = ({
	children,
	className,
}: {
	className?: string
	children: React.ReactNode
}) => {
	return (
		<main className='container mx-auto max-w-screen-lg md:px-6'>
			<DivAnimate
				className={cN(
					'rounded-b-xl border border-white/25 bg-dark-bg/25 px-6 py-8 shadow-lg shadow-brand-900',
					className
				)}
			>
				<div className='absolute -top-2 left-0 h-2 w-full bg-brand-900' />
				{children}
			</DivAnimate>
		</main>
	)
}
