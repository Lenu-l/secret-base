import { useState, useEffect, useCallback } from 'react'
import { getMedia, addMedia, updateMedia, deleteMedia } from '../utils/storage'

const TYPES = [
  { key:'book', label:'书籍', icon:'📚' },
  { key:'movie', label:'电影', icon:'🎬' },
  { key:'music', label:'音乐', icon:'🎵' },
]
const STATUSES = [
  { key:'want', label:'想看', icon:'📌' },
  { key:'doing', label:'在看', icon:'👀' },
  { key:'done', label:'已完成', icon:'✅' },
]

export default function Media() {
  const [items, setItems] = useState([])
  const [fType, setFType] = useState('all')
  const [fStatus, setFStatus] = useState('all')
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('book')
  const [status, setStatus] = useState('want')
  const [rating, setRating] = useState(0)
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState([])

  const load = useCallback(() => setItems(getMedia()), [])
  useEffect(() => { load() }, [load])

  const addTag = () => { const t = tagInput.trim().replace(/^#/,''); if(t&&!tags.includes(t)) setTags([...tags,t]); setTagInput('') }
  const submit = (e) => { e.preventDefault(); if(!title.trim()) return; addMedia({ title:title.trim(), type, status, rating, tags }); setTitle(''); setType('book'); setStatus('want'); setRating(0); setTags([]); setShow(false); load() }
  const chStatus = (id,s) => { updateMedia(id,{status:s}); load() }
  const chRating = (id,r) => { updateMedia(id,{rating:r}); load() }
  const del = (id) => { deleteMedia(id); load() }

  const filtered = items.filter(i => {
    if(fType!=='all' && i.type!==fType) return false
    if(fStatus!=='all' && i.status!==fStatus) return false
    return true
  })

  const counts = TYPES.map(t => ({...t, count:items.filter(i=>i.type===t.key).length }))

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between pt-2 pb-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-title font-bold text-g-text">🎬 书影音</h1>
          <p className="text-sm text-g-text-sub/55 mt-1">记录读过的书、看过的电影、听过的音乐</p>
        </div>
        <button onClick={() => setShow(!show)} className="btn text-lg !px-3 !py-2">{show?'✕':'+'}</button>
      </header>

      {show && (
        <form onSubmit={submit} className="card-sage p-5 space-y-4 anim-in">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="书名 / 电影名 / 专辑名..." className="input text-sm" autoFocus />

          <div className="flex gap-2">{TYPES.map(t=>(
            <button key={t.key} type="button" onClick={()=>setType(t.key)}
              className={`flex-1 py-2.5 rounded-[18px] text-sm transition-all ${type===t.key?'bg-g-card-sage text-g-sage font-medium':'bg-white text-g-text-sub/55 border border-gray-200'}`}>{t.icon} {t.label}</button>
          ))}</div>

          <div className="flex gap-2">{STATUSES.map(s=>(
            <button key={s.key} type="button" onClick={()=>setStatus(s.key)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-[18px] text-xs transition-all ${status===s.key?'bg-g-card-sage text-g-sage':'bg-white text-g-text-sub/55 border border-gray-200'}`}>
              <span className="text-lg">{s.icon}</span><span>{s.label}</span></button>
          ))}</div>

          {status==='done' && (
            <div>
              <p className="text-xs font-medium text-g-text-sub/45 mb-2.5 tracking-wide">评分</p>
              <div className="flex gap-2">{[1,2,3,4,5].map(s=>(
                <button key={s} type="button" onClick={()=>setRating(s)}
                  className={`text-2xl transition-all ${s<=rating?'scale-110':'opacity-25 hover:opacity-50'}`}
                  style={{color:s<=rating?'#CCB890':undefined}}>★</button>
              ))}</div>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">{tags.map(t=>(<span key={t} className="tag flex items-center gap-1.5">#{t}<button type="button" onClick={()=>setTags(tags.filter(x=>x!==t))} className="text-[10px] hover:text-red-400">✕</button></span>))}</div>
          <div className="flex gap-2">
            <input value={tagInput} onChange={e=>setTagInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addTag())} placeholder="标签" className="input text-sm !py-2.5 flex-1" />
            <button type="button" onClick={addTag} className="btn text-sm !px-4">添加</button>
          </div>
          <button type="submit" className="btn-primary text-sm w-full !py-3">添加到书影音 ✨</button>
        </form>
      )}

      <div className="grid grid-cols-3 gap-3.5">
        {counts.map(t=>(
          <button key={t.key} onClick={()=>setFType(fType===t.key?'all':t.key)}
            className={`card-sage p-4 text-center transition-all ${fType===t.key?'ring-2 ring-g-sage/30':''}`}>
            <p className="text-2xl mb-1.5">{t.icon}</p>
            <p className="text-[11px] text-g-text-sub/45 tracking-wide">{t.label}</p>
            <p className="text-xl font-bold text-g-text mt-0.5">{t.count}</p>
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={()=>setFStatus('all')} className={`text-xs px-4 py-2 rounded-tag transition-all ${fStatus==='all'?'tag-active':'tag'}`}>全部状态</button>
        {STATUSES.map(s=>(<button key={s.key} onClick={()=>setFStatus(fStatus===s.key?'all':s.key)} className={`text-xs px-4 py-2 rounded-tag transition-all ${fStatus===s.key?'tag-active':'tag'}`}>{s.icon} {s.label}</button>))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 stagger">
          {filtered.map(item=>{
            const ti = TYPES.find(t=>t.key===item.type)
            const si = STATUSES.find(s=>s.key===item.status)
            return (
              <div key={item.id} className="card-sage p-5 group">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{ti?.icon}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-g-card-sage rounded-md text-g-sage font-medium">{si?.icon} {si?.label}</span>
                    </div>
                    <h3 className="font-medium text-g-text text-[15px]">{item.title}</h3>
                  </div>
                  <button onClick={()=>del(item.id)} className="text-g-text-sub/15 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-sm shrink-0" aria-label="删除">✕</button>
                </div>

                {item.status==='done' && (
                  <div className="mt-3 flex gap-1">{[1,2,3,4,5].map(s=>(
                    <button key={s} onClick={()=>chRating(item.id,s)} className="text-base transition-all hover:scale-110"
                      style={{color:s<=(item.rating||0)?'#CCB890':undefined,opacity:s<=(item.rating||0)?1:0.2}}>★</button>
                  ))}
                  {item.rating>0&&<span className="text-xs text-g-text-sub/35 ml-1">{item.rating}/5</span>}</div>
                )}

                <div className="flex gap-1.5 mt-3.5">{STATUSES.map(s=>(
                  <button key={s.key} onClick={()=>chStatus(item.id,s.key)} className={`text-[10px] px-3 py-1.5 rounded-tag transition-all ${item.status===s.key?'tag-active':'tag'}`}>{s.icon}</button>
                ))}</div>

                {item.tags.length>0 && <div className="flex flex-wrap gap-1.5 mt-3">{item.tags.map(t=>(<span key={t} className="tag text-[10px] !px-3 !py-1">#{t}</span>))}</div>}
                <p className="text-[10px] text-g-text-sub/30 mt-3">{new Date(item.createdAt).toLocaleDateString('zh-CN',{month:'short',day:'numeric'})}</p>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-4">📚</p>
          <p className="text-g-text-sub/45 text-sm">{fType!=='all'||fStatus!=='all'?'没有找到匹配的记录':'还没有书影音记录'}</p>
          {!show && fType==='all' && fStatus==='all' && <button onClick={()=>setShow(true)} className="btn-primary mt-5 text-sm !px-5 !py-2.5">添加第一条记录 →</button>}
        </div>
      )}
    </div>
  )
}
