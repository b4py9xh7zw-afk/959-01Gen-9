import { useState } from 'react';
import { CreditCard, Plus, Trash2, Star, Download, Calendar, Package } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency, formatDate, getStatusBadgeClass, getStatusText, maskCardNumber, cn } from '../utils';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import PageContainer from '../components/layout/PageContainer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';
import Modal from '../components/ui/Modal';

export default function Payments() {
  const {
    paymentMethods,
    subscriptions,
    invoices,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPayment,
    openModal,
    closeModal,
    isModalOpen,
    modalType,
  } = useAppStore();

  const [newCard, setNewCard] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardBrand: 'visa' as const,
  });

  const handleAddPayment = () => {
    const last4 = newCard.cardNumber.slice(-4);
    addPaymentMethod({
      cardBrand: newCard.cardBrand,
      last4,
      expiryMonth: parseInt(newCard.expiryMonth),
      expiryYear: parseInt(newCard.expiryYear),
      cardholderName: newCard.cardholderName,
      isDefault: paymentMethods.length === 0,
    });
    closeModal();
    setNewCard({ cardholderName: '', cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '', cardBrand: 'visa' });
  };

  const getCardGradient = (brand: string) => {
    const gradients: Record<string, string> = {
      visa: 'from-blue-600 to-blue-900',
      mastercard: 'from-orange-500 to-red-600',
      amex: 'from-blue-500 to-indigo-700',
      discover: 'from-orange-600 to-amber-500',
    };
    return gradients[brand] || 'from-gray-600 to-gray-800';
  };

  const getCardLogo = (brand: string) => {
    const logos: Record<string, string> = {
      visa: 'VISA',
      mastercard: 'Mastercard',
      amex: 'AMEX',
      discover: 'Discover',
    };
    return logos[brand] || brand;
  };

  return (
    <>
      <Sidebar />
      <Header />
      <PageContainer>
        <div className="animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">付款管理</h1>
              <p className="text-text-secondary">管理您的付款方式和订阅记录</p>
            </div>
          </div>

          <Tabs defaultValue="methods" className="mb-6">
            <TabsList>
              <TabsTrigger value="methods">付款方式</TabsTrigger>
              <TabsTrigger value="subscriptions">订阅记录</TabsTrigger>
              <TabsTrigger value="invoices">发票</TabsTrigger>
            </TabsList>

            <TabsContent value="methods">
            <div className="mb-4">
              <Button onClick={() => openModal('addPayment')}>
                <Plus className="w-4 h-4" />
                添加付款方式
              </Button>
            </div>
            <div>
              {paymentMethods.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 text-text-muted" />
                    <p className="text-text-secondary mb-4">暂无付款方式</p>
                    <Button onClick={() => openModal('addPayment')}>
                      <Plus className="w-4 h-4" />
                      添加第一张卡
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="group perspective-1000">
                      <div
                        className={cn(
                          'relative h-52 rounded-2xl p-6 text-white transform-gpu transition-all duration-500 hover:scale-105 hover:rotate-y-5 shadow-2xl bg-gradient-to-br',
                          getCardGradient(method.cardBrand),
                          method.isDefault && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                        )}
                        style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
                      >
                        <div className="flex justify-between items-start mb-8">
                          <div className="text-lg font-semibold opacity-90">{getCardLogo(method.cardBrand)}</div>
                          {method.isDefault && <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
                        </div>
                        <div className="text-xl font-mono tracking-wider mb-6">{maskCardNumber(method.last4, method.cardBrand)}</div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xs opacity-70 mb-1">持卡人</p>
                            <p className="font-medium">{method.cardholderName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs opacity-70 mb-1">有效期</p>
                            <p className="font-medium">{String(method.expiryMonth).padStart(2, '0')}/{String(method.expiryYear).slice(-2)}</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center gap-3">
                          {!method.isDefault && (
                            <Button size="sm" variant="secondary" onClick={() => setDefaultPayment(method.id)}>
                              <Star className="w-4 h-4" />设为默认
                            </Button>
                          )}
                          <Button size="sm" variant="danger" onClick={() => removePaymentMethod(method.id)}>
                            <Trash2 className="w-4 h-4" />删除
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            </TabsContent>

            <TabsContent value="subscriptions">
            <Card>
              <CardHeader>
                <CardTitle>订阅记录</CardTitle>
                <CardDescription>查看您的所有订阅历史和费用明细</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriptions.map((sub) => (
                    <div key={sub.id} className="p-5 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-primary/10">
                            <Package className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-text-primary">{sub.pluginName}</h4>
                              <Badge className={getStatusBadgeClass(sub.status)}>{getStatusText(sub.status)}</Badge>
                            </div>
                            <p className="text-sm text-text-secondary">{sub.plan === 'monthly' ? '月付' : '年付'} • {sub.seatCount} 席位</p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-text-muted">
                              <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />开始: {formatDate(sub.startDate)}</div>
                              <div className="flex items-center gap-1"><Calendar className="w-4 h-4" />结束: {formatDate(sub.endDate)}</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-text-primary">{formatCurrency(sub.amount)}</p>
                          <p className="text-sm text-text-muted">{sub.plan === 'monthly' ? '/月' : '/年'}</p>
                          <div className="mt-2 text-sm text-text-secondary">已使用 {sub.usedSeats}/{sub.seatCount} 席位</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>发票记录</CardTitle>
                <CardDescription>下载您的订阅发票</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <CreditCard className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{invoice.pluginName}</p>
                          <p className="text-sm text-text-muted">{formatDate(invoice.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusBadgeClass(invoice.status)}>{getStatusText(invoice.status)}</Badge>
                        <p className="font-semibold text-text-primary">{formatCurrency(invoice.amount, invoice.currency)}</p>
                        <Button variant="ghost" size="sm" onClick={() => window.open(invoice.pdfUrl)}>
                          <Download className="w-4 h-4" />下载
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </TabsContent>
          </Tabs>
        </div>
      </PageContainer>

      {isModalOpen && modalType === 'addPayment' && (
        <Modal title="添加付款方式" onClose={closeModal}>
          <div className="space-y-4">
            <Select
              label="卡品牌"
              value={newCard.cardBrand}
              onChange={(e) => setNewCard({ ...newCard, cardBrand: e.target.value as any })}
              options={[
                { value: 'visa', label: 'Visa' },
                { value: 'mastercard', label: 'Mastercard' },
                { value: 'amex', label: 'American Express' },
                { value: 'discover', label: 'Discover' },
              ]}
            />
            <Input
              label="持卡人姓名"
              placeholder="请输入持卡人姓名"
              value={newCard.cardholderName}
              onChange={(e) => setNewCard({ ...newCard, cardholderName: e.target.value })}
            />
            <Input
              label="卡号"
              placeholder="1234 5678 9012 3456"
              value={newCard.cardNumber}
              onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16) })}
              maxLength={16}
            />
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="月份"
                placeholder="MM"
                value={newCard.expiryMonth}
                onChange={(e) => setNewCard({ ...newCard, expiryMonth: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                maxLength={2}
              />
              <Input
                label="年份"
                placeholder="YYYY"
                value={newCard.expiryYear}
                onChange={(e) => setNewCard({ ...newCard, expiryYear: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                maxLength={4}
              />
              <Input
                label="CVV"
                placeholder="123"
                value={newCard.cvv}
                onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                maxLength={4}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" className="flex-1" onClick={closeModal}>取消</Button>
              <Button
                className="flex-1"
                onClick={handleAddPayment}
                disabled={!newCard.cardholderName || newCard.cardNumber.length !== 16 || !newCard.expiryMonth || !newCard.expiryYear || !newCard.cvv}
              >
                添加
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
