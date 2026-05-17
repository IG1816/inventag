export type PlanType = 'starter' | 'professional' | 'enterprise';
export type UserRole = 'admin' | 'manager' | 'operator' | 'viewer';
export type AssetStatus = 'active' | 'missing' | 'maintenance' | 'retired' | 'transferred';
export type AssetCategory = 'notebook' | 'desktop' | 'monitor' | 'tablet' | 'smartphone' | 'tool' | 'machine' | 'equipment' | 'network' | 'other';
export type InventoryStatus = 'correct' | 'missing' | 'extra' | 'not_scanned' | 'pending_review';
export type ScanType = 'asset_audit' | 'stock_count' | 'location_check' | 'full_inventory';
export type ScanModule = 'assets' | 'inventory';
export type ScanStatus = 'in_progress' | 'completed' | 'pending_review' | 'approved';
export type ResultStatus = 'found_correctly' | 'missing' | 'wrong_location' | 'extra' | 'unknown_tag';
export type DivergenceType = 'missing_asset' | 'wrong_location' | 'missing_stock' | 'extra_stock' | 'unknown_tag' | 'erp_mismatch';
export type DivergenceStatus = 'open' | 'in_review' | 'resolved' | 'ignored';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type TagType = 'metallic' | 'adhesive';
export type ApiStatus = 'connected' | 'disconnected' | 'error' | 'testing';
export type LocationType = 'headquarters' | 'warehouse' | 'store' | 'office' | 'it_room' | 'production' | 'server_room' | 'other';

export interface Company {
  id: string; company_name: string; tax_id: string; industry: string;
  contact_name: string; contact_email: string; contact_phone: string;
  plan_type: PlanType; status: string; created_at: string;
}

export interface UserProfile {
  id: string; full_name: string; email: string; role: UserRole;
  company_id: string; department: string; status: string; created_at: string;
}

export interface Location {
  id: string; company_id: string; location_name: string; type: LocationType;
  address: string; responsible_person: string; status: string; created_at: string;
  asset_count?: number; product_count?: number; open_divergences?: number;
}

export interface Asset {
  id: string; company_id: string; asset_name: string; category: AssetCategory;
  brand: string; model: string; serial_number: string; rfid_tag_code: string;
  rfid_tag_type: TagType; location_id: string; location_name?: string;
  department: string; assigned_employee: string; purchase_date: string;
  purchase_value: number; current_status: AssetStatus; last_scan_date: string;
  notes: string; created_at: string;
}

export interface Product {
  id: string; company_id: string; sku: string; product_name: string;
  category: string; description: string; unit_cost: number; sale_price: number;
  erp_product_code: string; minimum_stock: number; status: string; created_at: string;
}

export interface InventoryItem {
  id: string; company_id: string; product_id: string; product_name?: string;
  sku?: string; rfid_tag_code: string; rfid_tag_type: TagType;
  location_id: string; location_name?: string; expected_quantity: number;
  scanned_quantity: number; difference?: number; last_scan_date: string;
  status: InventoryStatus; created_at: string;
}

export interface RFIDScan {
  id: string; company_id: string; scan_type: ScanType; module: ScanModule;
  location_id: string; location_name?: string; operator_user_id: string;
  operator_name?: string; scan_date: string; total_expected_items: number;
  total_scanned_items: number; missing_items: number; extra_items: number;
  status: ScanStatus; notes: string; created_at: string;
}

export interface ScanResult {
  id: string; scan_id: string; rfid_tag_code: string; linked_item_name: string;
  linked_item_type: string; expected_location: string; scanned_location: string;
  result_status: ResultStatus; observation: string; created_at: string;
}

export interface Divergence {
  id: string; company_id: string; module: ScanModule;
  related_asset_id?: string; related_asset_name?: string;
  related_product_id?: string; related_product_name?: string;
  rfid_tag_code: string; divergence_type: DivergenceType;
  expected_value: string; found_value: string; location_id: string;
  location_name?: string; scan_id?: string; priority: Priority;
  status: DivergenceStatus; responsible_user_id?: string;
  responsible_user_name?: string; created_at: string;
  resolved_at?: string; resolution_notes?: string;
}

export interface ERPIntegration {
  id: string; company_id: string; erp_name: string; api_base_url: string;
  auth_type: string; api_status: ApiStatus; last_sync_date: string;
  sync_frequency: string; notes: string; created_at: string;
}

export interface Report {
  id: string; company_id: string; report_name: string; report_type: string;
  module: string; period: string; generated_by: string; generated_by_name?: string;
  generated_at: string; status: string; created_at: string;
}

// ─── Maintenance ──────────────────────────────────────────────────────────────

export type MaintenanceType =
  | 'corrective'       // Corretiva: conserta falha já ocorrida
  | 'preventive'       // Preventiva: agendada periodicamente
  | 'predictive'       // Preditiva: baseada em monitoramento/condição
  | 'calibration'      // Calibração: ajuste de precisão
  | 'inspection'       // Inspeção: verificação sem intervenção
  | 'upgrade';         // Atualização: melhoria/substituição de componente

export type MaintenanceStatus =
  | 'scheduled'        // Agendada
  | 'in_progress'      // Em andamento
  | 'completed'        // Concluída
  | 'cancelled'        // Cancelada
  | 'pending_parts';   // Aguardando peças

export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical';

export interface MaintenanceRecord {
  id: string;
  company_id: string;
  asset_id: string;
  asset_name?: string;
  rfid_tag_code?: string;
  maintenance_type: MaintenanceType;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  title: string;
  description: string;
  scheduled_date?: string;
  started_at?: string;
  completed_at?: string;
  estimated_cost?: number;
  actual_cost?: number;
  service_provider?: string;
  technician_name?: string;
  work_order_number?: string;
  parts_replaced?: string;
  resolution_notes?: string;
  next_maintenance_date?: string;
  created_by?: string;
  created_at: string;
}
