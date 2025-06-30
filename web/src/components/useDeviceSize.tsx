import { useEffect, useState } from 'react'

export function useDeviceSize() {
    const [windowWidth, setWindowWidth] = useState(0)
    const [windowHeight, setWindowHeight] = useState(0)

    const handleWindowResize = () => {
        if (typeof window !== 'undefined') {
            setWindowWidth(window.innerWidth)
            setWindowHeight(window.innerHeight)
        }
    }

    useEffect(() => {
        // Only run on client-side
        if (typeof window !== 'undefined') {
            handleWindowResize()
            window.addEventListener('resize', handleWindowResize)
            return () => window.removeEventListener('resize', handleWindowResize)
        }
    }, [])

    return [windowWidth, windowHeight]
}
