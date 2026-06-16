import { useState, useEffect, useCallback } from 'react'
import { getInspirations, addInspiration, deleteInspiration } from '../utils/storage'

const TAGS = ['tag-sage','tag-blush','tag-warm','tag']

export default function Inspiration() {
  const [items, setItems] = useState([])
  const [content, setContent] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])
  const [filterTag, setFilterTag] = useState('')
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(() => setItems(getInspirations()), [])
  useEffect(() => { load() }, [load])

  const addTag = () => { const t = tagInput.trim().replace(/^#/,''); if(t&&!tags.includes(t)) setTags([...tags,t]); setTagInput('') }
  const rmTag = (t) => setTags(tags.filter(x => x !== t))

  const submit = (e) => {
    e.preventDefault()
    if(!content.trim()) return
    addInspiration({ content: content.trim(), tags })
    setContent(''); setTags([]); setShowForm(false); load()
  }

  const allTags = [...new Set(items.flatMap(i => i.tags))].sort()
  const filtered = filterTag ? items.filter(i => i.tags.includes(filterTag)) : items

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between pt-2 pb-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-title font-bold text-g-text">💡 灵感</h1>
          <p className="text-sm text-g-text-sub/55 mt-1">捕捉一闪而过的念头 · 已收集 {items.length} 颗星</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn text-lg !px-3 !py-2">{showForm ? '✕' : '+'}</button>
      </header>

      {showForm && (
        <form onSubmit={submit} className="card-sky p-5 space-y-4 anim-in">
          <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="写下你此刻的想法..." className="textarea text-[15px]" rows={3} autoFocus />
          <div className="flex flex-wrap gap-1.5">{tags.map(t => (
            <span key={t} className="tag flex items-center gap-1.5">#{t}<button type="button" onClick={() => rmTag(t)} className="text-[10px] hover:text-red-400">✕</button></span>
          ))}</div>
          <div className="flex gap-2">
            <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key==='Enter'&&(e.preventDefault(),addTag())} placeholder="添加标签 (回车确认)" className="input text-sm !py-2.5 flex-1" />
            <button type="button" onClick={addTag} className="btn text-sm !px-4">添加</button>
          </div>
          <button type="submit" className="btn-primary text-sm w-full !py-3">保存灵感 ✨</button>
        </form>
      )}

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilterTag('')} className={`text-xs px-4 py-1.5 rounded-tag transition-all ${!filterTag ? 'tag-active' : 'tag'}`}>全部</button>
          {allTags.map(t => (
            <button key={t} onClick={() => setFilterTag(filterTag===t?'':t)} className={`text-xs px-4 py-1.5 rounded-tag transition-all ${filterTag===t ? 'tag-active' : 'tag'}`}>#{t}</button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="space-y-3 stagger">
          {filtered.map((item, idx) => (
            <div key={item.id} className="card-sky p-5 group relative">
              <p className="text-g-text leading-relaxed text-[15px]">{item.content}</p>
              {item.tags.length > 0 && <div className="flex flex-wrap gap-1.5 mt-3.5">{item.tags.map((t,ti) => (<span key={t} className={TAGS[ti%TAGS.length]}>#{t}</span>))}</div>}
              <div className="flex items-center justify-between mt-4">
                <span className="text-[11px] text-g-text-sub/40">{fmt(item.createdAt)}</span>
                <button onClick={() => { deleteInspiration(item.id); load() }} className="text-g-text-sub/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-sm" aria-label="删除">✕</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-sky p-12 text-center">
          <p className="text-4xl mb-4">💡</p>
          <p className="text-g-text-sub/45 text-sm">{filterTag?`还没有 #${filterTag} 标签的灵感`:'还没有灵感记录'}</p>
          {!showForm && !filterTag && <button onClick={() => setShowForm(true)} className="btn-primary mt-5 text-sm !px-5 !py-2.5">记下第一个灵感 →</button>}
        </div>
      )}
    </div>
  )
}

function fmt(iso){ const d=Date.now()-new Date(iso).getTime(); const m=Math.floor(d/60000); if(m<1)return'刚刚'; if(m<60)return`${m}分钟前`; const h=Math.floor(m/60); if(h<24)return`${h}小时前`; const dd=Math.floor(h/24); if(dd<7)return`${dd}天前`; return new Date(iso).toLocaleDateString('zh-CN',{month:'short',day:'numeric'}) }
