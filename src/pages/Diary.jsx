import { useState, useEffect, useCallback } from 'react'
import { getDiaries, addDiary, deleteDiary, getDiaryByDate } from '../utils/storage'

const MOODS = [
  { key:'happy', emoji:'😊', label:'开心' },
  { key:'calm', emoji:'😌', label:'平静' },
  { key:'anxious', emoji:'😰', label:'焦虑' },
  { key:'inspired', emoji:'✨', label:'灵感' },
]

export default function Diary() {
  const [diaries, setDiaries] = useState([])
  const [date, setDate] = useState(today())
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('calm')
  const [editing, setEditing] = useState(false)

  const load = useCallback(() => setDiaries(getDiaries()), [])
  useEffect(() => { load() }, [load])

  useEffect(() => {
    const ex = getDiaryByDate(date)
    if(ex){ setContent(ex.content); setMood(ex.mood||'calm'); setEditing(true) }
    else { setContent(''); setMood('calm'); setEditing(false) }
  }, [date])

  const submit = (e) => {
    e.preventDefault()
    if(!content.trim()) return
    addDiary({ date, content: content.trim(), mood })
    load(); setEditing(true)
  }

  const del = (id) => { if(window.confirm('确定删除？')){ deleteDiary(id); load(); setContent(''); setEditing(false) } }

  const grouped = groupByMonth(diaries)
  const todayDiary = getDiaryByDate(today())

  return (
    <div className="space-y-6">
      <header className="pt-2 pb-3">
        <h1 className="text-2xl md:text-3xl font-title font-bold text-g-text">📖 日记</h1>
        <p className="text-sm text-g-text-sub/55 mt-1">记录每一天的情绪与思考</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="card p-4">
            <label className="text-xs font-medium text-g-text-sub/50 block mb-3 tracking-wide">选择日期</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} max={today()} className="input text-sm !py-2.5" />
            <div className="flex gap-2 mt-3">
              <button onClick={() => setDate(today())} className="btn text-xs !py-2 !px-3 flex-1">今天</button>
              <button onClick={() => setDate(offset(-1))} className="btn text-xs !py-2 !px-3 flex-1">昨天</button>
            </div>
          </div>

          {diaries.length > 0 && (
            <div className="card p-4 max-h-[55vh] overflow-y-auto">
              <h3 className="text-xs font-semibold text-g-text-sub/35 uppercase tracking-[0.12em] mb-3">日记列表</h3>
              <div className="space-y-0.5">
                {Object.entries(grouped).map(([month, items]) => (
                  <div key={month}>
                    <p className="text-[10px] text-g-text-sub/30 px-2 py-1.5 font-medium tracking-wide">{month}</p>
                    {items.map(d => (
                      <button key={d.id} onClick={() => setDate(d.date)}
                        className={`w-full text-left px-3 py-2 rounded-[14px] text-sm transition-all flex items-center gap-2.5 ${date===d.date ? 'bg-g-card-sage text-g-sage font-medium' : 'text-g-text-sub/55 hover:text-g-text'}`}>
                        <span>{MOODS.find(m=>m.key===d.mood)?.emoji||'😌'}</span>
                        <span className="text-xs">{d.date.slice(5)}</span>
                        <span className="flex-1 truncate text-xs opacity-50">{d.content.slice(0,12)}...</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <form onSubmit={submit} className="card-blush p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold text-g-text">{fmtDate(date)}</p>
                {editing && <p className="text-xs text-g-sage mt-1">✏️ 编辑模式</p>}
              </div>
              {editing && (
                <button type="button" onClick={() => { const d = getDiaryByDate(date); if(d) del(d.id) }}
                  className="text-xs text-g-text-sub/30 hover:text-red-400 transition-colors">删除</button>
              )}
            </div>

            <div>
              <p className="text-xs font-medium text-g-text-sub/45 mb-3 tracking-wide">今天的情绪</p>
              <div className="flex gap-2.5">
                {MOODS.map(m => (
                  <button key={m.key} type="button" onClick={() => setMood(m.key)}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-[20px] transition-all text-xs
                      ${mood===m.key ? 'bg-g-card-sage text-g-sage font-medium ' : 'bg-white text-g-text-sub/55 border border-gray-200 hover:border-g-sage/30'}`}>
                    <span className="text-xl">{m.emoji}</span>
                    <span className="text-[10px] tracking-wide">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <textarea value={content} onChange={e => setContent(e.target.value)}
              placeholder="今天发生了什么？你有什么感受？..." className="textarea text-[15px]" rows={10} />

            <button type="submit" className="btn-primary text-sm w-full !py-3.5">{editing?'更新日记 ✨':'保存日记 🌙'}</button>
          </form>

          {!todayDiary && date===today() && !content && (
            <div className="card-blush p-6 mt-4 text-center animate-pulse">
              <p className="text-2xl mb-3">🌟</p>
              <p className="text-sm text-g-text-sub/45">今天还没有写日记，留下点什么吧</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function today(){ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
function offset(n){ const d=new Date(); d.setDate(d.getDate()+n); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
function fmtDate(s){ const d=new Date(s+'T00:00:00'); const w=['日','一','二','三','四','五','六']; return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 星期${w[d.getDay()]}` }
function groupByMonth(arr){ const g={}; arr.forEach(d=>{ const m=d.date.slice(0,7); if(!g[m]) g[m]=[]; g[m].push(d) }); return Object.fromEntries(Object.entries(g).sort((a,b)=>b[0].localeCompare(a[0]))) }
