import React from 'react'
import {useRouter} from 'next/router'
import {z} from 'zod'
import {useForm, SubmitHandler, useFieldArray} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {trpc} from 'utils/trpc'

import DivAnimate from 'components/div-animate'
import QueryWrapper from 'components/query-wrapper'
import FormWrapper from 'components/form-wrapper'
import TextAreaInput from 'components/textarea-input'
import {Button, IconButton} from 'components/button'
import {SectionSeparator} from 'components/ornaments'
import {ErrorMessage} from '@hookform/error-message'
import {
	Bars3BottomLeftIcon,
	ChevronDownIcon,
	PencilIcon,
	PlusIcon,
	TrashIcon,
} from '@heroicons/react/24/outline'

import {criteriaUpdateSchema} from 'types/criteria'
import {appCreateSchema} from 'types/app'

const criteriaSchema = criteriaUpdateSchema
	.pick({id: true, type: true})
	.extend({
		checked: z.boolean(),
		explanation: z.string().optional(),
	})
	.refine(
		(val) =>
			!(
				val.checked &&
				val.type === 'EXPLANATION' &&
				(!!val.explanation || val.explanation === '') &&
				val.explanation?.length < 3
			),
		{message: 'Provide more clear explanation', path: ['explanation']}
	)

const appSchema = appCreateSchema.extend({
	criteria: z
		.array(criteriaSchema)
		.refine((val) => val.some((item) => item.checked), 'Provide criteria'),
})

type AppTypeForm = z.infer<typeof appSchema>

export default function AppSection() {
	const router = useRouter()

	const [isCreate, setIsCreate] = React.useState(false)

	const appQuery = trpc.app.fetchAll.useQuery()
	const criteriaQuery = trpc.criteria.fetchRoot.useQuery(
		{noParent: false},
		{
			refetchOnWindowFocus: false,
			onSuccess: (data) => {
				for (const [i, criteria] of data.entries()) {
					setValue(`criteria.${i}.id`, criteria.id)
					setValue(`criteria.${i}.type`, criteria.type)
					setValue(`criteria.${i}.checked`, false)
				}
			},
		}
	)
	const {mutate: create} = trpc.app.create.useMutation({
		onSuccess: () => router.push('/policy'),
	})
	const {mutate: remove} = trpc.app.delete.useMutation({
		onSuccess: () => {
			appQuery.refetch()
		},
	})

	const methods = useForm<AppTypeForm>({resolver: zodResolver(appSchema)})
	const {
		control,
		setValue,
		watch,
		formState: {errors},
	} = methods
	const criteriaInput = watch('criteria')
	useFieldArray<AppTypeForm>({control, name: 'criteria'})

	const onCreateApp: SubmitHandler<AppTypeForm> = (data) => {
		const criteria = data.criteria
			.filter((item) => item.checked)
			.map((item) => ({
				id: item.id,
				explanation: item.explanation,
			}))

		create({
			...data,
			criteria,
		})
	}

	return (
		<DivAnimate>
			{isCreate ? (
				<>
					<h1 className='mb-4 text-2xl'>Create new app</h1>

					<FormWrapper
						methods={methods}
						onValidSubmit={onCreateApp}
						className='flex flex-col'
					>
						<div className='mb-2 grid grid-cols-2 gap-x-8 gap-y-2'>
							<TextAreaInput<AppTypeForm>
								name='name'
								label='App name'
								rows={1}
							/>
							<div />
							<TextAreaInput<AppTypeForm>
								name='company'
								label='Company name'
								rows={1}
							/>
							<TextAreaInput<AppTypeForm> name='headquarter' rows={1} />
							<TextAreaInput<AppTypeForm>
								name='registeredIn'
								label='Registered city'
								rows={1}
							/>
							<TextAreaInput<AppTypeForm> name='offices' rows={1} />
							<TextAreaInput<AppTypeForm>
								name='about'
								wrapperClassName='col-span-2'
							/>
						</div>

						<fieldset className='mt-6'>
							<SectionSeparator>Policy criteria</SectionSeparator>

							<QueryWrapper {...criteriaQuery}>
								{(data) => (
									<div className='divide-y divide-gray-500/50 '>
										{data.map((criteria, i) => {
											if (criteria.parentId) return
											return (
												<DivAnimate
													key={criteria.id}
													className='flex flex-col items-start py-3'
												>
													<input
														type='hidden'
														{...methods.register(`criteria.${i}.id` as const)}
													/>
													<input
														type='hidden'
														{...methods.register(`criteria.${i}.type` as const)}
													/>

													<div className='flex gap-2'>
														<div className='ml-2 mt-0.5 flex h-5 items-center'>
															<input
																id={`criteria-${criteria.id}`}
																type='checkbox'
																className='h-4 w-4 rounded border-gray-300 text-brand-600 hover:cursor-pointer focus:ring-brand-500'
																{...methods.register(
																	`criteria.${i}.checked` as const
																)}
															/>
														</div>
														<div className='min-w-0 items-start'>
															<label
																htmlFor={`criteria-${criteria.id}`}
																className='select-none font-medium hover:cursor-pointer'
															>
																{criteria.value}
															</label>
															{criteria.type === 'EXPLANATION' && (
																<Bars3BottomLeftIcon className='ml-2 inline h-5 w-5 align-middle text-brand-100' />
															)}
															{criteria.children.length > 0 && (
																<ChevronDownIcon className='ml-2 inline h-5 w-5 align-middle text-brand-100' />
															)}
														</div>
													</div>

													{criteriaInput?.[i]?.checked &&
														criteriaInput[i]?.type === 'EXPLANATION' && (
															<TextAreaInput
																name={`criteria.${i}.explanation`}
																label=''
																wrapperClassName='w-full pl-9 pt-1'
																autoFocus
															/>
														)}

													{criteriaInput?.[i]?.checked &&
														criteria.children.length > 0 && (
															<div className='w-full pl-9 pt-1'>
																{criteria.children.map((item) => {
																	const idx = data.findIndex(
																		(c) => c.id === item.id
																	)
																	return (
																		<DivAnimate
																			key={item.id}
																			className='flex flex-col'
																		>
																			<div className='flex gap-2'>
																				<div className='flex h-5 items-center'>
																					<input
																						id={`criteria-${item.id}`}
																						type='checkbox'
																						className='mt-1 h-4 w-4 rounded border-gray-300 text-brand-600 hover:cursor-pointer focus:ring-brand-500'
																						{...methods.register(
																							`criteria.${idx}.checked` as const
																						)}
																					/>
																				</div>
																				<div className='min-w-0'>
																					<label
																						htmlFor={`criteria-${item.id}`}
																						className='select-none font-medium hover:cursor-pointer'
																					>
																						{item.value}
																					</label>
																					{item.type === 'EXPLANATION' && (
																						<Bars3BottomLeftIcon className='ml-2 inline h-5 w-5 align-middle text-brand-100' />
																					)}
																				</div>
																			</div>

																			{criteriaInput?.[idx]?.checked &&
																				criteriaInput[idx]?.type ===
																					'EXPLANATION' && (
																					<TextAreaInput
																						name={`criteria.${idx}.explanation`}
																						label=''
																						wrapperClassName='w-full pl-6 pt-1 pb-3'
																						autoFocus
																						rows={1}
																					/>
																				)}
																		</DivAnimate>
																	)
																})}
															</div>
														)}
												</DivAnimate>
											)
										})}
									</div>
								)}
							</QueryWrapper>
							<ErrorMessage
								name='criteria'
								errors={errors}
								render={({message}) => (
									<small className='mt-0.5 font-medium text-red-500'>
										{message}
									</small>
								)}
							/>
						</fieldset>

						<div className='space-x-4 self-end'>
							<Button type='submit' variant='filled' className=''>
								Submit
							</Button>
							<Button
								type='reset'
								variant='outlined'
								className=''
								onClick={() => setIsCreate(false)}
							>
								Cancel
							</Button>
						</div>
					</FormWrapper>
				</>
			) : (
				<>
					<h1 className='mb-4 text-2xl'>
						App policy
						<IconButton
							className='ml-2 align-bottom'
							onClick={() => setIsCreate(true)}
						>
							<PlusIcon className='h-6 w-6 text-brand-300 ' />
						</IconButton>
					</h1>

					<QueryWrapper {...appQuery}>
						{(data) => (
							<div className='space-y-1'>
								{data.map((app) => (
									<div
										className='flex flex-1 items-center justify-between gap-2 rounded-lg bg-dark-bg/25 p-2 pl-4'
										key={app.id}
									>
										<h2 className={` leading-5 md:text-lg md:leading-none`}>
											{app.name}
										</h2>
										<div className='item-center flex'>
											<button onClick={() => console.log('edit', app.id)}>
												<PencilIcon className='h-8 w-8 rounded-l-lg border-l-[1px] border-r-[1px] border-brand-100/25 bg-brand-100/50 p-1  text-blue-700 transition-colors duration-200 hover:bg-brand-200 active:bg-brand-300 md:h-10 md:w-10 md:p-2' />
											</button>
											<button onClick={() => remove({id: app.id})}>
												<TrashIcon className='h-8 w-8 rounded-r-lg bg-brand-100/50 p-1 text-red-700 transition-colors duration-200 hover:bg-brand-200 active:bg-brand-300 md:h-10 md:w-10 md:p-2' />
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</QueryWrapper>
				</>
			)}
		</DivAnimate>
	)
}
