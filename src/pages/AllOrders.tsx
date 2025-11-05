import { useState, useMemo, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import { Order, ElectricalItem } from '@/types/electrical';
import PageHeader from '@/components/PageHeader';
import PageNavigation from '@/components/PageNavigation';
import ContactModal from '@/components/ContactModal';
import OrderDetailModal from '@/components/orders/OrderDetailModal';
import RoleGate from '@/components/auth/RoleGate';
import { useAuth } from '@/contexts/AuthContext';

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
      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onViewDetails(order)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold">Заявка #{order.id.slice(-6)}</h3>
            <span className={`text-xs px-3 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">{getServiceTypeLabel(order.items)}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          {order.assignedToName && (
            <div className="flex items-center gap-1 mt-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-lg w-fit">
              <Icon name="User" size={12} />
              <span>Исполнитель: {order.assignedToName}</span>
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-primary">{(order.totalAmount || 0).toLocaleString()} ₽</p>
          <p className="text-xs text-gray-500">{order.items?.length || 0} услуг</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <Icon name="Phone" size={14} className="inline mr-2 text-gray-500" />
          <span className="text-gray-700">{order.phone}</span>
        </div>
        <div>
          <Icon name="MapPin" size={14} className="inline mr-2 text-gray-500" />
          <span className="text-gray-700">{order.address || 'Не указан'}</span>
        </div>
        <div>
          <Icon name="Zap" size={14} className="inline mr-2 text-gray-500" />
          <span className="text-gray-700">{order.totalPoints} точек</span>
        </div>
        <div>
          <Icon name="Cable" size={14} className="inline mr-2 text-gray-500" />
          <span className="text-gray-700">~{order.estimatedCable}м кабеля</span>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {order.status === 'pending' && (
          <Button
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              updateOrderStatus(order.id, 'confirmed');
            }}
          >
            <Icon name="CheckCircle" size={14} className="mr-1" />
            Подтвердить
          </Button>
        )}
        {order.status === 'confirmed' && (
          <Button
            size="sm"
            className="flex-1 bg-orange-600 hover:bg-orange-700"
            onClick={(e) => {
              e.stopPropagation();
              updateOrderStatus(order.id, 'in-progress');
            }}
          >
            <Icon name="Wrench" size={14} className="mr-1" />
            В работу
          </Button>
        )}
        {order.status === 'in-progress' && (
          <Button
            size="sm"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={(e) => {
              e.stopPropagation();
              updateOrderStatus(order.id, 'completed');
            }}
          >
            <Icon name="CheckCircle2" size={14} className="mr-1" />
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
  const { isAuthenticated } = useAuth();
  const [showContactModal, setShowContactModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<Order['status'] | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

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

  const filteredOrders = useMemo(() => 
    filterStatus === 'all' 
      ? orders 
      : orders.filter(order => order.status === filterStatus),
    [orders, filterStatus]
  );

  const rowVirtualizer = useVirtualizer({
    count: filteredOrders.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 240,
    overscan: 3,
  });

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
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-800">Все заявки</h1>
              <div className="flex items-center gap-2">
                <Icon name="ClipboardList" size={24} className="text-primary" />
                <span className="text-lg font-semibold text-gray-600">{filteredOrders.length}</span>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                size="sm"
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                Все ({orders.length})
              </Button>
              {Object.entries(STATUS_LABELS).map(([status, label]) => {
                const count = orders.filter(o => o.status === status).length;
                return (
                  <Button
                    key={status}
                    size="sm"
                    variant={filterStatus === status ? 'default' : 'outline'}
                    onClick={() => setFilterStatus(status as Order['status'])}
                  >
                    {label} ({count})
                  </Button>
                );
              })}
            </div>

            {filteredOrders.length === 0 ? (
              <Card className="p-12 text-center">
                <Icon name="Inbox" size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 text-lg">Заявок не найдено</p>
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