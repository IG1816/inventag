import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertTriangle, Radio, Package2, ArrowRight } from 'lucide-react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { divergences } from '../../lib/data';

const typeLabels: Record<string, string> = {
  missing_asset: 'Missing Asset', wrong_location: 'Wrong Location',
  missing_stock: 'Missing Stock', extra_stock: 'Extra Stock',
  unknown_tag: 'Unknown Tag', erp_mismatch: 'ERP Quantity Mismatch'
};

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900 text-right ml-4">{value || '—'}</span>
    </div>
  );
}

export default function DivergenceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [showNotesForm, setShowNotesForm] = useState(false);
  const divergence = divergences.find(d => d.id === id);

  if (!divergence) {
    return (
      <Layout title="Not Found">
        <div className="text-center py-20">
          <p className="text-slate-500">Divergence not found.</p>
          <button onClick={() => navigate('/divergences')} className="mt-4 text-yellow-600 hover:underline text-sm">Back</button>
        </div>
      </Layout>
    );
  }

  const priorityColors: Record<string, string> = {
    critical: 'border-red-400 bg-red-50',
    high: 'border-yellow-400 bg-yellow-50',
    medium: 'border-amber-400 bg-amber-50',
    low: 'border-slate-300 bg-slate-50',
  };

  return (
    <Layout
      title={typeLabels[divergence.divergence_type]}
      subtitle={`${divergence.module === 'assets' ? 'Fixed Assets' : 'Inventory'} · Created ${new Date(divergence.created_at).toLocaleDateString()}`}
      actions={
        <div className="flex gap-2">
          <button onClick={() => navigate('/divergences')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {divergence.status !== 'resolved' && (
            <button
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
              <CheckCircle2 className="w-4 h-4" /> Mark as Resolved
            </button>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Overview Card */}
          <div className={`border-l-4 rounded-xl p-5 border ${priorityColors[divergence.priority]}`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <AlertTriangle className={`w-6 h-6 ${
                  divergence.priority === 'critical' ? 'text-red-600' :
                  divergence.priority === 'high' ? 'text-yellow-600' :
                  divergence.priority === 'medium' ? 'text-amber-600' : 'text-slate-500'
                }`} />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  <StatusBadge status={divergence.priority} />
                  <StatusBadge status={divergence.status} />
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${divergence.module === 'assets' ? 'bg-yellow-100 text-yellow-700' : 'bg-teal-100 text-teal-700'}`}>
                    {divergence.module === 'assets' ? 'Fixed Assets' : 'Inventory'}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900">{typeLabels[divergence.divergence_type]}</h2>
                <p className="text-sm text-slate-600 mt-1">
                  {divergence.related_asset_name || divergence.related_product_name || 'Unknown Item'}
                </p>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Expected vs Found</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Expected</p>
                <p className="text-base font-bold text-slate-900">{divergence.expected_value}</p>
                <p className="text-xs text-slate-500 mt-1">Source: ERP / System record</p>
              </div>
              <div className={`rounded-xl p-4 ${divergence.found_value === 'Not Found' ? 'bg-red-50' : 'bg-amber-50'}`}>
                <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Found (RFID Scan)</p>
                <p className={`text-base font-bold ${divergence.found_value === 'Not Found' ? 'text-red-700' : 'text-amber-700'}`}>
                  {divergence.found_value}
                </p>
                <p className="text-xs text-slate-500 mt-1">Source: RFID physical scan</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Divergence Details</h3>
            <InfoRow label="Divergence Type" value={typeLabels[divergence.divergence_type]} />
            <InfoRow label="RFID Tag Code" value={divergence.rfid_tag_code} />
            <InfoRow label="Location" value={divergence.location_name} />
            <InfoRow label="Related Asset / Product" value={divergence.related_asset_name || divergence.related_product_name} />
            <InfoRow label="Responsible User" value={divergence.responsible_user_name} />
            <InfoRow label="Created At" value={new Date(divergence.created_at).toLocaleString()} />
            {divergence.resolved_at && (
              <InfoRow label="Resolved At" value={new Date(divergence.resolved_at).toLocaleString()} />
            )}
          </div>

          {/* Resolution Notes */}
          {divergence.resolution_notes && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-emerald-800 mb-2">Resolution Notes</p>
              <p className="text-sm text-emerald-900">{divergence.resolution_notes}</p>
            </div>
          )}

          {/* Add notes form */}
          {showNotesForm && (
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Add Resolution Notes</h3>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
                placeholder="Describe the resolution steps taken..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none" />
              <div className="flex gap-2 mt-3">
                <button className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors">
                  Save Notes
                </button>
                <button onClick={() => setShowNotesForm(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Related Scan */}
          {divergence.scan_id && (
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Related Scan</p>
              <button onClick={() => navigate(`/scans/${divergence.scan_id}`)}
                className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-slate-700">View Scan Details</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}

          {/* Related Item */}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Related Item</p>
            <button
              onClick={() => divergence.related_asset_id
                ? navigate(`/assets/${divergence.related_asset_id}`)
                : navigate(`/inventory/${divergence.related_product_id}`)
              }
              className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-2">
                <Package2 className="w-4 h-4 text-yellow-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-700">
                    {divergence.related_asset_name || divergence.related_product_name || 'Unknown'}
                  </p>
                  <p className="text-xs text-slate-400">{divergence.module === 'assets' ? 'Fixed Asset' : 'Inventory Product'}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Actions</p>
            {[
              { label: 'Change Status to In Review', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100', show: divergence.status === 'open' },
              { label: 'Add Resolution Notes', color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100', onClick: () => setShowNotesForm(true) },
              { label: 'Assign Responsible User', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
              { label: 'Mark as Resolved', color: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100', show: divergence.status !== 'resolved' },
              { label: 'Ignore Divergence', color: 'bg-slate-100 text-slate-500 hover:bg-slate-200' },
            ].filter(a => a.show !== false).map(({ label, color, onClick }) => (
              <button key={label} onClick={onClick}
                className={`w-full text-sm font-medium py-2 px-3 rounded-lg transition-colors text-left ${color}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
