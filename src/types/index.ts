export type UserRole = 'admin' | 'member' | 'author';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  teamId?: string;
}

export interface Team {
  id: string;
  name: string;
  adminId: string;
  createdAt: string;
  memberCount: number;
}

export interface Member {
  id: string;
  teamId: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  joinDate: string;
  isActive: boolean;
  assignedSeats: string[];
}

export interface Plugin {
  id: string;
  authorId: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  coverImage: string;
  features: string[];
  monthlyPrice: number;
  yearlyPrice: number;
  compatibleVersions: string[];
  createdAt: string;
  rating: number;
  reviewCount: number;
  installCount: number;
  authorName: string;
}

export interface Version {
  id: string;
  pluginId: string;
  pluginName: string;
  version: string;
  releaseNotes: string;
  compatibleWith: string[];
  releaseDate: string;
  isCurrent: boolean;
  changes: {
    type: 'feature' | 'fix' | 'improvement' | 'breaking';
    description: string;
  }[];
}

export interface Subscription {
  id: string;
  teamId: string;
  pluginId: string;
  pluginName: string;
  pluginIcon: string;
  plan: 'monthly' | 'yearly';
  seatCount: number;
  usedSeats: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled' | 'expired';
  nextBillingDate: string;
  amount: number;
}

export interface Seat {
  id: string;
  subscriptionId: string;
  pluginId: string;
  pluginName: string;
  memberId: string | null;
  memberName?: string;
  memberEmail?: string;
  memberAvatar?: string;
  assignedAt: string | null;
  expiresAt: string | null;
  status: 'available' | 'assigned' | 'expired';
}

export interface Author {
  id: string;
  name: string;
  email: string;
  avatar: string;
  company: string;
  website?: string;
  plugins: string[];
  totalSubscribers: number;
  totalRevenue: number;
}

export interface PaymentMethod {
  id: string;
  teamId: string;
  cardBrand: 'visa' | 'mastercard' | 'amex' | 'discover';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  cardholderName: string;
}

export interface Invoice {
  id: string;
  teamId: string;
  subscriptionId: string;
  pluginName: string;
  amount: number;
  currency: string;
  date: string;
  status: 'paid' | 'pending' | 'failed';
  pdfUrl: string;
}

export interface Activity {
  id: string;
  teamId: string;
  type: 'seat_assigned' | 'seat_revoked' | 'version_released' | 'subscription_purchased' | 'member_joined' | 'member_left';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AuthorStats {
  totalSubscribers: number;
  activeUsers: number;
  totalRevenue: number;
  versionDistribution: { version: string; count: number }[];
  monthlySubscribers: { month: string; count: number }[];
  pluginPerformance: { pluginName: string; subscribers: number; revenue: number }[];
}
