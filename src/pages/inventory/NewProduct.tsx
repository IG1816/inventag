import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Boxes } from 'lucide-react';
import Layout from '../../components/Layout';
import { locations as sampleLocations } from '../../lib/data';
import { createProduct, getLocations } from '../../lib/firestore';
import { useAuth } from '../../lib/auth-context';
import type { Location } from '../../types';

const inputCls = "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white";

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

export default function NewProduct() {
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
    sku: '', product_name: '', category: 'Consumables', description: '',
    unit_cost: '', sale_price: '', erp_product_code: '', minimum_stock: '',
    location_id: 'loc-005', rfid_tag_type: 'adhesive', notes: '',
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createProduct({
        company_id: userProfile?.company_id ?? 'comp-001',
        sku: form.sku,
        product_name: form.product_name,
        category: form.category,
        description: form.description,
        unit_cost: Number(form.unit_cost) || 0,
        sale_price: Number(form.sale_price) || 0,
        erp_product_code: form.erp_product_code,
        minimum_stock: Number(form.minimum_stock) || 0,
        status: 'active',
      });
      setSaved(true);
      setTimeout(() => navigate('/inventory'), 1500);
    } catch {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <Layout title="Produto Registrado">
        <div className="max-w-md mx-auto text-center py-20">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Boxes className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Produto Registrado!</h2>
          <p className="text-slate-500 text-sm">O produto foi salvo com sucesso.</p>
          <p className="text-xs text-slate-400 mt-2">Redirecionando...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title="Registrar Novo Produto"
      subtitle="Adicione um novo SKU ao sistema de gestão de estoque"
      actions={
        <button onClick={() => navigate('/inventory')}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Informações do Produto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="SKU" required>
              <input value={form.sku} onChange={set('sku')} required placeholder="ex: SKU-0001" className={`${inputCls} font-mono`} />
            </Field>
            <Field label="Categoria" required>
              <select value={form.category} onChange={set('category')} className={inputCls}>
                {['Consumíveis', 'Material de Escritório', 'Acessórios', 'Infraestrutura', 'Cabos', 'Armazenamento', 'Componentes', 'Outros'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Nome do Produto" required>
              <input value={form.product_name} onChange={set('product_name')} required placeholder="ex: Toner HP LaserJet 26A" className={inputCls} />
            </Field>
            <Field label="Código ERP do Produto">
              <input value={form.erp_product_code} onChange={set('erp_product_code')} placeholder="ex: ERP-TON-001" className={`${inputCls} font-mono`} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Descrição">
              <textarea value={form.description} onChange={set('description')} rows={2}
                placeholder="Breve descrição do produto..." className={`${inputCls} resize-none`} />
            </Field>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Preços e Estoque</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Custo Unitário (R$)">
              <input type="number" step="0.01" value={form.unit_cost} onChange={set('unit_cost')} placeholder="0,00" className={inputCls} />
            </Field>
            <Field label="Preço de Venda (R$)">
              <input type="number" step="0.01" value={form.sale_price} onChange={set('sale_price')} placeholder="0,00" className={inputCls} />
            </Field>
            <Field label="Estoque Mínimo">
              <input type="number" value={form.minimum_stock} onChange={set('minimum_stock')} placeholder="0" className={inputCls} />
            </Field>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Localização e RFID</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Localização de Armazenamento">
              <select value={form.location_id} onChange={set('location_id')} className={inputCls}>
                {locations.map(l => <option key={l.id} value={l.id}>{l.location_name}</option>)}
              </select>
            </Field>
            <Field label="Tipo de Tag RFID">
              <select value={form.rfid_tag_type} onChange={set('rfid_tag_type')} className={inputCls}>
                <option value="adhesive">Tag RFID Adesiva</option>
                <option value="metallic">Tag RFID Metálica</option>
              </select>
            </Field>
          </div>
          <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
            <p className="text-xs text-teal-800">
              <strong>Dica:</strong> Para itens de estoque, Tags RFID Adesivas são recomendadas. Podem ser aplicadas diretamente na embalagem do produto.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-yellow-600 text-white text-sm font-semibold rounded-lg hover:bg-yellow-700 disabled:opacity-60 transition-colors">
            {saving ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Salvando...</> : <><Save className="w-4 h-4" /> Registrar Produto</>}
          </button>
          <button type="button" onClick={() => navigate('/inventory')}
            className="px-6 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </Layout>
  );
}
