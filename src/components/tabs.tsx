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
		<div>
			<div className='sm:hidden'>
				<label htmlFor='tabs' className='sr-only'>
					Select a tab
				</label>
				<select
					id='tabs'
					name='tabs'
					className='block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-brand-500 focus:outline-none focus:ring-brand-500 sm:text-sm'
					defaultValue={tabActive}
					onChange={(e) => setTabActive(e.target.value)}
				>
					{tabs.map((tab) => (
						<option key={'button_' + tab}>{tab}</option>
					))}
				</select>
			</div>
			<div className='hidden sm:block'>
				<div className='border-t border-gray-200/75'>
					<nav className='-mb-px flex flex-row-reverse' aria-label='Tabs'>
						{tabs.map((tab) => (
							<button
								key={'button_' + tab}
								className={`
                  ${
										tabActive === tab
											? 'border-gray-200/75 font-bold '
											: 'border-transparent'
									}
                  whitespace-nowrap border-t-2 px-4 py-2 text-sm font-medium hover:border-brand-300 hover:text-brand-300
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
		</div>
	)
}
