'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Save, PlayCircle } from 'lucide-react';
import { getAgentGuide, saveAgentGuide } from '@/lib/firestore';

type Tut = { title: string; youtube: string };

export default function AgentGuidePage() {
  const [tutorials, setTutorials] = useState<Tut[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    getAgentGuide().then((d: any) => {
      const t = Array.isArray(d?.tutorials) ? d.tutorials : [];
      setTutorials(t.length ? t : [{ title: '', youtube: '' }]);
      setLoading(false);
    });
  }, []);

  const update = (i: number, key: keyof Tut, val: string) =>
    setTutorials((cur) => cur.map((t, idx) => (idx === i ? { ...t, [key]: val } : t)));
  const add = () => setTutorials((cur) => [...cur, { title: '', youtube: '' }]);
  const remove = (i: number) => setTutorials((cur) => cur.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) =>
    setTutorials((cur) => {
      const j = i + dir;
      if (j < 0 || j >= cur.length) return cur;
      const next = [...cur];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const save = async () => {
    setSaving(true);
    setMsg('');
    const clean = tutorials.filter((t) => (t.title || '').trim() || (t.youtube || '').trim());
    const ok = await saveAgentGuide({ tutorials: clean, updated_at: new Date().toISOString() });
    setMsg(ok ? '✅ Saved — changes are live on the For Agents page.' : '❌ Could not save. Check your admin access.');
    setSaving(false);
    if (ok) setTutorials(clean.length ? clean : [{ title: '', youtube: '' }]);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Agent Guide — Tutorial Videos</h1>
        <p className="text-gray-600 text-sm mt-1">
          Add YouTube how-to videos for agents. These appear on the public{' '}
          <a href="https://yaal-nilam.web.app/for-agents" target="_blank" rel="noopener noreferrer" className="text-teal-700 font-semibold underline">
            For Agents
          </a>{' '}
          page. Paste a YouTube link and a short title for each step.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <>
          <div className="space-y-4">
            {tutorials.map((t, i) => (
              <div key={i} className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400 flex items-center gap-1.5">
                    <PlayCircle className="w-4 h-4" /> Video {i + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30" aria-label="Move up"><ArrowUp className="w-4 h-4" /></button>
                    <button onClick={() => move(i, 1)} disabled={i === tutorials.length - 1} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30" aria-label="Move down"><ArrowDown className="w-4 h-4" /></button>
                    <button onClick={() => remove(i)} className="p-1.5 rounded hover:bg-red-50 text-red-600" aria-label="Remove"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={t.title}
                  onChange={(e) => update(i, 'title', e.target.value)}
                  placeholder="e.g. How to post your first listing"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-3"
                />
                <label className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</label>
                <input
                  type="url"
                  value={t.youtube}
                  onChange={(e) => update(i, 'youtube', e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-5">
            <button onClick={add} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50">
              <Plus className="w-4 h-4" /> Add video
            </button>
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-teal-700 text-white font-bold hover:bg-teal-800 disabled:opacity-50">
              <Save className="w-4 h-4" /> {saving ? 'Saving…' : 'Save changes'}
            </button>
            {msg && <span className="text-sm text-gray-700">{msg}</span>}
          </div>

          <p className="text-xs text-gray-400 mt-4">
            Tip: leave the list empty to show the default step-by-step guide (no videos) on the For Agents page.
          </p>
        </>
      )}
    </div>
  );
}
