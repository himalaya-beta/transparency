import React, {type Dispatch} from 'react'

export default function Tabs({
	tabs,
	tabActive,
	setTabActive,
}: {
	tabs: string[]
	tabActive: string
	setTabActive: Dispatch<string>
}) {
	return (
		<div className='border-t-2 border-gray-200/75 md:border-none md:px-8'>
			<div className='border-t-[1px] border-gray-200/75'>
				<nav className='-mb-px flex flex-row-reverse' aria-label='Tabs'>
					{tabs.map((tab) => (
						<button
							key={'button_' + tab}
							className={`
                  ${
										tabActive === tab
											? 'border-gray-200/75 font-heading font-extrabold'
											: 'border-transparent font-normal'
									}
                  whitespace-nowrap border-t-2 px-4 py-2 text-sm text-light-bg hover:font-semibold
                `}
							onClick={() => setTabActive(tab)}
							aria-current={tabActive === tab ? 'page' : undefined}
						>
							{tab}
						</button>
					))}
				</nav>
			</div>
		</div>
	)
}
