import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { ElectricalItem } from '@/types/electrical';

interface OrderItemsSectionProps {
  items: ElectricalItem[];
  totalAmount: number;
  isEditing: boolean;
  onItemEdit: (index: number, field: keyof ElectricalItem, value: string | number) => void;
}

export default function OrderItemsSection({ items, totalAmount, isEditing, onItemEdit }: OrderItemsSectionProps) {
  return (
    <Card className="p-6 animate-fadeIn">
      <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Icon name="ShoppingCart" size={20} className="text-primary" />
        Состав заявки
      </h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-2">
              {isEditing ? (
                <Input 
                  value={item.name}
                  onChange={(e) => onItemEdit(index, 'name', e.target.value)}
                  className="flex-1 mr-2 font-medium"
                />
              ) : (
                <span className="font-semibold text-gray-800">{item.name}</span>
              )}
              {isEditing ? (
                <Input 
                  type="number"
                  value={item.price}
                  onChange={(e) => onItemEdit(index, 'price', parseFloat(e.target.value))}
                  className="w-32 font-medium"
                />
              ) : (
                <span className="font-bold text-primary whitespace-nowrap ml-2">{item.price.toLocaleString()} ₽</span>
              )}
            </div>
            
            {item.category && (
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Icon name="Tag" size={12} />
                {item.category}
              </div>
            )}
            
            {item.description && (
              <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
            )}
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Icon name="Package" size={14} className="text-gray-500" />
                <span className="text-muted-foreground">Количество:</span>
                {isEditing ? (
                  <Input 
                    type="number"
                    value={item.quantity}
                    onChange={(e) => onItemEdit(index, 'quantity', parseInt(e.target.value))}
                    className="w-20 h-8 text-sm"
                    min="1"
                  />
                ) : (
                  <span className="font-semibold">{item.quantity} шт</span>
                )}
              </div>
              <div className="font-bold text-gray-800 bg-white px-3 py-1 rounded-full shadow-sm">
                {(item.price * item.quantity).toLocaleString()} ₽
              </div>
            </div>
          </div>
        ))}
        
        <div className="border-t-2 pt-4 mt-4">
          <div className="flex justify-between items-center text-lg">
            <span className="font-bold text-gray-800">Итого:</span>
            <span className="font-bold text-2xl text-primary">{totalAmount.toLocaleString()} ₽</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
