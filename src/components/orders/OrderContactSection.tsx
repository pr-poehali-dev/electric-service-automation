import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Order } from '@/types/electrical';

interface OrderContactSectionProps {
  order: Order;
  isEditing: boolean;
  onEdit: (field: keyof Order, value: string) => void;
}

export default function OrderContactSection({ order, isEditing, onEdit }: OrderContactSectionProps) {
  return (
    <Card className="p-6 animate-fadeIn">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground flex items-center gap-2">
            <Icon name="User" size={16} className="text-primary" />
            Имя клиента
          </label>
          {isEditing ? (
            <Input 
              value={order.customerName}
              onChange={(e) => onEdit('customerName', e.target.value)}
              className="font-medium"
              placeholder="Введите имя клиента"
            />
          ) : (
            <div className="text-base font-medium bg-gray-50 p-3 rounded-lg border border-gray-200">
              {order.customerName || 'Не указано'}
            </div>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1 text-muted-foreground flex items-center gap-2">
            <Icon name="Phone" size={16} className="text-primary" />
            Телефон
          </label>
          {isEditing ? (
            <Input 
              type="tel"
              value={order.customerPhone}
              onChange={(e) => onEdit('customerPhone', e.target.value)}
              className="font-medium"
            />
          ) : (
            <a 
              href={`tel:${order.customerPhone}`}
              className="text-base font-medium bg-green-50 p-3 rounded-lg border border-green-200 text-green-900 hover:bg-green-100 transition-colors flex items-center gap-2 w-fit"
            >
              {order.customerPhone}
            </a>
          )}
        </div>
        
        {(order.customerEmail || isEditing) && (
          <div>
            <label className="block text-sm font-medium mb-1 text-muted-foreground flex items-center gap-2">
              <Icon name="Mail" size={16} className="text-primary" />
              Email
            </label>
            {isEditing ? (
              <Input 
                type="email"
                value={order.customerEmail || ''}
                onChange={(e) => onEdit('customerEmail', e.target.value)}
                className="font-medium"
                placeholder="Введите email (необязательно)"
              />
            ) : (
              <a 
                href={`mailto:${order.customerEmail}`}
                className="text-base font-medium bg-blue-50 p-3 rounded-lg border border-blue-200 text-blue-900 hover:bg-blue-100 transition-colors flex items-center gap-2 w-fit"
              >
                {order.customerEmail}
              </a>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}