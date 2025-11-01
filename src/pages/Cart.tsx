import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from '@/contexts/CartContext';
import { calculateTotals, calculateItemPrice, getDiscount, MASTER_VISIT_ID } from '@/types/electrical';
import NewProgressBar from '@/components/NewProgressBar';
import ServiceModal from '@/components/ServiceModal';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, updateOption, toggleAdditionalOption } = useCart();
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const totals = calculateTotals(cart);
  const totalPrice = cart.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  const totalDiscount = cart.reduce((sum, item) => {
    const discount = getDiscount(item.quantity);
    const basePrice = item.selectedOption === 'install-only' ? item.product.priceInstallOnly : item.product.priceWithWiring;
    const fullPrice = basePrice * item.quantity;
    return sum + (fullPrice * discount / 100);
  }, 0);

  const cableMeters = cart
    .filter(item => item.selectedOption === 'full-wiring')
    .reduce((sum, item) => sum + (item.product.slots * item.quantity * 7), 0);
  
  const cableCost = cableMeters * 100;

  const finalTotal = totalPrice + cableCost;
  
  const masterVisit = cart.find(item => item.product.id === MASTER_VISIT_ID);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const steps = [
    { id: 1, label: 'Выберите услугу', icon: 'List', onClick: () => setShowServiceModal(true) },
    { id: 2, label: 'План работ', icon: 'ClipboardList', onClick: () => navigate('/cart') },
    { id: 3, label: 'Оформление', icon: 'CheckCircle', onClick: () => navigate('/checkout') }
  ];

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <img 
          src="https://cdn.poehali.dev/files/eef76e18-1b64-4ae3-8839-b4fe8da091be.jpg"
          alt="Калининград"
          className="w-full h-32 object-cover"
        />
        
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow-lg p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/')}
                >
                  <Icon name="ArrowLeft" size={24} />
                </Button>
                <h1 className="text-2xl font-bold text-gray-800">План работ</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => navigate('/products')}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all p-0"
                  title="Услуги"
                >
                  <Icon name="List" size={20} />
                </Button>
                <Button
                  onClick={() => navigate('/profile')}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all p-0"
                  title="Личный кабинет"
                >
                  <Icon name="User" size={20} />
                </Button>
              </div>
            </div>
            
            <NewProgressBar 
              steps={steps}
              currentStep={2}
              hasItems={false}
              cartConfirmed={false}
            />
          </div>

          <div className="p-6">
            <Card className="p-12 text-center bg-white">
              <Icon name="ShoppingCart" size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Список пуст</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Добавьте услуги для формирования плана работ
              </p>
              <Button
                onClick={() => navigate('/products')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Выбрать услуги
              </Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-32">
      <img 
        src="https://cdn.poehali.dev/files/eef76e18-1b64-4ae3-8839-b4fe8da091be.jpg"
        alt="Калининград"
        className="w-full h-32 object-cover"
      />

      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/products')}
              >
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">План работ</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowServiceModal(true)}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all p-0"
                title="Каталог услуг"
              >
                <Icon name="List" size={20} />
              </Button>
              <Button
                onClick={() => navigate('/cart')}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all p-0 relative"
                title="План работ"
              >
                <Icon name="ShoppingBag" size={20} />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                  {totalItems}
                </span>
              </Button>
              <Button
                onClick={() => navigate('/profile')}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all p-0"
                title="Личный кабинет"
              >
                <Icon name="User" size={20} />
              </Button>
            </div>
          </div>
          
          <NewProgressBar 
            steps={steps}
            currentStep={2}
            hasItems={totalItems > 0}
            cartConfirmed={false}
          />
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 text-center">
              <h2 className="text-2xl font-bold mb-1">ПЛАН РАБОТ</h2>
              <p className="text-blue-100 text-sm">ООО "Кениг Электрик"</p>
              <p className="text-blue-100 text-xs mt-1">{new Date().toLocaleDateString('ru-RU')}</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-700">Выбранные услуги</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditMode(!editMode)}
                  className="text-xs"
                >
                  <Icon name={editMode ? 'Check' : 'Edit'} size={14} className="mr-1" />
                  {editMode ? 'Готово' : 'Редактировать'}
                </Button>
              </div>

              {cart.filter(item => item.product.id !== MASTER_VISIT_ID).map((item, index) => (
                <div key={item.product.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                        <h4 className="font-semibold text-sm">{item.product.name}</h4>
                      </div>
                      
                      {editMode ? (
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="h-7 w-7 p-0"
                            >
                              <Icon name="Minus" size={12} />
                            </Button>
                            <span className="text-sm font-semibold px-2">{item.quantity} шт</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="h-7 w-7 p-0"
                            >
                              <Icon name="Plus" size={12} />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(item.product.id)}
                              className="h-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Icon name="Trash2" size={14} />
                            </Button>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`${item.product.id}-install`}
                                checked={item.selectedOption === 'install-only'}
                                onCheckedChange={() => updateOption(item.product.id, 'install-only')}
                              />
                              <label htmlFor={`${item.product.id}-install`} className="text-xs cursor-pointer">
                                Установка изделия
                              </label>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`${item.product.id}-wiring`}
                                checked={item.selectedOption === 'full-wiring'}
                                onCheckedChange={() => updateOption(item.product.id, 'full-wiring')}
                              />
                              <label htmlFor={`${item.product.id}-wiring`} className="text-xs cursor-pointer">
                                Черновой монтаж
                              </label>
                            </div>

                            {item.product.options?.map(option => (
                              <div key={option.id} className="flex items-center gap-2">
                                <Checkbox
                                  id={`${item.product.id}-${option.id}`}
                                  checked={item.additionalOptions?.includes(option.id)}
                                  onCheckedChange={() => toggleAdditionalOption(item.product.id, option.id)}
                                />
                                <label htmlFor={`${item.product.id}-${option.id}`} className="text-xs cursor-pointer">
                                  +{option.price} ₽ {option.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mt-1 space-y-1">
                          <p className="text-xs text-gray-600">Количество: {item.quantity} шт</p>
                          <p className="text-xs text-gray-600">
                            {item.selectedOption === 'install-only' ? 'Установка изделия' : 'Черновой монтаж'}
                          </p>
                          {item.additionalOptions && item.additionalOptions.length > 0 && (
                            <p className="text-xs text-gray-600">
                              + {item.product.options?.filter(o => item.additionalOptions?.includes(o.id)).map(o => o.name).join(', ')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-primary">{calculateItemPrice(item).toLocaleString('ru-RU')} ₽</div>
                      {getDiscount(item.quantity) > 0 && (
                        <div className="text-xs text-green-600 font-semibold">
                          Скидка {getDiscount(item.quantity)}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {masterVisit && (
                <div className="border-b border-gray-200 pb-4 bg-orange-50 -mx-6 px-6 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon name="Truck" size={18} className="text-orange-600" />
                      <span className="font-semibold text-sm">{masterVisit.product.name}</span>
                    </div>
                    <span className="font-bold text-primary">{masterVisit.product.priceInstallOnly} ₽</span>
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-2">
                {totalDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Экономия</span>
                    <span className="text-green-600 font-semibold">-{totalDiscount.toLocaleString('ru-RU')} ₽</span>
                  </div>
                )}
                
                {cableMeters > 0 && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Примерный метраж кабеля</span>
                      <span className="font-semibold">{cableMeters} м</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Стоимость монтажа кабеля</span>
                      <span className="font-semibold">{cableCost.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </>
                )}

                <div className="border-t-2 border-dashed border-gray-300 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">ИТОГО</span>
                    <span className="text-2xl font-bold text-primary">{finalTotal.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 text-center border-t">
              <p className="text-xs text-gray-500">Спасибо за ваш выбор!</p>
              <p className="text-xs text-gray-500 mt-1">📞 +7 (4012) 52-07-25</p>
            </div>
          </div>

          <Button
            onClick={() => setShowServiceModal(true)}
            variant="outline"
            className="w-full h-12 border-2 border-dashed border-blue-300 hover:border-blue-400 hover:bg-blue-50"
          >
            <Icon name="Plus" size={18} className="mr-2" />
            Добавить ещё услуги
          </Button>

          <Button
            size="lg"
            onClick={() => navigate('/checkout')}
            className="w-full h-14 text-base font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Уточнить детали →
          </Button>
        </div>
      </div>

      <ServiceModal open={showServiceModal} onClose={() => setShowServiceModal(false)} />

      <a
        href="tel:+74012520725"
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl flex items-center justify-center transition-all duration-300 hover:scale-110 group z-50"
        title="Связаться с нами"
      >
        <Icon name="Phone" size={28} className="group-hover:animate-wiggle" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
      </a>
    </div>
  );
}
