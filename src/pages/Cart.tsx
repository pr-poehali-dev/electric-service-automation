import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from '@/contexts/CartContext';
import { MASTER_VISIT_ID, PRODUCTS } from '@/types/electrical';
import ServiceModal from '@/components/ServiceModal';
import ContactModal from '@/components/ContactModal';

import PageHeader from '@/components/PageHeader';
import PageNavigation from '@/components/PageNavigation';

interface ServiceOption {
  id: string;
  name: string;
  price: number;
  quantity: number;
  enabled: boolean;
}

interface ServiceContainer {
  productId: string;
  productName: string;
  productDescription: string;
  category: string;
  options: ServiceOption[];
}

export default function Cart() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const [containers, setContainers] = useState<ServiceContainer[]>(() => {
    const chandelier = PRODUCTS.find(p => p.id === 'chandelier-1');
    const outlet = PRODUCTS.find(p => p.id === 'out-1');
    const switchProduct = PRODUCTS.find(p => p.id === 'sw-1');

    return [
      {
        productId: 'chandelier-1',
        productName: chandelier?.name || 'Установить люстру',
        productDescription: chandelier?.description || '',
        category: 'chandelier',
        options: [
          { id: 'install', name: 'Установить люстру', price: 1000, quantity: 1, enabled: false },
          { id: 'dismantle', name: 'Демонтаж старой люстры', price: 500, quantity: 1, enabled: false },
          { id: 'assemble', name: 'Сборка люстры', price: 500, quantity: 1, enabled: false },
        ]
      },
      {
        productId: 'sw-1',
        productName: switchProduct?.name || 'Установить выключатель',
        productDescription: switchProduct?.description || '',
        category: 'switch',
        options: [
          { id: 'install', name: 'Установить выключатель', price: 250, quantity: 1, enabled: false },
          { id: 'wiring', name: 'Добавить/перенести', price: 1500, quantity: 1, enabled: false },
        ]
      },
      {
        productId: 'out-1',
        productName: outlet?.name || 'Установить розетку',
        productDescription: outlet?.description || 'Черновые работы со штроблением, сверлением и установкой подрозетника',
        category: 'outlet',
        options: [
          { id: 'block-2', name: 'Блок из 2-х розеток', price: 1200, quantity: 1, enabled: false },
          { id: 'block-3', name: 'Блок из 3-х розеток', price: 2500, quantity: 1, enabled: false },
          { id: 'block-4', name: 'Блок из 4-х розеток', price: 3000, quantity: 1, enabled: false },
          { id: 'block-5', name: 'Блок из 5 розеток', price: 3500, quantity: 1, enabled: false },
          { id: 'install', name: 'Установить розетку', price: 250, quantity: 1, enabled: false },
          { id: 'wiring', name: 'Добавить/перенести', price: 850, quantity: 1, enabled: false },
        ]
      }
    ];
  });

  const toggleOption = (containerIndex: number, optionId: string) => {
    setContainers(prev => prev.map((container, idx) => {
      if (idx === containerIndex) {
        return {
          ...container,
          options: container.options.map(opt => 
            opt.id === optionId ? { ...opt, enabled: !opt.enabled } : opt
          )
        };
      }
      return container;
    }));
  };

  const updateOptionQuantity = (containerIndex: number, optionId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setContainers(prev => prev.map((container, idx) => {
      if (idx === containerIndex) {
        return {
          ...container,
          options: container.options.map(opt => 
            opt.id === optionId ? { ...opt, quantity: newQuantity } : opt
          )
        };
      }
      return container;
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    containers.forEach(container => {
      container.options.forEach(option => {
        if (option.enabled) {
          total += option.price * option.quantity;
        }
      });
    });
    const masterVisit = cart.find(item => item.product.id === MASTER_VISIT_ID);
    if (masterVisit) {
      total += masterVisit.product.priceInstallOnly;
    }
    return total;
  };

  const hasAnyEnabledOptions = containers.some(container => 
    container.options.some(opt => opt.enabled)
  );

  if (!hasAnyEnabledOptions && cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <PageHeader />
        
        <div className="max-w-md mx-auto">
          <PageNavigation onContactClick={() => setShowContactModal(true)} />

          <div className="p-6">
            <Card className="p-12 text-center bg-white">
              <Icon name="ShoppingCart" size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Задачи</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Добавьте услуги для формирования списка задач
              </p>
              <Button
                onClick={() => navigate('/products')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Добавить задачи
              </Button>
            </Card>
          </div>
        </div>

        <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />
        <ServiceModal open={showServiceModal} onClose={() => setShowServiceModal(false)} />
      </div>
    );
  }

  const masterVisit = cart.find(item => item.product.id === MASTER_VISIT_ID);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-32">
      <PageHeader />

      <div className="max-w-md mx-auto">
        <PageNavigation onContactClick={() => setShowContactModal(true)} />

        <div className="p-6 space-y-4">
          {containers.map((container, containerIndex) => (
            <Card key={container.productId} className="overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{container.productName}</h3>
                <p className="text-sm text-gray-600 mb-4">{container.productDescription}</p>

                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Дополнительно:</p>
                  
                  {container.options.map((option) => (
                    <div 
                      key={option.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                        option.enabled ? 'bg-green-100' : 'bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Checkbox
                          id={`${container.productId}-${option.id}`}
                          checked={option.enabled}
                          onCheckedChange={() => toggleOption(containerIndex, option.id)}
                        />
                        <label 
                          htmlFor={`${container.productId}-${option.id}`}
                          className="text-sm font-medium cursor-pointer flex-1"
                        >
                          {option.name}
                        </label>
                      </div>
                      
                      {option.enabled ? (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateOptionQuantity(containerIndex, option.id, option.quantity - 1)}
                            className="h-8 w-8 p-0 rounded-full bg-gray-200 hover:bg-gray-300"
                          >
                            <Icon name="Minus" size={16} />
                          </Button>
                          <span className="font-bold text-lg min-w-[2rem] text-center">{option.quantity}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateOptionQuantity(containerIndex, option.id, option.quantity + 1)}
                            className="h-8 w-8 p-0 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            <Icon name="Plus" size={16} />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-green-600 font-bold text-sm">+{option.price} ₽</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Итого за услугу:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {container.options
                        .filter(opt => opt.enabled)
                        .reduce((sum, opt) => sum + opt.price * opt.quantity, 0)
                        .toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {masterVisit && (
            <Card className="bg-orange-50 border-orange-200">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="Truck" size={18} className="text-orange-600" />
                  <span className="font-semibold text-sm">{masterVisit.product.name}</span>
                </div>
                <span className="font-bold text-primary">{masterVisit.product.priceInstallOnly} ₽</span>
              </div>
            </Card>
          )}

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold text-gray-800">ИТОГО</span>
                <span className="text-3xl font-bold text-green-600">
                  {calculateTotal().toLocaleString('ru-RU')} ₽
                </span>
              </div>
              
              <Button
                size="lg"
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={!hasAnyEnabledOptions}
              >
                Оформить заявку
              </Button>
            </div>
          </Card>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 p-4 text-center border-t space-y-2">
              <p className="text-xs text-gray-500">
                Welcome to <a href="https://t.me/konigelectric" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Telegram</a> 🚀
              </p>
              <p className="text-xs text-gray-500">Спасибо за ваш выбор!</p>
              <p className="text-xs text-gray-500 mt-1">📞 +7 (4012) 52-07-25</p>
            </div>
          </div>
        </div>
      </div>

      <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />
      <ServiceModal open={showServiceModal} onClose={() => setShowServiceModal(false)} />
    </div>
  );
}
