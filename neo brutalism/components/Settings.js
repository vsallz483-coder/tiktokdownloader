'use client';
import { useState } from 'react';
import { Icon } from './Icons';
import { getHist, setHist } from '../lib/history';

export default function Settings({ toast, onChange }) {
  const [logoFailed, setLogoFailed] = useState(false);

  const clear = () => {
    if (!getHist().length) return toast('History empty', 'Nothing to clear.', true);
    if (!confirm('Delete all history?')) return;
    setHist([]);
    onChange();
    toast('History cleared', 'All saved downloads removed.');
  };

  return (
    <>
      <div className="sh"><h1>Sett<span>ings</span></h1></div>
      <div className="card glass sb">
        <h1 style={{ fontSize: '1.9rem', letterSpacing: '-.5px', marginBottom: 18 }}>TikGrap</h1>
        <div className="lg glass">
          {logoFailed ? (
            <Icon n="tiktok" className="f" />
          ) : (
            <img src="https://i.imgur.com/3EZng8b.jpeg" alt="TikGrap" onError={() => setLogoFailed(true)} />
          )}
        </div>
        <div className="dev"><strong style={{ fontWeight: 800 }}>Developed: SAL VEC7K</strong></div>
        <p>TikTok video, audio &amp; photo downloader</p>
      </div>
      <div className="card glass">
        <button className="set" onClick={clear}>
          <span className="ic"><Icon n="trash" /></span>
          <span>Clear History<small>Remove all saved downloads from this device</small></span>
        </button>
      </div>
    </>
  );
}
