/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'

const usePaginate = (
	perPage: number,
	data: Array<{id: string; [key: string]: unknown}> | undefined,
	isPreviousData: boolean,
	isInitialLoading: boolean
) => {
	const [cursorIds, setCursorIds] = React.useState<Array<string | undefined>>([
		undefined,
	])
	const [page, setPage] = React.useState(0)

	React.useEffect(() => {
		if (!isPreviousData && data?.length === perPage) {
			const cursor = data[data.length - 1]
			setCursorIds([...cursorIds, cursor?.id])
		}
	}, [isPreviousData])

	React.useEffect(() => {
		if (!isInitialLoading && data) {
			const cursor = data[data.length - 1]
			setCursorIds([...cursorIds, cursor?.id])
		}
	}, [isInitialLoading])

	return {page, setPage, cursorIds}
}

export default usePaginate
