export type UserRole = 'user' | 'admin';

export type BusinessType = 'buyer' | 'supplier' | 'both';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  business_name: string | null;
  business_type: BusinessType;
  phone: string | null;
  country: string;
  role: UserRole;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserWallet {
  id: string;
  user_id: string;
  address: `0x${string}` | string;
  chain_id: number;
  is_primary: boolean;
  label: string | null;
  connected_at: string;
}

