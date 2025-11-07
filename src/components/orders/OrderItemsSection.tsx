import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { ElectricalItem, Order, Payment, PaymentStatus } from '@/types/electrical';

interface OrderItemsSectionProps {
  items: ElectricalItem[];
  totalAmount: number;
  isEditing: boolean;
  onItemEdit: (index: number, field: keyof ElectricalItem, value: string | number) => void;
  order?: Order;
}

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  'unpaid': 'Не оплачено',
  'partially_paid': 'Частично оплачено',
  'paid': 'Оплачено',
  'refunded': 'Возврат',
  'pending': 'Ожидает подтверждения'
};

const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  'unpaid': 'bg-red-100 text-red-800 border-red-300',
  'partially_paid': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'paid': 'bg-green-100 text-green-800 border-green-300',
  'refunded': 'bg-gray-100 text-gray-800 border-gray-300',
  'pending': 'bg-blue-100 text-blue-800 border-blue-300'
};

const PAYMENT_METHOD_LABELS = {
  'cash': 'Наличные',
  'card': 'Банковская карта',
  'bank_transfer': 'Банковский перевод',
  'yookassa': 'ЮКassa',
  'tinkoff': 'Тинькофф',
  'sberbank': 'Сбербанк Онлайн'
};

export default function OrderItemsSection({ items, totalAmount, isEditing, onItemEdit, order }: OrderItemsSectionProps) {
  const safeItems = items || [];
  const safeTotalAmount = totalAmount || 0;
  const paidAmount = order?.paidAmount || 0;
  const remainingAmount = safeTotalAmount - paidAmount;
  const paymentProgress = safeTotalAmount > 0 ? (paidAmount / safeTotalAmount) * 100 : 0;

  return (
    <div className="space-y-2 font-mono text-sm">
      {safeItems.map((item, index) => {
        const itemPrice = item.price || 0;
        const itemQuantity = item.quantity || 1;
        const itemTotal = itemPrice * itemQuantity;

        return (
          <div key={index} className="border-b border-dashed border-gray-200 pb-2 mb-2">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                {isEditing ? (
                  <Input 
                    value={item.name}
                    onChange={(e) => onItemEdit(index, 'name', e.target.value)}
                    className="font-medium mb-1"
                  />
                ) : (
                  <span className="font-semibold text-gray-900 block">{item.name}</span>
                )}
                {item.description && !isEditing && (
                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-3 text-xs text-gray-600">
                {isEditing ? (
                  <>
                    <Input 
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onItemEdit(index, 'quantity', parseInt(e.target.value))}
                      className="w-16 h-7 text-xs"
                      min="1"
                    />
                    <span>×</span>
                    <Input 
                      type="number"
                      value={item.price}
                      onChange={(e) => onItemEdit(index, 'price', parseFloat(e.target.value))}
                      className="w-24 h-7 text-xs"
                    />
                  </>
                ) : (
                  <span>{itemQuantity} шт × {itemPrice.toLocaleString()} ₽</span>
                )}
              </div>
              <span className="font-bold text-gray-900">{itemTotal.toLocaleString()} ₽</span>
            </div>
          </div>
        );
      })}
      
      <div className="border-t-2 border-gray-800 pt-4 mt-6">
        <div className="flex justify-between items-center">
          <span className="font-bold text-xl text-gray-900">ИТОГО:</span>
          <span className="font-bold text-2xl text-primary">{safeTotalAmount.toLocaleString()} ₽</span>
        </div>
      </div>

      {order && (
        <div className="border-t border-dashed border-gray-300 pt-4 mt-4 space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm text-gray-600">Оплачено</p>
                <p className="text-2xl font-bold text-green-600">{paidAmount.toLocaleString()} ₽</p>
              </div>
              <div className="text-right">
                <span className={`text-xs font-semibold py-1 px-3 rounded-full border ${PAYMENT_STATUS_COLORS[order.paymentStatus || 'unpaid']}`}>
                  {PAYMENT_STATUS_LABELS[order.paymentStatus || 'unpaid']}
                </span>
              </div>
            </div>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-primary">
                    {paymentProgress.toFixed(0)}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-orange-600">
                    Осталось: {remainingAmount.toLocaleString()} ₽
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
                <div 
                  style={{ width: `${paymentProgress}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                />
              </div>
            </div>
          </div>

          {order.payments && order.payments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">История платежей</h4>
              {order.payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Icon name="Receipt" size={14} className="text-gray-500" />
                      <span className="text-sm font-semibold">{payment.amount.toLocaleString()} ₽</span>
                      <span className="text-xs text-gray-500">{PAYMENT_METHOD_LABELS[payment.method as keyof typeof PAYMENT_METHOD_LABELS]}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(payment.createdAt).toLocaleString('ru-RU')}
                    </p>
                    {payment.description && (
                      <p className="text-xs text-gray-600 mt-1">{payment.description}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border ${PAYMENT_STATUS_COLORS[payment.status]}`}>
                    {PAYMENT_STATUS_LABELS[payment.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}