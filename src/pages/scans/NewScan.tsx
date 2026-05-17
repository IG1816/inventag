import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Package2, Boxes, Radio, Wifi, CheckCircle2, AlertTriangle, MapPin, Loader2 } from 'lucide-react';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/StatusBadge';
import { locations, assets, inventoryItems } from '../../lib/data';
import type { ResultStatus } from '../../types';

interface SimResult {
  rfid_tag_code: string;
  linked_item_name: string;
  linked_item_type: string;
  expected_location: string;
  scanned_location: string;
  result_status: ResultStatus;
  observation: string;
}

const SCAN_TYPES_ASSETS = ['Auditoria de Ativos', 'Verificação de Local', 'Inventário Completo'];
const SCAN_TYPES_INVENTORY = ['Contagem de Estoque', 'Inventário Completo'];

function StepDot({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
      done ? 'bg-emerald-500 border-emerald-500 text-white' :
      active ? 'bg-yellow-600 border-yellow-600 text-white' :
      'bg-white border-slate-300 text-slate-400'
    }`}>
      {done ? <CheckCircle2 className="w-4 h-4" /> : n}
    </div>
  );
}

function generateSimResults(module: string, locationId: string): SimResult[] {
  if (module === 'assets') {
    const locationAssets = assets.filter(a => a.location_id === locationId);
    const results: SimResult[] = locationAssets.map(a => ({
      rfid_tag_code: a.rfid_tag_code,
      linked_item_name: a.asset_name,
      linked_item_type: 'asset',
      expected_location: a.location_name ?? '',
      scanned_location: a.location_name ?? '',
      result_status: 'found_correctly' as ResultStatus,
      observation: '',
    }));
    // Simulate some issues
    if (results.length > 0) {
      results[0].result_status = 'found_correctly';
    }
    if (results.length > 1) {
      results[1].result_status = 'missing';
      results[1].scanned_location = '';
      results[1].observation = 'Item não detectado durante a leitura';
    }
    if (results.length > 2) {
      results[2].result_status = 'wrong_location';
      results[2].scanned_location = 'Escritório Andar 1';
      results[2].observation = 'Item encontrado em localização inesperada';
    }
    // Add unknown tag
    results.push({
      rfid_tag_code: 'MTL-UNK-99',
      linked_item_name: 'Item Desconhecido',
      linked_item_type: 'unknown',
      expected_location: '',
      scanned_location: locations.find(l => l.id === locationId)?.location_name ?? '',
      result_status: 'unknown_tag',
      observation: 'Tag não registrada no sistema',
    });
    return results;
  } else {
    const locationItems = inventoryItems.filter(i => i.location_id === locationId);
    return locationItems.map(i => ({
      rfid_tag_code: i.rfid_tag_code,
      linked_item_name: i.product_name ?? 'Unknown Product',
      linked_item_type: 'product',
      expected_location: i.location_name ?? '',
      scanned_location: i.location_name ?? '',
      result_status: (i.status === 'correct' ? 'found_correctly' : i.status === 'missing' ? 'missing' : i.status === 'extra' ? 'extra' : 'found_correctly') as ResultStatus,
      observation: i.status === 'missing' ? `Esperado ${i.expected_quantity}, encontrado ${i.scanned_quantity}` : i.status === 'extra' ? `${i.scanned_quantity - i.expected_quantity} unidades extras encontradas` : '',
    }));
  }
}

export default function NewScan() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [module, setModule] = useState<'assets' | 'inventory' | ''>('');
  const [scanType, setScanType] = useState('');
  const [locationId, setLocationId] = useState('');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<SimResult[]>([]);
  const [scanComplete, setScanComplete] = useState(false);

  const location = locations.find(l => l.id === locationId);
  const scanTypes = module === 'assets' ? SCAN_TYPES_ASSETS : SCAN_TYPES_INVENTORY;

  const handleSimulate = () => {
    setScanning(true);
    setTimeout(() => {
      const res = generateSimResults(module, locationId);
      setResults(res);
      setScanning(false);
      setScanComplete(true);
    }, 2500);
  };

  const handleSave = () => {
    navigate('/scans');
  };

  const correct = results.filter(r => r.result_status === 'found_correctly').length;
  const missing = results.filter(r => r.result_status === 'missing').length;
  const extra = results.filter(r => r.result_status === 'extra').length;
  const wrong = results.filter(r => r.result_status === 'wrong_location').length;
  const unknown = results.filter(r => r.result_status === 'unknown_tag').length;
  const total = results.length;
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  const resultColors: Record<string, string> = {
    found_correctly: 'border-l-emerald-400 bg-emerald-50/50',
    missing: 'border-l-red-400 bg-red-50/50',
    wrong_location: 'border-l-amber-400 bg-amber-50/50',
    extra: 'border-l-yellow-400 bg-yellow-50/50',
    unknown_tag: 'border-l-slate-400 bg-slate-50/50',
  };

  return (
    <Layout
      title="Nova Leitura RFID"
      subtitle="Inicie uma nova sessão de leitura RFID"
      actions={
        <button onClick={() => navigate('/scans')}
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg">
          <ArrowLeft className="w-4 h-4" /> Cancelar
        </button>
      }
    >
      {/* Steps */}
      <div className="flex items-center gap-2 mb-6">
        {['Selecionar Módulo', 'Tipo de Leitura', 'Localização', 'Leitura'].map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <StepDot n={i + 1} active={step === i + 1} done={step > i + 1} />
              <span className={`text-xs mt-1 whitespace-nowrap ${step === i+1 ? 'text-yellow-600 font-semibold' : step > i+1 ? 'text-emerald-600' : 'text-slate-400'}`}>{label}</span>
            </div>
            {i < 3 && <div className={`w-8 lg:w-16 h-0.5 mx-2 mt-[-12px] ${step > i + 1 ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <div className="max-w-2xl">
        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Selecionar Módulo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { value: 'assets', label: 'Gestão de Ativos Fixos', desc: 'Audite notebooks, computadores, equipamentos e outros ativos fixos usando tags RFID metálicas.', icon: Package2, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                  { value: 'inventory', label: 'Estoque e Inventário', desc: 'Conte e verifique itens de estoque, peças e produtos usando tags RFID adesivas.', icon: Boxes, color: 'text-teal-600', bg: 'bg-teal-50' },
                ].map(({ value, label, desc, icon: Icon, color, bg }) => (
                  <button key={value}
                    onClick={() => { setModule(value as 'assets' | 'inventory'); setScanType(''); }}
                    className={`text-left p-5 rounded-xl border-2 transition-all ${module === value ? 'border-yellow-500 bg-yellow-50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
                    <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <p className="font-semibold text-slate-900 text-sm mb-1">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <button disabled={!module} onClick={() => setStep(2)}
              className="flex items-center gap-2 px-5 py-2.5 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              Próximo <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Selecionar Tipo de Leitura</h3>
              <div className="space-y-2">
                {scanTypes.map(type => (
                  <button key={type} onClick={() => setScanType(type)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${scanType === type ? 'border-yellow-500 bg-yellow-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className="flex items-center gap-3">
                      <Radio className={`w-4 h-4 flex-shrink-0 ${scanType === type ? 'text-yellow-600' : 'text-slate-400'}`} />
                      <span className={`text-sm font-medium ${scanType === type ? 'text-yellow-900' : 'text-slate-700'}`}>{type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(1)}
                className="px-4 py-2.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                Voltar
              </button>
              <button disabled={!scanType} onClick={() => setStep(3)}
                className="flex items-center gap-2 px-5 py-2.5 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Próximo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Selecionar Localização</h3>
              <div className="space-y-2">
                {locations.map(loc => (
                  <button key={loc.id} onClick={() => setLocationId(loc.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${locationId === loc.id ? 'border-yellow-500 bg-yellow-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${locationId === loc.id ? 'bg-yellow-100' : 'bg-slate-100'}`}>
                        <MapPin className={`w-4 h-4 ${locationId === loc.id ? 'text-yellow-600' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${locationId === loc.id ? 'text-yellow-900' : 'text-slate-700'}`}>{loc.location_name}</p>
                        <p className="text-xs text-slate-400">{loc.address} · {loc.asset_count} ativos · {loc.product_count} produtos</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setStep(2)}
                className="px-4 py-2.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                Voltar
              </button>
              <button disabled={!locationId} onClick={() => setStep(4)}
                className="flex items-center gap-2 px-5 py-2.5 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Próximo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Configuração da Leitura</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: 'Módulo', value: module === 'assets' ? 'Ativos Fixos' : 'Estoque' },
                  { label: 'Tipo de Leitura', value: scanType },
                  { label: 'Localização', value: location?.location_name },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-500 mb-1">{label}</p>
                    <p className="text-sm font-semibold text-slate-900">{value}</p>
                  </div>
                ))}
              </div>

              {!scanComplete && !scanning && (
                <div className="border-2 border-dashed border-yellow-200 rounded-xl p-8 text-center bg-yellow-50/50">
                  <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Wifi className="w-7 h-7 text-yellow-600" />
                  </div>
                  <p className="text-base font-semibold text-slate-800 mb-1">Pronto para Leitura</p>
                  <p className="text-sm text-slate-500 mb-5">Clique no botão abaixo para simular a leitura RFID dos itens em <strong>{location?.location_name}</strong></p>
                  <button onClick={handleSimulate}
                    className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white text-sm font-bold rounded-xl hover:bg-yellow-700 transition-colors mx-auto">
                    <Radio className="w-5 h-5" />
                    Simular Leitura RFID
                  </button>
                </div>
              )}

              {scanning && (
                <div className="text-center py-8">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="absolute inset-0 border-4 border-yellow-200 rounded-full animate-ping" />
                    <div className="absolute inset-0 border-4 border-yellow-500 rounded-full animate-pulse" />
                    <Wifi className="w-6 h-6 text-yellow-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mb-1">Leitor RFID Ativo...</p>
                  <p className="text-xs text-slate-500">Lendo tags RFID em {location?.location_name}</p>
                  <div className="flex justify-center gap-1 mt-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            {scanComplete && (
              <>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {[
                    { label: 'Total', value: total, color: 'text-slate-700', bg: 'bg-slate-50' },
                    { label: 'Correto', value: correct, color: 'text-emerald-700', bg: 'bg-emerald-50' },
                    { label: 'Faltante', value: missing, color: 'text-red-700', bg: 'bg-red-50' },
                    { label: 'Local Errado', value: wrong, color: 'text-amber-700', bg: 'bg-amber-50' },
                    { label: 'Extra', value: extra, color: 'text-yellow-700', bg: 'bg-yellow-50' },
                    { label: 'Precisão', value: `${accuracy}%`, color: accuracy >= 80 ? 'text-emerald-700' : 'text-amber-700', bg: accuracy >= 80 ? 'bg-emerald-50' : 'bg-amber-50' },
                  ].map(({ label, value, color, bg }) => (
                    <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                      <p className={`text-xl font-bold ${color}`}>{value}</p>
                      <p className="text-xs text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                    <p className="text-sm font-semibold text-slate-800">Resultados da Leitura</p>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {results.map((r, i) => (
                      <div key={i} className={`flex items-center gap-3 px-4 py-3 border-l-4 ${resultColors[r.result_status]}`}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-slate-900 truncate">{r.linked_item_name}</span>
                            <span className="text-xs font-mono text-slate-400">{r.rfid_tag_code}</span>
                          </div>
                          {r.observation && <p className="text-xs text-slate-500 mt-0.5">{r.observation}</p>}
                          {r.scanned_location && r.scanned_location !== r.expected_location && (
                            <p className="text-xs text-amber-600 mt-0.5">Encontrado em: {r.scanned_location}</p>
                          )}
                        </div>
                        <StatusBadge status={r.result_status} size="sm" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={handleSave}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors">
                    <CheckCircle2 className="w-4 h-4" /> Salvar Resultados
                  </button>
                  <button onClick={() => navigate('/divergences')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors">
                    <AlertTriangle className="w-4 h-4" /> Gerar Divergências
                  </button>
                </div>
              </>
            )}

            {!scanComplete && (
              <button onClick={() => setStep(3)}
                className="px-4 py-2.5 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                Voltar
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
