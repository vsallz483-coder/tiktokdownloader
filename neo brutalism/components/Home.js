'use client';
import { useState } from 'react';
import { Icon } from './Icons';
import { getData, forceDownload } from '../lib/download';
import { addHistory } from '../lib/history';

const TECH = [
  { n: 'next', l: 'NEXT.JS', href: 'https://nextjs.org' },
  { n: 'react', l: 'REACT.JS', href: 'https://react.dev' },
  { n: 'vercel', l: 'VERCEL', href: 'https://vercel.com' },
  { n: 'github', l: 'GITHUB', href: 'https://github.com' },
];

export default function Home({ toast, onSaved }) {
  const [url, setUrl] = useState('');
  const [fmt, setFmt] = useState('mp4');
  const [loading, setLoading] = useState(false);
  const [cur, setCur] = useState(null);
  const [idx, setIdx] = useState(0);
  const [busy, setBusy] = useState('');

  const save = (entry) => { addHistory(entry); onSaved(); };

  const paste = async () => {
    try { setUrl((await navigator.clipboard.readText()).trim()); } catch {}
  };

  const run = async () => {
    const link = url.trim();
    if (!link) return toast('Link required', 'Paste a TikTok link first.', true);
    setLoading(true);
    setCur(null);
    try {
      const d = await getData(link);
      setCur({ ...d, link });
      setIdx(0);
    } catch (e) {
      toast('Failed', e.message, true);
    } finally {
      setLoading(false);
    }
  };

  const dl = async (key, src, name, entry) => {
    setBusy(key);
    const ok = await forceDownload(src, name, toast);
    if (ok) save(entry);
    setBusy('');
  };

  const dlAll = async () => {
    setBusy('all');
    let ok = 0;
    for (let i = 0; i < cur.slides.length; i++) {
      await new Promise((r) => setTimeout(r, 900));
      if (await forceDownload(cur.slides[i].url, `${cur.username}_slide_${i + 1}.jpg`, toast, true)) ok++;
    }
    setBusy('');
    if (ok) {
      save({ link: cur.link, kind: 'photo', username: cur.username, src: cur.slides[0].url, count: cur.slides.length });
      toast('Download complete', `${ok} photos saved`);
    }
  };

  const move = (d) => setIdx((i) => (i + d + cur.slides.length) % cur.slides.length);

  return (
    <>
      <div className="head">
        <div className="logo glass"><Icon n="tiktok" className="f" /></div>
        <h1>Tik<span>Grap</span></h1>
        <p className="sub">High-quality Video (No WM) &amp; Photo Slideshows</p>
      </div>

      <div className="card glass">
        <div className="row">
          <Icon n="link" />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && run()}
            placeholder="Paste TikTok link here..."
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <button className="ib" onClick={paste} title="Paste"><Icon n="paste" /></button>
        </div>
        <div className="seg">
          <button className={fmt === 'mp4' ? 'on' : ''} onClick={() => setFmt('mp4')}><Icon n="video" />MP4 Video</button>
          <button className={fmt === 'mp3' ? 'on' : ''} onClick={() => setFmt('mp3')}><Icon n="music" />MP3 Audio</button>
        </div>
        {!loading && <button className="btn" onClick={run}><Icon n="zap" />Download Now</button>}
        {loading && <div className="loader" />}
      </div>

      {cur && (
        <div className="card glass">
          <div className="ui">
            <h3>@{cur.username}</h3>
            <div className="st">
              <span><Icon n="play" />{cur.views}</span>
              <span><Icon n="heart" />{cur.likes}</span>
            </div>
          </div>

          {cur.type === 'video' ? (
            <div>
              <video src={cur.videoUrl} controls playsInline />
              {fmt === 'mp4' && (
                <button
                  className="btn s"
                  disabled={busy === 'v'}
                  onClick={() => dl('v', cur.videoUrl, `${cur.username}_video.mp4`, { link: cur.link, kind: 'video', username: cur.username, src: cur.videoUrl })}
                >
                  <Icon n="dl" />{busy === 'v' ? 'Downloading...' : 'Download Video (No WM)'}
                </button>
              )}
              {fmt === 'mp3' && cur.audioUrl && (
                <button
                  className="btn s"
                  disabled={busy === 'a'}
                  onClick={() => dl('a', cur.audioUrl, `${cur.username}_audio.mp3`, { link: cur.link, kind: 'audio', username: cur.username, src: cur.audioUrl })}
                >
                  <Icon n="music" />{busy === 'a' ? 'Downloading...' : 'Download Audio'}
                </button>
              )}
              {fmt === 'mp3' && !cur.audioUrl && <p className="sub" style={{ textAlign: 'center', marginTop: 12 }}>No audio available for this video.</p>}
            </div>
          ) : (
            <div>
              <div className="slw">
                <div className="sl" style={{ transform: `translateX(-${idx * 100}%)` }}>
                  {cur.slides.map((s, i) => <img key={i} src={s.url} referrerPolicy="no-referrer" alt="" />)}
                </div>
              </div>
              <div className="slc">
                <button className="ib" onClick={() => move(-1)}><Icon n="left" /></button>
                <span>{idx + 1} / {cur.slides.length}</span>
                <button className="ib" onClick={() => move(1)}><Icon n="right" /></button>
              </div>
              <button
                className="btn s"
                disabled={!!busy}
                onClick={() => dl('p', cur.slides[idx].url, `${cur.username}_slide_${idx + 1}.jpg`, { link: cur.link, kind: 'photo', username: cur.username, src: cur.slides[0].url, count: cur.slides.length })}
              >
                <Icon n="img" />{busy === 'p' ? 'Downloading...' : 'Download This Photo'}
              </button>
              <button className="btn s" disabled={!!busy} onClick={dlAll}>
                <Icon n="dl" />{busy === 'all' ? 'Downloading all...' : 'Download All Photos'}
              </button>
            </div>
          )}
        </div>
      )}

      <div className="feat">
        {TECH.map((t) => (
          <a key={t.n} className="tl" href={t.href} target="_blank" rel="noopener noreferrer">
            <div className="ic glass" style={{ borderRadius: 16 }}><Icon n={t.n} /></div>
            <span>{t.l}</span>
          </a>
        ))}
      </div>

      <div className="foot">SAL VEC7K © 2026</div>
    </>
  );
}
