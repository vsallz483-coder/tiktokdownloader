const KEY = 'tikgrap_history';
let mem = [];

export function getHist() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return mem;
  }
}

export function setHist(list) {
  mem = list;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {}
}

export function addHistory(entry) {
  const list = getHist().filter((x) => !(x.link === entry.link && x.kind === entry.kind));
  list.unshift({ ...entry, id: Date.now() + Math.random().toString(36).slice(2, 6), ts: Date.now() });
  setHist(list.slice(0, 100));
}
