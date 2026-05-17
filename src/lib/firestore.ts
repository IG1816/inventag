// Database operations using Supabase
import { supabase } from './supabase';
import type { Asset, Product, Location, UserProfile, Divergence, RFIDScan, MaintenanceRecord } from '../types';

// ─── Locations ────────────────────────────────────────────────────────────────

export async function getLocations(companyId: string): Promise<Location[]> {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('company_id', companyId)
    .order('location_name');
  if (error) throw error;
  return (data ?? []) as Location[];
}

export async function createLocation(data: Omit<Location, 'id' | 'created_at'>): Promise<string> {
  const { data: row, error } = await supabase
    .from('locations')
    .insert({ ...data, created_at: new Date().toISOString() })
    .select('id')
    .single();
  if (error) throw error;
  return row.id as string;
}

export async function updateLocation(id: string, data: Partial<Location>): Promise<void> {
  const { error } = await supabase.from('locations').update(data).eq('id', id);
  if (error) throw error;
}

export async function deleteLocation(id: string): Promise<void> {
  const { error } = await supabase.from('locations').delete().eq('id', id);
  if (error) throw error;
}

// ─── Assets ──────────────────────────────────────────────────────────────────

export async function getAssets(companyId: string): Promise<Asset[]> {
  const { data, error } = await supabase
    .from('assets')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Asset[];
}

export async function getAsset(id: string): Promise<Asset | null> {
  const { data } = await supabase.from('assets').select('*').eq('id', id).maybeSingle();
  return data as Asset | null;
}

export async function createAsset(data: Omit<Asset, 'id' | 'created_at'>): Promise<string> {
  const { data: row, error } = await supabase
    .from('assets')
    .insert({ ...data, created_at: new Date().toISOString() })
    .select('id')
    .single();
  if (error) throw error;
  return row.id as string;
}

export async function updateAsset(id: string, data: Partial<Asset>): Promise<void> {
  const { error } = await supabase.from('assets').update(data).eq('id', id);
  if (error) throw error;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(companyId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('company_id', companyId)
    .order('product_name');
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function createProduct(data: Omit<Product, 'id' | 'created_at'>): Promise<string> {
  const { data: row, error } = await supabase
    .from('products')
    .insert({ ...data, created_at: new Date().toISOString() })
    .select('id')
    .single();
  if (error) throw error;
  return row.id as string;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  const { error } = await supabase.from('products').update(data).eq('id', id);
  if (error) throw error;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data } = await supabase.from('user_profiles').select('*').eq('id', userId).maybeSingle();
  return data as UserProfile | null;
}

export async function setUserProfile(userId: string, data: Omit<UserProfile, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase.from('user_profiles').upsert({
    id: userId,
    ...data,
    created_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function getCompanyUsers(companyId: string): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('company_id', companyId);
  if (error) throw error;
  return (data ?? []) as UserProfile[];
}

// ─── Maintenance Records ──────────────────────────────────────────────────────

export async function getMaintenanceRecords(companyId: string): Promise<MaintenanceRecord[]> {
  const { data, error } = await supabase
    .from('maintenance')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as MaintenanceRecord[];
}

export async function getAssetMaintenance(assetId: string): Promise<MaintenanceRecord[]> {
  const { data, error } = await supabase
    .from('maintenance')
    .select('*')
    .eq('asset_id', assetId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as MaintenanceRecord[];
}

export async function createMaintenanceRecord(data: Omit<MaintenanceRecord, 'id' | 'created_at'>): Promise<string> {
  const { data: row, error } = await supabase
    .from('maintenance')
    .insert({ ...data, created_at: new Date().toISOString() })
    .select('id')
    .single();
  if (error) throw error;
  return row.id as string;
}

export async function updateMaintenanceRecord(id: string, data: Partial<MaintenanceRecord>): Promise<void> {
  const { error } = await supabase.from('maintenance').update(data).eq('id', id);
  if (error) throw error;
}

// ─── Divergences ──────────────────────────────────────────────────────────────

export async function getDivergences(companyId: string): Promise<Divergence[]> {
  const { data, error } = await supabase
    .from('divergences')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Divergence[];
}

export async function updateDivergence(id: string, data: Partial<Divergence>): Promise<void> {
  const { error } = await supabase.from('divergences').update(data).eq('id', id);
  if (error) throw error;
}

// ─── Scans ────────────────────────────────────────────────────────────────────

export async function getScans(companyId: string): Promise<RFIDScan[]> {
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .eq('company_id', companyId)
    .order('scan_date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as RFIDScan[];
}

export async function createScan(data: Omit<RFIDScan, 'id' | 'created_at'>): Promise<string> {
  const { data: row, error } = await supabase
    .from('scans')
    .insert({ ...data, created_at: new Date().toISOString() })
    .select('id')
    .single();
  if (error) throw error;
  return row.id as string;
}
