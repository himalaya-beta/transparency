import type {NextPage} from 'next'
import Head from 'next/head'

import TNC from '../components/svg/tnc'
import MagnifyingGlass from '/public/images/magnifying-glass.svg'
import PeopleGroup from '/public/images/people-group.svg'

import animate from '../styles/index.module.scss'

const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>Transparency</title>
				<meta content='Let there be light in every term & condition' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className=''>
				<section className='relative h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600'>
					<div className='absolute top-1/2 -translate-y-[50%] md:container md:left-1/2 md:max-w-screen-xl md:-translate-x-1/2 md:-translate-y-[60%]'>
						<div className='mx-4 grid grid-cols-12 overflow-hidden pb-8 md:mx-0'>
							<div className='relative col-span-12 flex flex-col gap-2 self-center text-white md:col-span-7 md:ml-16 md:gap-4 lg:px-16'>
								<h1
									className={`${animate.h1} whitespace-nowrap text-3xl md:text-5xl lg:text-6xl`}
								>
									Term and condition <br />
									made&nbsp;
									<span
										className={`${animate.zigzag} bg-rainbow bg-zoom-in bg-clip-text italic text-transparent`}
									>
										transparent
									</span>
								</h1>
								<TNC
									className={`${animate.tnc} mx-auto my-8 w-72 sm:my-16 sm:w-80 md:absolute md:left-[1000%]`}
								/>
								<h2
									className={`${animate.h2} whitespace-nowrap text-lg child:underline-offset-8 sm:text-center sm:text-xl md:text-left md:text-2xl`}
								>
									Search
									<span className='underline decoration-pink-500 decoration-wavy'>
										&nbsp;app
									</span>
									.&nbsp;Read <mark>&nbsp;highlights&nbsp;</mark>.&nbsp;
									<span className=''>Decide</span>!
								</h2>
								<p
									className={`${animate.p} ml-4 text-gray-200/[0.8] sm:mx-4 sm:text-justify sm:text-base md:ml-0 md:text-left`}
								>
									<span className='hidden sm:inline'>
										No more getting abused by irresponsible companies who force
										us to agree on something we don&apos;t want.&nbsp;
										<br className='hidden md:inline' />
									</span>
									With the community, transparency give you the concise points,
									summarizing the verbose and confusing terms that company
									provide.
								</p>
								<div
									className={`${animate.button} mt-4 flex flex-col items-start gap-4 overflow-visible px-4 sm:flex-row sm:px-4 md:px-0`}
								>
									<button className='flex items-center gap-2 whitespace-nowrap rounded-full border-[0.2rem] border-purple-500 px-5 py-2 shadow-lg transition ease-out hover:border-violet-200 hover:shadow-purple-200 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-white active:translate-y-2 active:text-white active:shadow-md active:shadow-purple-200'>
										Discover app
										<span className='relative h-5'>
											<MagnifyingGlass className='h-5 fill-violet-200' />
											<MagnifyingGlass
												className={`${animate.pinging} absolute top-0.5 left-0.5 h-5 fill-violet-200`}
											/>
										</span>
									</button>
									<button className='flex items-center gap-2 whitespace-nowrap rounded-full bg-violet-500 px-6 py-2.5 shadow-lg transition ease-out hover:bg-violet-700 hover:shadow-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 active:translate-y-2 active:bg-violet-900 active:shadow-md active:shadow-purple-200 sm:flex'>
										Join our community
										<PeopleGroup
											className={`${animate.bouncing} h-5 fill-purple-200`}
										/>
									</button>
								</div>
							</div>

							<div className='hidden justify-self-center md:col-span-5 md:-mr-[55%] md:mt-72 md:inline lg:mt-64 lg:-mr-[48%] xl:mt-24 xl:mr-0'>
								<TNC
									className={`${animate.tnc} w-[26rem] max-w-full lg:w-[28rem] xl:w-[30rem]`}
								/>
							</div>
						</div>
					</div>
				</section>
			</main>
		</>
	)
}

export default Home
