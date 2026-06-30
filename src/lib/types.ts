export interface User {
  clerk_user_id: string;
  email: string;
  plan_status: 'free' | 'starter' | 'pro' | 'business';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsageRecord {
  id: string;
  clerk_user_id: string;
  count: number;
  period_month: number;
  period_year: number;
  updated_at: string;
}

export interface FieldContext {
  fieldLabel: string;
  fieldPlaceholder?: string;
  fieldType?: string;
  fieldRequired?: boolean;
  fieldName?: string;
  formTitle?: string;
  pageTitle?: string;
  pageUrl?: string;
  surroundingHtml?: string;
}

export interface ExplanationResponse {
  plain_explanation: string;
  what_to_write: string;
  why_asked: string;
  common_mistakes: string[];
  documents_needed: string[];
  tips: string;
}

export interface SessionResponse {
  userId: string;
  email: string;
  plan: 'free' | 'starter' | 'pro' | 'business';
  usageCount: number;
  usageLimit: number; // forms per month based on plan
}

export interface ErrorResponse {
  error: {
    message: string;
    code: string;
  };
}
