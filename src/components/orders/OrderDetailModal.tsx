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

export default function OrderDetailModal({ order, onClose, onStatusChange, onRepeatOrder, onAssignExecutor }: OrderDetailModalProps) {
  const { isAuthenticated } = useAuth();
  const permissions = usePermissions();
  const { getOrderReviews, getOrderPhotoReports } = useReviews();
  const { addPayment, updatePaymentStatus } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order>(order);
  
  const orderReviews = getOrderReviews(order.id);
  const orderPhotoReports = getOrderPhotoReports(order.id);
  const canLeaveReview = order.status === 'completed' && orderReviews.length === 0;

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

        <div className="p-6 space-y-6">
          {isAuthenticated && permissions.canEditOrders && (
            <Card className="p-4 space-y-4 animate-fadeIn bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <OrderStatusManager 
                order={currentOrder} 
                onStatusChange={onStatusChange} 
              />
              
              {onAssignExecutor && (
                <AssignExecutorSelector
                  order={currentOrder}
                  onAssign={onAssignExecutor}
                />
              )}
            </Card>
          )}

          <PaymentManager
            order={currentOrder}
            onAddPayment={addPayment}
            onUpdatePaymentStatus={updatePaymentStatus}
          />

          {isAuthenticated && permissions.isAdmin && (
            <GoogleIntegrationPanel order={currentOrder} />
          )}
          
          <OrderProgressSection order={currentOrder} />
          
          <OrderInfoSection 
            order={currentOrder} 
            isEditing={isEditing}
            onEdit={handleOrderEdit}
          />
          
          <OrderItemsSection 
            items={currentOrder.items}
            totalAmount={currentOrder.totalAmount}
            isEditing={isEditing}
            onItemEdit={handleItemEdit}
          />
          
          <OrderContactSection 
            order={currentOrder}
            isEditing={isEditing}
            onEdit={handleOrderEdit}
          />
          
          <OrderReviewSection
            order={currentOrder}
            canLeaveReview={canLeaveReview}
            orderReviews={orderReviews}
            orderPhotoReports={orderPhotoReports}
            isAuthenticated={isAuthenticated}
            canManageReviews={permissions.canManageReviews}
          />

          <div className="flex gap-3">
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
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Повторить заявку
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
