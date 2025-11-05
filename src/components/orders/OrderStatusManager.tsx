import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Order } from '@/types/electrical';

interface OrderStatusManagerProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: Order['status']) => void;
}

export default function OrderStatusManager({ order, onStatusChange }: OrderStatusManagerProps) {
  const { isAuthenticated } = useAuth();
  const permissions = usePermissions();

  if (!isAuthenticated || !permissions.canEditOrders) {
    return null;
  }

  const statusFlow = [
    { status: 'pending' as const, label: 'Ожидает', icon: 'Clock', color: 'yellow' },
    { status: 'confirmed' as const, label: 'Подтверждена', icon: 'CheckCircle', color: 'blue' },
    { status: 'in-progress' as const, label: 'В работе', icon: 'Wrench', color: 'orange' },
    { status: 'completed' as const, label: 'Завершена', icon: 'CheckCircle2', color: 'green' }
  ];

  const currentIndex = statusFlow.findIndex(s => s.status === order.status);

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
      <div className="flex items-center gap-2 mb-3">
        <Icon name="Settings" size={18} className="text-primary" />
        <h3 className="font-semibold">Управление статусом</h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {statusFlow.map((step, index) => (
          <Button
            key={step.status}
            size="sm"
            variant={order.status === step.status ? 'default' : 'outline'}
            onClick={() => onStatusChange(order.id, step.status)}
            disabled={index < currentIndex}
            className={`${
              order.status === step.status 
                ? `bg-${step.color}-600 hover:bg-${step.color}-700` 
                : ''
            }`}
          >
            <Icon name={step.icon as any} size={14} className="mr-1" />
            {step.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
