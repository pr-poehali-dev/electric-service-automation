import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import { Order } from '@/types/electrical';

const STATUS_LABELS = {
  'pending': 'Ожидает подтверждения',
  'confirmed': 'Подтверждена',
  'in-progress': 'В работе',
  'completed': 'Завершена'
};

const STATUS_ICONS = {
  'pending': 'Clock',
  'confirmed': 'CheckCircle',
  'in-progress': 'Wrench',
  'completed': 'CheckCircle2'
};

const STATUS_COLORS = {
  'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'confirmed': 'bg-blue-100 text-blue-800 border-blue-300',
  'in-progress': 'bg-orange-100 text-orange-800 border-orange-300',
  'completed': 'bg-green-100 text-green-800 border-green-300'
};

export default function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orders } = useCart();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const newOrderId = location.state?.newOrderId;
    if (newOrderId) {
      const order = orders.find(o => o.id === newOrderId);
      if (order) {
        setSelectedOrder(order);
      }
    }
  }, [location.state, orders]);

  const getProgressPercentage = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 25;
      case 'confirmed': return 50;
      case 'in-progress': return 75;
      case 'completed': return 100;
      default: return 0;
    }
  };

  if (selectedOrder) {
    const progress = getProgressPercentage(selectedOrder.status);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow-md p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedOrder(null)}
              >
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <h1 className="text-2xl font-bold flex-1">Заявка {selectedOrder.id}</h1>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <Card className="p-6">
              <h2 className="font-bold text-lg mb-4">Статус выполнения</h2>
              
              <div className="relative pt-1 mb-6">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full ${STATUS_COLORS[selectedOrder.status]}`}>
                      {STATUS_LABELS[selectedOrder.status]}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-primary">
                      {progress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div 
                    style={{ width: `${progress}%` }} 
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    progress >= 25 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <Icon name="FileText" size={16} />
                  </div>
                  <span className={progress >= 25 ? 'font-semibold' : 'text-muted-foreground'}>
                    Заявка создана
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    progress >= 50 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <Icon name="CheckCircle" size={16} />
                  </div>
                  <span className={progress >= 50 ? 'font-semibold' : 'text-muted-foreground'}>
                    Подтверждена мастером
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    progress >= 75 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <Icon name="Wrench" size={16} />
                  </div>
                  <span className={progress >= 75 ? 'font-semibold' : 'text-muted-foreground'}>
                    Работы начаты
                  </span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    progress >= 100 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    <Icon name="CheckCircle2" size={16} />
                  </div>
                  <span className={progress >= 100 ? 'font-semibold' : 'text-muted-foreground'}>
                    Работы завершены
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-bold text-lg mb-4">Детали заявки</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Дата:</span>
                  <span className="font-semibold">{selectedOrder.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Время:</span>
                  <span className="font-semibold">{selectedOrder.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Адрес:</span>
                  <span className="font-semibold text-right">{selectedOrder.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Телефон:</span>
                  <span className="font-semibold">{selectedOrder.phone}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <h2 className="font-bold text-lg mb-4">Расчёты</h2>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Выключателей:</span>
                  <span className="font-bold">{selectedOrder.totalSwitches}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Розеток:</span>
                  <span className="font-bold">{selectedOrder.totalOutlets}</span>
                </div>
                <div className="h-px bg-blue-200 my-2" />
                <div className="flex justify-between">
                  <span>Всего точек:</span>
                  <span className="font-bold text-lg text-primary">{selectedOrder.totalPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span>Метраж кабеля:</span>
                  <span className="font-bold text-lg text-primary">~{selectedOrder.estimatedCable} м</span>
                </div>
                <div className="flex justify-between">
                  <span>Рамок:</span>
                  <span className="font-bold text-lg text-primary">{selectedOrder.estimatedFrames} шт</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-bold text-lg mb-4">Список товаров</h2>
              <div className="space-y-2">
                {selectedOrder.items.map(item => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.product.name}</span>
                    <span className="font-semibold">{item.quantity} шт</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-md p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/electrical')}
            >
              <Icon name="ArrowLeft" size={24} />
            </Button>
            <h1 className="text-2xl font-bold flex-1">История заявок</h1>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {orders.length === 0 ? (
            <Card className="p-12 text-center">
              <Icon name="FileText" size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Нет заявок</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Вы ещё не создали ни одной заявки
              </p>
              <Button onClick={() => navigate('/calculator')}>
                Создать заявку
              </Button>
            </Card>
          ) : (
            orders.map(order => (
              <Card 
                key={order.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-base">{order.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.date} в {order.time}
                    </p>
                  </div>
                  <Icon name={STATUS_ICONS[order.status] as any} size={24} className="text-primary" />
                </div>

                <div className={`inline-block text-xs font-semibold py-1 px-3 rounded-full ${STATUS_COLORS[order.status]} mb-3`}>
                  {STATUS_LABELS[order.status]}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Точек:</span>
                  <span className="font-bold">{order.totalPoints}</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
