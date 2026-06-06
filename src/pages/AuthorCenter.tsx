import { useState } from 'react';
import { Users, UserCheck, DollarSign, TrendingUp, Shield, Upload, Package, AlertTriangle, BarChart3 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency, formatNumber } from '../utils';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import StatCard from '../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';
import DonutChart from '../components/charts/DonutChart';
import type { Version } from '../types';

export default function AuthorCenter() {
  const {
    authorStats,
    plugins,
    versions,
    authorProfile,
    openModal,
    closeModal,
    isModalOpen,
    modalType,
    publishVersion,
  } = useAppStore();

  const [selectedPlugin, setSelectedPlugin] = useState('');
  const [versionNumber, setVersionNumber] = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [compatibleWith, setCompatibleWith] = useState('');
  const [changeType, setChangeType] = useState<'feature' | 'fix' | 'improvement' | 'breaking'>('feature');
  const [changeDescription, setChangeDescription] = useState('');
  const [changes, setChanges] = useState<Version['changes']>([]);

  const authorPlugins = plugins.filter(p => p.authorId === authorProfile.id);

  const subscriberTrendData = authorStats.monthlySubscribers.map(item => ({
    name: item.month,
    value: item.count,
  }));

  const versionDistData = authorStats.versionDistribution.map(item => ({
    name: item.version,
    value: item.count,
  }));

  const pluginPerfData = authorStats.pluginPerformance.map(item => ({
    name: item.pluginName,
    value: item.subscribers,
    revenue: item.revenue,
  }));

  const pluginOptions = authorPlugins.map(p => ({
    value: p.id,
    label: p.name,
  }));

  const handleAddChange = () => {
    if (!changeDescription.trim()) return;
    setChanges([...changes, { type: changeType, description: changeDescription.trim() }]);
    setChangeDescription('');
  };

  const handleRemoveChange = (index: number) => {
    setChanges(changes.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    if (!selectedPlugin || !versionNumber || !releaseNotes || changes.length === 0) return;

    publishVersion({
      pluginId: selectedPlugin,
      version: versionNumber,
      releaseNotes: releaseNotes.trim(),
      compatibleWith: compatibleWith ? compatibleWith.split(',').map(s => s.trim()) : [],
      changes,
    });

    setSelectedPlugin('');
    setVersionNumber('');
    setReleaseNotes('');
    setCompatibleWith('');
    setChanges([]);
  };

  const handleOpenPublishModal = () => {
    openModal('publishVersion');
  };

  const handleCloseModal = () => {
    closeModal();
    setSelectedPlugin('');
    setVersionNumber('');
    setReleaseNotes('');
    setCompatibleWith('');
    setChanges([]);
  };

  return (
    <>
      <Sidebar />
      <Header />
      <PageContainer>
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">作者中心</h1>
              <p className="text-text-secondary">查看您的插件表现和收入概览</p>
            </div>
            <Button onClick={handleOpenPublishModal}>
              <Upload className="w-4 h-4" />
              发布新版本
            </Button>
          </div>

          <div className="mb-6 p-4 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-warning/20 flex-shrink-0">
              <Shield className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h4 className="font-semibold text-warning mb-1">隐私保护承诺</h4>
              <p className="text-sm text-text-secondary">
                本系统<strong className="text-text-primary">不存储、不访问</strong>任何客户设计文件。
                所有插件运行均在用户本地环境执行，您的用户数据和设计资产完全由用户掌控。
                我们仅收集插件运行所需的匿名统计数据用于产品优化。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="总订阅数"
              value={formatNumber(authorStats.totalSubscribers)}
              change={12.5}
              icon={Users}
              gradientFrom="from-primary"
              gradientTo="to-cyan-600"
              className="animate-slide-up"
            />
            <StatCard
              title="活跃用户"
              value={formatNumber(authorStats.activeUsers)}
              change={8.3}
              icon={UserCheck}
              gradientFrom="from-success"
              gradientTo="to-emerald-600"
              className="animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            />
            <StatCard
              title="总收入"
              value={formatCurrency(authorStats.totalRevenue)}
              change={15.2}
              icon={DollarSign}
              gradientFrom="from-warning"
              gradientTo="to-amber-600"
              className="animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  订阅数趋势
                </CardTitle>
                <CardDescription>近6个月订阅用户增长情况</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <LineChart
                    data={subscriberTrendData}
                    strokeColor="#06B6D4"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-success" />
                  版本分布
                </CardTitle>
                <CardDescription>用户使用的插件版本分布</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <DonutChart
                    data={versionDistData}
                    innerRadius={55}
                    outerRadius={85}
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {versionDistData.map((item, idx) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: ['#06B6D4', '#10B981', '#F59E0B', '#F43F5E'][idx] }}
                      />
                      <span className="text-sm text-text-secondary">
                        {item.name}: {formatNumber(item.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-warning" />
                插件表现
              </CardTitle>
              <CardDescription>各插件订阅用户数量对比</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <BarChart
                  data={pluginPerfData}
                  fillColor="#06B6D4"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {pluginPerfData.map((item, idx) => (
                  <div
                    key={item.name}
                    className="p-4 rounded-xl bg-surface-light"
                    style={{ animationDelay: `${0.6 + idx * 0.1}s` }}
                  >
                    <p className="text-sm text-text-muted mb-1">{item.name}</p>
                    <p className="text-xl font-bold text-text-primary">
                      {formatNumber(item.value)} 订阅
                    </p>
                    <p className="text-sm text-success mt-1">
                      {formatCurrency(item.revenue)} 收入
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>

      {isModalOpen && modalType === 'publishVersion' && (
        <Modal
          title="发布新版本"
          onClose={handleCloseModal}
          className="max-w-2xl"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                选择插件 <span className="text-danger">*</span>
              </label>
              <Select
                value={selectedPlugin}
                onChange={(e) => setSelectedPlugin(e.target.value)}
                options={[{ value: '', label: '请选择插件' }, ...pluginOptions]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                版本号 <span className="text-danger">*</span>
              </label>
              <Input
                placeholder="例如: 1.0.0"
                value={versionNumber}
                onChange={(e) => setVersionNumber(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                兼容版本
              </label>
              <Input
                placeholder="例如: Figma 2024+, Sketch 90+"
                value={compatibleWith}
                onChange={(e) => setCompatibleWith(e.target.value)}
              />
              <p className="text-xs text-text-muted mt-1">多个版本用逗号分隔</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                发布说明 <span className="text-danger">*</span>
              </label>
              <textarea
                className="w-full h-24 px-3 py-2 rounded-lg bg-surface-light border border-border text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="描述此版本的主要更新内容..."
                value={releaseNotes}
                onChange={(e) => setReleaseNotes(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                更新日志 <span className="text-danger">*</span>
              </label>
              <div className="flex gap-2 mb-2">
                <Select
                  value={changeType}
                  onChange={(e) => setChangeType(e.target.value as any)}
                  options={[
                    { value: 'feature', label: '新功能' },
                    { value: 'fix', label: '修复' },
                    { value: 'improvement', label: '优化' },
                    { value: 'breaking', label: '破坏性' },
                  ]}
                  className="w-32"
                />
                <Input
                  placeholder="更新内容描述"
                  value={changeDescription}
                  onChange={(e) => setChangeDescription(e.target.value)}
                  className="flex-1"
                />
                <Button variant="secondary" onClick={handleAddChange}>
                  添加
                </Button>
              </div>
              {changes.length > 0 ? (
                <div className="space-y-2">
                  {changes.map((change, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-surface-light"
                    >
                      <div className="flex items-center gap-2">
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
                        <span className="text-sm text-text-primary">{change.description}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveChange(idx)}
                        className="text-text-muted hover:text-danger transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-lg border border-dashed border-border text-center text-text-muted text-sm">
                  暂无更新内容，请添加至少一条更新日志
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <p className="text-sm text-text-secondary">
                请确保新版本<strong className="text-text-primary">不包含任何访问用户设计文件</strong>的代码。
                所有插件功能必须在用户本地环境运行，严禁上传或存储用户数据。
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                className="flex-1"
              >
                取消
              </Button>
              <Button
                variant="primary"
                onClick={handlePublish}
                disabled={!selectedPlugin || !versionNumber || !releaseNotes || changes.length === 0}
                className="flex-1"
              >
                <Upload className="w-4 h-4" />
                发布版本
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
