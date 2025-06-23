import { database } from '../integration/client';
// Modularized admin indicator update logic
export const recordAdminIndicatorChange = async ({ indicator_id, value, rationale, admin_id }) => {
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
export const updateHistoricalValue = async ({ indicator_id, year, value, rationale, admin_id }) => {
    // Log to admin_inputs
    const { error: logError } = await database.from('admin_inputs').insert({
        indicator_id,
        value,
        input_type: 'historical_value',
        rationale,
        admin_id,
        year
    });
    if (logError)
        return { success: false, error: logError };
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
    }
    else {
        const { error } = await database
            .from('historical_trends')
            .insert({ indicator_id, year, value });
        updateError = error;
    }
    if (updateError)
        return { success: false, error: updateError };
    return { success: true };
};
// Indicators API
export const getIndicators = async () => {
    const { data, error } = await database
        .from('indicators')
        .select('*');
    if (error)
        throw error;
    return data;
};
export const updateIndicatorValue = async (indicator_id, new_value) => {
    const { error } = await database
        .from('indicators')
        .update({ current_value: new_value, updated_at: new Date().toISOString() })
        .eq('indicator_id', indicator_id);
    if (error)
        throw error;
};
export const getIndicatorById = async (indicator_id) => {
    const { data, error } = await database
        .from('indicators')
        .select('*')
        .eq('indicator_id', indicator_id)
        .single();
    if (error)
        throw error;
    return data;
};
// Relationships API
export const getRelationships = async () => {
    const { data, error } = await database
        .from('relationships')
        .select('*');
    if (error)
        throw error;
    return data;
};
export const getChildrenByParentId = async (parent_id) => {
    const { data, error } = await database
        .from('relationships')
        .select('*')
        .eq('parent_id', parent_id);
    if (error)
        throw error;
    return data;
};
export const getParentsByChildId = async (child_id) => {
    const { data, error } = await database
        .from('relationships')
        .select('*')
        .eq('child_id', child_id);
    if (error)
        throw error;
    return data;
};
// Get relationships for propagation
const relationships = await getRelationships();
