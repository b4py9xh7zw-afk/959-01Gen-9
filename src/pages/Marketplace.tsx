import { useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusText } from '../utils';
import {
  Search,
  Star,
  ShoppingCart,
  X,
  Check,
  Users,
  LayoutGrid,
  Palette,
  Shapes,
  Type,
  FolderOpen,
  Play,
} from 'lucide-react';
import { Card, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import PageContainer from '../components/layout/PageContainer';
import type { Plugin } from '../types';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  LayoutGrid,
  Palette,
  Shapes,
  Type,
  FolderOpen,
  Play,
};

export default function Marketplace() {
  const { plugins, subscriptions, openModal, closeModal, isModalOpen, modalType, modalData, purchaseSubscription } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [seatCount, setSeatCount] = useState(1);

  const categories = useMemo(() => {
    const cats = [...new Set(plugins.map(p => p.category))];
    return [{ value: 'all', label: '全部' }, ...cats.map(c => ({ value: c, label: c }))];
  }, [plugins]);

  const filteredPlugins = useMemo(() => {
    return plugins.filter(plugin => {
      const matchesSearch = plugin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plugin.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [plugins, searchQuery, selectedCategory]);

  const isSubscribed = (pluginId: string) => {
    return subscriptions.some(s => s.pluginId === pluginId && s.status === 'active');
  };

  const handlePluginClick = (plugin: Plugin) => {
    setSelectedPlugin(plugin);
    setPlan('monthly');
    setSeatCount(1);
    openModal('pluginDetail', plugin);
  };

  const handlePurchase = () => {
    if (!selectedPlugin) return;
    purchaseSubscription(selectedPlugin.id, plan, seatCount);
    setSelectedPlugin(null);
  };

  const handleCloseModal = () => {
    closeModal();
    setSelectedPlugin(null);
  };

  const totalPrice = selectedPlugin
    ? (plan === 'monthly' ? selectedPlugin.monthlyPrice : selectedPlugin.yearlyPrice) * seatCount
    : 0;

  const IconComponent = selectedPlugin ? iconMap[selectedPlugin.icon] || LayoutGrid : LayoutGrid;

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">插件市场</h1>
        <p className="text-text-secondary">发现优质插件，提升团队设计效率</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          placeholder="搜索插件..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefixIcon={<Search className="w-5 h-5" />}
          className="sm:w-80"
        />
        <Select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          options={categories}
          className="sm:w-48"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlugins.map((plugin) => {
          const PluginIcon = iconMap[plugin.icon] || LayoutGrid;
          const subscribed = isSubscribed(plugin.id);
          return (
            <Card
              key={plugin.id}
              hoverable
              clickable
              onClick={() => handlePluginClick(plugin)}
              className="flex flex-col"
            >
              <CardContent className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary-hover shadow-glow">
                    <PluginIcon className="w-6 h-6 text-white" />
                  </div>
                  {subscribed && (
                    <Badge variant="success">
                      <Check className="w-3 h-3 mr-1" />
                      已订阅
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{plugin.name}</h3>
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">{plugin.description}</p>
                <div className="flex items-center gap-4 text-sm text-text-muted mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span>{plugin.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{plugin.installCount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="info">{plugin.category}</Badge>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <div>
                  <span className="text-2xl font-bold text-text-primary">{formatCurrency(plugin.monthlyPrice)}</span>
                  <span className="text-sm text-text-muted">/月</span>
                </div>
                <Button
                  variant={subscribed ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePluginClick(plugin);
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {subscribed ? '管理' : '订阅'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {filteredPlugins.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-muted text-lg">没有找到匹配的插件</p>
        </div>
      )}

      {selectedPlugin && (
        <Modal
          title={selectedPlugin.name}
          onClose={handleCloseModal}
          className="max-w-2xl"
        >
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary to-primary-hover shadow-glow">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-text-primary mb-1">{selectedPlugin.name}</h3>
                <p className="text-text-secondary mb-3">{selectedPlugin.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-text-muted">作者：{selectedPlugin.authorName}</span>
                  <span className="text-text-muted">分类：{selectedPlugin.category}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 p-4 bg-surface-light rounded-xl">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-warning fill-warning" />
                <span className="text-lg font-semibold text-text-primary">{selectedPlugin.rating}</span>
                <span className="text-text-muted">({selectedPlugin.reviewCount} 评价)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-text-muted" />
                <span className="text-text-primary">{selectedPlugin.installCount.toLocaleString()} 安装</span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-3">主要功能</h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedPlugin.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-text-secondary">
                    <Check className="w-4 h-4 text-success" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h4 className="text-sm font-semibold text-text-primary mb-4">选择订阅方案</h4>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    plan === 'monthly'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setPlan('monthly')}
                >
                  <div className="text-sm text-text-muted mb-1">月付</div>
                  <div className="text-2xl font-bold text-text-primary">
                    {formatCurrency(selectedPlugin.monthlyPrice)}
                    <span className="text-sm font-normal text-text-muted">/月</span>
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
                  <div className="text-sm text-text-muted mb-1">年付</div>
                  <div className="text-2xl font-bold text-text-primary">
                    {formatCurrency(selectedPlugin.yearlyPrice)}
                    <span className="text-sm font-normal text-text-muted">/年</span>
                  </div>
                  <div className="text-xs text-success mt-1">省 2 个月费用</div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-text-primary mb-2">
                  席位数量
                </label>
                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                  >
                    -
                  </Button>
                  <span className="w-16 text-center text-lg font-semibold text-text-primary">
                    {seatCount}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSeatCount(Math.min(100, seatCount + 1))}
                  >
                    +
                  </Button>
                  <span className="text-sm text-text-muted ml-2">席位</span>
                </div>
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

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={handleCloseModal}
                  className="flex-1"
                >
                  取消
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePurchase}
                  className="flex-1"
                >
                  <ShoppingCart className="w-4 h-4" />
                  确认订阅
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </PageContainer>
  );
}
