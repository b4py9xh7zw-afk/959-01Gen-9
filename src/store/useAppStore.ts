import { create } from 'zustand';
import type { User, Team, Member, Plugin, Version, Subscription, Seat, PaymentMethod, Invoice, Activity, Author, AuthorStats } from '../types';
import {
  mockUser,
  mockAuthor,
  mockTeam,
  mockMembers,
  mockPlugins,
  mockVersions,
  mockSubscriptions,
  mockSeats,
  mockPaymentMethods,
  mockInvoices,
  mockActivities,
  mockAuthorProfile,
  mockAuthorStats,
} from '../data/mockData';

type AppRole = 'admin' | 'member' | 'author';

const defaultMember = mockMembers.find(member => member.role === 'member' && member.isActive) ?? mockMembers[0];

const createUserFromMember = (member: Member): User => ({
  id: member.id,
  name: member.name,
  email: member.email,
  avatar: member.avatar,
  role: member.role,
  teamId: member.teamId,
});

const getLoginUser = (role: AppRole): User => {
  if (role === 'author') {
    return mockAuthor;
  }

  if (role === 'member') {
    return createUserFromMember(defaultMember);
  }

  return mockUser;
};

interface AppState {
  currentUser: User | null;
  currentRole: AppRole;
  team: Team;
  members: Member[];
  plugins: Plugin[];
  versions: Version[];
  subscriptions: Subscription[];
  seats: Seat[];
  paymentMethods: PaymentMethod[];
  invoices: Invoice[];
  activities: Activity[];
  authorProfile: Author;
  authorStats: AuthorStats;
  isModalOpen: boolean;
  modalType: string | null;
  modalData: unknown;
  
  login: (role: AppRole) => void;
  logout: () => void;
  openModal: (type: string, data?: unknown) => void;
  closeModal: () => void;
  
  isSubscribed: (pluginId: string) => boolean;
  assignSeat: (seatId: string, memberId: string) => void;
  revokeSeat: (seatId: string) => void;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'teamId'>) => void;
  removePaymentMethod: (methodId: string) => void;
  setDefaultPayment: (methodId: string) => void;
  purchaseSubscription: (pluginId: string, plan: 'monthly' | 'yearly', seatCount: number) => void;
  cancelSubscription: (subscriptionId: string) => void;
  inviteMember: (email: string, name: string) => void;
  removeMember: (memberId: string) => void;
  publishVersion: (version: Omit<Version, 'id' | 'pluginName' | 'isCurrent' | 'releaseDate'>) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  currentRole: 'admin',
  team: mockTeam,
  members: mockMembers,
  plugins: mockPlugins,
  versions: mockVersions,
  subscriptions: mockSubscriptions,
  seats: mockSeats,
  paymentMethods: mockPaymentMethods,
  invoices: mockInvoices,
  activities: mockActivities,
  authorProfile: mockAuthorProfile,
  authorStats: mockAuthorStats,
  isModalOpen: false,
  modalType: null,
  modalData: null,

  login: (role) => {
    set({ currentRole: role, currentUser: getLoginUser(role) });
  },

  logout: () => {
    set({ currentUser: null, currentRole: 'admin' });
  },

  isSubscribed: (pluginId) => {
    return get().subscriptions.some(
      sub => sub.pluginId === pluginId && sub.status === 'active'
    );
  },

  openModal: (type, data) => {
    set({ isModalOpen: true, modalType: type, modalData: data });
  },

  closeModal: () => {
    set({ isModalOpen: false, modalType: null, modalData: null });
  },

  assignSeat: (seatId, memberId) => {
    if (get().currentRole !== 'admin') return;

    const { seats, members } = get();
    const seat = seats.find(s => s.id === seatId);
    const member = members.find(m => m.id === memberId);
    
    if (!seat || !member) return;

    const updatedSeats = seats.map(s => {
      if (s.id === seatId) {
        return {
          ...s,
          memberId,
          memberName: member.name,
          memberEmail: member.email,
          memberAvatar: member.avatar,
          assignedAt: new Date().toISOString(),
          expiresAt: seat.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'assigned' as const,
        };
      }
      return s;
    });

    const updatedMembers = members.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          assignedSeats: [...m.assignedSeats, seatId],
        };
      }
      return m;
    });

    const updatedSubscriptions = get().subscriptions.map(sub => {
      const subSeats = updatedSeats.filter(s => s.subscriptionId === sub.id);
      const used = subSeats.filter(s => s.status === 'assigned').length;
      return { ...sub, usedSeats: used };
    });

    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      teamId: get().team.id,
      type: 'seat_assigned',
      description: `将 ${seat.pluginName} 席位分配给 ${member.name}`,
      timestamp: new Date().toISOString(),
      metadata: { memberId, pluginId: seat.pluginId },
    };

    set({
      seats: updatedSeats,
      members: updatedMembers,
      subscriptions: updatedSubscriptions,
      activities: [newActivity, ...get().activities],
      isModalOpen: false,
      modalType: null,
      modalData: null,
    });
  },

  revokeSeat: (seatId) => {
    if (get().currentRole !== 'admin') return;

    const { seats, members } = get();
    const seat = seats.find(s => s.id === seatId);
    
    if (!seat) return;

    const updatedSeats = seats.map(s => {
      if (s.id === seatId) {
        return {
          ...s,
          memberId: null,
          memberName: undefined,
          memberEmail: undefined,
          memberAvatar: undefined,
          assignedAt: null,
          expiresAt: null,
          status: 'available' as const,
        };
      }
      return s;
    });

    const updatedMembers = members.map(m => {
      return {
        ...m,
        assignedSeats: m.assignedSeats.filter(id => id !== seatId),
      };
    });

    const updatedSubscriptions = get().subscriptions.map(sub => {
      const subSeats = updatedSeats.filter(s => s.subscriptionId === sub.id);
      const used = subSeats.filter(s => s.status === 'assigned').length;
      return { ...sub, usedSeats: used };
    });

    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      teamId: get().team.id,
      type: 'seat_revoked',
      description: `回收了 ${seat.memberName} 的 ${seat.pluginName} 席位`,
      timestamp: new Date().toISOString(),
      metadata: { memberId: seat.memberId, pluginId: seat.pluginId },
    };

    set({
      seats: updatedSeats,
      members: updatedMembers,
      subscriptions: updatedSubscriptions,
      activities: [newActivity, ...get().activities],
    });
  },

  addPaymentMethod: (method) => {
    if (get().currentRole !== 'admin') return;

    const newMethod: PaymentMethod = {
      ...method,
      id: `payment-${Date.now()}`,
      teamId: get().team.id,
      isDefault: get().paymentMethods.length === 0,
    };
    set({ paymentMethods: [...get().paymentMethods, newMethod] });
  },

  removePaymentMethod: (methodId) => {
    if (get().currentRole !== 'admin') return;

    set({
      paymentMethods: get().paymentMethods.filter(p => p.id !== methodId),
    });
  },

  setDefaultPayment: (methodId) => {
    if (get().currentRole !== 'admin') return;

    set({
      paymentMethods: get().paymentMethods.map(p => ({
        ...p,
        isDefault: p.id === methodId,
      })),
    });
  },

  purchaseSubscription: (pluginId, plan, seatCount) => {
    if (get().currentRole !== 'admin') {
      console.warn('只有管理员可以购买插件订阅');
      return;
    }

    const plugin = get().plugins.find(p => p.id === pluginId);
    if (!plugin) return;
    
    if (get().isSubscribed(pluginId)) {
      console.warn('该插件已订阅，无法重复购买');
      return;
    }

    const price = plan === 'monthly' ? plugin.monthlyPrice : plugin.yearlyPrice;
    const amount = price * seatCount;
    const startDate = new Date().toISOString().split('T')[0];
    const endDate = plan === 'monthly'
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const newSubscription: Subscription = {
      id: `sub-${Date.now()}`,
      teamId: get().team.id,
      pluginId,
      pluginName: plugin.name,
      pluginIcon: plugin.icon,
      plan,
      seatCount,
      usedSeats: 0,
      startDate,
      endDate,
      status: 'active',
      nextBillingDate: endDate,
      amount,
    };

    const newSeats: Seat[] = Array.from({ length: seatCount }, (_, i) => ({
      id: `seat-${Date.now()}-${i}`,
      subscriptionId: newSubscription.id,
      pluginId,
      pluginName: plugin.name,
      memberId: null,
      assignedAt: null,
      expiresAt: null,
      status: 'available' as const,
    }));

    const newInvoice: Invoice = {
      id: `invoice-${Date.now()}`,
      teamId: get().team.id,
      subscriptionId: newSubscription.id,
      pluginName: `${plugin.name} (${plan === 'monthly' ? '月付' : '年付'} x ${seatCount}席位)`,
      amount,
      currency: 'CNY',
      date: startDate,
      status: 'paid',
      pdfUrl: '#',
    };

    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      teamId: get().team.id,
      type: 'subscription_purchased',
      description: `购买了 ${plugin.name} ${plan === 'monthly' ? '月付' : '年付'}订阅 (${seatCount}席位)`,
      timestamp: new Date().toISOString(),
      metadata: { pluginId, amount },
    };

    set({
      subscriptions: [...get().subscriptions, newSubscription],
      seats: [...get().seats, ...newSeats],
      invoices: [newInvoice, ...get().invoices],
      activities: [newActivity, ...get().activities],
      isModalOpen: false,
      modalType: null,
      modalData: null,
    });
  },

  cancelSubscription: (subscriptionId) => {
    if (get().currentRole !== 'admin') return;

    set({
      subscriptions: get().subscriptions.map(s =>
        s.id === subscriptionId ? { ...s, status: 'cancelled' as const } : s
      ),
    });
  },

  inviteMember: (email, name) => {
    if (get().currentRole !== 'admin') return;

    const newMember: Member = {
      id: `member-${Date.now()}`,
      teamId: get().team.id,
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      role: 'member',
      joinDate: new Date().toISOString().split('T')[0],
      isActive: true,
      assignedSeats: [],
    };

    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      teamId: get().team.id,
      type: 'member_joined',
      description: `${name} 加入了团队`,
      timestamp: new Date().toISOString(),
      metadata: { memberId: newMember.id },
    };

    set({
      members: [...get().members, newMember],
      team: { ...get().team, memberCount: get().team.memberCount + 1 },
      activities: [newActivity, ...get().activities],
      isModalOpen: false,
      modalType: null,
      modalData: null,
    });
  },

  removeMember: (memberId) => {
    if (get().currentRole !== 'admin') return;

    const member = get().members.find(m => m.id === memberId);
    if (!member) return;

    const updatedSeats = get().seats.map(s => {
      if (s.memberId === memberId) {
        return {
          ...s,
          memberId: null,
          memberName: undefined,
          memberEmail: undefined,
          memberAvatar: undefined,
          assignedAt: null,
          expiresAt: null,
          status: 'available' as const,
        };
      }
      return s;
    });

    const updatedSubscriptions = get().subscriptions.map(sub => {
      const subSeats = updatedSeats.filter(s => s.subscriptionId === sub.id);
      const used = subSeats.filter(s => s.status === 'assigned').length;
      return { ...sub, usedSeats: used };
    });

    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      teamId: get().team.id,
      type: 'member_left',
      description: `${member.name} 离开了团队`,
      timestamp: new Date().toISOString(),
      metadata: { memberId },
    };

    set({
      members: get().members.map(m =>
        m.id === memberId ? { ...m, isActive: false } : m
      ),
      seats: updatedSeats,
      subscriptions: updatedSubscriptions,
      activities: [newActivity, ...get().activities],
    });
  },

  publishVersion: (versionData) => {
    const plugin = get().plugins.find(p => p.id === versionData.pluginId);
    if (!plugin) return;

    const newVersion: Version = {
      ...versionData,
      id: `version-${Date.now()}`,
      pluginName: plugin.name,
      releaseDate: new Date().toISOString().split('T')[0],
      isCurrent: true,
    };

    const updatedVersions = get().versions.map(v =>
      v.pluginId === versionData.pluginId ? { ...v, isCurrent: false } : v
    );

    const newActivity: Activity = {
      id: `activity-${Date.now()}`,
      teamId: 'global',
      type: 'version_released',
      description: `${plugin.name} 发布了 ${versionData.version} 版本更新`,
      timestamp: new Date().toISOString(),
      metadata: { pluginId: versionData.pluginId, version: versionData.version },
    };

    set({
      versions: [newVersion, ...updatedVersions],
      activities: [newActivity, ...get().activities],
      isModalOpen: false,
      modalType: null,
      modalData: null,
    });
  },
}));
