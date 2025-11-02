import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from '@/contexts/CartContext';
import { calculateItemPrice, getDiscount, MASTER_VISIT_ID } from '@/types/electrical';
import ServiceModal from '@/components/ServiceModal';
import ContactModal from '@/components/ContactModal';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, updateOption, toggleAdditionalOption } = useCart();
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

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

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <img 
          src="https://cdn.poehali.dev/files/eef76e18-1b64-4ae3-8839-b4fe8da091be.jpg"
          alt="Калининград"
          className="w-full h-48 object-cover"
        />
        
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/')}
                >
                  <Icon name="ArrowLeft" size={24} />
                </Button>
                <h1 className="text-2xl font-bold text-gray-800 flex-1">План работ</h1>
              </div>
              <Button
                onClick={() => setShowContactModal(true)}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 p-0 hover:scale-110"
                title="Меню связи"
              >
                <Icon name="Menu" size={24} />
              </Button>
            </div>
          </div>

          <div className="p-6">
            <Card className="p-12 text-center bg-white">
              <Icon name="ShoppingCart" size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">План работ пуст</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Добавьте услуги для формирования плана работ
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                На главную
              </Button>
            </Card>
          </div>
        </div>

        <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-32">
      <img 
        src="https://cdn.poehali.dev/files/6c409522-72a0-424a-95d5-7c20d103daa1.jpg"
        alt="Калининград"
        className="w-full h-auto object-cover"
      />

      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-lg p-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <Icon name="Home" size={20} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate('/portfolio')}>
            <Icon name="ImageIcon" size={20} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate('/orders')}>
            <Icon name="ClipboardList" size={20} />
          </Button>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" onClick={() => setShowContactModal(true)}>
            <Icon name="Menu" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-200 overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 text-center">
              <h2 className="text-2xl font-bold mb-1">План работ на {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</h2>
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
                                +{item.product.priceInstallOnly} ₽ Установить {item.product.name.toLowerCase()}
                              </label>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Checkbox
                                id={`${item.product.id}-wiring`}
                                checked={item.selectedOption === 'full-wiring'}
                                onCheckedChange={() => updateOption(item.product.id, 'full-wiring')}
                              />
                              <label htmlFor={`${item.product.id}-wiring`} className="text-xs cursor-pointer">
                                +{item.product.priceWithWiring - item.product.priceInstallOnly} ₽ Подготовить проводку
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
                            {item.selectedOption === 'install-only' 
                              ? `Установить ${item.product.name.toLowerCase()}` 
                              : 'Подготовить проводку'}
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

            <div className="bg-gray-50 p-4 text-center border-t space-y-2">
              <p className="text-xs text-gray-500">
                Welcome to <a href="https://t.me/konigelectric" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Telegram</a>
              </p>
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
            Добавить ещё услуги в план работ
          </Button>

          <Button
            size="lg"
            onClick={() => navigate('/checkout')}
            className="w-full h-14 text-base font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Далее →
          </Button>
        </div>
      </div>

      <ServiceModal open={showServiceModal} onClose={() => setShowServiceModal(false)} />
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