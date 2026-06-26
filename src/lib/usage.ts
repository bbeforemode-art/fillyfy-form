import { supabase } from './supabase';
import type { UsageRecord } from './types';

/**
 * Plan limits: number of forms (form sessions) allowed per month.
 * A "form" = one form session. Clicking any field on a form counts as 1 form for the month.
 * Clicking multiple fields within the same form does NOT count as additional usage.
 */
export const PLAN_LIMITS: Record<string, number> = {
  free: 1,
  starter: 15,
  pro: 50,
  business: 300,
};

/**
 * Gets or creates a usage record for the current month.
 */
export async function getOrCreateUsage(userId: string): Promise<UsageRecord> {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const year = now.getFullYear();

  // Try to get existing record
  const { data: existing } = await supabase
    .from('usage')
    .select('*')
    .eq('clerk_user_id', userId)
    .eq('period_month', month)
    .eq('period_year', year)
    .single();

  if (existing) return existing as UsageRecord;

  // Create new record
  const { data: created, error } = await supabase
    .from('usage')
    .insert({
      clerk_user_id: userId,
      count: 0,
      period_month: month,
      period_year: year,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create usage record: ${error.message}`);
  return created as UsageRecord;
}

/**
 * Increments the usage count (forms used) for the current month.
 */
export async function incrementUsage(userId: string): Promise<void> {
  const record = await getOrCreateUsage(userId);

  const { error } = await supabase
    .from('usage')
    .update({ count: record.count + 1 })
    .eq('id', record.id);

  if (error) throw new Error(`Failed to increment usage: ${error.message}`);
}

/**
 * Checks if the user can use a form (not at their plan limit).
 * Each plan has a specific monthly form limit defined in PLAN_LIMITS.
 */
export async function canUseExplanation(userId: string, plan: string): Promise<boolean> {
  const limit = PLAN_LIMITS[plan];
  if (limit === undefined) return false;

  const record = await getOrCreateUsage(userId);
  return record.count < limit;
}

/**
 * Resets usage count to 0 for all free-tier users.
 * Returns the number of records processed and failed.
 */
export async function resetFreeUsers(): Promise<{ processed: number; failed: number }> {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // Get all free-tier users
  const { data: freeUsers, error: fetchError } = await supabase
    .from('users')
    .select('clerk_user_id')
    .eq('plan_status', 'free');

  if (fetchError) throw new Error(`Failed to fetch free users: ${fetchError.message}`);
  if (!freeUsers || freeUsers.length === 0) return { processed: 0, failed: 0 };

  const userIds = freeUsers.map(u => u.clerk_user_id);

  // Reset usage for free users in current period
  const { error: updateError, count } = await supabase
    .from('usage')
    .update({ count: 0 })
    .in('clerk_user_id', userIds)
    .eq('period_month', month)
    .eq('period_year', year);

  if (updateError) {
    console.error(`Reset usage error: ${updateError.message}`);
    return { processed: 0, failed: userIds.length };
  }

  return { processed: count || 0, failed: 0 };
}
