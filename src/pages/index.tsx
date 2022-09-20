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
				<section className='relative h-screen bg-gradient-to-br from-gray-900  via-purple-900 to-violet-600'>
					<div className='sbg-red-300/[0.5] absolute top-1/2 -translate-y-[50%] md:container md:left-1/2 md:max-w-screen-xl md:-translate-x-1/2 md:-translate-y-[60%]'>
						<div className='mx-4 grid grid-cols-12 md:mx-0'>
							<div className='sbg-blue-300/[0.5] relative col-span-12 flex flex-col gap-2 self-center overflow-hidden text-white md:col-span-7 md:ml-16 md:gap-4 lg:px-16'>
								<h1 className='text-3xl md:text-5xl'>
									Term and condition <br />
									made
									<span className='italic'> transparent</span>
								</h1>
								<TNC className='mx-auto my-8 w-72 sm:my-16 md:absolute md:left-[1000%]' />
								<h2 className='text-lg sm:text-center sm:text-xl md:text-left md:text-2xl'>
									Search app. Read highlights. Decide!
								</h2>
								<p className='ml-4 text-sm sm:mx-4 sm:text-justify sm:text-base md:ml-0'>
									<span className='hidden sm:inline'>
										No more getting abused by irresponsible companies who force
										us to agree on something we don&apos;t want. <br />
									</span>
									With the community, transparency give you the concise points,
									summarizing the verbose and confusing terms that company
									provide.
								</p>
								<div className='mt-4 ml-4 h-fit items-center space-y-3 pb-4 sm:space-x-4 md:ml-0 md:mt-0'>
									<button className='rounded-full border-[0.2rem] border-purple-500 px-5 py-2 shadow-lg transition ease-out hover:border-violet-200 hover:text-purple-300 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-white active:translate-y-2 active:text-white'>
										Discover app
									</button>
									<button className='block rounded-full bg-violet-500 px-6 py-2 shadow-lg transition ease-out hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 active:translate-y-2  active:bg-violet-900 sm:inline'>
										Join our community
									</button>
								</div>
							</div>

							<div className='sbg-green-300/[0.5] hidden justify-self-center md:col-span-5 md:inline'>
								<TNC className='w-96' />
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	)
}

export default Home
