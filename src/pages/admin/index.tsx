import React from 'react'
import NavbarLayout from 'layouts/navbar'
import CriteriaSection from 'view/admin/criteria'
import AppSection from 'view/admin/app'
import Tabs from 'components/tabs'
import DivAnimate from 'components/div-animate'

export default function AdminPage() {
	const tabs = ['App', 'Criteria']
	const [tabActive, setTabActive] = React.useState('App')

	return (
		<div className='pb-12'>
			<Tabs tabs={tabs} tabActive={tabActive} setTabActive={setTabActive} />
			<DivAnimate>
				{tabActive === 'App' && (
					<div className='mx-auto max-w-screen-md space-y-4'>
						<h1 className='text-2xl'>New app policy</h1>
						<AppSection />
					</div>
				)}
				{tabActive === 'Criteria' && (
					<div className='mx-auto max-w-screen-md space-y-4 pb-8 md:mx-auto'>
						<h1 className='text-2xl'>Policy criteria</h1>
						<CriteriaSection />
					</div>
				)}
			</DivAnimate>
		</div>
	)
}

AdminPage.getLayout = (page: React.ReactElement) => (
	<NavbarLayout>{page}</NavbarLayout>
)
