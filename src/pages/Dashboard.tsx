import { useMemo } from 'react';
import { Package, Users, UserCheck, CreditCard, Clock, RefreshCw, ChevronRight, Calendar } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency, formatDate, getRelativeTime, cn } from '../utils';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import StatCard from '../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import DonutChart from '../components/charts/DonutChart';

export default function Dashboard() {
  const { currentRole, currentUser, seats, subscriptions, invoices, activities, versions } = useAppStore();
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

  const visibleSubscriptions = useMemo(() => {
    if (isAdmin) {
      return subscriptions;
    }

    return subscriptions.filter(subscription => visiblePluginIds.has(subscription.pluginId));
  }, [isAdmin, subscriptions, visiblePluginIds]);

  const visibleVersions = useMemo(() => {
    if (isAdmin) {
      return versions;
    }

    return versions.filter(version => visiblePluginIds.has(version.pluginId));
  }, [isAdmin, versions, visiblePluginIds]);

  const visibleActivities = useMemo(() => {
    if (isAdmin) {
      return activities;
    }

    return activities.filter(activity => {
      const pluginId = activity.metadata?.pluginId;
      const memberId = activity.metadata?.memberId;

      return memberId === currentUser?.id || (typeof pluginId === 'string' && visiblePluginIds.has(pluginId));
    });
  }, [activities, currentUser?.id, isAdmin, visiblePluginIds]);

  const activePlugins = visibleSubscriptions.filter(subscription => subscription.status === 'active').length;
  const totalSeats = visibleSeats.length;
  const usedSeats = visibleSeats.filter(seat => seat.status === 'assigned').length;
  const pendingPayments = isAdmin
    ? invoices.filter(invoice => invoice.status === 'pending').reduce((sum, invoice) => sum + invoice.amount, 0)
    : 0;

  const seatChartData = [
    { name: '已分配', value: usedSeats, color: '#06B6D4' },
    { name: '可分配', value: Math.max(totalSeats - usedSeats, 0), color: '#10B981' },
  ];

  const seatUsageRate = totalSeats > 0 ? Math.round((usedSeats / totalSeats) * 100) : 0;

  const recentActivities = visibleActivities.slice(0, 5);
  const recentVersions = visibleVersions.filter(version => version.isCurrent).slice(0, 4);
  const activeSubscriptions = visibleSubscriptions.filter(subscription => subscription.status === 'active');

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'seat_assigned':
        return UserCheck;
      case 'seat_revoked':
        return Users;
      case 'version_released':
        return RefreshCw;
      case 'subscription_purchased':
        return CreditCard;
      case 'member_joined':
      case 'member_left':
        return Users;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'seat_assigned':
        return 'bg-primary/20 text-primary';
      case 'seat_revoked':
        return 'bg-warning/20 text-warning';
      case 'version_released':
        return 'bg-success/20 text-success';
      case 'subscription_purchased':
        return 'bg-primary/20 text-primary';
      case 'member_joined':
        return 'bg-success/20 text-success';
      case 'member_left':
        return 'bg-danger/20 text-danger';
      default:
        return 'bg-surface-light text-text-muted';
    }
  };

  return (
    <>
      <Sidebar />
      <Header />
      <PageContainer>
        <div className="animate-fade-in">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">仪表板</h1>
            <p className="text-text-secondary">
              {isAdmin ? '欢迎回来，这是您的团队概览' : '查看您当前能使用的插件、席位和更新动态'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title={isAdmin ? '活跃插件' : '我的插件'}
              value={activePlugins}
              change={12}
              icon={Package}
              gradientFrom="from-primary"
              gradientTo="to-cyan-600"
              className="animate-slide-up"
            />
            <StatCard
              title={isAdmin ? '总席位' : '我的席位'}
              value={totalSeats}
              change={8}
              icon={Users}
              gradientFrom="from-success"
              gradientTo="to-emerald-600"
              className="animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            />
            <StatCard
              title="已用席位"
              value={`${usedSeats} (${seatUsageRate}%)`}
              change={5}
              icon={UserCheck}
              gradientFrom="from-warning"
              gradientTo="to-amber-600"
              className="animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            />
            <StatCard
              title={isAdmin ? '待付款项' : '即将到期'}
              value={isAdmin ? formatCurrency(pendingPayments) : `${activeSubscriptions.filter(sub => new Date(sub.endDate).getTime() <= Date.now() + 30 * 24 * 60 * 60 * 1000).length} 个`}
              change={-3}
              icon={CreditCard}
              gradientFrom="from-danger"
              gradientTo="to-rose-600"
              className="animate-slide-up"
              style={{ animationDelay: '0.3s' }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle>{isAdmin ? '席位使用率' : '我的席位使用率'}</CardTitle>
                <CardDescription>{isAdmin ? '当前团队席位使用情况' : '当前分配到您账号的席位情况'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <DonutChart
                    data={seatChartData}
                    innerRadius={55}
                    outerRadius={85}
                  />
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-sm text-text-secondary">已分配 {usedSeats}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-sm text-text-secondary">可分配 {Math.max(totalSeats - usedSeats, 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{isAdmin ? '最近活动' : '与我相关的动态'}</CardTitle>
                  <CardDescription>{isAdmin ? '团队最新动态' : '您最近使用的插件和席位变更'}</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  查看全部
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                {recentActivities.length === 0 ? (
                  <div className="py-12 text-center text-text-muted">暂无可展示的动态</div>
                ) : (
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                    <div className="space-y-6">
                      {recentActivities.map((activity) => {
                        const Icon = getActivityIcon(activity.type);
                        return (
                          <div key={activity.id} className="relative flex gap-4 pl-8">
                            <div
                              className={cn(
                                'absolute left-0 w-8 h-8 rounded-full flex items-center justify-center',
                                getActivityColor(activity.type)
                              )}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-text-primary font-medium">{activity.description}</p>
                              <p className="text-text-muted text-sm mt-0.5">{getRelativeTime(activity.timestamp)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>最新版本更新</CardTitle>
                  <CardDescription>{isAdmin ? '已订阅插件的最新版本' : '您可使用插件的最新版本'}</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  查看全部
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentVersions.map((version) => (
                    <div
                      key={version.id}
                      className="flex items-start justify-between p-4 rounded-xl bg-background hover:bg-surface-light/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <RefreshCw className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{version.pluginName}</p>
                          <p className="text-sm text-text-secondary mt-0.5">v{version.version}</p>
                          <p className="text-xs text-text-muted mt-1">{formatDate(version.releaseDate)}</p>
                        </div>
                      </div>
                      <Badge variant="success">最新</Badge>
                    </div>
                  ))}
                  {recentVersions.length === 0 && (
                    <div className="py-12 text-center text-text-muted">暂无可展示的版本更新</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{isAdmin ? '订阅概览' : '我的插件概览'}</CardTitle>
                  <CardDescription>{isAdmin ? '当前活跃的插件订阅' : '当前分配到您账号的插件服务'}</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  {isAdmin ? '管理' : '查看详情'}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeSubscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-background hover:bg-surface-light/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{sub.pluginName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-text-muted">{sub.plan === 'monthly' ? '月付' : '年付'}</span>
                            <span className="text-xs text-text-muted">•</span>
                            <span className="text-xs text-text-muted">{sub.usedSeats}/{sub.seatCount} 席位</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-text-primary">
                          {isAdmin ? formatCurrency(sub.amount) : `${visibleSeats.filter(seat => seat.subscriptionId === sub.id).length} 个席位`}
                        </p>
                        <div className="flex items-center gap-1 mt-0.5 justify-end">
                          <Calendar className="w-3 h-3 text-text-muted" />
                          <span className="text-xs text-text-muted">至 {formatDate(sub.endDate)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {activeSubscriptions.length === 0 && (
                    <div className="py-12 text-center text-text-muted">暂无可展示的订阅信息</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
