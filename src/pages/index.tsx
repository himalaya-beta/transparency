import type {NextPage} from 'next'
import Head from 'next/head'

import Tilt from 'react-parallax-tilt'

import {ButtonFilled, ButtonOutlined} from '@components/button'
import TNC from '@components/svg/tnc'
import MagnifyingGlass from '@images/magnifying-glass.svg'
import PeopleGroup from '@images/people-group.svg'

import animate from '@styles/index.module.scss'
import useDeviceDetect from '@utils/hooks/use-device-detect'

const Home: NextPage = () => {
	const {isMobile, isPhone} = useDeviceDetect()

	return (
		<>
			<Head>
				<title>Transparency</title>
				<meta content='Let there be light in every term & condition' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className=''>
				<section className='relative h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600'>
					<div className='absolute top-1/2 -translate-y-[50%] overflow-x-visible md:container md:left-1/2 md:max-w-screen-xl md:-translate-x-1/2 md:-translate-y-[55%]'>
						<div className='mx-4 grid grid-cols-12 pb-8 md:mx-0'>
							<Tilt
								reset={!isMobile}
								tiltEnable={!isPhone}
								tiltAngleYInitial={isPhone ? 0 : -10}
								perspective={700}
								transitionSpeed={600}
								tiltMaxAngleX={10}
								tiltMaxAngleY={15}
								className='group relative col-span-12 flex flex-col gap-8 self-center text-white preserve-3d md:col-span-7 md:ml-12 md:gap-16 lg:ml-16 lg:px-0 xl:pl-10'
							>
								<div
									className={`${animate.glassMain} absolute -z-10 h-[26rem] w-full opacity-0 preserve-3d child:absolute md:opacity-100`}
								>
									<div
										className={`${animate.glassBack} child:glass -top-[22%] -left-[24%] flex origin-bottom-right gap-3 transition-all duration-500 move-back-lg group-hover:translate-z-[-12rem] child:h-28 child:rounded-xl	lg:-left-[18%] xl:-top-[20%] xl:-left-[14%] xl:child:h-36`}
									>
										<div className='w-48 xl:w-52' />
										<div className='w-20 xl:w-24' />
									</div>
									<div className='-top-12 -left-[45%] h-[23.5rem] w-[46rem] child:absolute child:h-full child:w-full child:rounded-3xl lg:-left-16 xl:-left-14'>
										<div className='glass'></div>
										<div className='opacity-0 shadow-glowing transition-all duration-1000 group-hover:opacity-70'></div>
									</div>
									<div
										className={`${animate.glassFront} child:glass -right-[20%] bottom-[22%] flex gap-2 backdrop-blur transition-all duration-500 move-forth-lg group-hover:translate-z-48 child:h-11 child:rounded-lg lg:bottom-[14%] lg:-right-[18%] xl:right-[6%]`}
									>
										<div className='w-12' />
										<div className='w-24' />
									</div>
								</div>

								<div
									className={`${animate.content} flex flex-col gap-2 move-forth md:gap-4 xl:gap-5`}
								>
									<h1 className='whitespace-nowrap text-3xl md:w-[32rem] md:text-5xl lg:w-[40rem] lg:text-6xl'>
										<span>
											<span className='absolute text-transparent'>
												Terms & conditions
												<span className='hidden'>
													, privacy policy, terms of service, and data agreement
												</span>
											</span>
											<span className={animate.typewriter} />
										</span>
										<br /> made&nbsp;
										<span
											className={`${animate.zigzag} bg-rainbow bg-zoom-in bg-clip-text italic text-transparent`}
										>
											transparent
										</span>
									</h1>

									<Tilt reset={false} tiltMaxAngleY={30}>
										<TNC
											className={`${animate.tnc} mx-auto my-8 w-72 sm:my-16 sm:w-80 md:absolute md:opacity-0`}
										/>
									</Tilt>

									<h2
										className={`${animate.h2} whitespace-nowrap text-lg child:underline-offset-8 sm:text-center sm:text-xl md:-mt-4 md:text-left md:text-2xl xl:-mt-6`}
									>
										Search
										<span className='underline decoration-pink-500 decoration-wavy'>
											&nbsp;app
										</span>
										.&nbsp;Read&nbsp;
										<mark className='bg-pink-500 text-white'>
											&nbsp;highlights&nbsp;
										</mark>
										.&nbsp;Decide
										<span className='text-pink-500'>!</span>
									</h2>

									<p className='ml-4 text-gray-300 sm:mx-4 sm:text-justify sm:text-base md:ml-0 md:min-w-[28rem] md:text-left lg:min-w-[33rem]'>
										<span className='hidden sm:inline'>
											No more getting abused by irresponsible companies who
											force us to agree on something we don&apos;t want.&nbsp;
											<br className='hidden md:inline' />
										</span>
										With the community, transparency give you the concise
										points, summarizing the verbose and confusing terms that
										company provide.
									</p>
								</div>

								<div
									className={`${animate.button} child:button-3d flex flex-col items-start gap-4 overflow-visible px-4 preserve-3d move-forth sm:flex-row sm:px-4 md:mt-4 md:px-0 xl:-ml-6`}
								>
									<ButtonOutlined
										onClick={() => console.log('Join our community')}
									>
										Join our community
										<PeopleGroup
											className={`${animate.bouncing} h-5 fill-purple-200`}
										/>
									</ButtonOutlined>

									<ButtonFilled onClick={() => console.log('Discover app')}>
										Discover app
										<span className='relative h-5'>
											<MagnifyingGlass className='h-5 fill-violet-200' />
											<MagnifyingGlass
												className={`${animate.pinging} absolute top-0.5 left-0.5 h-5 fill-violet-200`}
											/>
										</span>
									</ButtonFilled>
								</div>
							</Tilt>

							<div className='hidden justify-self-center md:col-span-5 md:ml-8 md:-mr-[55%] md:mt-72 md:inline lg:-ml-10 lg:mt-72 xl:mt-32 xl:-mr-36'>
								<TNC
									className={`${animate.tncBig} w-[26rem] max-w-full lg:w-[28rem] xl:w-[30rem]`}
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
