import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart } from '@/contexts/CartContext';
import { PRODUCTS, Product, MASTER_VISIT_ID, calculateItemPrice } from '@/types/electrical';
import ContactModal from '@/components/ContactModal';
import PageHeader from '@/components/PageHeader';
import PageNavigation from '@/components/PageNavigation';

export default function Products() {
  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, updateOption, toggleAdditionalOption } = useCart();
  const [showContactModal, setShowContactModal] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const popularServices = PRODUCTS.filter(p => p.serviceCategory === 'popular' && p.id !== MASTER_VISIT_ID);
  const constructionServices = PRODUCTS.filter(p => p.serviceCategory === 'construction');

  const renderServiceCard = (product: Product) => {
    const inCart = cart.find(item => item.product.id === product.id);
    const quantity = inCart?.quantity || 0;
    const isRepairSelected = inCart?.selectedOption === 'repair';
    const isInstallSelected = inCart?.additionalOptions?.includes('install') || inCart?.selectedOption === 'install-only';
    const isWiringSelected = inCart?.additionalOptions?.includes('wiring') || inCart?.selectedOption === 'full-wiring';
    const showOptions = expandedProduct === product.id;

    return (
      <Card key={product.id} className="p-4 hover:shadow-lg transition-all">
        <div className="flex items-start gap-3">
          {!showOptions && (
            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex-shrink-0 flex items-center justify-center border border-blue-200">
              {product.category === 'switch' ? (
                <Icon name="Power" size={28} className="text-primary" />
              ) : product.category === 'chandelier' ? (
                <Icon name="Lightbulb" size={28} className="text-primary" />
              ) : (
                <Icon name="Plug" size={28} className="text-primary" />
              )}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base mb-1">{product.name}</h3>
            <p className="text-xs text-muted-foreground mb-2">{product.description}</p>
            
            {!showOptions ? (
              <Button
                size="sm"
                onClick={() => {
                  if (quantity === 0) {
                    addToCart(product, 1);
                  }
                  setExpandedProduct(product.id);
                }}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg"
              >
                <Icon name="Plus" size={16} className="mr-1" />
                Добавить
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (quantity > 1) {
                          updateQuantity(product.id, quantity - 1);
                        } else {
                          setExpandedProduct(null);
                          updateQuantity(product.id, 0);
                        }
                      }}
                      className="h-9 w-9 p-0 rounded-full bg-gray-100 hover:bg-gray-200 border-2 border-gray-300"
                    >
                      <Icon name="Minus" size={16} />
                    </Button>
                    <span className="font-bold text-xl px-3 min-w-[2.5rem] text-center">{quantity}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="h-9 w-9 p-0 rounded-full bg-orange-500 hover:bg-orange-600 text-white border-0"
                    >
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setExpandedProduct(null);
                      updateQuantity(product.id, 0);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-9"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>

                <div className="space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Дополнительно:</p>
                  
                  {product.options?.map(option => {
                    const isRepairOption = option.id === 'repair';
                    const disabled = isRepairOption && (isInstallSelected || isWiringSelected);

                    return (
                      <div 
                        key={option.id} 
                        className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                          (isRepairOption && inCart?.selectedOption === 'repair') || 
                          (!isRepairOption && inCart?.additionalOptions?.includes(option.id))
                            ? 'bg-green-100 shadow-sm' 
                            : 'bg-white hover:bg-gray-50'
                        } ${disabled ? 'opacity-50' : ''}`}
                        onClick={() => {
                          if (!disabled) {
                            if (isRepairOption) {
                              updateOption(product.id, 'repair');
                            } else {
                              toggleAdditionalOption(product.id, option.id);
                            }
                          }
                        }}
                      >
                        <Checkbox
                          id={`${product.id}-${option.id}`}
                          checked={
                            isRepairOption
                              ? inCart?.selectedOption === 'repair'
                              : inCart?.additionalOptions?.includes(option.id)
                          }
                          disabled={disabled}
                          className="cursor-pointer"
                        />
                        <label 
                          htmlFor={`${product.id}-${option.id}`} 
                          className="text-sm cursor-pointer flex-1 font-medium"
                        >
                          {option.name}
                        </label>
                        <span className="text-sm font-bold text-green-600">
                          +{option.price} ₽
                        </span>
                      </div>
                    );
                  })}
                  
                  {product.category !== 'cable' && product.category !== 'chandelier' && (
                    <>
                      <div 
                        className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                          isInstallSelected
                            ? 'bg-green-100 shadow-sm' 
                            : 'bg-white hover:bg-gray-50'
                        } ${isRepairSelected ? 'opacity-50' : ''}`}
                        onClick={() => !isRepairSelected && toggleAdditionalOption(product.id, 'install')}
                      >
                        <Checkbox
                          id={`${product.id}-install`}
                          checked={isInstallSelected}
                          disabled={isRepairSelected}
                          className="cursor-pointer"
                        />
                        <label htmlFor={`${product.id}-install`} className="text-sm cursor-pointer flex-1 font-medium">
                          Установить {product.name.toLowerCase()}
                        </label>
                        {product.priceInstallOnly > 0 ? (
                          <span className="text-sm font-bold text-green-600">
                            +{product.priceInstallOnly} ₽
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">
                            250 ₽/шт
                          </span>
                        )}
                      </div>
                      
                      <div 
                        className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                          isWiringSelected
                            ? 'bg-green-100 shadow-sm' 
                            : 'bg-white hover:bg-gray-50'
                        } ${isRepairSelected ? 'opacity-50' : ''}`}
                        onClick={() => !isRepairSelected && toggleAdditionalOption(product.id, 'wiring')}
                      >
                        <Checkbox
                          id={`${product.id}-wiring`}
                          checked={isWiringSelected}
                          disabled={isRepairSelected}
                          className="cursor-pointer"
                        />
                        <label htmlFor={`${product.id}-wiring`} className="text-sm cursor-pointer flex-1 font-medium">
                          Добавить/перенести
                        </label>
                        <span className="text-sm font-bold text-green-600">
                          +{product.priceWithWiring} ₽
                        </span>
                      </div>
                    </>
                  )}

                  {product.category === 'chandelier' && (
                    <div 
                      className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                        inCart?.selectedOption === 'install-only'
                          ? 'bg-green-100 shadow-sm' 
                          : 'bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => updateOption(product.id, 'install-only')}
                    >
                      <Checkbox
                        id={`${product.id}-install`}
                        checked={inCart?.selectedOption === 'install-only'}
                        className="cursor-pointer"
                      />
                      <label htmlFor={`${product.id}-install`} className="text-sm cursor-pointer flex-1 font-medium">
                        Установить люстру
                      </label>
                      <span className="text-sm font-bold text-green-600">
                        +{product.priceInstallOnly} ₽
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t-2 border-orange-200">
                  <span className="text-base font-semibold">Итого за услугу:</span>
                  <span className="font-bold text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {inCart ? calculateItemPrice(inCart).toLocaleString('ru-RU') : '0'} ₽
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-32">
      <PageHeader />

      <div className="max-w-md mx-auto">
        <PageNavigation onContactClick={() => setShowContactModal(true)} />

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-800">Популярные услуги</h3>
            <div className="space-y-3">
              {popularServices.map(renderServiceCard)}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-800">
              Строительные услуги
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Этими услугами пользуются дизайнеры интерьеров
            </p>
            <div className="space-y-3">
              {constructionServices.map(renderServiceCard)}
            </div>
          </div>
        </div>
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-200 shadow-2xl p-4 z-50">
          <div className="max-w-md mx-auto flex gap-3">
            <Button 
              onClick={() => navigate('/cart')} 
              className="flex-1 h-14 text-base font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Icon name="Check" size={18} className="mr-2" />
              Перейти в план работ ({totalItems})
            </Button>
          </div>
        </div>
      )}

      <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />
    </div>
  );
}