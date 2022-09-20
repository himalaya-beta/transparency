import type {NextPage} from 'next'
import Head from 'next/head'

import TNC from '/public/images/tnc.svg'

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Transparency</title>
				<meta content='Let there be light in every term & condition' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className=''>
				<section className='h-screen bg-gradient-to-br from-gray-900 via-purple-900  to-violet-600'>
					<div className='sbg-red-300/[0.5] container absolute top-1/2 left-1/2 max-w-screen-xl -translate-y-[60%]  -translate-x-1/2'>
						<div className='grid grid-cols-12'>
							<div className='sbg-blue-300/[0.5] col-span-7 flex flex-col gap-4 self-center px-16 text-white'>
								<h1 className='text-5xl'>
									Term and condition <br />
									made
									<span className='italic'> transparent</span>
								</h1>
								<h2 className='text-2xl'>
									Search app. Read highlights. Decide!
								</h2>
								<p>
									No more getting abused by irresponsible companies who force us{' '}
									<br /> to agree on something we don&apos;t want. <br />
									With the power of the community, transparency give you the
									concise points, summarizing the verbose and confusing terms
									that company provide.
								</p>
								<div className='mt-4 items-center space-x-4'>
									<button className='rounded-full border-[0.2rem] border-violet-500 px-5 py-2 shadow-lg'>
										Discover app
									</button>
									<button className='rounded-full bg-gradient-to-br from-purple-900 via-violet-600 px-6 py-2 shadow-lg'>
										Join our community
									</button>
								</div>
							</div>

							<div className='sbg-green-300/[0.5] col-span-5 justify-self-center'>
								<TNC className='w-96 ' />
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	)
}

export default Home
