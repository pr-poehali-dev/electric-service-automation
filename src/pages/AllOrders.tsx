import { useState, useMemo, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import { Order, ElectricalItem } from '@/types/electrical';
import PageHeader from '@/components/PageHeader';
import PageNavigation from '@/components/PageNavigation';
import ContactModal from '@/components/ContactModal';
import OrderDetailModal from '@/components/orders/OrderDetailModal';
import RoleGate from '@/components/auth/RoleGate';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useGoogleAutoSync } from '@/hooks/useGoogleAutoSync';

const STATUS_LABELS = {
  'pending': 'Ожидает',
  'confirmed': 'Подтверждена',
  'in-progress': 'В работе',
  'completed': 'Завершена'
};

const STATUS_COLORS = {
  'pending': 'bg-yellow-100 text-yellow-800',
  'confirmed': 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-orange-100 text-orange-800',
  'completed': 'bg-green-100 text-green-800'
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

const AllOrderCard = memo(({ order, onViewDetails, updateOrderStatus }: { order: Order; onViewDetails: (order: Order) => void; updateOrderStatus: (orderId: string, status: Order['status']) => void }) => {
  return (
    <Card 
      className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-l-4 border-l-primary shadow-md"
      onClick={() => onViewDetails(order)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-gray-800">Заявка #{order.id.slice(-6)}</h3>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2 font-medium">{getServiceTypeLabel(order.items)}</p>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Icon name="Clock" size={14} />
            <span>
              {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          {order.assignedToName && (
            <div className="flex items-center gap-2 mt-3 text-xs text-green-700 bg-green-50 px-3 py-1.5 rounded-lg w-fit">
              <Icon name="User" size={14} />
              <span className="font-medium">Исполнитель: {order.assignedToName}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {(order.totalAmount || 0).toLocaleString()} ₽
          </p>
          <p className="text-xs text-gray-500 mt-1">{order.items?.length || 0} услуг</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Icon name="Phone" size={16} className="text-primary" />
          <span className="text-gray-700 font-medium">{order.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="MapPin" size={16} className="text-primary" />
          <span className="text-gray-700">{order.address || 'Не указан'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Zap" size={16} className="text-primary" />
          <span className="text-gray-700">{order.totalPoints} точек</span>
        </div>
        <div className="flex items-center gap-2">
          <Icon name="Cable" size={16} className="text-primary" />
          <span className="text-gray-700">~{order.estimatedCable}м кабеля</span>
        </div>
      </div>

      <div className="flex gap-2">
        {order.status === 'pending' && (
          <Button
            size="lg"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              updateOrderStatus(order.id, 'confirmed');
            }}
          >
            <Icon name="CheckCircle" size={18} className="mr-2" />
            Подтвердить
          </Button>
        )}
        {order.status === 'confirmed' && (
          <Button
            size="lg"
            className="w-full bg-orange-600 hover:bg-orange-700"
            onClick={(e) => {
              e.stopPropagation();
              updateOrderStatus(order.id, 'in-progress');
            }}
          >
            <Icon name="Wrench" size={18} className="mr-2" />
            В работу
          </Button>
        )}
        {order.status === 'in-progress' && (
          <Button
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={(e) => {
              e.stopPropagation();
              updateOrderStatus(order.id, 'completed');
            }}
          >
            <Icon name="CheckCircle2" size={18} className="mr-2" />
            Завершить
          </Button>
        )}
      </div>
    </Card>
  );
});

AllOrderCard.displayName = 'AllOrderCard';

export default function AllOrders() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, assignExecutor, addToCart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const permissions = usePermissions();
  const [showContactModal, setShowContactModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Order['status'] | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  
  const filteredOrders = useMemo(() => {
    let filtered = orders;
    
    if (!permissions.isAdmin && user) {
      filtered = orders.filter(order => 
        order.status === 'pending' || order.assignedTo === user.uid
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }
    
    return filtered;
  }, [orders, filterStatus, permissions.isAdmin, user]);

  const rowVirtualizer = useVirtualizer({
    count: filteredOrders.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 240,
    overscan: 3,
  });
  
  useGoogleAutoSync(orders);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <Card className="p-8 text-center">
          <Icon name="Lock" size={48} className="mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">Доступ ограничен</h2>
          <p className="text-gray-600 mb-4">Для просмотра всех заказов необходимо войти в систему</p>
          <Button onClick={() => navigate('/')}>На главную</Button>
        </Card>
      </div>
    );
  }

  return (
    <RoleGate 
      allowedRoles={['electrician', 'admin']}
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6">
          <Card className="p-8 text-center">
            <Icon name="ShieldAlert" size={48} className="mx-auto mb-4 text-red-400" />
            <h2 className="text-2xl font-bold mb-2">Недостаточно прав</h2>
            <p className="text-gray-600 mb-4">Эта страница доступна только электрикам и администраторам</p>
            <Button onClick={() => navigate('/')}>На главную</Button>
          </Card>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-24">
        <PageHeader />

        <div className="max-w-4xl mx-auto">
          <PageNavigation onContactClick={() => setShowContactModal(true)} />

          <div className="p-6 space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
                Все заявки
              </h1>
              <p className="text-gray-600">Управление заявками на электромонтажные работы</p>
            </div>

            <Tabs value={filterStatus} onValueChange={(v) => setFilterStatus(v as Order['status'] | 'all')} className="w-full">
              <TabsList className="w-full grid grid-cols-5 h-auto bg-gradient-to-br from-blue-100 to-indigo-100 p-1">
                <TabsTrigger value="all" className="flex-col py-2 px-1 data-[state=active]:bg-white data-[state=active]:shadow-md">
                  <span className="text-lg font-bold">{orders.length}</span>
                  <span className="text-xs">Все</span>
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex-col py-2 px-1 data-[state=active]:bg-white data-[state=active]:shadow-md">
                  <span className="text-lg font-bold">{orders.filter(o => o.status === 'pending').length}</span>
                  <span className="text-xs">Новые</span>
                </TabsTrigger>
                <TabsTrigger value="confirmed" className="flex-col py-2 px-1 data-[state=active]:bg-white data-[state=active]:shadow-md">
                  <span className="text-lg font-bold">{orders.filter(o => o.status === 'confirmed').length}</span>
                  <span className="text-xs">Принято</span>
                </TabsTrigger>
                <TabsTrigger value="in-progress" className="flex-col py-2 px-1 data-[state=active]:bg-white data-[state=active]:shadow-md">
                  <span className="text-lg font-bold">{orders.filter(o => o.status === 'in-progress').length}</span>
                  <span className="text-xs">В работе</span>
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex-col py-2 px-1 data-[state=active]:bg-white data-[state=active]:shadow-md">
                  <span className="text-lg font-bold">{orders.filter(o => o.status === 'completed').length}</span>
                  <span className="text-xs">Готово</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {filteredOrders.length === 0 ? (
              <Card className="p-12 text-center shadow-md">
                <div className="mb-4">
                  <div className="w-20 h-20 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                    <Icon name="ClipboardList" size={40} className="text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">Заявок не найдено</h3>
                <p className="text-gray-600">
                  {filterStatus === 'all' ? 'Здесь появятся заявки на электромонтажные работы' : `В статусе "${STATUS_LABELS[filterStatus as Order['status']]}" нет заявок`}
                </p>
              </Card>
            ) : (
              <div
                ref={parentRef}
                className="overflow-auto"
                style={{ height: 'calc(100vh - 350px)', minHeight: '500px' }}
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const order = filteredOrders[virtualRow.index];
                    return (
                      <div
                        key={virtualRow.key}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <div className="pb-4">
                          <AllOrderCard
                            order={order}
                            onViewDetails={setSelectedOrder}
                            updateOrderStatus={updateOrderStatus}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />
        
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={updateOrderStatus}
            onRepeatOrder={(order) => {
              clearCart();
              order.items.forEach(item => addToCart(item.product, item.quantity));
              navigate('/cart');
            }}
            onAssignExecutor={assignExecutor}
          />
        )}
      </div>
    </RoleGate>
  );
}