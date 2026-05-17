import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Tag } from 'lucide-react';
import Layout from '../../components/Layout';
import { locations as sampleLocations } from '../../lib/data';
import { createAsset, getLocations } from '../../lib/firestore';
import { useAuth } from '../../lib/auth-context';
import type { Location } from '../../types';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white";

export default function NewAsset() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locations, setLocations] = useState<Location[]>(sampleLocations);

  useEffect(() => {
    if (userProfile?.company_id) {
      getLocations(userProfile.company_id)
        .then(data => { if (data.length > 0) setLocations(data); })
        .catch(() => {});
    }
  }, [userProfile]);

  const [form, setForm] = useState({
    asset_name: '', category: 'notebook', brand: '', model: '',
    serial_number: '', rfid_tag_code: '', rfid_tag_type: 'metallic',
    location_id: 'loc-001', department: '', assigned_employee: '',
    purchase_date: '', purchase_value: '', notes: '',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const loc = locations.find(l => l.id === form.location_id);
      await createAsset({
        company_id: userProfile?.company_id ?? 'comp-001',
        asset_name: form.asset_name,
        category: form.category as import('../../types').AssetCategory,
        brand: form.brand,
        model: form.model,
        serial_number: form.serial_number,
        rfid_tag_code: form.rfid_tag_code,
        rfid_tag_type: form.rfid_tag_type as import('../../types').TagType,
        location_id: form.location_id,
        location_name: loc?.location_name,
        department: form.department,
        assigned_employee: form.assigned_employee,
        purchase_date: form.purchase_date,
        purchase_value: Number(form.purchase_value) || 0,
        current_status: 'active',
        last_scan_date: '',
        notes: form.notes,
      });
      setSaved(true);
      setTimeout(() => navigate('/assets'), 1500);
    } catch {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <Layout title="Ativo Registrado">
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Ativo Registrado!</h2>
          <p className="text-slate-500 text-sm">O ativo e sua tag RFID foram salvos com sucesso.</p>
          <p className="text-xs text-slate-400 mt-2">Redirecionando para a lista de ativos...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Registrar Novo Ativo"
      subtitle="Adicione um novo ativo fixo ao sistema de gestão RFID"
      actions={
        <button onClick={() => navigate('/assets')}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Informações do Ativo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nome do Ativo" required>
                <input value={form.asset_name} onChange={set('asset_name')} required
                  placeholder="ex: Notebook Dell XPS 15" className={inputCls} />
              </Field>
              <Field label="Categoria" required>
                <select value={form.category} onChange={set('category')} className={inputCls}>
                  {['notebook','desktop','monitor','tablet','smartphone','tool','machine','equipment','network','other'].map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </Field>
              <Field label="Marca">
                <input value={form.brand} onChange={set('brand')} placeholder="ex: Dell" className={inputCls} />
              </Field>
              <Field label="Modelo">
                <input value={form.model} onChange={set('model')} placeholder="ex: XPS 15 9520" className={inputCls} />
              </Field>
              <Field label="Número de Série">
                <input value={form.serial_number} onChange={set('serial_number')} placeholder="ex: SN-DELL-001" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* RFID Tag */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Tag RFID</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Código da Tag RFID" required>
                <input value={form.rfid_tag_code} onChange={set('rfid_tag_code')} required
                  placeholder="ex: MTL-A0001" className={`${inputCls} font-mono`} />
              </Field>
              <Field label="Tipo de Tag">
                <select value={form.rfid_tag_type} onChange={set('rfid_tag_type')} className={inputCls}>
                  <option value="metallic">Tag RFID Metálica</option>
                  <option value="adhesive">Tag RFID Adesiva</option>
                </select>
              </Field>
            </div>
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Dica:</strong> Para ativos fixos, recomendamos Tags RFID Metálicas. São duráveis e podem ser fixadas em superfícies metálicas.
              </p>
            </div>
          </div>

          {/* Location & Assignment */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Localização e Atribuição</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Localização" required>
                <select value={form.location_id} onChange={set('location_id')} className={inputCls}>
                  {locations.map(l => (
                    <option key={l.id} value={l.id}>{l.location_name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Departamento">
                <input value={form.department} onChange={set('department')} placeholder="ex: TI" className={inputCls} />
              </Field>
              <Field label="Funcionário Responsável">
                <input value={form.assigned_employee} onChange={set('assigned_employee')} placeholder="ex: Carlos Silva" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* Purchase Info */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Informações de Compra</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Data de Compra">
                <input type="date" value={form.purchase_date} onChange={set('purchase_date')} className={inputCls} />
              </Field>
              <Field label="Valor de Compra (R$)">
                <input type="number" step="0.01" value={form.purchase_value} onChange={set('purchase_value')}
                  placeholder="0,00" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <Field label="Observações">
              <textarea value={form.notes} onChange={set('notes')} rows={3}
                placeholder="Observações adicionais sobre este ativo..."
                className={`${inputCls} resize-none`} />
            </Field>
          </div>

          {/* Submit */}
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-yellow-600 text-white text-sm font-semibold rounded-lg hover:bg-yellow-700 disabled:opacity-60 transition-colors">
              {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Salvando...</> : <><Save className="w-4 h-4" /> Registrar Ativo</>}
            </button>
            <button type="button" onClick={() => navigate('/assets')}
              className="px-6 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
