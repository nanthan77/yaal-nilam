// @ts-nocheck
'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { httpsCallable } from 'firebase/functions';
import {
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  ExternalLink,
  Eye,
  Globe2,
  Loader2,
  MessageCircle,
  Plus,
  Radar,
  RefreshCw,
  Search,
  Trash2,
  Video,
  X,
  Sparkles,
  Bot,
  Send,
  Check,
} from 'lucide-react';
import { functions } from '@/lib/firebase';
import {
  createSocialLead,
  deleteSocialLead,
  getSocialLeads,
  getSocialMonitorConfig,
  getSocialMonitorRuns,
  saveSocialMonitorConfig,
  updateSocialLead,
} from '@/lib/firestore';

const STATUSES = ['new', 'reviewing', 'invited', 'contacted', 'converted', 'ignored', 'duplicate'];
const SOURCES = ['All', 'youtube', 'facebook', 'web', 'manual'];
const PROPERTY_TYPES = ['unknown', 'house', 'land', 'apartment', 'villa', 'commercial'];
const INTENTS = ['unknown', 'sell', 'rent', 'short_rent'];

const EMPTY_LEAD = {
  source: 'manual',
  source_url: '',
  title: '',
  author_name: '',
  snippet: '',
  area: '',
  property_type: 'unknown',
  intent: 'unknown',
  price_text: '',
  phone: '',
  email: '',
  score: 60,
  notes: '',
};

function sourceIcon(source: string) {
  if (source === 'youtube') return Video;
  if (source === 'facebook') return MessageCircle;
  if (source === 'web') return Globe2;
  return Radar;
}

function statusClass(status: string) {
  switch (status) {
    case 'new': return 'bg-teal-100 text-teal-800';
    case 'reviewing': return 'bg-blue-100 text-blue-800';
    case 'invited': return 'bg-purple-100 text-purple-800';
    case 'contacted': return 'bg-orange-100 text-orange-800';
    case 'converted': return 'bg-green-100 text-green-800';
    case 'ignored': return 'bg-charcoal-100 text-charcoal-700';
    case 'duplicate': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function priorityClass(priority: string) {
  switch (priority) {
    case 'hot': return 'bg-red-100 text-red-800 border-red-200';
    case 'warm': return 'bg-amber-100 text-amber-800 border-amber-200';
    default: return 'bg-navy-100 text-navy-800 border-navy-200';
  }
}

function buildInviteMessage(lead: any) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://yaalnilam.lk').replace(/\/$/, '');
  const leadTitle = lead?.title ? ` about "${lead.title}"` : '';
  return `Hi${lead?.author_name ? ` ${lead.author_name}` : ''}, I saw your property post${leadTitle}. Yaal Nilam is offering free early listings for Jaffna and Northern Sri Lanka property owners and agencies. You can post your property here free of charge: ${siteUrl}/list-property`;
}

function normalizeFacebookPages(config: any) {
  const rawPages = Array.isArray(config?.facebook?.page_ids) ? config.facebook.page_ids : [];
  return rawPages
    .map((page: any) => {
      if (typeof page === 'string') return { id: page.trim(), name: '' };
      return {
        id: String(page?.id || page?.page_id || '').trim(),
        name: String(page?.name || page?.page_name || '').trim(),
      };
    })
    .filter((page: any) => page.id);
}

function FacebookPagesPanel({
  config,
  onSave,
}: {
  config: any;
  onSave: (nextConfig: any) => Promise<boolean>;
}) {
  const [pageId, setPageId] = useState('');
  const [pageName, setPageName] = useState('');
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState('');
  const pages = normalizeFacebookPages(config);

  const savePages = async (nextPages: any[]) => {
    setSaving(true);
    setLocalError('');
    const ok = await onSave({
      ...(config || {}),
      facebook: {
        ...(config?.facebook || {}),
        enabled: config?.facebook?.enabled !== false,
        page_ids: nextPages,
      },
    });
    setSaving(false);
    if (!ok) setLocalError('Could not save Facebook pages. Check admin access.');
    return ok;
  };

  const addPage = async () => {
    const id = pageId.trim();
    if (!id) {
      setLocalError('Facebook Page ID is required.');
      return;
    }
    if (pages.some((page: any) => page.id === id)) {
      setLocalError('That Page ID is already in the monitor list.');
      return;
    }
    const ok = await savePages([...pages, { id, name: pageName.trim() }]);
    if (ok) {
      setPageId('');
      setPageName('');
    }
  };

  const removePage = async (id: string) => {
    await savePages(pages.filter((page: any) => page.id !== id));
  };

  return (
    <div className="card shadow-card border border-sand-200 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
        <div>
          <h2 className="font-bold text-charcoal-900 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-navy-600" />
            Facebook Pages to monitor
          </h2>
          <p className="text-sm text-charcoal-600 mt-1">
            Add public real estate or property Page IDs now. When the Meta token is connected, the monitor reads each Page feed.
          </p>
        </div>
        <span className="inline-flex rounded-full bg-navy-50 px-3 py-1 text-xs font-semibold text-navy-700">
          {pages.length} pages
        </span>
      </div>

      {localError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
          {localError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-3 mb-5">
        <div>
          <label htmlFor="facebook-page-id" className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Facebook Page ID</label>
          <input
            id="facebook-page-id"
            value={pageId}
            onChange={(e) => setPageId(e.target.value)}
            className="input-field"
            placeholder="123456789012345"
          />
        </div>
        <div>
          <label htmlFor="facebook-page-name" className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Page name optional</label>
          <input
            id="facebook-page-name"
            value={pageName}
            onChange={(e) => setPageName(e.target.value)}
            className="input-field"
            placeholder="Jaffna Real Estate Page"
          />
        </div>
        <div className="lg:self-end">
          <button onClick={addPage} disabled={saving} className="btn-primary w-full lg:w-auto">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
            Add Page
          </button>
        </div>
      </div>

      {pages.length === 0 ? (
        <div className="rounded-lg border border-dashed border-sand-300 bg-sand-50 px-4 py-6 text-center">
          <p className="text-sm font-semibold text-charcoal-700">No Facebook Pages added yet</p>
          <p className="text-xs text-charcoal-500 mt-1">Paste Page IDs from real estate/property Pages you want the agent to monitor later.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-sand-200">
          <table className="w-full">
            <thead className="bg-sand-100 border-b border-sand-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal-900">Page</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal-900">Page ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal-900">Open</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-charcoal-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((page: any) => (
                <tr key={page.id} className="border-b border-sand-100 hover:bg-sand-50">
                  <td className="px-4 py-3 text-sm font-semibold text-charcoal-900">{page.name || 'Unnamed Page'}</td>
                  <td className="px-4 py-3 text-sm font-mono text-charcoal-700">{page.id}</td>
                  <td className="px-4 py-3">
                    <a href={`https://www.facebook.com/${page.id}`} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => removePage(page.id)} disabled={saving} className="btn-danger btn-sm" aria-label={`Remove ${page.name || page.id}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AddLeadModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState(EMPTY_LEAD);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  const save = async () => {
    if (!form.title.trim() || !form.source_url.trim()) {
      setError('Title and source link are required.');
      return;
    }
    setSaving(true);
    const id = await createSocialLead(form);
    setSaving(false);
    if (!id) {
      setError('Could not save lead. Check admin access.');
      return;
    }
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-charcoal-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-charcoal-900">Add social property lead</h2>
            <p className="text-sm text-charcoal-500 mt-1">Save a post from Facebook, YouTube, WhatsApp, classifieds, or any public link.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-charcoal-100" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="lead-source" className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Source</label>
              <select id="lead-source" value={form.source} onChange={(e) => update('source', e.target.value)} className="select-field">
                {SOURCES.filter((source) => source !== 'All').map((source) => <option key={source} value={source}>{source}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="lead-url" className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Post link</label>
              <input id="lead-url" value={form.source_url} onChange={(e) => update('source_url', e.target.value)} className="input-field" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="lead-title" className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Post title</label>
              <input id="lead-title" value={form.title} onChange={(e) => update('title', e.target.value)} className="input-field" placeholder="Land for sale in Nallur" />
            </div>
            <div>
              <label htmlFor="lead-author" className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Author / page</label>
              <input id="lead-author" value={form.author_name} onChange={(e) => update('author_name', e.target.value)} className="input-field" />
            </div>
            <div>
              <label htmlFor="lead-area" className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Area</label>
              <input id="lead-area" value={form.area} onChange={(e) => update('area', e.target.value)} className="input-field" placeholder="Jaffna, Nallur..." />
            </div>
            <div>
              <label htmlFor="lead-type" className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Type</label>
              <select id="lead-type" value={form.property_type} onChange={(e) => update('property_type', e.target.value)} className="select-field">
                {PROPERTY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="lead-intent" className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Intent</label>
              <select id="lead-intent" value={form.intent} onChange={(e) => update('intent', e.target.value)} className="select-field">
                {INTENTS.map((intent) => <option key={intent} value={intent}>{intent}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="lead-price" className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Price text</label>
              <input id="lead-price" value={form.price_text} onChange={(e) => update('price_text', e.target.value)} className="input-field" placeholder="Rs. 18M, negotiable..." />
            </div>
            <div>
              <label htmlFor="lead-phone" className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Phone</label>
              <input id="lead-phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} className="input-field" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="lead-snippet" className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Post text</label>
              <textarea id="lead-snippet" value={form.snippet} onChange={(e) => update('snippet', e.target.value)} rows={4} className="textarea-field" />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="lead-notes" className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Internal notes</label>
              <textarea id="lead-notes" value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={3} className="textarea-field" />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-charcoal-200 flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            Save lead
          </button>
        </div>
      </div>
    </div>
  );
}

function PasteAndParseModal({
  onClose,
  onProcessed,
}: {
  onClose: () => void;
  onProcessed: (msg: string) => void;
}) {
  const [postText, setPostText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [autoOutreach, setAutoOutreach] = useState(true);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const runPipeline = async () => {
    if (!postText.trim()) {
      setError('Please paste the social media post text.');
      return;
    }
    setRunning(true);
    setError('');
    setResult(null);

    try {
      const callable = httpsCallable(functions, 'processSocialPost');
      const res: any = await callable({
        text: postText,
        author_name: authorName,
        source_url: sourceUrl,
        auto_outreach: autoOutreach,
        site_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yaalnilam.com',
      });

      if (res.data?.success) {
        setResult(res.data);
        onProcessed(`AI successfully extracted property & staged draft listing ${res.data.listing_id}!`);
      } else {
        setError(res.data?.error || 'AI pipeline processing failed.');
      }
    } catch (err: any) {
      setError(err?.message || 'Pipeline execution failed. Check admin authentication.');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-charcoal-200 flex items-center justify-between bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Property Extractor & Agent Pipeline</h2>
              <p className="text-xs text-teal-200">Parse social media posts (Tamil / English), profile agents, and dispatch WhatsApp consent</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-white/80 hover:text-white" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {!result ? (
            <>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                  Raw Social Post Text (Tamil or English) *
                </label>
                <textarea
                  rows={6}
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Paste the Facebook post or group listing text here... e.g.:
நல்லூர் கோவில் அருகில் 20 பரப்பு காணி விற்பனைக்கு உள்ளது. விலை 1.5 கோடி. தொடர்பு: 0771234567"
                  className="textarea-field font-sans text-sm w-full"
                />
                <p className="text-xs text-charcoal-500 mt-1">
                  AI automatically parses location (40+ canonical Jaffna slugs), price in LKR, land size in perches/parappu, bedrooms, bathrooms, and contact phone.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                    Author / Broker Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Sivakumar Agency"
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-700 mb-1.5">
                    Source URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="https://facebook.com/groups/..."
                    className="input-field w-full"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-teal-50 border border-teal-200 p-4">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoOutreach}
                    onChange={(e) => setAutoOutreach(e.target.checked)}
                    className="w-4 h-4 text-teal-700 rounded border-teal-300 focus:ring-teal-500"
                  />
                  <div>
                    <p className="text-sm font-bold text-teal-950">
                      Send WhatsApp Consent Request Automatically
                    </p>
                    <p className="text-xs text-teal-700">
                      Sends the preview link asking: &ldquo;Can we post your listing free of charge? (1=Yes, 2=Edit, 3=No)&rdquo;
                    </p>
                  </div>
                </label>
              </div>
            </>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-950">Property Extracted & Listing Staged!</h3>
                  <p className="text-xs text-emerald-800">
                    Draft Listing ID: <span className="font-mono font-bold">{result.listing_id}</span> • Agent ID: <span className="font-mono font-bold">{result.agent_id}</span>
                  </p>
                </div>
              </div>

              {/* Extracted Data Card */}
              <div className="rounded-xl border border-sand-200 p-4 bg-sand-50 space-y-2 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-sand-200">
                  <span className="font-bold text-charcoal-900">{result.extracted?.title_ta || result.extracted?.title}</span>
                  <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                    {result.extracted?.property_type} • {result.extracted?.area_name_ta || result.extracted?.area_name}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-charcoal-700 pt-1">
                  <div>Price: <span className="font-bold">{result.extracted?.price_text || `LKR ${result.extracted?.price?.toLocaleString()}`}</span></div>
                  <div>Land Size: <span className="font-bold">{result.extracted?.land_size_perches ? `${result.extracted.land_size_perches} Perches` : 'N/A'}</span></div>
                  <div>Agent: <span className="font-bold">{result.extracted?.agent_name} ({result.extracted?.agent_phone})</span></div>
                  <div>Confidence: <span className="font-bold text-emerald-700">{result.extracted?.confidence_score}%</span></div>
                </div>
              </div>

              {/* Preview Link */}
              <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 space-y-2">
                <p className="text-xs uppercase font-bold text-teal-800 tracking-wider">Agent Preview & Consent Link</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={result.preview_url || `https://yaalnilam.com/preview/${result.claim_token}`}
                    className="input-field text-xs font-mono bg-white flex-1"
                  />
                  <a
                    href={result.preview_url || `https://yaalnilam.com/preview/${result.claim_token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary text-xs px-3 py-2 flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open
                  </a>
                </div>
              </div>

              {/* Outreach status */}
              <div className="text-xs text-charcoal-600 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>
                  WhatsApp Outreach Status:{" "}
                  <strong className="text-charcoal-900 capitalize">
                    {result.outreach?.status || (autoOutreach ? "Queued" : "Skipped")}
                  </strong>
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-charcoal-200 flex items-center justify-end gap-3 bg-sand-50">
          <button onClick={onClose} className="btn-ghost">
            {result ? "Done" : "Cancel"}
          </button>
          {!result ? (
            <button onClick={runPipeline} disabled={running} className="btn-primary bg-emerald-700 hover:bg-emerald-800">
              {running ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running AI Pipeline...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Extract & Stage Listing
                </>
              )}
            </button>
          ) : (
            <button onClick={() => setResult(null)} className="btn-secondary">
              Parse Another Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function LeadDetailModal({ lead, onClose, onSave, onCopied }: { lead: any; onClose: () => void; onSave: (lead: any, data: any) => void; onCopied: (msg: string) => void }) {
  const [notes, setNotes] = useState(lead.notes || '');
  const [status, setStatus] = useState(lead.status || 'new');
  const [assignedTo, setAssignedTo] = useState(lead.assigned_to || '');
  const invite = buildInviteMessage(lead);

  const copyInvite = async () => {
    await navigator.clipboard.writeText(invite);
    await onSave(lead, { status: lead.status === 'new' ? 'invited' : lead.status, outreach_message: invite });
    onCopied('Invite message copied and lead marked for outreach.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-charcoal-200 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-teal-700">{lead.source_label || lead.source}</p>
            <h2 className="text-xl font-bold text-charcoal-900 mt-1">{lead.title}</h2>
            <p className="text-sm text-charcoal-500 mt-1">{lead.author_name || 'Unknown author'}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-charcoal-100" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-lg bg-charcoal-50 p-3">
              <p className="text-xs text-charcoal-500">Score</p>
              <p className="text-xl font-bold text-charcoal-900">{lead.score}</p>
            </div>
            <div className="rounded-lg bg-charcoal-50 p-3">
              <p className="text-xs text-charcoal-500">Area</p>
              <p className="text-sm font-bold text-charcoal-900">{lead.area || 'Unknown'}</p>
            </div>
            <div className="rounded-lg bg-charcoal-50 p-3">
              <p className="text-xs text-charcoal-500">Type</p>
              <p className="text-sm font-bold text-charcoal-900">{lead.property_type}</p>
            </div>
            <div className="rounded-lg bg-charcoal-50 p-3">
              <p className="text-xs text-charcoal-500">Intent</p>
              <p className="text-sm font-bold text-charcoal-900">{lead.intent}</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-charcoal-500 mb-2">Matched post text</p>
            <p className="rounded-lg bg-sand-50 border border-sand-200 p-4 text-sm text-charcoal-800 whitespace-pre-wrap">{lead.snippet || 'No post text captured.'}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase text-charcoal-500 mb-2">Outreach message</p>
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm text-teal-900">
              {invite}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="detail-status" className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Status</label>
              <select id="detail-status" value={status} onChange={(e) => setStatus(e.target.value)} className="select-field">
                {STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="detail-assigned" className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Assigned to</label>
              <input id="detail-assigned" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="input-field" />
            </div>
          </div>

          <div>
            <label htmlFor="detail-notes" className="block text-xs font-semibold uppercase text-charcoal-500 mb-2">Internal notes</label>
            <textarea id="detail-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="textarea-field" />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-charcoal-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {lead.source_url && (
              <a href={lead.source_url} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open post
              </a>
            )}
            <button onClick={copyInvite} className="btn-secondary">
              <Clipboard className="w-4 h-4 mr-2" />
              Copy invite
            </button>
          </div>
          <button
            onClick={() => onSave(lead, { notes, status, assigned_to: assignedTo })}
            className="btn-primary"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SocialLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [addingLead, setAddingLead] = useState(false);
  const [pastingPost, setPastingPost] = useState(false);
  const [batchRunning, setBatchRunning] = useState(false);
  const [processingLeadId, setProcessingLeadId] = useState<string | null>(null);
  const [resendingLeadId, setResendingLeadId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [fsLeads, fsConfig, fsRuns] = await Promise.all([
        getSocialLeads(),
        getSocialMonitorConfig(),
        getSocialMonitorRuns(),
      ]);
      setLeads(fsLeads);
      setConfig(fsConfig);
      setRuns(fsRuns.slice(0, 5));
      setError('');
    } catch (err: any) {
      const msg = err?.message || '';
      setError(msg.toLowerCase().includes('permission') || msg.includes('PERMISSION_DENIED')
        ? 'Permission denied — your account lacks an admin role.'
        : 'Failed to load social leads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showMessage = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(''), 4500);
  };

  const runBatchPipeline = async () => {
    setBatchRunning(true);
    setMessage('');
    setError('');
    try {
      const callable = httpsCallable(functions, 'runDailyAgentPipeline');
      const result: any = await callable({
        limit: 25,
        site_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yaalnilam.com',
        auto_outreach: true,
      });
      const { processed = 0, succeeded = 0, failed = 0 } = result?.data || {};
      showMessage(`Daily Multi-Agent Pipeline: ${processed} scanned, ${succeeded} staged & contacted, ${failed} failed.`);
      await loadData();
    } catch (err: any) {
      setError(err?.message || 'Daily AI Pipeline run failed. Verify admin authorization.');
    } finally {
      setBatchRunning(false);
    }
  };

  const runSingleLeadPipeline = async (lead: any) => {
    setProcessingLeadId(lead.id);
    setMessage('');
    setError('');
    try {
      const callable = httpsCallable(functions, 'processSocialPost');
      const text = `${lead.title || ''}\n${lead.snippet || ''}`.trim();
      const result: any = await callable({
        lead_id: lead.id,
        text,
        author_name: lead.author_name || '',
        source_url: lead.source_url || '',
        source: lead.source || 'facebook',
        auto_outreach: true,
        site_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yaalnilam.com',
      });
      if (result.data?.success) {
        showMessage(`AI Extracted & Staged Listing ${result.data.listing_id}! WhatsApp consent link dispatched.`);
        await loadData();
      } else {
        setError(result.data?.error || 'AI processing failed.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to process lead with AI pipeline.');
    } finally {
      setProcessingLeadId(null);
    }
  };

  const resendConsent = async (lead: any) => {
    const listingId = lead.extracted_listing_id;
    if (!listingId) return;
    setResendingLeadId(lead.id);
    try {
      const callable = httpsCallable(functions, 'sendAgentWhatsAppConsent');
      const result: any = await callable({
        listing_id: listingId,
        site_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yaalnilam.com',
      });
      if (result.data?.success) {
        showMessage(`WhatsApp consent message dispatched to ${lead.phone || 'agent'}!`);
        await loadData();
      } else {
        setError(result.data?.error || 'Consent dispatch failed.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to dispatch WhatsApp consent.');
    } finally {
      setResendingLeadId(null);
    }
  };

  const runMonitor = async () => {
    setRunning(true);
    setMessage('');
    try {
      const callable = httpsCallable(functions, 'runSocialLeadMonitor');
      const result: any = await callable({});
      const created = result?.data?.created || 0;
      const updated = result?.data?.updated || 0;
      const skipped = result?.data?.skipped || 0;
      showMessage(`Monitor finished: ${created} new, ${updated} refreshed, ${skipped} skipped.`);
      await loadData();
    } catch (err: any) {
      const msg = err?.message || 'Monitor run failed. Check function deployment and API configuration.';
      setError(msg);
    } finally {
      setRunning(false);
    }
  };

  const updateLead = async (lead: any, data: any) => {
    setLeads((current) => current.map((item) => item.id === lead.id ? { ...item, ...data, updated_at: new Date().toISOString() } : item));
    const ok = await updateSocialLead(lead.id, data);
    showMessage(ok ? 'Lead updated.' : 'Update failed — check admin access.');
    if (ok) setSelectedLead((current: any) => current?.id === lead.id ? { ...current, ...data } : current);
  };

  const removeLead = async (lead: any) => {
    const ok = await deleteSocialLead(lead.id);
    if (ok) {
      setLeads((current) => current.filter((item) => item.id !== lead.id));
      showMessage('Lead deleted.');
    } else {
      showMessage('Delete failed — check admin access.');
    }
  };

  const copyInvite = async (lead: any) => {
    const invite = buildInviteMessage(lead);
    await navigator.clipboard.writeText(invite);
    await updateLead(lead, { status: lead.status === 'new' ? 'invited' : lead.status, outreach_message: invite });
    showMessage('Invite message copied.');
  };

  const saveMonitorConfig = async (nextConfig: any) => {
    const ok = await saveSocialMonitorConfig(nextConfig);
    if (ok) {
      setConfig(nextConfig);
      showMessage('Social monitor settings saved.');
    }
    return ok;
  };

  const filteredLeads = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      const matchesSearch = !term ||
        `${lead.title} ${lead.author_name} ${lead.area} ${lead.snippet}`.toLowerCase().includes(term);
      return matchesSource && matchesStatus && matchesSearch;
    });
  }, [leads, searchTerm, sourceFilter, statusFilter]);

  const counts = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((lead) => lead.status === 'new').length;
    const invited = leads.filter((lead) => ['invited', 'contacted'].includes(lead.status)).length;
    const converted = leads.filter((lead) => lead.status === 'converted').length;
    return { total, newCount, invited, converted };
  }, [leads]);

  const sourceAgents = [
    {
      key: 'youtube',
      label: 'YouTube agent',
      icon: Video,
      enabled: Boolean(config?.youtube?.enabled),
      ready: Boolean(config?.youtube?.enabled && (config?.youtube?.api_key || config?.youtube?.uses_env_key)),
      note: 'Official search API',
    },
    {
      key: 'facebook',
      label: 'Facebook agent',
      icon: MessageCircle,
      enabled: Boolean(config?.facebook?.enabled),
      ready: Boolean(config?.facebook?.enabled && (config?.facebook?.access_token || config?.facebook?.uses_env_token)),
      note: 'Graph API Pages',
    },
    {
      key: 'web',
      label: 'Web scout',
      icon: Globe2,
      enabled: Boolean(config?.web?.enabled),
      ready: Boolean(config?.web?.provider || config?.web?.feeds?.length),
      note: 'Search/RSS provider',
    },
    {
      key: 'manual',
      label: 'Manual inbox',
      icon: Radar,
      enabled: true,
      ready: true,
      note: 'Paste any public link',
    },
  ];

  return (
    <div className="min-h-screen bg-sand-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-charcoal-900 flex items-center gap-3">
              <Radar className="w-8 h-8 text-navy-600" />
              Social Lead Monitor
            </h1>
            <p className="text-charcoal-600 mt-2 max-w-3xl">
              Find property owners and agencies posting outside Yaal Nilam, review them in CRM, then invite them to list for free.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setPastingPost(true)}
              className="btn-primary bg-emerald-700 hover:bg-emerald-800 text-white flex items-center shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI Parse & Ingest Post
            </button>
            <button
              onClick={runBatchPipeline}
              disabled={batchRunning}
              className="btn-secondary flex items-center"
            >
              {batchRunning ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-teal-700" />
              ) : (
                <Bot className="w-4 h-4 mr-2 text-teal-700" />
              )}
              Run Daily Agent Pipeline
            </button>
            <button onClick={() => setAddingLead(true)} className="btn-ghost">
              <Plus className="w-4 h-4 mr-2" />
              Add lead
            </button>
            <button onClick={runMonitor} disabled={running} className="btn-ghost">
              {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Run monitor
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800" role="status">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="card shadow-card border border-sand-200">
            <p className="text-sm text-charcoal-500">Total leads</p>
            <p className="text-3xl font-bold text-charcoal-900 mt-2">{counts.total}</p>
          </div>
          <div className="card shadow-card border border-sand-200">
            <p className="text-sm text-charcoal-500">New to review</p>
            <p className="text-3xl font-bold text-teal-700 mt-2">{counts.newCount}</p>
          </div>
          <div className="card shadow-card border border-sand-200">
            <p className="text-sm text-charcoal-500">Invited/contacted</p>
            <p className="text-3xl font-bold text-navy-700 mt-2">{counts.invited}</p>
          </div>
          <div className="card shadow-card border border-sand-200">
            <p className="text-sm text-charcoal-500">Converted</p>
            <p className="text-3xl font-bold text-green-700 mt-2">{counts.converted}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {sourceAgents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div key={agent.key} className="card shadow-card border border-sand-200">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-navy-50 text-navy-700">
                    <Icon className="w-5 h-5" />
                  </div>
                  {agent.ready ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <h2 className="font-bold text-charcoal-900 mt-4">{agent.label}</h2>
                <p className="text-xs text-charcoal-500 mt-1">{agent.note}</p>
                <span className={`mt-4 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${agent.ready ? 'bg-green-100 text-green-800' : agent.enabled ? 'bg-amber-100 text-amber-800' : 'bg-charcoal-100 text-charcoal-700'}`}>
                  {agent.ready ? 'ready' : agent.enabled ? 'setup needed' : 'off'}
                </span>
              </div>
            );
          })}
        </div>

        <FacebookPagesPanel config={config} onSave={saveMonitorConfig} />

        <div className="bg-white rounded-lg border border-sand-200 shadow-card mb-6">
          <div className="p-5 border-b border-sand-200 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-charcoal-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search title, author, area, or post text..."
                className="w-full pl-10 pr-4 py-2 border border-charcoal-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="select-field lg:w-44">
              {SOURCES.map((source) => <option key={source} value={source}>{source === 'All' ? 'All sources' : source}</option>)}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="select-field lg:w-44">
              {['All', ...STATUSES].map((status) => <option key={status} value={status}>{status === 'All' ? 'All statuses' : status}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="py-16 text-center text-charcoal-500 text-sm">Loading social leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-16 text-center">
              <Radar className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
              <p className="font-semibold text-charcoal-700">No social leads found</p>
              <p className="text-sm text-charcoal-500 mt-1">Run a monitor or add a public post link manually.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sand-100 border-b border-sand-200">
                  <tr>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-charcoal-900">Post</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-charcoal-900">Source</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-charcoal-900">Score</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-charcoal-900">Status</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-charcoal-900">Property</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-charcoal-900">Seen</th>
                    <th className="px-5 py-3 text-left text-sm font-semibold text-charcoal-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => {
                    const Icon = sourceIcon(lead.source);
                    return (
                      <tr key={lead.id} className="border-b border-sand-100 hover:bg-sand-50 transition">
                        <td className="px-5 py-4 min-w-[320px]">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-charcoal-900 line-clamp-1">{lead.title}</p>
                            {lead.extracted_listing_id && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                                Staged: {lead.extracted_listing_id}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-charcoal-500 mt-1">{lead.author_name || 'Unknown author'} · {lead.area || 'area unknown'}</p>
                          <p className="text-xs text-charcoal-600 mt-2 line-clamp-2">{lead.snippet || 'No post text captured.'}</p>
                          {lead.claim_token && (
                            <div className="mt-2 flex items-center gap-2">
                              <a
                                href={lead.preview_url || `https://yaalnilam.com/preview/${lead.claim_token}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Agent Preview Link
                              </a>
                              {lead.outreach_status && (
                                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                  lead.outreach_status === 'sent'
                                    ? 'bg-green-100 text-green-800'
                                    : lead.outreach_status === 'saved_local'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-stone-100 text-stone-700'
                                }`}>
                                  WA: {lead.outreach_status}
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-2 rounded-full bg-navy-50 text-navy-700 px-2.5 py-1 text-xs font-semibold">
                            <Icon className="w-3.5 h-3.5" />
                            {lead.source}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${priorityClass(lead.priority)}`}>
                            {lead.priority} · {lead.score}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <select
                            value={lead.status}
                            onChange={(e) => updateLead(lead, { status: e.target.value })}
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold border-0 cursor-pointer ${statusClass(lead.status)}`}
                          >
                            {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                          </select>
                        </td>
                        <td className="px-5 py-4 text-sm text-charcoal-700">
                          <p>{lead.property_type} · {lead.intent}</p>
                          <p className="text-xs text-charcoal-500">{lead.price_text || 'price unknown'}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-charcoal-600">
                          {new Date(lead.last_seen_at || lead.discovered_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {!lead.extracted_listing_id ? (
                              <button
                                onClick={() => runSingleLeadPipeline(lead)}
                                disabled={processingLeadId === lead.id}
                                className="btn-primary btn-sm flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs px-2.5 py-1.5"
                                title="Run AI Extractor & Send WhatsApp Consent"
                              >
                                {processingLeadId === lead.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Sparkles className="w-3.5 h-3.5" />
                                )}
                                <span>AI Ingest</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => resendConsent(lead)}
                                disabled={resendingLeadId === lead.id}
                                className="btn-secondary btn-sm flex items-center gap-1 text-xs px-2 py-1"
                                title="Re-send WhatsApp Consent"
                              >
                                {resendingLeadId === lead.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Send className="w-3.5 h-3.5 text-teal-700" />
                                )}
                                <span>Consent</span>
                              </button>
                            )}

                            <button onClick={() => setSelectedLead(lead)} className="btn-ghost btn-sm" title="View details">
                              <Eye className="w-4 h-4" />
                            </button>
                            {lead.source_url && (
                              <a href={lead.source_url} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm" aria-label="Open post">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            )}
                            <button onClick={() => copyInvite(lead)} className="btn-secondary btn-sm" aria-label="Copy invite">
                              <Clipboard className="w-4 h-4" />
                            </button>
                            <button onClick={() => removeLead(lead)} className="btn-danger btn-sm" aria-label="Delete lead">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card shadow-card border border-sand-200">
            <h2 className="font-bold text-charcoal-900 mb-3">Recent monitor runs</h2>
            {runs.length === 0 ? (
              <p className="text-sm text-charcoal-500">No runs recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {runs.map((run) => (
                  <div key={run.id} className="flex items-center justify-between rounded-lg bg-sand-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-charcoal-900">{run.status || 'completed'}</p>
                      <p className="text-xs text-charcoal-500">{new Date(run.started_at || run.created_at).toLocaleString()}</p>
                    </div>
                    <p className="text-sm font-bold text-navy-700">{run.created || 0} new</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="card shadow-card border border-sand-200">
            <h2 className="font-bold text-charcoal-900 mb-3">Free listing link</h2>
            <p className="text-sm text-charcoal-600 mb-4">Use this in outreach after reviewing a lead.</p>
            <Link href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://yaalnilam.lk'}/list-property`} target="_blank" className="btn-primary">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open public listing form
            </Link>
          </div>
        </div>
      </div>

      {addingLead && <AddLeadModal onClose={() => setAddingLead(false)} onCreated={loadData} />}
      {pastingPost && (
        <PasteAndParseModal
          onClose={() => setPastingPost(false)}
          onProcessed={(msg) => {
            setPastingPost(false);
            showMessage(msg);
            loadData();
          }}
        />
      )}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onSave={updateLead}
          onCopied={showMessage}
        />
      )}
    </div>
  );
}
