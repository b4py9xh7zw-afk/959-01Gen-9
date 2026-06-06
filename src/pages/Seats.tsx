import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusText } from '../utils';
import {
  Users,
  UserCheck,
  UserX,
  Plus,
  Trash2,
  AlertTriangle,
  LayoutGrid,
  Palette,
  Shapes,
  Type,
  FolderOpen,
  Play,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import StatCard from '../components/ui/StatCard';
import PageContainer from '../components/layout/PageContainer';
import type { Seat } from '../types';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  LayoutGrid,
  Palette,
  Shapes,
  Type,
  FolderOpen,
  Play,
};

export default function Seats() {
  const { seats, members, subscriptions, openModal, closeModal, isModalOpen, modalType, modalData, assignSeat, revokeSeat } = useAppStore();
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [seatToRevoke, setSeatToRevoke] = useState<Seat | null>(null);

  const stats = useMemo(() => {
    const total = seats.length;
    const assigned = seats.filter(s => s.status === 'assigned').length;
    const available = seats.filter(s => s.status === 'available').length;
    return { total, assigned, available };
  }, [seats]);

  const seatsByPlugin = useMemo(() => {
    const grouped: Record<string, Seat[]> = {};
    seats.forEach(seat => {
      if (!grouped[seat.pluginName]) {
        grouped[seat.pluginName] = [];
      }
      grouped[seat.pluginName].push(seat);
    });
    return grouped;
  }, [seats]);

  const pluginSubscriptions = useMemo(() => {
    const map: Record<string, { icon: string; plan: string; amount: number }> = {};
    subscriptions.forEach(sub => {
      map[sub.pluginName] = {
        icon: sub.pluginIcon,
        plan: sub.plan,
        amount: sub.amount,
      };
    });
    return map;
  }, [subscriptions]);

  const availableMembers = useMemo(() => {
    return members
      .filter(m => m.isActive)
      .map(m => ({
        value: m.id,
        label: `${m.name} (${m.email})`,
      }));
  }, [members]);

  const handleAssignClick = (seat: Seat) => {
    setSelectedSeat(seat);
    setSelectedMemberId('');
    openModal('assignSeat', seat);
  };

  const handleAssignConfirm = () => {
    if (!selectedSeat || !selectedMemberId) return;
    assignSeat(selectedSeat.id, selectedMemberId);
    setSelectedSeat(null);
    setSelectedMemberId('');
  };

  const handleRevokeClick = (seat: Seat) => {
    setSeatToRevoke(seat);
    setShowRevokeConfirm(true);
  };

  const handleRevokeConfirm = () => {
    if (!seatToRevoke) return;
    revokeSeat(seatToRevoke.id);
    setSeatToRevoke(null);
    setShowRevokeConfirm(false);
  };

  const handleCloseAssignModal = () => {
    closeModal();
    setSelectedSeat(null);
    setSelectedMemberId('');
  };

  const getMemberSeatCount = (memberId: string) => {
    return seats.filter(s => s.memberId === memberId).length;
  };

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">席位管理</h1>
        <p className="text-text-secondary">管理团队插件席位分配和使用情况</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="总席位"
          value={stats.total}
          icon={Users}
          gradientFrom="from-primary"
          gradientTo="to-primary-hover"
        />
        <StatCard
          title="已分配"
          value={stats.assigned}
          icon={UserCheck}
          gradientFrom="from-success"
          gradientTo="to-emerald-600"
        />
        <StatCard
          title="可分配"
          value={stats.available}
          icon={UserX}
          gradientFrom="from-warning"
          gradientTo="to-amber-600"
        />
      </div>

      <div className="space-y-6">
        {Object.entries(seatsByPlugin).map(([pluginName, pluginSeats]) => {
          const subInfo = pluginSubscriptions[pluginName];
          const PluginIcon = subInfo ? iconMap[subInfo.icon] || LayoutGrid : LayoutGrid;
          const assignedCount = pluginSeats.filter(s => s.status === 'assigned').length;
          
          return (
            <Card key={pluginName}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary-hover shadow-glow">
                      <PluginIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>{pluginName}</CardTitle>
                      <div className="flex items-center gap-4 mt-1 text-sm text-text-muted">
                        <span>
                          {subInfo?.plan === 'monthly' ? '月付' : '年付'} ·{' '}
                          {formatCurrency(subInfo?.amount || 0)}
                          {subInfo?.plan === 'monthly' ? '/月' : '/年'}
                        </span>
                        <span>
                          {assignedCount}/{pluginSeats.length} 席位已使用
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 bg-surface-light rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${(assignedCount / pluginSeats.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-text-muted">
                      {Math.round((assignedCount / pluginSeats.length) * 100)}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pluginSeats.map(seat => {
                    const member = members.find(m => m.id === seat.memberId);
                    const badgeVariant = seat.status === 'assigned' ? 'success' : seat.status === 'available' ? 'warning' : 'danger';
                    
                    return (
                      <div
                        key={seat.id}
                        className="p-4 bg-surface-light rounded-xl border border-border hover:border-primary/50 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant={badgeVariant}>
                            {getStatusText(seat.status)}
                          </Badge>
                          {seat.status === 'assigned' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRevokeClick(seat)}
                              className="h-8 px-2 text-danger hover:text-danger hover:bg-danger/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAssignClick(seat)}
                              className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        
                        {seat.status === 'assigned' && member ? (
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <div className="font-medium text-text-primary">{member.name}</div>
                                <div className="text-xs text-text-muted">{member.email}</div>
                              </div>
                            </div>
                            <div className="text-xs text-text-muted space-y-1">
                              <div>分配日期：{seat.assignedAt ? formatDate(seat.assignedAt) : '-'}</div>
                              <div>到期日期：{seat.expiresAt ? formatDate(seat.expiresAt) : '-'}</div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <div className="text-text-muted mb-2">席位空闲</div>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleAssignClick(seat)}
                              className="w-full"
                            >
                              <Plus className="w-4 h-4" />
                              分配席位
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>成员席位使用概览</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {members.filter(m => m.isActive).map(member => {
              const seatCount = getMemberSeatCount(member.id);
              const memberSeats = seats.filter(s => s.memberId === member.id);
              
              return (
                <div
                  key={member.id}
                  className="p-4 bg-surface-light rounded-xl border border-border"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-medium text-text-primary">{member.name}</div>
                      <div className="text-xs text-text-muted">{member.role === 'admin' ? '管理员' : '成员'}</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">已分配席位</span>
                    <span className="text-lg font-bold text-text-primary">{seatCount}</span>
                  </div>
                  {memberSeats.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="text-xs text-text-muted mb-2">使用中的插件：</div>
                      <div className="flex flex-wrap gap-1">
                        {memberSeats.map(seat => (
                          <Badge key={seat.id} variant="info" className="text-xs">
                            {seat.pluginName}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedSeat && (
        <Modal
          title="分配席位"
          onClose={handleCloseAssignModal}
        >
          <div className="space-y-4">
            <div className="p-4 bg-surface-light rounded-xl">
              <div className="text-sm text-text-muted mb-1">插件</div>
              <div className="font-semibold text-text-primary">{selectedSeat.pluginName}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                选择成员
              </label>
              <Select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                options={availableMembers}
                placeholder="请选择要分配的成员"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={handleCloseAssignModal}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                variant="primary"
                onClick={handleAssignConfirm}
                disabled={!selectedMemberId}
                className="flex-1"
              >
                <UserCheck className="w-4 h-4" />
                确认分配
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {showRevokeConfirm && seatToRevoke && (
        <Modal
          title="确认回收席位"
          onClose={() => {
            setShowRevokeConfirm(false);
            setSeatToRevoke(null);
          }}
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-danger/10 rounded-xl">
              <div className="p-2 bg-danger/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-danger" />
              </div>
              <div>
                <h4 className="font-semibold text-text-primary mb-1">确定要回收此席位吗？</h4>
                <p className="text-sm text-text-secondary">
                  回收后，<span className="font-medium text-text-primary">{seatToRevoke.memberName}</span> 将失去
                  <span className="font-medium text-text-primary">{seatToRevoke.pluginName}</span> 的访问权限。
                </p>
              </div>
            </div>

            <div className="p-4 bg-surface-light rounded-xl">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-muted">插件：</span>
                  <span className="text-text-primary">{seatToRevoke.pluginName}</span>
                </div>
                <div>
                  <span className="text-text-muted">成员：</span>
                  <span className="text-text-primary">{seatToRevoke.memberName}</span>
                </div>
                <div>
                  <span className="text-text-muted">分配日期：</span>
                  <span className="text-text-primary">{seatToRevoke.assignedAt ? formatDate(seatToRevoke.assignedAt) : '-'}</span>
                </div>
                <div>
                  <span className="text-text-muted">到期日期：</span>
                  <span className="text-text-primary">{seatToRevoke.expiresAt ? formatDate(seatToRevoke.expiresAt) : '-'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowRevokeConfirm(false);
                  setSeatToRevoke(null);
                }}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                variant="danger"
                onClick={handleRevokeConfirm}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4" />
                确认回收
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
}
