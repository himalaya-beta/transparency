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
import {Button} from 'components/button'
import {SectionSeparator} from 'components/ornaments'
import {ErrorMessage} from '@hookform/error-message'
import {Bars3BottomLeftIcon, ChevronDownIcon} from '@heroicons/react/24/outline'

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
		onSuccess: () => router.push('/admin'),
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
		<FormWrapper
			methods={methods}
			onValidSubmit={onCreateApp}
			className='flex flex-col'
		>
			<div className='mb-2 grid grid-cols-2 gap-x-8 gap-y-2'>
				<TextAreaInput<AppTypeForm> name='name' label='App name' rows={1} />
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
														const idx = data.findIndex((c) => c.id === item.id)
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
						<small className='mt-0.5 font-medium text-red-500'>{message}</small>
					)}
				/>
			</fieldset>

			<Button type='submit' variant='filled' className='self-end'>
				Submit
			</Button>
		</FormWrapper>
	)
}
