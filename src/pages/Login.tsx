import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, Shield, Users, Code2, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { cn } from '../utils';

type Role = 'admin' | 'member' | 'author';

const roleOptions: { value: Role; label: string; icon: typeof Shield; description: string }[] = [
  { value: 'admin', label: '管理员', icon: Shield, description: '管理团队、订阅和付款' },
  { value: 'member', label: '团队成员', icon: Users, description: '使用插件、管理个人席位' },
  { value: 'author', label: '插件作者', icon: Code2, description: '发布插件、查看数据分析' },
];

const features = [
  '100+ 优质设计插件',
  '团队席位统一管理',
  '自动版本更新推送',
  '安全可靠的支付系统',
];

export default function Login() {
  const navigate = useNavigate();
  const { setCurrentRole } = useAppStore();
  const [selectedRole, setSelectedRole] = useState<Role>('admin');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setCurrentRole(selectedRole);
    setIsLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-success/20" />
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-success/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 flex flex-col justify-center p-12 lg:p-20 w-full">
          <div className="flex items-center gap-3 mb-12 animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-glow">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-primary">PluginHub</h1>
              <p className="text-text-muted">专业设计插件管理平台</p>
            </div>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-text-primary mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            让设计工作
            <span className="text-gradient"> 更高效</span>
          </h2>
          
          <p className="text-lg text-text-secondary mb-10 max-w-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
            一站式管理您的设计插件订阅，为团队提供统一的许可证管理和版本更新服务。
          </p>

          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-text-secondary">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-border/50 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                    alt="user"
                    className="w-10 h-10 rounded-full border-2 border-surface"
                  />
                ))}
              </div>
              <div>
                <p className="text-text-primary font-medium">10,000+ 设计师信赖</p>
                <p className="text-text-muted text-sm">已为团队节省 50% 管理时间</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center shadow-glow">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">PluginHub</h1>
              <p className="text-text-muted text-sm">插件管理平台</p>
            </div>
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
            欢迎回来
          </h2>
          <p className="text-text-secondary mb-8">请选择您的身份并登录</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                选择角色
              </label>
              <div className="grid grid-cols-1 gap-3">
                {roleOptions.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setSelectedRole(role.value)}
                      className={cn(
                        'flex items-start gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left',
                        isSelected
                          ? 'border-primary bg-primary/10 glow-border'
                          : 'border-border bg-surface hover:border-surface-light hover:bg-surface-light/50'
                      )}
                    >
                      <div className={cn(
                        'p-2.5 rounded-lg transition-colors',
                        isSelected ? 'bg-primary text-white' : 'bg-surface-light text-text-muted'
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          'font-medium',
                          isSelected ? 'text-primary' : 'text-text-primary'
                        )}>
                          {role.label}
                        </p>
                        <p className="text-sm text-text-muted mt-0.5">
                          {role.description}
                        </p>
                      </div>
                      <div className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                        isSelected ? 'border-primary bg-primary' : 'border-border'
                      )}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Input
              label="邮箱地址"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              prefixIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              size="lg"
              className="w-full group"
              loading={isLoading}
              disabled={!email}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              登录系统
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-text-muted text-sm">
              登录即表示您同意我们的
              <button className="text-primary hover:underline mx-1">服务条款</button>
              和
              <button className="text-primary hover:underline ml-1">隐私政策</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
