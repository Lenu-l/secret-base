import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import StarrySky from './components/StarrySky'
import Home from './pages/Home'
import Inspiration from './pages/Inspiration'
import Diary from './pages/Diary'
import Resources from './pages/Resources'
import Media from './pages/Media'

export default function App() {
  return (
    <>
      <StarrySky />
      <div className="sky-orb w-80 h-80 md:w-[450px] md:h-[450px] top-[-6%] left-[-6%]"
        style={{ background: '#B5C8B5', opacity: 0.18 }} />
      <div className="sky-orb w-64 h-64 md:w-80 md:h-80 bottom-[5%] right-[-4%]"
        style={{ background: '#F2D8D0', opacity: 0.15 }} />
      <div className="sky-orb w-56 h-56 md:w-72 md:h-72 top-[50%] left-[15%]"
        style={{ background: '#F5EDD6', opacity: 0.15 }} />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inspiration" element={<Inspiration />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/media" element={<Media />} />
        </Routes>
      </Layout>
    </>
  )
}
