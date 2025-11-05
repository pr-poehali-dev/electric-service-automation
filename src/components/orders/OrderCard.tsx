import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Order, ElectricalItem } from '@/types/electrical';

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
  onRepeat: (order: Order) => void;
}

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

const OrderCard = memo(({ order, onViewDetails, onRepeat }: OrderCardProps) => {
  return (
    <Card className="p-5 hover:shadow-lg transition-all cursor-pointer animate-fadeIn">
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
          onClick={() => onViewDetails(order)}
        >
          <Icon name="Eye" size={16} className="mr-2" />
          Подробнее
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            onRepeat(order);
          }}
          title="Повторить заказ"
        >
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Повторить
        </Button>
      </div>
    </Card>
  );
});

OrderCard.displayName = 'OrderCard';

export default OrderCard;
