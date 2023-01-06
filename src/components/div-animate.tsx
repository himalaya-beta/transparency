import React, {HTMLAttributes} from 'react'
import {useAutoAnimate} from '@formkit/auto-animate/react'
import {
	type AutoAnimateOptions,
	type AutoAnimationPlugin,
} from '@formkit/auto-animate'

type Props = {
	className?: string
	options?: Partial<AutoAnimateOptions> | AutoAnimationPlugin
	children: React.ReactNode
} & HTMLAttributes<HTMLDivElement>

const DivAnimate: React.FC<Props> = ({
	className,
	children,
	options,
	...props
}) => {
	const [ref] = useAutoAnimate<HTMLDivElement>(options)

	return (
		<div className={className} ref={ref} {...props}>
			{children}
		</div>
	)
}
export default DivAnimate
