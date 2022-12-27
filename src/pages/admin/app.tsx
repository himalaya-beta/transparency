import React from 'react'
import {z} from 'zod'
import {useForm, SubmitHandler, useFieldArray} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import {trpc} from 'utils/trpc'

import NavbarTopLayout from 'layouts/navbar'
import QueryWrapper from 'components/query-wrapper'
import FormWrapper from 'components/form-wrapper'
import TextAreaInput from 'components/textarea-input'
import {Button} from 'components/button'
import DivAnimate from 'components/div-animate'
import {SectionSeparator} from 'components/ornaments'

import {criteriaUpdateSchema} from 'types/criteria'
import {ErrorMessage} from '@hookform/error-message'

const criteriaSchema = criteriaUpdateSchema
	.omit({order: true, value: true})
	.extend({
		checked: z.boolean(),
		explanation: z.string().optional(),
	})
	.refine(
		(val) =>
			!(
				val.checked &&
				val.type.includes('EXPLANATION') &&
				(!!val.explanation || val.explanation === '') &&
				val.explanation?.length < 3
			),
		{message: 'Provide more clear explanation', path: ['explanation']}
	)

const appSchema = z.object({
	name: z.string().min(3, 'Provide more descriptive app name'),
	company: z.string().min(3, 'Provide more descriptive company name'),
	headquarter: z.string().optional(),
	registeredIn: z.string().optional(),
	offices: z.string().optional(),
	about: z.string().optional(),
	criteria: z
		.array(criteriaSchema)
		.refine((val) => val.some((item) => item.checked), 'Provide criteria'),
})

type AppType = z.infer<typeof appSchema>

export default function AppPage() {
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

	const methods = useForm<AppType>({resolver: zodResolver(appSchema)})
	const {
		control,
		setValue,
		watch,
		formState: {errors},
	} = methods
	const criteriaInput = watch('criteria')
	useFieldArray<AppType>({control, name: 'criteria'})

	// eslint-disable-next-line unicorn/consistent-function-scoping
	const onCreateApp: SubmitHandler<AppType> = (data) => {
		console.log(data.criteria)
		console.log(data.criteria.filter((item) => item.checked))
	}

	return (
		<div className='mx-auto w-full max-w-screen-lg space-y-6'>
			<h1 className='text-2xl'>New app policy</h1>
			<FormWrapper methods={methods} onValidSubmit={onCreateApp}>
				<div className='mb-2 grid grid-cols-2 gap-x-8 gap-y-2'>
					<TextAreaInput<AppType>
						name='name'
						label='App name'
						rows={1}
						autoFocus
					/>
					<div />
					<TextAreaInput<AppType>
						name='company'
						label='Company name'
						rows={1}
					/>
					<TextAreaInput<AppType> name='headquarter' rows={1} />
					<TextAreaInput<AppType>
						name='registeredIn'
						label='Registered city'
						rows={1}
					/>
					<TextAreaInput<AppType> name='offices' rows={1} />
					<TextAreaInput<AppType> name='about' wrapperClassName='col-span-2' />
				</div>

				<fieldset>
					<SectionSeparator className='mt-8'>Policy Criteria</SectionSeparator>

					<QueryWrapper {...criteriaQuery}>
						{(data) => (
							<div className='divide-y divide-gray-200 border-gray-200'>
								{data.map((criteria, i) => {
									if (criteria.parentId) return
									return (
										<DivAnimate
											key={criteria.id}
											className='flex flex-col items-start py-4'
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
												<div className='ml-2 flex h-5 items-center'>
													<input
														id={`criteria-${criteria.id}`}
														type='checkbox'
														className='h-4 w-4 rounded border-gray-300 text-brand-600 hover:cursor-pointer focus:ring-brand-500'
														{...methods.register(
															`criteria.${i}.checked` as const
														)}
													/>
												</div>
												<div className='min-w-0 space-y-1'>
													<label
														htmlFor={`criteria-${criteria.id}`}
														className='select-none font-medium hover:cursor-pointer'
													>
														{criteria.value}
													</label>
												</div>
											</div>

											{criteriaInput[i]?.checked &&
												criteriaInput[i]?.type.includes('EXPLANATION') && (
													<TextAreaInput
														name={`criteria.${i}.explanation`}
														label=''
														wrapperClassName='w-full pl-9 pt-1'
														autoFocus
													/>
												)}

											{criteriaInput[i]?.checked &&
												criteria.children.length > 0 && (
													<div className='pl-9 pt-1 '>
														{criteria.children.map((item) => {
															const idx = data.findIndex(
																(c) => c.id === item.id
															)
															return (
																<div key={item.id} className='flex gap-2'>
																	<div className='flex h-5 items-center'>
																		<input
																			id={`criteria-${item.id}`}
																			type='checkbox'
																			className='h-4 w-4 rounded border-gray-300 text-brand-600 hover:cursor-pointer focus:ring-brand-500'
																			{...methods.register(
																				`criteria.${idx}.checked` as const
																			)}
																		/>
																	</div>
																	<div className='min-w-0 space-y-1'>
																		<label
																			htmlFor={`criteria-${item.id}`}
																			className='select-none font-medium hover:cursor-pointer'
																		>
																			{item.value}
																		</label>
																	</div>
																</div>
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

				<Button type='submit' variant='filled' className=''>
					Submit
				</Button>
			</FormWrapper>
		</div>
	)
}

AppPage.getLayout = (page: React.ReactElement) => (
	<NavbarTopLayout>{page}</NavbarTopLayout>
)
