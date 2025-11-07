import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useCart } from '@/contexts/CartContext';
import { Order } from '@/types/electrical';

interface OrderStatusManagerProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: Order['status']) => void;
}

export default function OrderStatusManager({ order, onStatusChange }: OrderStatusManagerProps) {
  const { isAuthenticated, user } = useAuth();
  const permissions = usePermissions();
  const { updateOrder } = useCart();
  const [showDepartureConfirm, setShowDepartureConfirm] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  const isAssignedExecutor = order.assignedTo === user?.id;

  const handleConfirmDeparture = () => {
    const updatedOrder = {
      ...order,
      status: 'on-the-way' as const,
      departureConfirmedAt: Date.now()
    };
    updateOrder(updatedOrder);
    setShowDepartureConfirm(true);
    
    setTimeout(() => setShowDepartureConfirm(false), 8000);
  };

  const canAccessPhone = () => {
    if (!order.departureConfirmedAt) return false;
    const twentyMinutes = 20 * 60 * 1000;
    return Date.now() - order.departureConfirmedAt >= twentyMinutes;
  };

  const handleArrived = () => {
    if (!canAccessPhone()) {
      alert('Контактные данные будут доступны через 20 минут после подтверждения выезда');
      return;
    }
    const updatedOrder = {
      ...order,
      status: 'arrived' as const,
      arrivedAt: Date.now()
    };
    updateOrder(updatedOrder);
  };

  const handleStartWork = () => {
    onStatusChange(order.id, 'in-progress');
  };

  if (permissions.isAdmin) {
    const statusFlow = [
      { status: 'pending' as const, label: 'Поиск мастера', icon: 'Search', color: 'yellow' },
      { status: 'confirmed' as const, label: 'Подтверждена', icon: 'CheckCircle', color: 'blue' },
      { status: 'on-the-way' as const, label: 'В пути', icon: 'Navigation', color: 'purple' },
      { status: 'arrived' as const, label: 'Прибыл', icon: 'MapPin', color: 'indigo' },
      { status: 'in-progress' as const, label: 'В работе', icon: 'Wrench', color: 'orange' },
      { status: 'completed' as const, label: 'Завершена', icon: 'CheckCircle2', color: 'green' }
    ];

    return (
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Settings" size={18} className="text-primary" />
          <h3 className="font-semibold">Управление статусом (Админ)</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {statusFlow.map((step) => (
            <Button
              key={step.status}
              size="sm"
              variant={order.status === step.status ? 'default' : 'outline'}
              onClick={() => onStatusChange(order.id, step.status)}
              className={
                order.status === step.status 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : ''
              }
            >
              <Icon name={step.icon as any} size={14} className="mr-1" />
              {step.label}
            </Button>
          ))}
        </div>
      </Card>
    );
  }

  if (!isAssignedExecutor) {
    return null;
  }

  return (
    <div className="space-y-3">
      {showDepartureConfirm && (
        <Card className="p-4 bg-green-50 border-2 border-green-300 animate-fadeIn">
          <div className="flex items-start gap-3">
            <Icon name="CheckCircle" size={20} className="text-green-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-green-800 mb-1">Выезд подтверждён!</h4>
              <p className="text-sm text-green-700">
                Контактные данные клиента откроются автоматически через 20 минут. Удачного пути!
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <Icon name="Navigation" size={18} className="text-primary" />
          <h3 className="font-semibold">Действия по заказу</h3>
        </div>

        <div className="space-y-2">
          {order.status === 'confirmed' && (
            <Button
              onClick={handleConfirmDeparture}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              size="lg"
            >
              <Icon name="Navigation" size={18} className="mr-2" />
              Подтвердить выезд
            </Button>
          )}

          {order.status === 'on-the-way' && (
            <Button
              onClick={handleArrived}
              disabled={!canAccessPhone()}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:opacity-50"
              size="lg"
            >
              <Icon name="MapPin" size={18} className="mr-2" />
              Прибыл
            </Button>
          )}

          {order.status === 'arrived' && (
            <Button
              onClick={handleStartWork}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              size="lg"
            >
              <Icon name="Wrench" size={18} className="mr-2" />
              Начать работу
            </Button>
          )}

          {order.status === 'in-progress' && (
            <div className="space-y-2">
              <Button
                onClick={() => onStatusChange(order.id, 'completed')}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                size="lg"
              >
                <Icon name="CheckCircle2" size={18} className="mr-2" />
                Работа завершена
              </Button>
              <Button
                variant="outline"
                className="w-full"
                size="sm"
              >
                <Icon name="Calendar" size={16} className="mr-2" />
                Перенести заявку
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
