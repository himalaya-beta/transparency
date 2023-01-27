type Props = {
	className?: string
	primaryClassName?: string
	secondaryClassName?: string
}

const BlackQuoteIcon = ({
	className = 'h-5 w-5',
	primaryClassName,
	secondaryClassName,
}: Props) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		viewBox='0 0 448 512'
		className={className}
	>
		<path
			className={primaryClassName}
			d='M0 256C0 238.3 14.33 224 32 224C49.67 224 64 238.3 64 256V416C64 433.7 49.67 448 32 448C14.33 448 0 433.7 0 416V256z'
		/>
		<path
			className={secondaryClassName}
			d='M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM128 256C128 238.3 142.3 224 160 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H160C142.3 288 128 273.7 128 256zM416 384C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448H160C142.3 448 128 433.7 128 416C128 398.3 142.3 384 160 384H416z'
		/>
	</svg>
)

export default BlackQuoteIcon
