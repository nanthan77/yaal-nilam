'use client';

import { useEffect, useState } from 'react';
import { BellRing, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { getPropertyAlerts, getAlertDeliveries, getWhatsAppConfigured } from '@/lib/firestore';

function fmtPrice(n: any) {
  const v = Number(n || 0);
  return v > 0 ? `Rs ${v.toLocaleString('en-US')}` : '—';
}
function fmtDate(s: any) {
  if (!s) return '—';
  const d = new Date(s);
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPropertyAlerts(), getAlertDeliveries(), getWhatsAppConfigured()]).then(
      ([a, d, c]: any) => {
        setAlerts(
          (a || []).sort((x: any, y: any) => String(y.created_at || '').localeCompare(String(x.created_at || '')))
        );
        setDeliveries(d || []);
        setConfigured(Boolean(c));
        setLoading(false);
      }
    );
  }, []);

  const sent = deliveries.filter((d) => d.status === 'sent').length;
  const queued = deliveries.filter((d) => d.status === 'queued').length;
  const failed = deliveries.filter((d) => d.status === 'failed').length;

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
          <BellRing className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Property Alerts</h1>
          <p className="text-gray-600 text-sm">
            Buyers who registered to be WhatsApp&apos;d when a matching new listing is published.
          </p>
        </div>
      </div>

      {!loading && !configured && (
        <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900">
            <p className="font-semibold">WhatsApp sending isn&apos;t configured yet.</p>
            <p className="mt-1">
              Matching alerts are being <strong>queued</strong> (recorded below) but not delivered. Add your Meta
              Cloud API credentials to <code className="bg-amber-100 px-1 rounded">config/whatsapp</code>{' '}
              (<code className="bg-amber-100 px-1 rounded">phone_number_id</code>,{' '}
              <code className="bg-amber-100 px-1 rounded">access_token</code>,{' '}
              <code className="bg-amber-100 px-1 rounded">alert_template_name</code>) and approve the alert template
              in Meta to switch delivery on.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Subscribers</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{alerts.length}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Sent
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{sent}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" /> Queued
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{queued}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Failed</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{failed}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : alerts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
          No alert registrations yet. They&apos;ll appear here as buyers sign up on the{' '}
          <a href="https://yaal-nilam.web.app/alerts" target="_blank" rel="noopener noreferrer" className="text-teal-700 font-semibold underline">
            Alerts page
          </a>
          .
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Contact</th>
                <th className="text-left font-semibold px-4 py-3">Looking for</th>
                <th className="text-left font-semibold px-4 py-3">Area</th>
                <th className="text-left font-semibold px-4 py-3">Beds</th>
                <th className="text-left font-semibold px-4 py-3">Max budget</th>
                <th className="text-left font-semibold px-4 py-3">Matches</th>
                <th className="text-left font-semibold px-4 py-3">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {alerts.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{a.name || '—'}</div>
                    <div className="text-gray-500">{a.whatsapp || '—'}</div>
                    {a.email && <div className="text-gray-400 text-xs">{a.email}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold capitalize">
                      {a.purpose || '—'}
                    </span>{' '}
                    <span className="capitalize text-gray-700">{a.property_type || 'any'}</span>
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-700">{a.area || 'any'}</td>
                  <td className="px-4 py-3 text-gray-700">{Number(a.min_bedrooms || 0) > 0 ? `${a.min_bedrooms}+` : 'Any'}</td>
                  <td className="px-4 py-3 text-gray-700">{fmtPrice(a.max_price)}</td>
                  <td className="px-4 py-3 text-gray-700">{Number(a.match_count || 0)}</td>
                  <td className="px-4 py-3 text-gray-500">{fmtDate(a.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
