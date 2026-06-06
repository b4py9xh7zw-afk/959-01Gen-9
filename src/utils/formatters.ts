export const formatCurrency = (amount: number, currency: string = 'CNY'): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateShort = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export const getRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins <= 1 ? '刚刚' : `${diffMins} 分钟前`;
    }
    return `${diffHours} 小时前`;
  }
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays} 天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`;
  return formatDateShort(dateString);
};

export const maskCardNumber = (last4: string, brand: string): string => {
  const brandIcons: Record<string, string> = {
    visa: 'VISA',
    mastercard: 'Mastercard',
    amex: 'AMEX',
    discover: 'Discover',
  };
  return `${brandIcons[brand] || brand} •••• ${last4}`;
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case 'active':
    case 'paid':
    case 'assigned':
    case 'success':
      return 'badge-success';
    case 'pending':
    case 'warning':
    case 'available':
      return 'badge-warning';
    case 'cancelled':
    case 'expired':
    case 'failed':
    case 'revoked':
      return 'badge-danger';
    default:
      return 'badge-info';
  }
};

export const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: '活跃',
    paid: '已支付',
    assigned: '已分配',
    available: '可分配',
    pending: '待处理',
    cancelled: '已取消',
    expired: '已过期',
    failed: '失败',
    revoked: '已回收',
  };
  return statusMap[status] || status;
};

export const getChangeTypeBadge = (type: string): string => {
  switch (type) {
    case 'feature':
      return 'bg-success/20 text-success';
    case 'fix':
      return 'bg-warning/20 text-warning';
    case 'improvement':
      return 'bg-primary/20 text-primary';
    case 'breaking':
      return 'bg-danger/20 text-danger';
    default:
      return 'bg-surface-light text-text-secondary';
  }
};

export const getChangeTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    feature: '新功能',
    fix: '修复',
    improvement: '优化',
    breaking: '破坏性',
  };
  return typeMap[type] || type;
};
