import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Order, ElectricalItem } from '@/types/electrical';
import OrderStatusManager from './OrderStatusManager';
import AssignExecutorSelector from './AssignExecutorSelector';
import PaymentManager from '@/components/payments/PaymentManager';
import GoogleIntegrationPanel from '@/components/google/GoogleIntegrationPanel';
import OrderProgressSection from './OrderProgressSection';
import OrderInfoSection from './OrderInfoSection';
import OrderItemsSection from './OrderItemsSection';
import OrderContactSection from './OrderContactSection';
import OrderReviewSection from './OrderReviewSection';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useReviews } from '@/contexts/ReviewContext';
import { useCart } from '@/contexts/CartContext';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: Order['status']) => void;
  onRepeatOrder: (order: Order) => void;
  onAssignExecutor?: (orderId: string, electricianId: string, electricianName: string) => void;
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

export default function OrderDetailModal({ order, onClose, onStatusChange, onRepeatOrder, onAssignExecutor }: OrderDetailModalProps) {
  const { isAuthenticated } = useAuth();
  const permissions = usePermissions();
  const { getOrderReviews, getOrderPhotoReports } = useReviews();
  const { addPayment, updatePaymentStatus } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order>(order);
  const [expandedSections, setExpandedSections] = useState({
    info: false,
    items: false,
    contact: false,
    payment: false,
    review: false
  });
  
  const orderReviews = getOrderReviews(order.id);
  const orderPhotoReports = getOrderPhotoReports(order.id);
  const canLeaveReview = order.status === 'completed' && orderReviews.length === 0;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSaveEdit = () => {
    console.log('Сохранение изменений:', editedOrder);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedOrder(order);
    setIsEditing(false);
  };

  const handleOrderEdit = (field: keyof Order, value: string) => {
    setEditedOrder({
      ...editedOrder,
      [field]: value
    });
  };

  const handleItemEdit = (index: number, field: keyof ElectricalItem, value: string | number) => {
    const newItems = [...editedOrder.items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    const newTotalAmount = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    setEditedOrder({
      ...editedOrder,
      items: newItems,
      totalAmount: newTotalAmount
    });
  };

  const { user } = useAuth();

  const handleAcceptOrder = () => {
    if (order.status === 'pending') {
      onStatusChange(order.id, 'confirmed');
      
      if (user && onAssignExecutor) {
        onAssignExecutor(order.id, user.uid, user.displayName || user.email || 'Мастер');
      }
    }
  };

  const handleStatusChange = (newStatus: Order['status']) => {
    onStatusChange(order.id, newStatus);
  };

  const getNextStatus = (): Order['status'] | null => {
    switch (order.status) {
      case 'confirmed': return 'in-progress';
      case 'in-progress': return 'completed';
      default: return null;
    }
  };

  const getStatusActionLabel = (status: Order['status']): string => {
    switch (status) {
      case 'confirmed': return 'Начать работу';
      case 'in-progress': return 'Завершить';
      default: return 'Перевести';
    }
  };

  const nextStatus = getNextStatus();
  const currentOrder = isEditing ? editedOrder : order;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={24} />
            </Button>
            <h2 className="text-xl font-bold">Заявка #{currentOrder.id.slice(-6)}</h2>
          </div>
          <div className="flex gap-2">
            {isAuthenticated && permissions.isAdmin && (
              <>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Icon name="Edit" size={16} className="mr-2" />
                    Редактировать
                  </Button>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                      Отмена
                    </Button>
                    <Button size="sm" onClick={handleSaveEdit}>
                      <Icon name="Save" size={16} className="mr-2" />
                      Сохранить
                    </Button>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div className="p-6 space-y-4">
          <OrderProgressSection order={currentOrder} />

          {isAuthenticated && permissions.canEditOrders && (
            <>
              {order.status === 'pending' && (
                <Button 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  size="lg"
                  onClick={handleAcceptOrder}
                >
                  <Icon name="Check" size={20} className="mr-2" />
                  Принять заявку
                </Button>
              )}
              
              {nextStatus && (
                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600"
                  size="lg"
                  onClick={() => handleStatusChange(nextStatus)}
                >
                  <Icon name={nextStatus === 'completed' ? 'CheckCircle' : 'Play'} size={20} className="mr-2" />
                  {getStatusActionLabel(order.status)}
                </Button>
              )}
            </>
          )}

          {isAuthenticated && permissions.isAdmin && order.status !== 'pending' && onAssignExecutor && (
            <Card className="p-4">
              <AssignExecutorSelector
                order={currentOrder}
                onAssign={onAssignExecutor}
              />
            </Card>
          )}

          <Card className="p-4">
            <button
              onClick={() => toggleSection('payment')}
              className="w-full flex items-center justify-between"
            >
              <h3 className="font-semibold flex items-center gap-2">
                <Icon name="CreditCard" size={18} />
                Оплата
              </h3>
              <Icon name={expandedSections.payment ? 'ChevronUp' : 'ChevronDown'} size={20} />
            </button>
            {expandedSections.payment && (
              <div className="mt-4">
                <PaymentManager
                  order={currentOrder}
                  onAddPayment={addPayment}
                  onUpdatePaymentStatus={updatePaymentStatus}
                />
              </div>
            )}
          </Card>

          {isAuthenticated && permissions.isAdmin && (
            <Card className="p-4">
              <GoogleIntegrationPanel order={currentOrder} />
            </Card>
          )}

          <Card className="p-4">
            <button
              onClick={() => toggleSection('info')}
              className="w-full flex items-center justify-between"
            >
              <h3 className="font-semibold flex items-center gap-2">
                <Icon name="Info" size={18} />
                Информация о заявке
              </h3>
              <Icon name={expandedSections.info ? 'ChevronUp' : 'ChevronDown'} size={20} />
            </button>
            {expandedSections.info && (
              <div className="mt-4">
                <OrderInfoSection 
                  order={currentOrder} 
                  isEditing={isEditing}
                  onEdit={handleOrderEdit}
                />
              </div>
            )}
          </Card>

          <Card className="p-4">
            <button
              onClick={() => toggleSection('items')}
              className="w-full flex items-center justify-between"
            >
              <h3 className="font-semibold flex items-center gap-2">
                <Icon name="ShoppingCart" size={18} />
                Состав заявки
              </h3>
              <Icon name={expandedSections.items ? 'ChevronUp' : 'ChevronDown'} size={20} />
            </button>
            {expandedSections.items && (
              <div className="mt-4">
                <OrderItemsSection 
                  items={currentOrder.items}
                  totalAmount={currentOrder.totalAmount}
                  isEditing={isEditing}
                  onItemEdit={handleItemEdit}
                />
              </div>
            )}
          </Card>

          <Card className="p-4">
            <button
              onClick={() => toggleSection('contact')}
              className="w-full flex items-center justify-between"
            >
              <h3 className="font-semibold flex items-center gap-2">
                <Icon name="Phone" size={18} />
                Контактные данные
              </h3>
              <Icon name={expandedSections.contact ? 'ChevronUp' : 'ChevronDown'} size={20} />
            </button>
            {expandedSections.contact && (
              <div className="mt-4">
                <OrderContactSection 
                  order={currentOrder}
                  isEditing={isEditing}
                  onEdit={handleOrderEdit}
                />
              </div>
            )}
          </Card>

          <Card className="p-4">
            <button
              onClick={() => toggleSection('review')}
              className="w-full flex items-center justify-between"
            >
              <h3 className="font-semibold flex items-center gap-2">
                <Icon name="Star" size={18} />
                Отзывы и фото
              </h3>
              <Icon name={expandedSections.review ? 'ChevronUp' : 'ChevronDown'} size={20} />
            </button>
            {expandedSections.review && (
              <div className="mt-4">
                <OrderReviewSection
                  order={currentOrder}
                  canLeaveReview={canLeaveReview}
                  orderReviews={orderReviews}
                  orderPhotoReports={orderPhotoReports}
                  isAuthenticated={isAuthenticated}
                  canManageReviews={permissions.canManageReviews}
                />
              </div>
            )}
          </Card>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Закрыть
            </Button>
            
            {order.status === 'completed' && (
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                onClick={() => {
                  onRepeatOrder(order);
                  onClose();
                }}
              >
                <Icon name="Repeat" size={18} className="mr-2" />
                Повторить заявку
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}