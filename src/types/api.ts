import { database } from '../integration/client';
import type { Indicator, Relationship } from '../types';

// Modularized admin indicator update logic
export const recordAdminIndicatorChange = async ({
  indicator_id,
  value,
  rationale,
  admin_id
}: {
  indicator_id: string;
  value: number;
  rationale?: string;
  admin_id: string;
}): Promise<{ success: boolean; error?: any }> => {
  
  const { error: adminInputError } = await database
    .from('admin_inputs')
    .insert({
      indicator_id,
      value,
      input_type: 'current_value',
      rationale,
      admin_id
    });

  if (adminInputError) {
    return { success: false, error: adminInputError };
  }

  const { error: updateError } = await database
    .from('indicators')
    .update({ current_value: value })
    .eq('indicator_id', indicator_id);

  if (updateError) {
    return { success: false, error: updateError };
  }

  return { success: true };
};

export const updateHistoricalValue = async ({
  indicator_id,
  year,
  value,
  rationale,
  admin_id
}: {
  indicator_id: string;
  year: number;
  value: number;
  rationale?: string;
  admin_id: string;
}): Promise<{ success: boolean; error?: any }> => {
  // Log to admin_inputs
  const { error: logError } = await database.from('admin_inputs').insert({
    indicator_id,
    value,
    input_type: 'historical_value',
    rationale,
    admin_id,
    year
  });

  if (logError) return { success: false, error: logError };

  // Check if historical record exists
  const { data: existing, error: fetchError } = await database
    .from('historical_trends')
    .select('*')
    .eq('indicator_id', indicator_id)
    .eq('year', year)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    return { success: false, error: fetchError };
  }

  let updateError;
  if (existing) {
    const { error } = await database
      .from('historical_trends')
      .update({ value })
      .eq('indicator_id', indicator_id)
      .eq('year', year);
    updateError = error;
  } else {
    const { error } = await database
      .from('historical_trends')
      .insert({ indicator_id, year, value });
    updateError = error;
  }

  if (updateError) return { success: false, error: updateError };

  return { success: true };
};

// Indicators API
export const getIndicators = async (): Promise<Indicator[]> => {
  const { data, error } = await database
    .from('indicators')
    .select('*');
  
  if (error) throw error;
  return data as Indicator[];
};

export const updateIndicatorValue = async (indicator_id: string, new_value: number): Promise<void> => {
  const { error } = await database
    .from('indicators')
    .update({ current_value: new_value, updated_at: new Date().toISOString() })
    .eq('indicator_id', indicator_id);
  
  if (error) throw error;
};

export const getIndicatorById = async (indicator_id: string): Promise<Indicator> => {
  const { data, error } = await database
    .from('indicators')
    .select('*')
    .eq('indicator_id', indicator_id)
    .single();
  
  if (error) throw error;
  return data as Indicator;
};

// Relationships API
export const getRelationships = async (): Promise<Relationship[]> => {
  const { data, error } = await database
    .from('relationships')
    .select('*');
  
  if (error) throw error;
  return data as Relationship[];
};

export const getChildrenByParentId = async (parent_id: string): Promise<Relationship[]> => {
  const { data, error } = await database
    .from('relationships')
    .select('*')
    .eq('parent_id', parent_id);
  
  if (error) throw error;
  return data as Relationship[];
};

export const getParentsByChildId = async (child_id: string): Promise<Relationship[]> => {
  const { data, error } = await database
    .from('relationships')
    .select('*')
    .eq('child_id', child_id);
  
  if (error) throw error;
  return data as Relationship[];
};



  // Get relationships for propagation
  const relationships = await getRelationships();