type Props = {
	className?: string
	primaryClassName?: string
	secondaryClassName?: string
}

const UnderlineIcon = ({
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
			d='M448 480c0 17.69-14.31 32-32 32H32c-17.69 0-32-14.31-32-32s14.31-32 32-32h384C433.7 448 448 462.3 448 480z'
		/>
		<path
			className={secondaryClassName}
			d='M48 64.01H64v160c0 88.22 71.78 159.1 160 159.1s160-71.78 160-159.1v-160h16c17.69 0 32-14.32 32-32s-14.31-31.1-32-31.1l-96-.0049c-17.69 0-32 14.32-32 32s14.31 32 32 32H320v160c0 52.94-43.06 95.1-96 95.1S128 276.1 128 224v-160h16c17.69 0 32-14.31 32-32s-14.31-32-32-32l-96 .0049c-17.69 0-32 14.31-32 31.1S30.31 64.01 48 64.01z'
		/>
	</svg>
)

export default UnderlineIcon
