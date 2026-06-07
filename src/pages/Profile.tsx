import { useState } from 'react';
import {
  User,
  Mail,
  Building,
  Globe,
  Package,
  DollarSign,
  Users,
  Settings,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency, formatNumber } from '../utils';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';

export default function Profile() {
  const { currentUser, currentRole, authorProfile, authorStats, plugins } = useAppStore();
  const [name, setName] = useState(currentUser?.name ?? '');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [company, setCompany] = useState(authorProfile?.company || '');
  const [website, setWebsite] = useState(authorProfile?.website || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    versionUpdates: true,
    subscriptionUpdates: true,
    marketing: false,
  });

  const authorPlugins = plugins.filter(p => p.authorId === authorProfile?.id);

  if (!currentUser) {
    return null;
  }

  const handleSaveProfile = () => {
    alert('个人信息已保存');
  };

  const handleSavePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    if (newPassword.length < 8) {
      alert('密码长度至少为8位');
      return;
    }
    alert('密码已更新');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleSaveNotifications = () => {
    alert('通知设置已保存');
  };

  return (
    <>
      <Sidebar />
      <Header />
      <PageContainer>
        <div className="animate-fade-in">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">个人设置</h1>
            <p className="text-text-secondary">管理您的账户信息和偏好设置</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-24 h-24 rounded-full border-4 border-primary/20"
                    />
                    <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-1">
                    {currentUser.name}
                  </h3>
                  <p className="text-text-secondary mb-2">{currentUser.email}</p>
                  <Badge variant="info">
                    {currentRole === 'admin' ? '管理员' : currentRole === 'author' ? '作者' : '成员'}
                  </Badge>

                  {currentRole === 'author' && authorProfile && (
                    <div className="mt-6 pt-6 border-t border-border space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          插件数量
                        </span>
                        <span className="font-semibold text-text-primary">
                          {authorPlugins.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          总订阅数
                        </span>
                        <span className="font-semibold text-text-primary">
                          {formatNumber(authorStats.totalSubscribers)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          总收入
                        </span>
                        <span className="font-semibold text-text-primary">
                          {formatCurrency(authorStats.totalRevenue)}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-3">
              <Tabs defaultValue="profile">
                <TabsList>
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    个人信息
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    安全设置
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    通知偏好
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="pt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-primary" />
                        基本信息
                      </CardTitle>
                      <CardDescription>更新您的个人资料信息</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            姓名
                          </label>
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            prefixIcon={<User className="w-5 h-5" />}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-text-primary mb-2">
                            邮箱
                          </label>
                          <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            prefixIcon={<Mail className="w-5 h-5" />}
                          />
                        </div>
                        {currentRole === 'author' && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-text-primary mb-2">
                                公司/工作室
                              </label>
                              <Input
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                prefixIcon={<Building className="w-5 h-5" />}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-text-primary mb-2">
                                个人网站
                              </label>
                              <Input
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                prefixIcon={<Globe className="w-5 h-5" />}
                                placeholder="https://"
                              />
                            </div>
                          </>
                        )}
                      </div>

                      <div className="flex justify-end mt-8">
                        <Button onClick={handleSaveProfile} size="lg">
                          <Save className="w-4 h-4" />
                          保存更改
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="pt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary" />
                        修改密码
                      </CardTitle>
                      <CardDescription>定期更改密码以保护账户安全</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          当前密码
                        </label>
                        <div className="relative">
                          <Input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            prefixIcon={<Lock className="w-5 h-5" />}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          新密码
                        </label>
                        <div className="relative">
                          <Input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            prefixIcon={<Lock className="w-5 h-5" />}
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-text-muted mt-2">
                          密码长度至少为8位，建议包含大小写字母和数字
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          确认新密码
                        </label>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            prefixIcon={<Lock className="w-5 h-5" />}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button onClick={handleSavePassword} size="lg">
                          <Save className="w-4 h-4" />
                          更新密码
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="pt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary" />
                        通知偏好设置
                      </CardTitle>
                      <CardDescription>选择您希望接收的通知类型</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-surface-light">
                        <div className="flex-1">
                          <h4 className="font-medium text-text-primary">邮件通知</h4>
                          <p className="text-sm text-text-muted">接收重要更新和账单邮件</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            notifications.email ? 'bg-primary' : 'bg-surface'
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                              notifications.email ? 'translate-x-7' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-surface-light">
                        <div className="flex-1">
                          <h4 className="font-medium text-text-primary">推送通知</h4>
                          <p className="text-sm text-text-muted">接收浏览器推送通知</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, push: !notifications.push })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            notifications.push ? 'bg-primary' : 'bg-surface'
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                              notifications.push ? 'translate-x-7' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {currentRole === 'author' && (
                        <>
                          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-light">
                            <div className="flex-1">
                              <h4 className="font-medium text-text-primary">版本更新通知</h4>
                              <p className="text-sm text-text-muted">当您的插件有新版本发布时通知</p>
                            </div>
                            <button
                              onClick={() => setNotifications({ ...notifications, versionUpdates: !notifications.versionUpdates })}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                notifications.versionUpdates ? 'bg-primary' : 'bg-surface'
                              }`}
                            >
                              <div
                                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                  notifications.versionUpdates ? 'translate-x-7' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-light">
                            <div className="flex-1">
                              <h4 className="font-medium text-text-primary">订阅更新通知</h4>
                              <p className="text-sm text-text-muted">当有新订阅或取消订阅时通知</p>
                            </div>
                            <button
                              onClick={() => setNotifications({ ...notifications, subscriptionUpdates: !notifications.subscriptionUpdates })}
                              className={`relative w-12 h-6 rounded-full transition-colors ${
                                notifications.subscriptionUpdates ? 'bg-primary' : 'bg-surface'
                              }`}
                            >
                              <div
                                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                                  notifications.subscriptionUpdates ? 'translate-x-7' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </>
                      )}

                      <div className="flex items-center justify-between p-4 rounded-xl bg-surface-light">
                        <div className="flex-1">
                          <h4 className="font-medium text-text-primary">营销邮件</h4>
                          <p className="text-sm text-text-muted">接收产品更新和促销信息</p>
                        </div>
                        <button
                          onClick={() => setNotifications({ ...notifications, marketing: !notifications.marketing })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            notifications.marketing ? 'bg-primary' : 'bg-surface'
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                              notifications.marketing ? 'translate-x-7' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex justify-end pt-2">
                        <Button onClick={handleSaveNotifications} size="lg">
                          <Save className="w-4 h-4" />
                          保存设置
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </PageContainer>
    </>
  );
}

function Camera(props: { className?: string }) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}
