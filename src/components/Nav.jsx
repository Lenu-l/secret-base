import { NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { HomeIcon, SparkIcon, BookIcon, NestIcon, MusicIcon } from './Icons'

const ITEMS = [
  { to: '/', label: '基地', icon: HomeIcon },
  { to: '/inspiration', label: '灵感', icon: SparkIcon },
  { to: '/diary', label: '日记', icon: BookIcon },
  { to: '/resources', label: '资源', icon: NestIcon },
  { to: '/media', label: '书影音', icon: MusicIcon },
]

export default function Nav() {
  const { darkMode, toggle } = useTheme()
  const loc = useLocation()

  return (
    <>
      {/* Mobile bottom bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 safe-bottom px-3 pb-2">
        <div className="card rounded-[22px] px-2 py-2 flex items-center justify-around">
          {ITEMS.map(({ to, label, icon: Icon }) => {
            const is = loc.pathname === to
            return (
              <NavLink key={to} to={to}
                className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-[16px] transition-all duration-250
                  ${is ? 'bg-g-card-sage text-g-sage' : 'text-g-text-sub/50 hover:text-g-text-sub'}`}
              >
                <Icon active={is} />
                <span className="text-[10px] font-medium">{label}</span>
              </NavLink>
            )
          })}
          <span className="w-px h-7 bg-gray-200 dark:bg-gray-700 rounded-full" />
          <button onClick={toggle}
            className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-[16px] text-g-text-sub/50 hover:text-g-text-sub transition-all duration-250"
            aria-label="切换主题">
            <span className="text-lg leading-none">{darkMode ? '☀️' : '🌙'}</span>
            <span className="text-[10px] font-medium">主题</span>
          </button>
        </div>
      </nav>

      {/* Desktop side bar */}
      <nav className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col">
        <div className="card rounded-[22px] p-2.5 flex flex-col gap-2">
          {ITEMS.map(({ to, label, icon: Icon }) => {
            const is = loc.pathname === to
            return (
              <NavLink key={to} to={to}
                className={`flex items-center justify-center w-12 h-12 rounded-[16px] transition-all duration-250 group relative
                  ${is ? 'bg-g-card-sage text-g-sage' : 'text-g-text-sub/40 hover:text-g-sage'}`}
              >
                <Icon active={is} />
                <span className="absolute right-full mr-3 px-3 py-1.5 rounded-[10px] text-xs font-medium
                  bg-white text-g-sage opacity-0 group-hover:opacity-100 transition-opacity duration-200
                  whitespace-nowrap shadow-lg pointer-events-none">
                  {label}
                </span>
              </NavLink>
            )
          })}
          <div className="w-full h-px bg-gray-200 dark:bg-gray-700 my-1 rounded-full" />
          <button onClick={toggle}
            className="flex items-center justify-center w-12 h-12 rounded-[16px] text-g-text-sub/40 hover:text-g-sage transition-all duration-250"
            aria-label="切换主题">
            <span className="text-lg">{darkMode ? '☀️' : '🌙'}</span>
          </button>
        </div>
      </nav>
    </>
  )
}
