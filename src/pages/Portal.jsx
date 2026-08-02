import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, UserPlus, LogOut, Check, Zap, Trophy, Terminal } from 'lucide-react'
import { portalTasks, portalQuiz } from '../data/content'

/*
  ⚠️ FRONT-END DEMO ONLY — no backend / no database.
  Accounts + progress are kept in the browser via localStorage so the flow feels
  real while you build. Replace readUsers/saveUser/session + progress helpers with
  calls to your Express + MongoDB API when you're ready.
*/
const VIT_EMAIL = /^[a-z0-9._%+-]+@vit(student)?\.ac\.in$/i
const USERS_KEY = 'iq_users'
const SESSION_KEY = 'iq_session'
const progKey = (email) => `iq_prog_${email}`

const readJSON = (k, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? fallback
  } catch {
    return fallback
  }
}
const writeJSON = (k, v) => localStorage.setItem(k, JSON.stringify(v))

const RANKS = [
  { name: 'Initiate', min: 0 },
  { name: 'Builder', min: 60 },
  { name: 'Hacker', min: 130 },
  { name: 'Core', min: 190 },
]
function rankFor(xp) {
  let r = RANKS[0]
  for (const x of RANKS) if (xp >= x.min) r = x
  const next = RANKS.find((x) => x.min > xp)
  return { current: r, next }
}

/* ────────────────────────────── AUTH ────────────────────────────── */
function Auth({ onAuthed }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')

  const submit = (e) => {
    e.preventDefault()
    setErr('')
    if (!VIT_EMAIL.test(email)) return setErr('Use your VIT email (…@vitstudent.ac.in)')
    if (pass.length < 6) return setErr('Password must be at least 6 characters')

    const users = readJSON(USERS_KEY, {})
    if (mode === 'signup') {
      if (!name.trim()) return setErr('Enter your name')
      if (users[email.toLowerCase()]) return setErr('Account exists — try signing in')
      users[email.toLowerCase()] = { name: name.trim(), email: email.toLowerCase(), password: pass }
      writeJSON(USERS_KEY, users)
      writeJSON(progKey(email.toLowerCase()), { done: [], quizBest: 0 })
    } else {
      const u = users[email.toLowerCase()]
      if (!u || u.password !== pass) return setErr('Invalid credentials')
    }
    writeJSON(SESSION_KEY, email.toLowerCase())
    onAuthed(email.toLowerCase())
  }

  return (
    <div className="grid overflow-hidden rounded-2xl border border-line md:grid-cols-2">
      {/* brand / terminal side */}
      <div className="relative hidden flex-col justify-between bg-pink/[0.04] p-10 md:flex">
        <div>
          <p className="eyebrow flex items-center gap-2"><Terminal size={14} /> IQ · ACCESS</p>
          <h2 className="mt-6 font-display text-4xl font-extrabold leading-tight text-white">
            Enter the <span className="text-pink text-glow-pink">Quest.</span>
          </h2>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            Sign in with your VIT email to take on tasks, clear quizzes and climb the ranks.
          </p>
        </div>
        <pre className="font-mono text-[11px] leading-relaxed text-neon/70">{`> auth.init()
> domain: vitstudent.ac.in
> status: awaiting_credentials_`}</pre>
      </div>

      {/* form side */}
      <div className="p-8 md:p-10">
        <div className="mb-6 flex gap-2">
          {['login', 'signup'].map((mm) => (
            <button
              key={mm}
              onClick={() => { setMode(mm); setErr('') }}
              className={`flex-1 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors ${
                mode === mm ? 'border-pink/60 bg-pink/15 text-neon' : 'border-white/12 text-muted hover:text-neon'
              }`}
            >
              {mm === 'login' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {mode === 'signup' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <Field label="Name" value={name} onChange={setName} placeholder="Ada Lovelace" />
              </motion.div>
            )}
          </AnimatePresence>
          <Field label="VIT Email" type="email" value={email} onChange={setEmail} placeholder="you@vitstudent.ac.in" />
          <Field label="Password" type="password" value={pass} onChange={setPass} placeholder="••••••••" />

          {err && <p className="font-mono text-xs text-pink">// {err}</p>}

          <button type="submit" className="btn-primary w-full justify-center">
            {mode === 'login' ? <LogIn size={16} /> : <UserPlus size={16} />}
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
          <p className="text-center font-mono text-[10px] uppercase tracking-widest text-muted">
            demo · stored in your browser only
          </p>
        </form>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-lg border border-white/12 bg-white/[0.02] px-3 py-2.5 font-mono text-sm text-ink placeholder:text-muted/50 focus:border-pink focus:outline-none"
      />
    </label>
  )
}

/* ──────────────────────────── DASHBOARD ─────────────────────────── */
function Dashboard({ email, onLogout }) {
  const users = readJSON(USERS_KEY, {})
  const user = users[email] || { name: 'Innovator', email }
  const [prog, setProg] = useState(() => readJSON(progKey(email), { done: [], quizBest: 0 }))

  useEffect(() => writeJSON(progKey(email), prog), [email, prog])

  const taskXP = portalTasks
    .filter((t) => prog.done.includes(t.id))
    .reduce((s, t) => s + t.points, 0)
  const xp = taskXP + Math.round(prog.quizBest)
  const { current, next } = rankFor(xp)
  const pctToNext = next ? Math.min(100, Math.round(((xp - current.min) / (next.min - current.min)) * 100)) : 100

  const toggleTask = (id) =>
    setProg((p) => ({
      ...p,
      done: p.done.includes(id) ? p.done.filter((x) => x !== id) : [...p.done, id],
    }))

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">CONSOLE</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold text-white md:text-4xl">
            Welcome, {user.name.split(' ')[0]} <span className="text-pink">.</span>
          </h1>
          <p className="mt-1 font-mono text-[11px] text-muted">{user.email}</p>
        </div>
        <button onClick={onLogout} className="btn-ghost !py-2.5 !text-[10px]">
          <LogOut size={14} /> Sign out
        </button>
      </div>

      {/* XP + rank */}
      <div className="neo-panel grid gap-6 p-6 sm:grid-cols-[auto_1fr] sm:items-center md:p-8">
        <XPRing pct={pctToNext} xp={xp} />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon">Rank</p>
          <p className="mt-1 font-display text-3xl font-bold text-white">{current.name}</p>
          <p className="mt-2 font-mono text-xs text-muted">
            {next ? `${next.min - xp} XP to ${next.name}` : 'Max rank reached — legend.'}
          </p>
          <div className="mt-4 flex gap-4 font-mono text-[11px] text-muted">
            <span className="flex items-center gap-1.5"><Zap size={12} className="text-pink" /> {xp} XP</span>
            <span className="flex items-center gap-1.5"><Check size={12} className="text-pink" /> {prog.done.length}/{portalTasks.length} tasks</span>
            <span className="flex items-center gap-1.5"><Trophy size={12} className="text-pink" /> {prog.quizBest}% quiz</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* tasks */}
        <div className="neo-panel p-6 md:p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon">Tasks</p>
          <ul className="mt-4 space-y-2">
            {portalTasks.map((t) => {
              const done = prog.done.includes(t.id)
              return (
                <li key={t.id}>
                  <button
                    onClick={() => toggleTask(t.id)}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                      done ? 'border-pink/50 bg-pink/[0.08]' : 'border-white/10 hover:border-pink/40'
                    }`}
                  >
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border ${done ? 'border-pink bg-pink text-void' : 'border-white/25 text-transparent'}`}>
                      <Check size={12} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm ${done ? 'text-white' : 'text-ink'}`}>{t.title}</span>
                      <span className="mt-0.5 block font-mono text-[10px] text-muted">{t.hint}</span>
                    </span>
                    <span className="font-mono text-[11px] text-neon">+{t.points}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* quiz */}
        <Quiz best={prog.quizBest} onScore={(s) => setProg((p) => ({ ...p, quizBest: Math.max(p.quizBest, s) }))} />
      </div>
    </div>
  )
}

function XPRing({ pct, xp }) {
  const R = 46
  const C = 2 * Math.PI * R
  return (
    <div className="relative grid h-32 w-32 place-items-center">
      <svg width="128" height="128" className="-rotate-90">
        <circle cx="64" cy="64" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx="64" cy="64" r={R} fill="none" stroke="#ff2d95" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C - (pct / 100) * C}
          style={{ transition: 'stroke-dashoffset 0.6s ease', filter: 'drop-shadow(0 0 6px rgba(255,45,149,0.7))' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-2xl font-bold text-white">{xp}</div>
        <div className="font-mono text-[9px] uppercase tracking-widest text-muted">XP</div>
      </div>
    </div>
  )
}

function Quiz({ best, onScore }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const score = useMemo(() => {
    const correct = portalQuiz.questions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0)
    return Math.round((correct / portalQuiz.questions.length) * 100)
  }, [answers])

  const submit = () => {
    setSubmitted(true)
    onScore(score)
  }
  const reset = () => { setAnswers({}); setSubmitted(false) }

  return (
    <div className="neo-panel p-6 md:p-7">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-neon">{portalQuiz.title}</p>
        <span className="font-mono text-[10px] text-muted">best · {best}%</span>
      </div>

      <div className="mt-4 space-y-5">
        {portalQuiz.questions.map((q, qi) => (
          <div key={qi}>
            <p className="text-sm text-ink">{qi + 1}. {q.q}</p>
            <div className="mt-2 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {q.options.map((opt, oi) => {
                const chosen = answers[qi] === oi
                const isCorrect = submitted && oi === q.answer
                const isWrong = submitted && chosen && oi !== q.answer
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    className={`rounded-md border px-3 py-2 text-left font-mono text-[12px] transition-colors ${
                      isCorrect ? 'border-pink bg-pink/20 text-white'
                      : isWrong ? 'border-white/20 bg-white/5 text-muted line-through'
                      : chosen ? 'border-pink/60 bg-pink/10 text-neon'
                      : 'border-white/10 text-muted hover:border-pink/40'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        {!submitted ? (
          <button onClick={submit} disabled={Object.keys(answers).length < portalQuiz.questions.length} className="btn-primary disabled:opacity-40">
            Submit
          </button>
        ) : (
          <>
            <span className="font-display text-lg font-bold text-white">Score: <span className="text-pink">{score}%</span></span>
            <button onClick={reset} className="btn-ghost !py-2 !text-[10px]">Retry</button>
          </>
        )}
      </div>
    </div>
  )
}

/* ───────────────────────────── PAGE ─────────────────────────────── */
export default function Portal() {
  const [email, setEmail] = useState(null)
  useEffect(() => {
    setEmail(readJSON(SESSION_KEY, null))
  }, [])

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setEmail(null)
  }

  return (
    <section className="relative z-10 mx-auto max-w-5xl px-6 pb-28 pt-36">
      {email ? (
        <Dashboard email={email} onLogout={logout} />
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 text-center"
          >
            <p className="eyebrow">RECRUITMENT · PORTAL</p>
            <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white md:text-6xl">
              STUDENT <span className="text-pink text-glow-pink">ACCESS</span>
            </h1>
          </motion.div>
          <Auth onAuthed={setEmail} />
        </>
      )}
    </section>
  )
}
