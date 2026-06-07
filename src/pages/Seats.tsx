import { useMemo, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency, formatDate, getStatusText } from '../utils';
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
  const {
    seats,
    members,
    subscriptions,
    currentRole,
    currentUser,
    openModal,
    closeModal,
    assignSeat,
    revokeSeat,
  } = useAppStore();
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [seatToRevoke, setSeatToRevoke] = useState<Seat | null>(null);
  const isAdmin = currentRole === 'admin';

  const visibleSeats = useMemo(() => {
    if (isAdmin || !currentUser) {
      return seats;
    }

    return seats.filter(seat => seat.memberId === currentUser.id);
  }, [currentUser, isAdmin, seats]);

  const visiblePluginIds = useMemo(
    () => new Set(visibleSeats.map(seat => seat.pluginId)),
    [visibleSeats]
  );

  const adminStats = useMemo(() => {
    const total = seats.length;
    const assigned = seats.filter(seat => seat.status === 'assigned').length;
    const available = seats.filter(seat => seat.status === 'available').length;
    return { total, assigned, available };
  }, [seats]);

  const memberStats = useMemo(() => {
    const assigned = visibleSeats.filter(seat => seat.status === 'assigned').length;
    const activePlugins = visiblePluginIds.size;
    const expiringSoon = visibleSeats.filter(seat => {
      if (!seat.expiresAt) return false;
      return new Date(seat.expiresAt).getTime() <= Date.now() + 30 * 24 * 60 * 60 * 1000;
    }).length;

    return { assigned, activePlugins, expiringSoon };
  }, [visiblePluginIds, visibleSeats]);

  const seatsByPlugin = useMemo(() => {
    const grouped: Record<string, Seat[]> = {};
    visibleSeats.forEach(seat => {
      if (!grouped[seat.pluginName]) {
        grouped[seat.pluginName] = [];
      }
      grouped[seat.pluginName].push(seat);
    });
    return grouped;
  }, [visibleSeats]);

  const pluginSubscriptions = useMemo(() => {
    const map: Record<string, { icon: string; plan: string; amount: number }> = {};
    subscriptions.forEach(sub => {
      if (!isAdmin && !visiblePluginIds.has(sub.pluginId)) {
        return;
      }

      map[sub.pluginName] = {
        icon: sub.pluginIcon,
        plan: sub.plan,
        amount: sub.amount,
      };
    });
    return map;
  }, [isAdmin, subscriptions, visiblePluginIds]);

  const availableMembers = useMemo(() => {
    return members
      .filter(member => member.isActive)
      .map(member => ({
        value: member.id,
        label: `${member.name} (${member.email})`,
      }));
  }, [members]);

  const handleAssignClick = (seat: Seat) => {
    if (!isAdmin) return;

    setSelectedSeat(seat);
    setSelectedMemberId('');
    openModal('assignSeat', seat);
  };

  const handleAssignConfirm = () => {
    if (!isAdmin || !selectedSeat || !selectedMemberId) return;

    assignSeat(selectedSeat.id, selectedMemberId);
    setSelectedSeat(null);
    setSelectedMemberId('');
  };

  const handleRevokeClick = (seat: Seat) => {
    if (!isAdmin) return;

    setSeatToRevoke(seat);
    setShowRevokeConfirm(true);
  };

  const handleRevokeConfirm = () => {
    if (!isAdmin || !seatToRevoke) return;

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
    return visibleSeats.filter(seat => seat.memberId === memberId).length;
  };

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">{isAdmin ? '席位管理' : '我的席位'}</h1>
        <p className="text-text-secondary">
          {isAdmin ? '管理团队插件席位分配和使用情况' : '查看您当前已分配的插件席位和到期时间'}
        </p>
      </div>

      {isAdmin ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="总席位"
            value={adminStats.total}
            icon={Users}
            gradientFrom="from-primary"
            gradientTo="to-primary-hover"
          />
          <StatCard
            title="已分配"
            value={adminStats.assigned}
            icon={UserCheck}
            gradientFrom="from-success"
            gradientTo="to-emerald-600"
          />
          <StatCard
            title="可分配"
            value={adminStats.available}
            icon={UserX}
            gradientFrom="from-warning"
            gradientTo="to-amber-600"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="我的席位"
            value={memberStats.assigned}
            icon={UserCheck}
            gradientFrom="from-primary"
            gradientTo="to-primary-hover"
          />
          <StatCard
            title="使用中插件"
            value={memberStats.activePlugins}
            icon={LayoutGrid}
            gradientFrom="from-success"
            gradientTo="to-emerald-600"
          />
          <StatCard
            title="30天内到期"
            value={memberStats.expiringSoon}
            icon={AlertTriangle}
            gradientFrom="from-warning"
            gradientTo="to-amber-600"
          />
        </div>
      )}

      {!isAdmin && visibleSeats.length === 0 && (
        <Card className="mb-8">
          <CardContent className="py-12 text-center">
            <UserX className="mx-auto mb-4 h-12 w-12 text-text-muted" />
            <h2 className="mb-2 text-lg font-semibold text-text-primary">您还没有被分配席位</h2>
            <p className="text-text-secondary">
              当前账号可以浏览插件市场，但订阅和席位分配需要由团队管理员完成。
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {Object.entries(seatsByPlugin).map(([pluginName, pluginSeats]) => {
          const subInfo = pluginSubscriptions[pluginName];
          const PluginIcon = subInfo ? iconMap[subInfo.icon] || LayoutGrid : LayoutGrid;
          const assignedCount = pluginSeats.filter(seat => seat.status === 'assigned').length;

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
                      <div className="mt-1 flex items-center gap-4 text-sm text-text-muted">
                        {isAdmin ? (
                          <>
                            <span>
                              {subInfo?.plan === 'monthly' ? '月付' : '年付'} ·{' '}
                              {formatCurrency(subInfo?.amount || 0)}
                              {subInfo?.plan === 'monthly' ? '/月' : '/年'}
                            </span>
                            <span>
                              {assignedCount}/{pluginSeats.length} 席位已使用
                            </span>
                          </>
                        ) : (
                          <span>当前为您分配了 {pluginSeats.length} 个席位</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-surface-light">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${pluginSeats.length === 0 ? 0 : (assignedCount / pluginSeats.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-text-muted">
                      {pluginSeats.length === 0 ? 0 : Math.round((assignedCount / pluginSeats.length) * 100)}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pluginSeats.map(seat => {
                    const member = members.find(item => item.id === seat.memberId);
                    const badgeVariant =
                      seat.status === 'assigned'
                        ? 'success'
                        : seat.status === 'available'
                          ? 'warning'
                          : 'danger';

                    return (
                      <div
                        key={seat.id}
                        className="rounded-xl border border-border bg-surface-light p-4 transition-all hover:border-primary/50"
                      >
                        <div className="mb-3 flex items-start justify-between">
                          <Badge variant={badgeVariant}>{getStatusText(seat.status)}</Badge>
                          {isAdmin && seat.status === 'assigned' ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRevokeClick(seat)}
                              className="h-8 px-2 text-danger hover:bg-danger/10 hover:text-danger"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          ) : isAdmin ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAssignClick(seat)}
                              className="h-8 px-2 text-primary hover:bg-primary/10 hover:text-primary"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          ) : null}
                        </div>

                        {seat.status === 'assigned' && member ? (
                          <div>
                            <div className="mb-2 flex items-center gap-3">
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="h-10 w-10 rounded-full"
                              />
                              <div>
                                <div className="font-medium text-text-primary">{member.name}</div>
                                <div className="text-xs text-text-muted">{member.email}</div>
                              </div>
                            </div>
                            <div className="space-y-1 text-xs text-text-muted">
                              <div>分配日期：{seat.assignedAt ? formatDate(seat.assignedAt) : '-'}</div>
                              <div>到期日期：{seat.expiresAt ? formatDate(seat.expiresAt) : '-'}</div>
                            </div>
                          </div>
                        ) : isAdmin ? (
                          <div className="py-4 text-center">
                            <div className="mb-2 text-text-muted">席位空闲</div>
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
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isAdmin && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>成员席位使用概览</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {members.filter(member => member.isActive).map(member => {
                const seatCount = getMemberSeatCount(member.id);
                const memberSeats = visibleSeats.filter(seat => seat.memberId === member.id);

                return (
                  <div
                    key={member.id}
                    className="rounded-xl border border-border bg-surface-light p-4"
                  >
                    <div className="mb-3 flex items-center gap-3">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="h-12 w-12 rounded-full"
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
                      <div className="mt-3 border-t border-border pt-3">
                        <div className="mb-2 text-xs text-text-muted">使用中的插件：</div>
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
      )}

      {isAdmin && selectedSeat && (
        <Modal
          title="分配席位"
          onClose={handleCloseAssignModal}
        >
          <div className="space-y-4">
            <div className="rounded-xl bg-surface-light p-4">
              <div className="mb-1 text-sm text-text-muted">插件</div>
              <div className="font-semibold text-text-primary">{selectedSeat.pluginName}</div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text-primary">
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

      {isAdmin && showRevokeConfirm && seatToRevoke && (
        <Modal
          title="确认回收席位"
          onClose={() => {
            setShowRevokeConfirm(false);
            setSeatToRevoke(null);
          }}
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-xl bg-danger/10 p-4">
              <div className="rounded-lg bg-danger/20 p-2">
                <AlertTriangle className="h-6 w-6 text-danger" />
              </div>
              <div>
                <h4 className="mb-1 font-semibold text-text-primary">确定要回收此席位吗？</h4>
                <p className="text-sm text-text-secondary">
                  回收后，<span className="font-medium text-text-primary">{seatToRevoke.memberName}</span> 将失去
                  <span className="font-medium text-text-primary">{seatToRevoke.pluginName}</span> 的访问权限。
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-surface-light p-4">
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
