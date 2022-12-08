import {useEffect, useState} from 'react'

export default function useDeviceDetect() {
	const [isMobile, setMobile] = useState(false)
	const [isPhone, setIsPhone] = useState(true)

	useEffect(() => {
		const userAgent = window.navigator === undefined ? '' : navigator.userAgent
		const mobile = Boolean(
			/android|blackberry|iphone|ipad|ipod|opera mini|iemobile|wpdesktop/i.test(
				userAgent
			)
		)
		setMobile(mobile)

		if (typeof window !== undefined && window.innerWidth >= 640) {
			// tailwind sm breakpoint
			setIsPhone(false)
		}
	}, [])

	return {isMobile, isPhone}
}
