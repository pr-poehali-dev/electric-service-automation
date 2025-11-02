import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import { Order } from '@/types/electrical';
import ContactModal from '@/components/ContactModal';
import ProductSelectionModal from '@/components/ProductSelectionModal';
import CalculatorModal from '@/components/CalculatorModal';
import BottomMenu from '@/components/BottomMenu';
import PageHeader from '@/components/PageHeader';
import PageNavigation from '@/components/PageNavigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

export default function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orders, clearCart } = useCart();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);

  const handleNewOrder = () => {
    clearCart();
    setShowProductModal(true);
  };

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-24">
        <PageHeader />

        <div className="max-w-md mx-auto">
          <PageNavigation onContactClick={() => setShowContactModal(true)} />
          
          <div className="bg-white shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedOrder(null)}
                >
                  <Icon name="ArrowLeft" size={24} />
                </Button>
                <h1 className="text-2xl font-bold text-gray-800 flex-1">Заявка #{selectedOrder.id.slice(-6)}</h1>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <Card className="p-6 animate-fadeIn">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Icon name="Activity" size={20} className="text-primary" />
                Статус выполнения
              </h2>
              
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
                  <AccordionTrigger className="px-6 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" size={20} className="text-primary" />
                      <span className="font-bold">Детали заявки</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6">
                    <div className="space-y-3 pt-2">
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
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="calculations">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Icon name="Calculator" size={20} className="text-primary" />
                      <span className="font-bold">Объём работ</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6">
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-sm">
                        <span>Выключателей:</span>
                        <span className="font-bold">{selectedOrder.totalSwitches}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Розеток:</span>
                        <span className="font-bold">{selectedOrder.totalOutlets}</span>
                      </div>
                      <div className="h-px bg-gray-200 my-2" />
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
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="items">
                  <AccordionTrigger className="px-6 hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Icon name="Package" size={20} className="text-primary" />
                      <span className="font-bold">Список услуг ({selectedOrder.items.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6">
                    <div className="space-y-2 pt-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm py-2 border-b last:border-0">
                          <span className="font-medium">{item.product.name}</span>
                          <span className="text-muted-foreground">{item.quantity} шт</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setSelectedOrder(null)}
            >
              Вернуться к списку заявок
            </Button>
          </div>
        </div>

        <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-24">
      <PageHeader />

      <div className="max-w-md mx-auto">
        <PageNavigation onContactClick={() => setShowContactModal(true)} />
        
        <div className="p-6 space-y-4">
          
          {orders.length === 0 ? (
            <Card className="p-12 text-center">
              <Icon name="ShoppingBag" size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Пока нет заявок</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Создайте первую заявку
              </p>
              <Button
                onClick={handleNewOrder}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
+ Добавить заказ
              </Button>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Мои заявки</h2>
                <Button
                  onClick={handleNewOrder}
                  size="sm"
                  variant="outline"
                  className="gap-2"
                >
                  <Icon name="Plus" size={16} />
                  + Добавить задачи
                </Button>
              </div>
              
              {orders.map(order => (
                <Card 
                  key={order.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all animate-fadeIn hover:scale-105"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">Заявка #{order.id.slice(-6)}</h3>
                    <span className={`text-xs font-semibold py-1 px-3 rounded-full ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {order.address && (
                      <div className="flex items-center gap-2">
                        <Icon name="MapPin" size={16} />
                        <span className="truncate">{order.address}</span>
                      </div>
                    )}
                    {order.date && (
                      <div className="flex items-center gap-2">
                        <Icon name="Calendar" size={16} />
                        <span>{order.date}{order.time ? ` в ${order.time}` : ''}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Icon name="Package" size={16} />
                      <span>{order.items.length} услуг</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Нажмите для подробностей</span>
                    <Icon name="ChevronRight" size={20} className="text-primary" />
                  </div>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>

      <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />
      <ProductSelectionModal 
        open={showProductModal} 
        onClose={() => setShowProductModal(false)} 
      />
      <CalculatorModal 
        open={showCalculatorModal} 
        onClose={() => setShowCalculatorModal(false)} 
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}