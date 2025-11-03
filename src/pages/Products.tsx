import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from '@/contexts/CartContext';
import { PRODUCTS } from '@/types/electrical';
import ContactModal from '@/components/ContactModal';
import PageHeader from '@/components/PageHeader';
import PageNavigation from '@/components/PageNavigation';

interface ServiceOption {
  id: string;
  name: string;
  price: number;
  quantity: number;
  enabled: boolean;
  description?: string;
}

interface ServiceContainer {
  productId: string;
  productName: string;
  productDescription: string;
  category: string;
  sectionCategory: 'services' | 'wiring';
  options: ServiceOption[];
  expanded: boolean;
}

export default function Products() {
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const [showContactModal, setShowContactModal] = useState(false);

  const chandelier = PRODUCTS.find(p => p.id === 'chandelier-1');
  const outlet = PRODUCTS.find(p => p.id === 'out-1');
  const switchProduct = PRODUCTS.find(p => p.id === 'sw-1');

  const [containers, setContainers] = useState<ServiceContainer[]>([
    {
      productId: 'chandelier-1',
      productName: 'Установить люстру',
      productDescription: chandelier?.description || '',
      category: 'chandelier',
      sectionCategory: 'services',
      expanded: false,
      options: [
        { id: 'install', name: 'Установить люстру', price: 1000, quantity: 1, enabled: false },
        { id: 'dismantle', name: 'Демонтаж люстры', price: 500, quantity: 1, enabled: false },
        { id: 'assemble', name: 'Сборка люстры', price: 500, quantity: 1, enabled: false },
      ]
    },
    {
      productId: 'sw-install',
      productName: 'Установить выключатель',
      productDescription: 'Монтаж выключателя в готовое место',
      category: 'switch',
      sectionCategory: 'services',
      expanded: false,
      options: [
        { id: 'install', name: 'Установить выключатель', price: 250, quantity: 1, enabled: false },
      ]
    },
    {
      productId: 'out-install',
      productName: 'Установить розетку',
      productDescription: 'Монтаж розетки в готовое место',
      category: 'outlet',
      sectionCategory: 'services',
      expanded: false,
      options: [
        { id: 'install', name: 'Установить розетку', price: 250, quantity: 1, enabled: false },
      ]
    },
    {
      productId: 'sw-wiring',
      productName: 'Добавить/перенести выключатель',
      productDescription: 'Черновой монтаж проводки для выключателя',
      category: 'switch',
      sectionCategory: 'wiring',
      expanded: false,
      options: [
        { id: 'wiring', name: 'Добавить/перенести выключатель', price: 1500, quantity: 1, enabled: false },
      ]
    },
    {
      productId: 'out-wiring',
      productName: 'Добавить/перенести розетку',
      productDescription: 'Черновой монтаж проводки для розетки',
      category: 'outlet',
      sectionCategory: 'wiring',
      expanded: false,
      options: [
        { id: 'wiring', name: 'Добавить/перенести розетку', price: 850, quantity: 1, enabled: false },
      ]
    },
    {
      productId: 'out-blocks',
      productName: 'Комплексные работы',
      productDescription: 'Группа розеток, объединенных в одну рамку',
      category: 'outlet',
      sectionCategory: 'wiring',
      expanded: false,
      options: [
        { id: 'block-2', name: 'Блок из 2-х розеток', price: 1200, quantity: 1, enabled: false },
        { id: 'block-3', name: 'Блок из 3-х розеток', price: 2500, quantity: 1, enabled: false },
        { id: 'block-4', name: 'Блок из 4-х розеток', price: 3000, quantity: 1, enabled: false },
        { id: 'block-5', name: 'Блок из 5 розеток', price: 3500, quantity: 1, enabled: false },
      ]
    }
  ]);

  const toggleContainer = (containerIndex: number) => {
    setContainers(prev => prev.map((container, idx) => 
      idx === containerIndex ? { ...container, expanded: !container.expanded } : container
    ));
  };

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

  const calculateContainerTotal = (container: ServiceContainer) => {
    return container.options
      .filter(opt => opt.enabled)
      .reduce((sum, opt) => sum + opt.price * opt.quantity, 0);
  };

  const calculateGrandTotal = () => {
    return containers.reduce((sum, container) => sum + calculateContainerTotal(container), 0);
  };

  const handleAddToCart = () => {
    containers.forEach(container => {
      container.options.forEach(option => {
        if (option.enabled) {
          const product = PRODUCTS.find(p => p.id === container.productId);
          if (product) {
            for (let i = 0; i < option.quantity; i++) {
              addToCart(product, 1);
            }
          }
        }
      });
    });
    navigate('/cart');
  };

  const hasAnyEnabledOptions = containers.some(container => 
    container.options.some(opt => opt.enabled)
  );

  const servicesContainers = containers.filter(c => c.sectionCategory === 'services');
  const wiringContainers = containers.filter(c => c.sectionCategory === 'wiring');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-32">
      <PageHeader />

      <div className="max-w-md mx-auto">
        <PageNavigation onContactClick={() => setShowContactModal(true)} />

        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold mb-2">Электромонтажные работы</h2>
          
          <Button
            onClick={() => navigate('/calculator')}
            variant="outline"
            className="w-full border-2 border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold"
          >
            <Icon name="Calculator" size={18} className="mr-2" />
            Рассчитать количество точек по типу объекта
          </Button>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Icon name="Wrench" size={20} className="text-blue-600" />
                Услуги электрика
              </h3>
              <div className="space-y-3">
                {servicesContainers.map((container, containerIndex) => {
                  const actualIndex = containers.findIndex(c => c.productId === container.productId);
                  return (
                    <Card key={container.productId} className="overflow-hidden">
                      <div 
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleContainer(actualIndex)}
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-base">{container.productName}</h4>
                          <p className="text-xs text-gray-600 mt-1">{container.productDescription}</p>
                        </div>
                        <Icon 
                          name={container.expanded ? 'ChevronUp' : 'ChevronDown'} 
                          size={20} 
                          className="text-gray-400"
                        />
                      </div>

                      {container.expanded && (
                        <div className="px-4 pb-4">
                          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                            <p className="text-sm font-semibold text-gray-700 mb-3">Уточните задачу:</p>
                            
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
                                    onCheckedChange={() => toggleOption(actualIndex, option.id)}
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateOptionQuantity(actualIndex, option.id, option.quantity - 1);
                                      }}
                                      className="h-8 w-8 p-0 rounded-full bg-gray-200 hover:bg-gray-300"
                                    >
                                      <Icon name="Minus" size={16} />
                                    </Button>
                                    <span className="font-bold text-lg min-w-[2rem] text-center">{option.quantity}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateOptionQuantity(actualIndex, option.id, option.quantity + 1);
                                      }}
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

                          {calculateContainerTotal(container) > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-800">Итого за услугу:</span>
                                <span className="text-2xl font-bold text-green-600">
                                  {calculateContainerTotal(container).toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                <Icon name="Cable" size={20} className="text-orange-600" />
                Черновой монтаж проводки
              </h3>
              <div className="space-y-3">
                {wiringContainers.map((container, containerIndex) => {
                  const actualIndex = containers.findIndex(c => c.productId === container.productId);
                  return (
                    <Card key={container.productId} className="overflow-hidden">
                      <div 
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => toggleContainer(actualIndex)}
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-base">{container.productName}</h4>
                          <p className="text-xs text-gray-600 mt-1">{container.productDescription}</p>
                        </div>
                        <Icon 
                          name={container.expanded ? 'ChevronUp' : 'ChevronDown'} 
                          size={20} 
                          className="text-gray-400"
                        />
                      </div>

                      {container.expanded && (
                        <div className="px-4 pb-4">
                          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                            <p className="text-sm font-semibold text-gray-700 mb-3">Уточните задачу:</p>
                            
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
                                    onCheckedChange={() => toggleOption(actualIndex, option.id)}
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
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateOptionQuantity(actualIndex, option.id, option.quantity - 1);
                                      }}
                                      className="h-8 w-8 p-0 rounded-full bg-gray-200 hover:bg-gray-300"
                                    >
                                      <Icon name="Minus" size={16} />
                                    </Button>
                                    <span className="font-bold text-lg min-w-[2rem] text-center">{option.quantity}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateOptionQuantity(actualIndex, option.id, option.quantity + 1);
                                      }}
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

                          {calculateContainerTotal(container) > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex justify-between items-center">
                                <span className="font-semibold text-gray-800">Итого за услугу:</span>
                                <span className="text-2xl font-bold text-green-600">
                                  {calculateContainerTotal(container).toLocaleString('ru-RU')} ₽
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {hasAnyEnabledOptions && (
            <Card className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-800">ИТОГО</span>
                  <span className="text-3xl font-bold text-green-600">
                    {calculateGrandTotal().toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Добавить в список задач
                </Button>
              </div>
            </Card>
          )}

          <div className="mt-6 bg-white rounded-2xl shadow-lg overflow-hidden">
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
    </div>
  );
}
