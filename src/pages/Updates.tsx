import { useState } from 'react';
import { RefreshCw, ChevronDown, ChevronUp, Zap, AlertTriangle, ArrowUpRight, Package, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatDate, getChangeTypeBadge, getChangeTypeText, cn } from '../utils';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';

export default function Updates() {
  const { versions, plugins } = useAppStore();
  const [selectedPlugin, setSelectedPlugin] = useState<string>('');
  const [expandedVersion, setExpandedVersion] = useState<string | null>(null);

  const sortedVersions = [...versions].sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  );

  const filteredVersions = selectedPlugin
    ? sortedVersions.filter((v) => v.pluginId === selectedPlugin)
    : sortedVersions;

  const pluginOptions = [
    { value: '', label: '全部插件' },
    ...plugins.map((p) => ({ value: p.id, label: p.name })),
  ];

  const toggleExpand = (id: string) => {
    setExpandedVersion(expandedVersion === id ? null : id);
  };

  return (
    <>
      <Sidebar />
      <Header />
      <PageContainer>
        <div className="animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                版本更新
              </h1>
              <p className="text-text-secondary">
                查看已订阅插件的版本更新记录
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select
                placeholder="筛选插件"
                value={selectedPlugin}
                onChange={(e) => setSelectedPlugin(e.target.value)}
                options={pluginOptions}
                className="w-48"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">
                    {sortedVersions.length}
                  </p>
                  <p className="text-sm text-text-secondary">总更新次数</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-success/20 to-success/5 border-success/20">
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/20">
                  <Check className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">
                    {sortedVersions.filter((v) => v.isCurrent).length}
                  </p>
                  <p className="text-sm text-text-secondary">当前版本</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-warning/20 to-warning/5 border-warning/20">
              <CardContent className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-warning/20">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text-primary">
                    {sortedVersions.filter((v) => v.changes.some((c) => c.type === 'breaking')).length}
                  </p>
                  <p className="text-sm text-text-secondary">破坏性更新</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-primary" />
                <CardTitle>更新时间线</CardTitle>
              </div>
              <CardDescription>按时间倒序展示所有版本更新</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredVersions.length === 0 ? (
                <div className="text-center py-12 text-text-secondary">
                  <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>暂无该插件的更新记录</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-0">
                    {filteredVersions.map((version, index) => {
                      const isExpanded = expandedVersion === version.id;
                      const hasBreaking = version.changes.some(
                        (c) => c.type === 'breaking'
                      );

                      return (
                        <div
                          key={version.id}
                          className={cn(
                            'relative pl-10',
                            index !== filteredVersions.length - 1 ? 'pb-6' : ''
                          )}
                        >
                          <div
                            className={cn(
                              'absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2 border-background z-10',
                              version.isCurrent
                                ? 'bg-primary'
                                : 'bg-surface-light'
                            )}
                          >
                            <Package
                              className={cn(
                                'w-4 h-4',
                                version.isCurrent
                                  ? 'text-white'
                                  : 'text-text-muted'
                              )}
                            />
                          </div>

                          <div
                            className={cn(
                              'rounded-xl border border-border bg-background hover:border-primary/30 transition-all duration-200 overflow-hidden'
                            )}
                          >
                            <div
                              className="flex items-start justify-between p-4 cursor-pointer"
                              onClick={() => toggleExpand(version.id)}
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <span className="font-semibold text-text-primary">
                                    {version.pluginName}
                                  </span>
                                  <Badge
                                    variant={
                                      version.isCurrent
                                        ? 'success'
                                        : 'info'
                                    }
                                  >
                                    v{version.version}
                                  </Badge>
                                  {version.isCurrent && (
                                    <Badge variant="success">最新</Badge>
                                  )}
                                  {hasBreaking && (
                                    <Badge variant="danger">破坏性</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-text-muted">
                                  {formatDate(version.releaseDate)}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="ml-4"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                            </div>

                            {isExpanded && (
                              <div className="px-4 pb-4 border-t border-border pt-4 animate-fade-in">
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-text-primary mb-2">
                                    更新说明
                                  </h4>
                                  <p className="text-text-secondary">
                                    {version.releaseNotes}
                                  </p>
                                </div>

                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-text-primary mb-2">
                                    变更内容
                                  </h4>
                                  <div className="space-y-2">
                                    {version.changes.map(
                                      (change, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-start gap-3 p-3 rounded-lg bg-surface"
                                        >
                                          <span
                                            className={cn(
                                              'px-2 py-0.5 rounded text-xs font-medium',
                                              getChangeTypeBadge(change.type)
                                            )}
                                          >
                                            {getChangeTypeText(change.type)}
                                          </span>
                                          <span className="text-text-secondary text-sm">
                                            {change.description}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-text-primary mb-2">
                                    兼容版本
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {version.compatibleWith.map(
                                      (compat, idx) => (
                                        <span
                                          key={idx}
                                          className="px-3 py-1 rounded-full bg-surface text-text-secondary text-xs"
                                        >
                                          {compat}
                                        </span>
                                      )
                                    )}
                                  </div>
                                </div>

                                {!version.isCurrent && (
                                  <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/10 border border-primary/20">
                                    <div className="p-2 rounded-lg bg-primary/20">
                                      <ArrowUpRight className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-text-primary">
                                        有新版本可用
                                      </p>
                                      <p className="text-sm text-text-secondary">
                                        建议升级到最新版本以获得最佳体验
                                      </p>
                                    </div>
                                    <Button size="sm">立即升级</Button>
                                  </div>
                                )}
                              </div>
                            )}
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
      </PageContainer>
    </>
  );
}
