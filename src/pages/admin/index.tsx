/* eslint-disable unicorn/no-null */
import React from 'react'
import {type SubmitHandler, useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'

import NavbarTopLayout from 'layouts/navbar'
import QueryWrapper from 'components/query-wrapper'
import FormWrapper from 'components/form-wrapper'
import TextAreaInput from 'components/textarea-input'
import {Button} from 'components/button'
import {SectionSeparator} from 'components/ornaments'
import {PencilIcon, TrashIcon, XMarkIcon} from '@heroicons/react/24/outline'

import {trpc} from 'utils/trpc'

import {
	CreateCriteriaSchema,
	UpdateCriteriaSchema,
	type UpdateCriteriaType,
	type CreateCriteriaType,
} from 'types/criteria'

const AdminDashboardPage = () => {
	const [edit, setEdit] = React.useState<string | null>(null)

	const criteriaListQuery = trpc.criteria.fetchAll.useQuery()
	const {refetch: refetchCriteria} = criteriaListQuery

	const {mutate: update} = trpc.criteria.update.useMutation({
		onError: (error) => {
			alert(error.message)
		},
		onSuccess: () => {
			updateMethods.reset()
			setEdit(null)
			criteriaListQuery.refetch()
		},
	})
	const {mutate: remove} = trpc.criteria.delete.useMutation({
		onError: (error) => {
			alert(error.message)
		},
		onSuccess: () => {
			criteriaListQuery.refetch()
		},
	})

	const updateMethods = useForm<UpdateCriteriaType>({
		mode: 'onTouched',
		resolver: zodResolver(UpdateCriteriaSchema),
	})

	const onUpdateCriteria: SubmitHandler<UpdateCriteriaType> = (data) => {
		if (edit) {
			update({...data, id: edit})
		}
	}

	const onClickEdit = (criteria: UpdateCriteriaType) => {
		setEdit(criteria.id)
		updateMethods.setValue('id', criteria.id)
		updateMethods.setValue('value', criteria.value)
		updateMethods.setValue('parentId', criteria.parentId)
	}

	return (
		<div className='container max-w-screen-md space-y-8 px-8 md:mx-auto '>
			<h1 className='text-3xl'>Policy Criteria</h1>
			<QueryWrapper {...criteriaListQuery}>
				{(criterias) => (
					<div className='space-y-2'>
						{criterias.map((criteria) => (
							<div
								key={criteria.id}
								className='flex items-center justify-between rounded-lg bg-dark-bg/25 p-4'
							>
								{edit === criteria.id ? (
									<FormWrapper
										methods={updateMethods}
										onValidSubmit={onUpdateCriteria}
										className='flex w-full gap-2'
									>
										<TextAreaInput<UpdateCriteriaType>
											name='value'
											rows={2}
											label=''
											wrapperClassName='flex-1'
											inputClassName='pb-3'
										/>
										<div className='flex flex-col gap-1'>
											<button type='submit'>
												<PencilIcon className='h-8 w-8 rounded-lg bg-blue-500 p-1 text-brand-100' />
											</button>
											<button onClick={() => setEdit(null)}>
												<XMarkIcon className='h-8 w-8 rounded-lg bg-orange-400 p-1 text-brand-100' />
											</button>
										</div>
									</FormWrapper>
								) : (
									<>
										<h2>{criteria.value}</h2>
										<div className='item-center flex gap-2'>
											<button onClick={() => onClickEdit(criteria)}>
												<PencilIcon className='h-10 w-10 rounded-lg bg-brand-100 p-2 text-blue-500' />
											</button>
											<button onClick={() => remove({id: criteria.id})}>
												<TrashIcon className='h-10 w-10 rounded-lg bg-brand-100 p-2 text-red-500' />
											</button>
										</div>
									</>
								)}
							</div>
						))}
					</div>
				)}
			</QueryWrapper>

			<CreateForm refetchList={refetchCriteria} />
		</div>
	)
}

const CreateForm = ({refetchList}: {refetchList: () => void}) => {
	const {mutate: create} = trpc.criteria.create.useMutation({
		onError: (error) => {
			alert(error.message)
		},
		onSuccess: () => {
			createMethods.reset()
			refetchList()
		},
	})

	const createMethods = useForm<CreateCriteriaType>({
		mode: 'onTouched',
		resolver: zodResolver(CreateCriteriaSchema),
	})

	const onCreateCriteria: SubmitHandler<CreateCriteriaType> = (data) => {
		create(data)
	}

	return (
		<div>
			<SectionSeparator>Create New</SectionSeparator>
			<FormWrapper
				methods={createMethods}
				onValidSubmit={onCreateCriteria}
				className='space-y-4'
			>
				<TextAreaInput<CreateCriteriaType> name='value' label='The point' />
				<Button type='submit' variant='filled'>
					Submit
				</Button>
			</FormWrapper>
		</div>
	)
}

AdminDashboardPage.getLayout = (page: React.ReactElement) => (
	<NavbarTopLayout>{page}</NavbarTopLayout>
)

export default AdminDashboardPage
