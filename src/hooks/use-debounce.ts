import { useState, useEffect, useRef } from "react"

export function useDebounce<T>({
    state,
    delay = 200,
    onDebounced,
}: {
    state: T
    delay?: number
    onDebounced?: (value: T) => void
}) {
    const [debounce, setDebounce] = useState(state)
    const isFirstRender = useRef(true)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebounce(state)
            // Call callback after debounce, but not on initial mount
            if (!isFirstRender.current && onDebounced) {
                onDebounced(state)
            }
            isFirstRender.current = false
        }, delay)

        return () => {
            clearTimeout(timeout)
        }
    }, [state, delay, onDebounced])

    return debounce
}
