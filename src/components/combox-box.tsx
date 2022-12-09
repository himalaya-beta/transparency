import {useState, Fragment, Dispatch} from 'react'
import {Combobox, Transition} from '@headlessui/react'
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid'

type Props<T> = {
	label: string
	items: Array<T> | undefined
	labelField: keyof T
	selected: T | undefined
	setSelected: Dispatch<T>
}

const ComboboxInput = <T extends {id: string}>({
	label,
	items,
	labelField,
	selected,
	setSelected,
}: Props<T>) => {
	const [query, setQuery] = useState('')

	const filteredItems =
		query === ''
			? items
			: items?.filter((item) => {
					return (item[labelField] as string)
						.toLowerCase()
						.includes(query.toLowerCase())
			  })

	return (
		<div className=''>
			<Combobox value={selected} onChange={setSelected}>
				<Combobox.Label>{label}</Combobox.Label>
				<div className='relative mt-1'>
					<div className='relative w-full cursor-default overflow-hidden rounded-lg bg-light-bg text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-300 sm:text-sm'>
						<Combobox.Input
							className='w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0'
							displayValue={(item: T | undefined) =>
								item?.[labelField] as string
							}
							onChange={(event) => setQuery(event.target.value)}
							onFocus={(event: any) => {
								event.target.nextSibling.click()
							}}
						/>
						<Combobox.Button className='absolute inset-y-0 right-0 flex items-center pr-2'>
							<ChevronUpDownIcon
								className='h-5 w-5 text-gray-400'
								aria-hidden='true'
							/>
						</Combobox.Button>
					</div>
					<Transition
						as={Fragment}
						leave='transition ease-in duration-100'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
						afterLeave={() => setQuery('')}
					>
						<Combobox.Options className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-light-bg py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
							{filteredItems?.length === 0 && query !== '' ? (
								<div className='relative cursor-default select-none py-2 px-4 text-dark-body'>
									Nothing found.
								</div>
							) : (
								filteredItems?.map((item) => (
									<Combobox.Option
										key={item.id}
										className={({active}) =>
											`relative cursor-default select-none py-2 pl-10 pr-4 ${
												active
													? 'bg-brand-600 text-light-body'
													: 'text-dark-body'
											}`
										}
										value={item}
									>
										{({selected, active}) => (
											<>
												<span
													className={`block truncate ${
														selected ? 'font-medium' : 'font-normal'
													}`}
												>
													{item[labelField] as string}
												</span>
												{selected ? (
													<span
														className={`absolute inset-y-0 left-0 flex items-center pl-3`}
													>
														<CheckIcon
															className={`h-5 w-5 ${
																active ? 'text-brand-100' : 'text-brand-600'
															}`}
															aria-hidden='true'
														/>
													</span>
												) : undefined}
											</>
										)}
									</Combobox.Option>
								))
							)}
						</Combobox.Options>
					</Transition>
				</div>
			</Combobox>
		</div>
	)
}

export default ComboboxInput
