'use client';
import { useCallback, useState } from 'react';
import Background from '../components/Background';
import { Icon } from '../components/Icons';
import Home from '../components/Home';
import History from '../components/History';
import Settings from '../components/Settings';

const TABS = [
  { v: 'home', l: 'Home', n: 'home' },
  { v: 'history', l: 'History', n: 'history' },
  { v: 'settings', l: 'Settings', n: 'settings' },
];

export default function Page() {
  const [view, setView] = useState('home');
  const [toasts, setToasts] = useState([]);
  const [ver, setVer] = useState(0);
  const bump = useCallback(() => setVer((v) => v + 1), []);

  const toast = useCallback((title, msg, err = false) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, title, msg, err }]);
    if (!err && navigator.vibrate) navigator.vibrate(40);
    setTimeout(() => setToasts((t) => t.map((x) => (x.id === id ? { ...x, out: true } : x))), 3800);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4100);
  }, []);

  const go = (v) => { setView(v); if (v === 'history') bump(); window.scrollTo(0, 0); };
  const cls = (v) => 'view' + (view === v ? ' active' : '');

  return (
    <>
      <Background />

      <div id="toasts">
        {toasts.map((t) => (
          <div key={t.id} className={'toast glass' + (t.err ? ' err' : '') + (t.out ? ' out' : '')}>
            <span className="ic"><Icon n={t.err ? 'alert' : 'check'} /></span>
            <div><b>{t.title}</b><span>{t.msg}</span></div>
          </div>
        ))}
      </div>

      <main className="app">
        <section className={cls('home')}><Home toast={toast} onSaved={bump} /></section>
        <section className={cls('history')}><History ver={ver} toast={toast} onChange={bump} /></section>
        <section className={cls('settings')}><Settings toast={toast} onChange={bump} /></section>
      </main>

      <nav className="nav glass">
        {TABS.map((t) => (
          <button key={t.v} className={view === t.v ? 'on' : ''} onClick={() => go(t.v)}>
            <Icon n={t.n} />{t.l}
          </button>
        ))}
      </nav>
    </>
  );
}
