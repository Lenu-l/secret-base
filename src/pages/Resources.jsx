import { useState, useEffect, useCallback } from 'react'
import { getResources, addResource, deleteResource } from '../utils/storage'

const TYPES = [
  { key:'all', label:'全部', icon:'📦' },
  { key:'web', label:'网页', icon:'🌐' },
  { key:'video', label:'视频', icon:'▶️' },
  { key:'article', label:'文章', icon:'📄' },
  { key:'xiaohongshu', label:'小红书', icon:'📕' },
]

export default function Resources() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const [type, setType] = useState('web')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])

  const load = useCallback(() => setItems(getResources()), [])
  useEffect(() => { load() }, [load])

  const addTag = () => { const t = tagInput.trim().replace(/^#/,''); if(t&&!tags.includes(t)) setTags([...tags,t]); setTagInput('') }
  const submit = (e) => { e.preventDefault(); if(!title.trim()||!url.trim()) return; addResource({ title:title.trim(), url:url.trim(), type, tags }); setTitle(''); setUrl(''); setType('web'); setTags([]); setShow(false); load() }
  const del = (id) => { deleteResource(id); load() }

  const filtered = items.filter(i => {
    if(filter!=='all' && i.type!==filter) return false
    if(search){ const q=search.toLowerCase(); return i.title.toLowerCase().includes(q) || i.url.toLowerCase().includes(q) || i.tags.some(t=>t.toLowerCase().includes(q)) }
    return true
  })

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between pt-2 pb-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-title font-bold text-g-text">🔗 资源库</h1>
          <p className="text-sm text-g-text-sub/55 mt-1">收藏有价值的外部链接</p>
        </div>
        <button onClick={() => setShow(!show)} className="btn text-lg !px-3 !py-2">{show?'✕':'+'}</button>
      </header>

      {show && (
        <form onSubmit={submit} className="card-warm p-5 space-y-4 anim-in">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="标题" className="input text-sm" autoFocus />
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="链接 URL" type="url" className="input text-sm" />
          <div className="flex flex-wrap gap-2">{TYPES.filter(t=>t.key!=='all').map(t=>(
            <button key={t.key} type="button" onClick={()=>setType(t.key)} className={`text-xs px-4 py-2 rounded-tag transition-all ${type===t.key?'tag-active':'tag'}`}>{t.icon} {t.label}</button>
          ))}</div>
          <div className="flex flex-wrap gap-1.5">{tags.map(t=>(<span key={t} className="tag flex items-center gap-1.5">#{t}<button type="button" onClick={()=>setTags(tags.filter(x=>x!==t))} className="text-[10px] hover:text-red-400">✕</button></span>))}</div>
          <div className="flex gap-2">
            <input value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addTag())} placeholder="标签" className="input text-sm !py-2.5 flex-1" />
            <button type="button" onClick={addTag} className="btn text-sm !px-4">添加</button>
          </div>
          <button type="submit" className="btn-primary text-sm w-full !py-3">保存收藏 ✨</button>
        </form>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-g-text-sub/35">🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="搜索资源..." className="input text-sm !pl-10 !py-2.5" />
        </div>
        <div className="flex gap-1.5 flex-wrap">{TYPES.map(t=>(
          <button key={t.key} onClick={()=>setFilter(t.key)} className={`text-xs px-4 py-2 rounded-tag transition-all ${filter===t.key?'tag-active':'tag'}`}>{t.icon} {t.label}</button>
        ))}</div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 stagger">
          {filtered.map(item => (
            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer" className="card-warm p-5 group no-underline cursor-pointer block">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm">{TYPES.find(t=>t.key===item.type)?.icon||'🔗'}</span>
                    <span className="text-[10px] tracking-wide text-g-text-sub/35 uppercase">{TYPES.find(t=>t.key===item.type)?.label||item.type}</span>
                  </div>
                  <h3 className="font-medium text-g-text text-[15px] line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-g-text-sub/35 mt-1.5 line-clamp-1 break-all">{item.url}</p>
                </div>
                <button onClick={e=>{e.preventDefault();e.stopPropagation();del(item.id)}} className="shrink-0 text-g-text-sub/15 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-sm" aria-label="删除">✕</button>
              </div>
              {item.tags.length>0 && <div className="flex flex-wrap gap-1.5 mt-3.5">{item.tags.map(t=>(<span key={t} className="tag text-[10px] !px-3 !py-1">#{t}</span>))}</div>}
              <div className="flex items-center justify-between mt-3.5">
                <span className="text-[10px] text-g-text-sub/30">{fmt(item.createdAt)}</span>
                <span className="text-[10px] text-g-sage opacity-0 group-hover:opacity-100 transition-opacity">打开 →</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-4">🔗</p>
          <p className="text-g-text-sub/45 text-sm">{search||filter!=='all'?'没有找到匹配的资源':'还没有收藏任何资源'}</p>
        </div>
      )}
    </div>
  )
}

function fmt(iso){ const d=Date.now()-new Date(iso).getTime(); const m=Math.floor(d/60000); if(m<1)return'刚刚'; if(m<60)return`${m}分钟前`; const h=Math.floor(m/60); if(h<24)return`${h}小时前`; const dd=Math.floor(h/24); if(dd<7)return`${dd}天前`; return new Date(iso).toLocaleDateString('zh-CN',{month:'short',day:'numeric'}) }
