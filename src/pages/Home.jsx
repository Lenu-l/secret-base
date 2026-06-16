import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getRandomMemory, getRecentItems, getInspirations, getDiaries } from '../utils/storage'
import { SparkIcon, BookIcon, NestIcon, MusicIcon } from '../components/Icons'

const ENTRIES = [
  { to:'/inspiration', label:'灵感', sub:'捕捉一闪而过的念头', card:'card-sky',    icon: SparkIcon },
  { to:'/diary',        label:'日记', sub:'记录今日的情绪与思考',   card:'card-blush', icon: BookIcon },
  { to:'/resources',    label:'资源库', sub:'收藏有价值的链接',     card:'card-warm',  icon: NestIcon },
  { to:'/media',        label:'书影音', sub:'读过的书与看过的电影', card:'card-sage',  icon: MusicIcon },
]

const MOODS = { happy:'😊', calm:'😌', anxious:'😰', inspired:'✨' }
const LABELS = { inspiration:'灵感', diary:'日记', resource:'资源', media:'书影音' }
const SRC = { inspiration:'💡', diary:'📖', resource:'🔗', media:'🎬' }

export default function Home() {
  const [mem, setMem] = useState(null)
  const [recent, setRecent] = useState([])
  const [greet, setGreet] = useState('')
  const [stats, setStats] = useState({ i:0, d:0 })

  useEffect(() => {
    const h = new Date().getHours()
    if (h<6) setGreet('夜深了，星星还在亮着 🌙')
    else if (h<9) setGreet('早安，晨星刚刚隐去 ☀️')
    else if (h<12) setGreet('上午好，天空很清澈 ✨')
    else if (h<14) setGreet('午后好，适合发一会儿呆 ☕')
    else if (h<18) setGreet('下午好，光线变得温柔了 🌅')
    else if (h<21) setGreet('傍晚好，第一颗星出现了 🌟')
    else setGreet('晚上好，星河正灿烂 🌌')
    setMem(getRandomMemory())
    setRecent(getRecentItems(8))
    setStats({ i:getInspirations().length, d:getDiaries().length })
  }, [])

  const total = stats.i + stats.d

  return (
    <div className="space-y-8">
      <header className="pt-2 pb-4">
        <p className="text-sm text-g-text-sub/60 mb-2 animate-pulse tracking-wide">{greet}</p>
        <h1 className="text-3xl md:text-4xl font-title font-bold text-g-text">🌠 秘密基地</h1>
        <p className="mt-2 text-sm text-g-text-sub/55 leading-relaxed">每颗星星都是一个瞬间，在这片天空里安静发光</p>
      </header>

      {/* Stats — mint + lavender tints */}
      {total > 0 && (
        <div className="flex gap-4 stagger">
          <div className="card-mint flex-1 p-4 flex items-center gap-3">
            <span className="text-2xl">⭐</span>
            <div><p className="text-2xl font-bold text-g-sage">{total}</p><p className="text-[11px] text-g-text-sub/55">颗星星在闪烁</p></div>
          </div>
          <div className="card-lavender flex-1 p-4 flex items-center gap-3">
            <span className="text-2xl">🌙</span>
            <div><p className="text-2xl font-bold" style={{color:'#8A80B0'}}>{stats.d}</p><p className="text-[11px] text-g-text-sub/55">天日记已记录</p></div>
          </div>
        </div>
      )}

      {/* Entry cards */}
      <section>
        <h2 className="text-xs font-semibold text-g-text-sub/40 uppercase tracking-[0.15em] mb-4">入口</h2>
        <div className="grid grid-cols-2 gap-4 stagger">
          {ENTRIES.map(({ to, label, sub, card, icon: Icon }) => (
            <Link key={to} to={to} className={`${card} p-5 cursor-pointer no-underline group`}>
              <div className="flex items-center gap-2.5 mb-3">
                <Icon active={true} />
                <h3 className="font-semibold text-g-text text-[15px]">{label}</h3>
              </div>
              <p className="text-xs text-g-text-sub/50 leading-relaxed">{sub}</p>
              <span className="block mt-3 text-[11px] text-g-text-sub/30 group-hover:text-g-sage transition-colors">进入 →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Today's Echo — lavender tint */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-g-text-sub/40 uppercase tracking-[0.15em]">今日回响</h2>
          <button onClick={() => setMem(getRandomMemory())} className="tag text-[11px] cursor-pointer">🔄 换一颗星</button>
        </div>
        {mem ? (
          <div className="card-lavender p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl mt-0.5 shrink-0">{mem.source==='inspiration'?'💡':'📖'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-g-text leading-relaxed line-clamp-4 text-[15px]">{mem.content}</p>
                <div className="flex items-center gap-3 mt-4">
                  {mem.mood && <span className="text-base">{MOODS[mem.mood]}</span>}
                  <span className="text-xs text-g-text-sub/45">{LABELS[mem.source]} · {new Date(mem.createdAt).toLocaleDateString('zh-CN')}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-lavender p-10 text-center">
            <p className="text-4xl mb-4">🌌</p>
            <p className="text-g-text-sub/50 text-sm leading-relaxed">天空还是空的，去点亮第一颗星吧</p>
            <Link to="/inspiration" className="btn-primary inline-flex mt-5 text-sm !px-5 !py-2.5">写下第一条灵感 ✨</Link>
          </div>
        )}
      </section>

      {/* Recent — alternating card tints */}
      <section>
        <h2 className="text-xs font-semibold text-g-text-sub/40 uppercase tracking-[0.15em] mb-4">最近记录</h2>
        {recent.length > 0 ? (
          <div className="space-y-3 stagger">
            {recent.map((item, idx) => (
              <div key={item.id} className="card p-4 flex items-start gap-3.5">
                <span className="text-xl mt-0.5 shrink-0">{SRC[item.source]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-md text-g-text-sub/60 font-medium">{LABELS[item.source]}</span>
                    {item.mood && <span className="text-xs">{MOODS[item.mood]}</span>}
                  </div>
                  <p className="text-sm text-g-text mt-1.5 line-clamp-1">{item.content||item.title}</p>
                  <p className="text-[11px] text-g-text-sub/35 mt-1.5">{new Date(item.createdAt).toLocaleDateString('zh-CN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center"><p className="text-g-text-sub/45 text-sm">还没有记录，开始点亮星星吧 ✨</p></div>
        )}
      </section>
    </div>
  )
}
