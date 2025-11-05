import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Order, ElectricalItem } from '@/types/electrical';
import OrderStatusManager from './OrderStatusManager';
import AssignExecutorSelector from './AssignExecutorSelector';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewList from '@/components/reviews/ReviewList';
import PhotoReportUpload from '@/components/reviews/PhotoReportUpload';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { useReviews } from '@/contexts/ReviewContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
  onStatusChange: (orderId: string, newStatus: Order['status']) => void;
  onRepeatOrder: (order: Order) => void;
  onAssignExecutor?: (orderId: string, electricianId: string, electricianName: string) => void;
}

const STATUS_LABELS = {
  'pending': 'Ожидает подтверждения',
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Order>(order);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  
  const orderReviews = getOrderReviews(order.id);
  const orderPhotoReports = getOrderPhotoReports(order.id);
  const canLeaveReview = order.status === 'completed' && orderReviews.length === 0;

  const getProgressPercentage = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 25;
      case 'confirmed': return 50;
      case 'in-progress': return 75;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const progress = getProgressPercentage(order.status);

  const handleSaveEdit = () => {
    console.log('Сохранение изменений:', editedOrder);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedOrder(order);
    setIsEditing(false);
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
          
          <Card className="p-6 animate-fadeIn">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Icon name="Activity" size={20} className="text-primary" />
              Статус выполнения
            </h2>
            
            <div className="relative pt-1 mb-6">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full border ${STATUS_COLORS[currentOrder.status]}`}>
                    {STATUS_LABELS[currentOrder.status]}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-primary">
                    {progress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-200">
                <div 
                  style={{ width: `${progress}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 rounded-full"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  progress >= 25 ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'
                }`}>
                  <Icon name="FileText" size={18} />
                </div>
                <span className={progress >= 25 ? 'font-semibold text-gray-800' : 'text-muted-foreground'}>
                  Заявка создана
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  progress >= 50 ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'
                }`}>
                  <Icon name="CheckCircle" size={18} />
                </div>
                <span className={progress >= 50 ? 'font-semibold text-gray-800' : 'text-muted-foreground'}>
                  Подтверждена мастером
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  progress >= 75 ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'
                }`}>
                  <Icon name="Wrench" size={18} />
                </div>
                <span className={progress >= 75 ? 'font-semibold text-gray-800' : 'text-muted-foreground'}>
                  Работы начаты
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  progress >= 100 ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'
                }`}>
                  <Icon name="CheckCircle2" size={18} />
                </div>
                <span className={progress >= 100 ? 'font-semibold text-gray-800' : 'text-muted-foreground'}>
                  Работы завершены
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-4 animate-fadeIn">
            <a
              href="https://t.me/konigelectric"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Icon name="MessageCircle" size={24} />
              <div className="flex-1">
                <p className="font-bold">Есть вопрос?</p>
                <p className="text-sm opacity-90">Напишите в Telegram</p>
              </div>
              <Icon name="ArrowRight" size={20} />
            </a>
          </Card>

          <Card className="animate-fadeIn">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Icon name="FileText" size={20} className="text-primary" />
                    <span className="font-bold">Детали заявки</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-4">
                    {isEditing ? (
                      <>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-1 block">Адрес</label>
                          <Input
                            value={editedOrder.address || ''}
                            onChange={(e) => setEditedOrder({...editedOrder, address: e.target.value})}
                            placeholder="Введите адрес"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-1 block">Телефон</label>
                          <Input
                            value={editedOrder.phone || ''}
                            onChange={(e) => setEditedOrder({...editedOrder, phone: e.target.value})}
                            placeholder="Введите телефон"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-1 block">Комментарий</label>
                          <Textarea
                            value={editedOrder.comment || ''}
                            onChange={(e) => setEditedOrder({...editedOrder, comment: e.target.value})}
                            placeholder="Комментарий к заказу"
                            rows={3}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        {currentOrder.address && (
                          <div className="flex items-start gap-2">
                            <Icon name="MapPin" size={18} className="text-primary mt-1" />
                            <div>
                              <p className="text-sm font-semibold text-gray-700">Адрес</p>
                              <p className="text-gray-900">{currentOrder.address}</p>
                            </div>
                          </div>
                        )}
                        {currentOrder.phone && (
                          <div className="flex items-start gap-2">
                            <Icon name="Phone" size={18} className="text-primary mt-1" />
                            <div>
                              <p className="text-sm font-semibold text-gray-700">Телефон</p>
                              <p className="text-gray-900">{currentOrder.phone}</p>
                            </div>
                          </div>
                        )}
                        {currentOrder.comment && (
                          <div className="flex items-start gap-2">
                            <Icon name="MessageSquare" size={18} className="text-primary mt-1" />
                            <div>
                              <p className="text-sm font-semibold text-gray-700">Комментарий</p>
                              <p className="text-gray-900 whitespace-pre-wrap">{currentOrder.comment}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex items-start gap-2">
                      <Icon name="Calendar" size={18} className="text-primary mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Дата создания</p>
                        <p className="text-gray-900">
                          {new Date(currentOrder.createdAt).toLocaleString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="services">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Icon name="List" size={20} className="text-primary" />
                    <span className="font-bold">Услуги ({currentOrder.items.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  <div className="space-y-3">
                    {currentOrder.items.map((item, index) => (
                      <div key={index} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="space-y-2">
                              <Input
                                value={item.name}
                                onChange={(e) => handleItemEdit(index, 'name', e.target.value)}
                                placeholder="Название услуги"
                              />
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => handleItemEdit(index, 'quantity', parseInt(e.target.value) || 1)}
                                  className="w-20"
                                  min="1"
                                />
                                <span className="flex items-center px-2">×</span>
                                <Input
                                  type="number"
                                  value={item.price}
                                  onChange={(e) => handleItemEdit(index, 'price', parseInt(e.target.value) || 0)}
                                  className="flex-1"
                                  min="0"
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                {item.quantity} {item.unit} × {(item.price || 0).toLocaleString()} ₽
                              </p>
                            </>
                          )}
                        </div>
                        <div className="text-right ml-3">
                          <p className="font-bold text-primary">
                            {((item.price || 0) * (item.quantity || 0)).toLocaleString()} ₽
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Итоговая сумма</p>
                <p className="text-3xl font-bold text-primary">{(currentOrder.totalAmount || 0).toLocaleString()} ₽</p>
              </div>
              <Icon name="Wallet" size={40} className="text-primary opacity-20" />
            </div>
          </Card>

          {orderPhotoReports.length > 0 && (
            <Card className="animate-fadeIn">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="photos">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Icon name="Camera" size={20} className="text-primary" />
                      <span className="font-bold">Фотоотчёты ({orderPhotoReports.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="space-y-4">
                      {orderPhotoReports.map((report) => (
                        <div key={report.id}>
                          <p className="text-sm text-gray-600 mb-2">
                            {report.uploaderRole === 'electrician' ? 'Мастер' : 'Клиент'} • {' '}
                            {new Date(report.createdAt).toLocaleDateString('ru-RU')}
                          </p>
                          <div className="grid grid-cols-3 gap-2">
                            {report.photos.map((photo, idx) => (
                              <div key={idx}>
                                <img
                                  src={photo.url}
                                  alt={photo.caption || `Фото ${idx + 1}`}
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                {photo.caption && (
                                  <p className="text-xs text-gray-600 mt-1">{photo.caption}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          )}

          {orderReviews.length > 0 && (
            <Card className="animate-fadeIn">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="reviews">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Icon name="Star" size={20} className="text-primary" />
                      <span className="font-bold">Отзывы ({orderReviews.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <ReviewList reviews={orderReviews} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>
          )}

          <div className="space-y-3">
            {canLeaveReview && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowReviewForm(true)}
              >
                <Icon name="Star" size={18} className="mr-2" />
                Оставить отзыв
              </Button>
            )}

            {isAuthenticated && permissions.canEditOrders && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowPhotoUpload(true)}
              >
                <Icon name="Camera" size={18} className="mr-2" />
                Загрузить фотоотчёт
              </Button>
            )}

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => onRepeatOrder(currentOrder)}
              >
                <Icon name="RefreshCw" size={18} className="mr-2" />
                Повторить заказ
              </Button>
              <Button 
                className="flex-1"
                onClick={onClose}
              >
                Закрыть
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showReviewForm && (
        <ReviewForm order={currentOrder} onClose={() => setShowReviewForm(false)} />
      )}

      {showPhotoUpload && (
        <PhotoReportUpload order={currentOrder} onClose={() => setShowPhotoUpload(false)} />
      )}
    </div>
  );
}