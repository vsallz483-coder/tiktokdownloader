export async function getData(url) {
  const r = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
  const d = await r.json();
  if (d.error) throw new Error(d.details || d.error);
  return {
    type: d.type,
    username: (d.username || 'tiktok_user').replace(/^@/, ''),
    views: d.views,
    likes: d.likes,
    videoUrl: d.downloads?.nowm?.[0] || d.downloads?.wm?.[0],
    audioUrl: d.mp3?.[0],
    slides: d.slides || [],
  };
}

// Fetch as blob (no-referrer avoids TikTok 403) and trigger a real file save.
export async function forceDownload(url, filename, toast, silent = false) {
  try {
    const res = await fetch(url, { referrerPolicy: 'no-referrer' });
    if (!res.ok) throw new Error('Network response was not ok');
    const blobUrl = URL.createObjectURL(await res.blob());
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);
    if (!silent) toast('Download complete', filename);
    return true;
  } catch {
    toast('Auto download failed', 'Opening in a new tab instead.', true);
    window.open(url, '_blank');
    return false;
  }
}
