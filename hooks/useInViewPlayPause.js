import { useState, useEffect, useRef } from 'react'

const useInViewPlayPause = () => {
  const [isInView, setIsInView] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const ref = useRef(null)

  const handleScroll = () => {
    // prevent animating on page load
    setHasScrolled(true)
    window.removeEventListener('scroll', handleScroll)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [ref])

  return [isInView && hasScrolled, ref]
}

export default useInViewPlayPause
