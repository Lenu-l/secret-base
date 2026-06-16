import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Nav from './Nav'

export default function Layout({ children }) {
  const loc = useLocation()
  const [key, setKey] = useState(loc.pathname)
  useEffect(() => { setKey(loc.pathname) }, [loc.pathname])

  return (
    <div className="relative z-10 min-h-screen flex flex-col">
      <main key={key} className="flex-1 w-full max-w-3xl mx-auto px-5 pt-8 pb-36 md:pb-10 anim-in safe-top">
        {children}
      </main>
      <Nav />
    </div>
  )
}
