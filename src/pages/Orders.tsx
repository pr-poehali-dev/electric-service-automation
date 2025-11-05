import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import { Order, ElectricalItem } from '@/types/electrical';
import ContactModal from '@/components/ContactModal';
import ProductSelectionModal from '@/components/ProductSelectionModal';
import CalculatorModal from '@/components/CalculatorModal';
import BottomMenu from '@/components/BottomMenu';
import PageHeader from '@/components/PageHeader';
import PageNavigation from '@/components/PageNavigation';
import OrderStatusManager from '@/components/orders/OrderStatusManager';
import OrderDetailModal from '@/components/orders/OrderDetailModal';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';

const STATUS_LABELS = {
  'pending': 'Ожидает',
  'confirmed': 'Подтверждена',
  'in-progress': 'В работе',
  'completed': 'Завершена'
};

const STATUS_COLORS = {
  'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'confirmed': 'bg-blue-100 text-blue-800 border-blue-300',
  'in-progress': 'bg-orange-100 text-orange-800 border-orange-300',
  'completed': 'bg-green-100 text-green-800 border-green-300'
};

const getServiceTypeLabel = (items: ElectricalItem[]) => {
  const hasInstallation = items.some(item => 
    item.category === 'установка' || 
    item.category === 'монтаж розеток и выключателей'
  );
  const hasWiring = items.some(item => item.category === 'проводка и кабели');
  const hasLighting = items.some(item => item.category === 'освещение');
  
  if (hasInstallation && hasWiring) return 'Комплексная установка';
  if (hasInstallation) return 'Установка оборудования';
  if (hasWiring) return 'Прокладка кабелей';
  if (hasLighting) return 'Освещение';
  return 'Электромонтаж';
};

export default function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, clearCart, updateOrderStatus, addToCart, assignExecutor } = useCart();
  const { isAuthenticated } = useAuth();
  const permissions = usePermissions();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleNewOrder = () => {
    clearCart();
    navigate('/products');
  };

  const handleRepeatOrder = (order: Order) => {
    clearCart();
    order.items.forEach(item => {
      addToCart(item);
    });
    navigate('/cart');
  };

  useEffect(() => {
    const newOrderId = location.state?.newOrderId;
    if (newOrderId) {
      const order = orders.find(o => o.id === newOrderId);
      if (order) {
        setSelectedOrder(order);
      }
    }
  }, [location.state, orders]);

  const filteredOrders = orders.filter(order => {
    if (!order || !order.items) return false;
    
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    
    if (serviceTypeFilter !== 'all') {
      const serviceType = getServiceTypeLabel(order.items);
      if (serviceType !== serviceTypeFilter) return false;
    }
    
    if (dateFilter) {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      if (orderDate !== dateFilter) return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesId = order.id?.toLowerCase().includes(query);
      const matchesAddress = order.address?.toLowerCase().includes(query);
      const matchesPhone = order.phone?.toLowerCase().includes(query);
      if (!matchesId && !matchesAddress && !matchesPhone) return false;
    }
    
    return true;
  });

  const serviceTypes = Array.from(new Set(orders.map(order => getServiceTypeLabel(order.items))));

  const hasActiveFilters = statusFilter !== 'all' || serviceTypeFilter !== 'all' || dateFilter !== '' || searchQuery !== '';

  const clearFilters = () => {
    setStatusFilter('all');
    setServiceTypeFilter('all');
    setDateFilter('');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-24">
      <PageHeader />

      <div className="max-w-md mx-auto">
        <PageNavigation onContactClick={() => setShowContactModal(true)} />
        
        <div className="bg-white shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800">Мои заявки</h1>
          <p className="text-gray-600 mt-2">История ваших заказов</p>
        </div>

        {orders.length > 0 && (
          <div className="p-4 space-y-3 bg-white border-b">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Поиск по номеру, адресу, телефону"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={clearFilters}
                  title="Сбросить фильтры"
                >
                  <Icon name="X" size={18} />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="pending">Ожидает</SelectItem>
                  <SelectItem value="confirmed">Подтверждена</SelectItem>
                  <SelectItem value="in-progress">В работе</SelectItem>
                  <SelectItem value="completed">Завершена</SelectItem>
                </SelectContent>
              </Select>

              <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все типы</SelectItem>
                  {serviceTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="text-sm"
              />
            </div>

            {hasActiveFilters && (
              <p className="text-sm text-gray-600">
                Найдено: {filteredOrders.length} из {orders.length}
              </p>
            )}
          </div>
        )}

        <div className="p-6 space-y-4">
          {filteredOrders.length === 0 && orders.length > 0 && (
            <Card className="p-8 text-center">
              <Icon name="FileX" size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Ничего не найдено</h3>
              <p className="text-gray-600 mb-4">Попробуйте изменить параметры фильтрации</p>
              <Button onClick={clearFilters} variant="outline">
                Сбросить фильтры
              </Button>
            </Card>
          )}

          {filteredOrders.length === 0 && orders.length === 0 && (
            <Card className="p-8 text-center animate-fadeIn">
              <Icon name="Package" size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">У вас пока нет заявок</h3>
              <p className="text-gray-600 mb-4">Создайте первый заказ на электромонтажные работы</p>
              <Button onClick={handleNewOrder} className="w-full">
                Создать заявку
              </Button>
            </Card>
          )}

          {filteredOrders.map((order) => (
            <Card key={order.id} className="p-5 hover:shadow-lg transition-all cursor-pointer animate-fadeIn">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">#{order.id.slice(-6)}</h3>
                    <span className={`text-xs font-semibold py-1 px-3 rounded-full border ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{getServiceTypeLabel(order.items)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  {order.assignedToName && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-lg w-fit">
                      <Icon name="User" size={12} />
                      <span>{order.assignedToName}</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">{(order.totalAmount || 0).toLocaleString()} ₽</p>
                  <p className="text-xs text-gray-500">{order.items?.length || 0} услуг</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedOrder(order)}
                >
                  <Icon name="Eye" size={16} className="mr-2" />
                  Подробнее
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex-1"
                  onClick={() => handleRepeatOrder(order)}
                  title="Повторить заказ"
                >
                  <Icon name="RefreshCw" size={16} className="mr-2" />
                  Повторить
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="px-6 pb-6">
          <Button 
            onClick={handleNewOrder}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-6 rounded-xl shadow-lg"
          >
            <Icon name="Plus" size={20} className="mr-2" />
            Создать новую заявку
          </Button>
        </div>
      </div>

      <BottomMenu 
        onContactClick={() => setShowContactModal(true)}
        onProductsClick={() => setShowProductModal(true)}
        onCalculatorClick={() => setShowCalculatorModal(true)}
      />

      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
      {showProductModal && <ProductSelectionModal onClose={() => setShowProductModal(false)} />}
      {showCalculatorModal && <CalculatorModal onClose={() => setShowCalculatorModal(false)} />}
      
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={updateOrderStatus}
          onRepeatOrder={handleRepeatOrder}
          onAssignExecutor={assignExecutor}
        />
      )}
    </div>
  );
}