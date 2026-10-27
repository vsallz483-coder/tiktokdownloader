'use client';
import { useEffect, useState } from 'react';
import { Icon } from './Icons';
import { getHist, setHist } from '../lib/history';
import { getData, forceDownload } from '../lib/download';

function Item({ e, onDel, toast }) {
  const [bad, setBad] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard.writeText(e.link); toast('Link copied', e.link); }
    catch { toast('Copy failed', 'Clipboard blocked', true); }
  };

  const again = async () => {
    let src = e.src;
    if (e.kind !== 'photo') {
      try {
        const d = await getData(e.link);
        src = (e.kind === 'audio' ? d.audioUrl : d.videoUrl) || src;
      } catch {}
    }
    const ext = e.kind === 'video' ? 'mp4' : e.kind === 'audio' ? 'mp3' : 'jpg';
    forceDownload(src, `${e.username}_${e.kind}.${ext}`, toast);
  };

  const media = bad ? (
    <div className="ph"><Icon n="alert" />Preview expired, use the buttons below</div>
  ) : e.kind === 'video' ? (
    <video src={e.src} controls preload="metadata" playsInline onError={() => setBad(true)} />
  ) : e.kind === 'audio' ? (
    <audio src={e.src} controls preload="metadata" onError={() => setBad(true)} />
  ) : (
    <>
      <img src={e.src} referrerPolicy="no-referrer" alt="" onError={() => setBad(true)} />
      <span className="badge">{e.count || 1} photos</span>
    </>
  );

  return (
    <div className="card glass hi">
      <div className="md">{media}</div>
      <div className="mt">
        <b>@{e.username}</b>
        <span>
          <Icon n={e.kind === 'video' ? 'video' : e.kind === 'audio' ? 'music' : 'img'} />
          {new Date(e.ts).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
        </span>
      </div>
      <a className="lk" href={e.link} target="_blank" rel="noopener noreferrer"><Icon n="link" /><span>{e.link}</span></a>
      <div className="acts">
        <button onClick={copy} title="Copy link"><Icon n="copy" /></button>
        <button onClick={() => window.open(e.link, '_blank')} title="Open link"><Icon n="open" /></button>
        <button onClick={again} title="Download again"><Icon n="dl" /></button>
        <button onClick={() => onDel(e.id)} title="Delete"><Icon n="trash" /></button>
      </div>
    </div>
  );
}

export default function History({ ver, toast, onChange }) {
  const [list, setList] = useState([]);
  useEffect(() => { setList(getHist()); }, [ver]);

  const del = (id) => { setHist(getHist().filter((x) => x.id !== id)); onChange(); };

  return (
    <>
      <div className="sh">
        <div>
          <h1>Hist<span>ory</span></h1>
          <small>{list.length} download{list.length === 1 ? '' : 's'}</small>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {list.length === 0 && (
          <div className="card glass empty">
            <Icon n="history" />No downloads yet.<br />Your downloaded videos will appear here.
          </div>
        )}
        {list.map((e) => <Item key={e.id} e={e} onDel={del} toast={toast} />)}
      </div>
    </>
  );
}
