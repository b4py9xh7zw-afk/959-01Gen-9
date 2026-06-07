import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Star,
  Users,
  Check,
  ShoppingCart,
  LayoutGrid,
  Palette,
  Shapes,
  Type,
  FolderOpen,
  Play,
  Clock,
  ChevronRight,
  Download,
  MessageSquare,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency, formatDate } from '../utils';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  LayoutGrid,
  Palette,
  Shapes,
  Type,
  FolderOpen,
  Play,
};

interface PluginDetailProps {
  pluginId?: string;
}

export default function PluginDetail({ pluginId }: PluginDetailProps) {
  const { id: routePluginId } = useParams();
  const { plugins, versions, currentRole, purchaseSubscription, isSubscribed } = useAppStore();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [seatCount, setSeatCount] = useState(1);
  const resolvedPluginId = pluginId ?? routePluginId;
  const canPurchaseSubscription = currentRole === 'admin';
  const canOpenSeatStatus = currentRole === 'admin' || currentRole === 'member';

  const currentPlugin = useMemo(() => {
    if (resolvedPluginId) {
      return plugins.find(p => p.id === resolvedPluginId);
    }
    return plugins[0];
  }, [plugins, resolvedPluginId]);

  const pluginVersions = useMemo(() => {
    if (!currentPlugin) return [];
    return versions.filter(v => v.pluginId === currentPlugin.id);
  }, [versions, currentPlugin]);

  const pluginSubscribed = currentPlugin ? isSubscribed(currentPlugin.id) : false;

  if (!currentPlugin) {
    return (
      <>
        <Sidebar />
        <Header />
        <PageContainer>
          <div className="text-center py-16">
            <p className="text-text-muted text-lg">插件不存在</p>
          </div>
        </PageContainer>
      </>
    );
  }

  const IconComponent = iconMap[currentPlugin.icon] || LayoutGrid;
  const totalPrice = (plan === 'monthly' ? currentPlugin.monthlyPrice : currentPlugin.yearlyPrice) * seatCount;
  const actionLabel = pluginSubscribed
    ? canOpenSeatStatus
      ? currentRole === 'admin'
        ? '管理团队席位'
        : '查看我的席位'
      : '当前团队已订阅'
    : canPurchaseSubscription
      ? '立即订阅'
      : '仅管理员可订阅';
  const actionDisabled = (!pluginSubscribed && !canPurchaseSubscription) || (pluginSubscribed && !canOpenSeatStatus);

  const handlePurchase = () => {
    if (pluginSubscribed) {
      if (canOpenSeatStatus) {
        navigate('/seats');
      }
      return;
    }

    if (!canPurchaseSubscription) return;

    purchaseSubscription(currentPlugin.id, plan, seatCount);
  };

  return (
    <>
      <Sidebar />
      <Header />
      <PageContainer>
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
            <span className="cursor-pointer hover:text-text-primary">插件市场</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-text-primary">{currentPlugin.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-primary to-primary-hover shadow-glow">
                      <IconComponent className="w-12 h-12 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h1 className="text-3xl font-bold text-text-primary">
                          {currentPlugin.name}
                        </h1>
                        {pluginSubscribed && (
                          <Badge variant="success">
                            <Check className="w-3 h-3 mr-1" />
                            已订阅
                          </Badge>
                        )}
                      </div>
                      <p className="text-text-secondary mb-4 text-lg">
                        {currentPlugin.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-warning fill-warning" />
                          <span className="font-semibold text-text-primary">{currentPlugin.rating}</span>
                          <span className="text-text-muted">({currentPlugin.reviewCount} 评价)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-5 h-5 text-text-muted" />
                          <span className="text-text-primary">{currentPlugin.installCount.toLocaleString()} 安装</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-text-muted" />
                          <span className="text-text-muted">更新于 {formatDate(currentPlugin.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8">
                  <img
                    src={currentPlugin.coverImage}
                    alt={currentPlugin.name}
                    className="w-full h-64 object-cover rounded-xl mb-6"
                  />

                  <Tabs defaultValue="features">
                    <TabsList>
                      <TabsTrigger value="features">主要功能</TabsTrigger>
                      <TabsTrigger value="versions">版本历史</TabsTrigger>
                      <TabsTrigger value="compatible">兼容性</TabsTrigger>
                    </TabsList>

                    <TabsContent value="features" className="pt-6">
                      <h3 className="text-lg font-semibold text-text-primary mb-4">主要功能</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentPlugin.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 p-4 rounded-xl bg-surface-light"
                          >
                            <div className="p-1.5 rounded-lg bg-success/20 flex-shrink-0">
                              <Check className="w-4 h-4 text-success" />
                            </div>
                            <span className="text-text-secondary">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="versions" className="pt-6">
                      <h3 className="text-lg font-semibold text-text-primary mb-4">版本历史</h3>
                      <div className="space-y-4">
                        {pluginVersions.map((version) => (
                          <div
                            key={version.id}
                            className="p-5 rounded-xl bg-surface-light border border-border"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-text-primary">
                                  v{version.version}
                                </span>
                                {version.isCurrent && (
                                  <Badge variant="success">最新</Badge>
                                )}
                              </div>
                              <span className="text-sm text-text-muted">
                                {formatDate(version.releaseDate)}
                              </span>
                            </div>
                            <p className="text-text-secondary mb-4">{version.releaseNotes}</p>
                            <div className="space-y-2">
                              {version.changes.map((change, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm">
                                  <span
                                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                                      change.type === 'feature'
                                        ? 'bg-success/20 text-success'
                                        : change.type === 'fix'
                                        ? 'bg-warning/20 text-warning'
                                        : change.type === 'improvement'
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-danger/20 text-danger'
                                    }`}
                                  >
                                    {change.type === 'feature'
                                      ? '新功能'
                                      : change.type === 'fix'
                                      ? '修复'
                                      : change.type === 'improvement'
                                      ? '优化'
                                      : '破坏性'}
                                  </span>
                                  <span className="text-text-secondary">{change.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="compatible" className="pt-6">
                      <h3 className="text-lg font-semibold text-text-primary mb-4">兼容版本</h3>
                      <div className="flex flex-wrap gap-3">
                        {currentPlugin.compatibleVersions.map((version, idx) => (
                          <Badge key={idx} variant="secondary" className="text-base px-4 py-2">
                            {version}
                          </Badge>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>订阅方案</CardTitle>
                    <CardDescription>选择适合您团队的方案</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-6">
                      <div
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          plan === 'monthly'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setPlan('monthly')}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-text-primary">月付</span>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-text-primary">
                              {formatCurrency(currentPlugin.monthlyPrice)}
                            </span>
                            <span className="text-sm text-text-muted">/月</span>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          plan === 'yearly'
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setPlan('yearly')}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-text-primary">年付</span>
                          <div className="text-right">
                            <span className="text-2xl font-bold text-text-primary">
                              {formatCurrency(currentPlugin.yearlyPrice)}
                            </span>
                            <span className="text-sm text-text-muted">/年</span>
                          </div>
                        </div>
                        <div className="text-xs text-success">省 2 个月费用</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-text-primary mb-3">
                        席位数量
                      </label>
                      <div className="flex items-center justify-center gap-4">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                        >
                          -
                        </Button>
                        <span className="w-20 text-center text-2xl font-bold text-text-primary">
                          {seatCount}
                        </span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSeatCount(Math.min(100, seatCount + 1))}
                        >
                          +
                        </Button>
                      </div>
                      <p className="text-center text-sm text-text-muted mt-2">席位</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface-light rounded-xl mb-6">
                      <span className="text-text-muted">总计</span>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-text-primary">
                          {formatCurrency(totalPrice)}
                        </div>
                        <div className="text-sm text-text-muted">
                          {plan === 'monthly' ? '每月' : '每年'}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant={pluginSubscribed || !canPurchaseSubscription ? 'secondary' : 'primary'}
                      className="w-full"
                      onClick={handlePurchase}
                      size="lg"
                      disabled={actionDisabled}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {actionLabel}
                    </Button>
                    {!canPurchaseSubscription && (
                      <p className="mt-3 text-xs text-text-muted">
                        {currentRole === 'member'
                          ? '团队成员可以查看插件详情和自己的席位，订阅与续费需由管理员完成。'
                          : '作者账号仅可浏览插件信息，团队订阅与席位管理需由管理员完成。'}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-surface-light flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">作者</p>
                        <p className="font-medium text-text-primary">{currentPlugin.authorName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-surface-light flex items-center justify-center">
                        <Download className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">总安装量</p>
                        <p className="font-medium text-text-primary">
                          {currentPlugin.installCount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-surface-light flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-warning" />
                      </div>
                      <div>
                        <p className="text-sm text-text-muted">用户评价</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-warning fill-warning" />
                          <span className="font-medium text-text-primary">{currentPlugin.rating}</span>
                          <span className="text-text-muted">({currentPlugin.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
