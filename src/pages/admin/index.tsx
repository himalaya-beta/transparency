import React from 'react'
import {useRouter} from 'next/router'
import {useSession} from 'next-auth/react'

import NavbarLayout from 'layouts/navbar'
import CriteriaSection from 'view/admin/criteria'
import AppSection from 'view/admin/app'
import Tabs from 'components/tabs'
import DivAnimate from 'components/div-animate'

export default function AdminPage() {
	const tabs = ['App', 'Criteria']
	const [tabActive, setTabActive] = React.useState('App')

	const {data, status} = useSession()
	const router = useRouter()
	React.useEffect(() => {
		if (data?.user.role !== 'ADMIN' && status !== 'loading') {
			router.replace('/')
		}
	}, [data, router, status])

	return (
		<main>
			<Tabs tabs={tabs} tabActive={tabActive} setTabActive={setTabActive} />
			<DivAnimate className='container -mt-2 px-5 md:px-8'>
				{tabActive === 'App' && (
					<div className='mx-auto max-w-screen-md space-y-4'>
						<AppSection />
					</div>
				)}
				{tabActive === 'Criteria' && (
					<div className='mx-auto max-w-screen-md space-y-4'>
						<CriteriaSection />
					</div>
				)}
			</DivAnimate>
		</main>
	)
}

AdminPage.getLayout = (page: React.ReactElement) => (
	<NavbarLayout>{page}</NavbarLayout>
)
