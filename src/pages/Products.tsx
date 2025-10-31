import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { PRODUCTS, getDiscount, calculateItemPrice, ServiceOption, MASTER_VISIT_ID } from '@/types/electrical';
import { useCart } from '@/contexts/CartContext';
import ProgressBar from '@/components/ProgressBar';
import { Badge } from '@/components/ui/badge';

export default function Products() {
  const navigate = useNavigate();
  const { cart, addToCart, updateOption, toggleAdditionalOption } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  const totalDiscount = cart.reduce((sum, item) => {
    const discount = getDiscount(item.quantity);
    const basePrice = item.selectedOption === 'install-only' ? item.product.priceInstallOnly : item.product.priceWithWiring;
    const fullPrice = basePrice * item.quantity;
    return sum + (fullPrice * discount / 100);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-32">
      <img 
        src="https://cdn.poehali.dev/files/eef76e18-1b64-4ae3-8839-b4fe8da091be.jpg"
        alt="Калининград"
        className="w-full h-32 object-cover"
      />

      <div className="w-full">
        <div className="bg-white shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/electrical')}
              >
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <h1 className="text-2xl font-bold">Задачи</h1>
            </div>
            <Button
              onClick={() => navigate('/profile')}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all p-0"
            >
              <Icon name="User" size={20} />
            </Button>
          </div>
          
          {totalItems > 0 && (
            <p className="text-sm text-muted-foreground">Выбрано услуг: {totalItems}</p>
          )}
          
          {totalItems > 0 && (
            <Button
              onClick={() => navigate('/cart')}
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold text-base shadow-lg gap-3"
            >
              <Icon name="ClipboardList" size={20} />
              План работ
              <Badge variant="secondary" className="ml-auto bg-white text-orange-600 font-bold px-3 py-1">{totalItems}</Badge>
            </Button>
          )}
          
          <ProgressBar 
            currentStep={1} 
            steps={['Задачи', 'План работ', 'Оформление']}
            onStepClick={(step) => {
              if (step === 1) navigate('/products');
              if (step === 2) navigate('/cart');
              if (step === 3) navigate('/checkout');
            }}
          />
        </div>

        <div className="p-4 space-y-3">
          {PRODUCTS.filter(p => p.id !== MASTER_VISIT_ID).map(product => {
            const inCart = cart.find(item => item.product.id === product.id);
            const quantity = inCart?.quantity || 0;
            const price = quantity > 0 && inCart ? calculateItemPrice(inCart) : product.priceInstallOnly;
            const discount = quantity > 0 ? getDiscount(quantity) : 0;
            
            return (
              <Card 
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-all bg-white"
              >
                <div className="p-4">
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`w-16 h-16 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex-shrink-0 flex items-center justify-center border border-orange-200 transition-all duration-300 ${inCart ? 'animate-pulse-glow' : ''}`}>
                      {product.category === 'switch' ? (
                        <Icon name="Power" size={32} className={`text-[#FF8C00] transition-transform duration-300 ${inCart ? 'animate-wiggle' : ''}`} />
                      ) : product.category === 'cable' ? (
                        <Icon name="Cable" size={32} className={`text-[#FF8C00] transition-transform duration-300 ${inCart ? 'animate-rotate-slow' : ''}`} />
                      ) : product.category === 'chandelier' ? (
                        <Icon name="Lightbulb" size={32} className={`text-[#FF8C00] transition-transform duration-300 ${inCart ? 'animate-bounce-subtle' : ''}`} />
                      ) : (
                        <Icon name="Plug" size={32} className={`text-[#FF8C00] transition-transform duration-300 ${inCart ? 'animate-wiggle' : ''}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-1">{product.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {product.description}
                      </p>
                      {discount > 0 && (
                        <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          <Icon name="TrendingDown" size={12} />
                          Скидка {discount}%
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {inCart && (
                    <div className="mb-3 space-y-2">
                      <div className="text-xs font-semibold text-gray-700 mb-1">Конфигурация:</div>
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          variant={inCart.selectedOption === 'install-only' ? 'default' : 'outline'}
                          onClick={() => updateOption(product.id, 'install-only')}
                          className={`w-full justify-start text-left ${inCart.selectedOption === 'install-only' ? 'bg-[#FF8C00] hover:bg-[#FF8C00]/90' : ''}`}
                        >
                          <Icon name="Zap" size={14} className="mr-2" />
                          <div className="flex-1">
                            <div className="font-semibold">Чистовая установка</div>
                            <div className="text-xs opacity-80">Установка изделия без прокладки кабеля</div>
                          </div>
                          <Icon name="Info" size={14} className="ml-2 opacity-60" />
                        </Button>
                        <Button
                          size="sm"
                          variant={inCart.selectedOption === 'full-wiring' ? 'default' : 'outline'}
                          onClick={() => updateOption(product.id, 'full-wiring')}
                          className={`w-full justify-start text-left ${inCart.selectedOption === 'full-wiring' ? 'bg-[#FF8C00] hover:bg-[#FF8C00]/90' : ''}`}
                        >
                          <Icon name="Wrench" size={14} className="mr-2" />
                          <div className="flex-1">
                            <div className="font-semibold">Черновой монтаж</div>
                            <div className="text-xs opacity-80">Штробление, установка подрозетника. Без кабеля и чистовой</div>
                          </div>
                          <Icon name="Info" size={14} className="ml-2 opacity-60" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {inCart && product.options && product.options.length > 0 && (
                    <div className="mb-3 space-y-2">
                      <div className="text-xs font-semibold text-gray-700 mb-1">Дополнительно:</div>
                      {product.options.map(option => {
                        const isSelected = inCart.additionalOptions?.includes(option.id);
                        return (
                          <Button
                            key={option.id}
                            size="sm"
                            variant={isSelected ? 'default' : 'outline'}
                            onClick={() => toggleAdditionalOption(product.id, option.id)}
                            className={`w-full justify-between text-left ${isSelected ? 'bg-green-600 hover:bg-green-700' : ''}`}
                          >
                            <div className="flex items-center gap-2">
                              <Icon name={isSelected ? 'CheckSquare' : 'Square'} size={16} />
                              <span>{option.name}</span>
                            </div>
                            <span className="font-semibold">+{option.price} ₽</span>
                          </Button>
                        );
                      })}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {inCart ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addToCart(product, -1)}
                            className="h-10 w-10 p-0 rounded-full"
                          >
                            <Icon name="Minus" size={18} />
                          </Button>
                          <span className="font-bold text-xl w-10 text-center">{quantity}</span>
                          <Button
                            size="sm"
                            onClick={() => addToCart(product, 1)}
                            className="h-10 w-10 p-0 rounded-full bg-[#FF8C00] hover:bg-[#FF8C00]/90"
                          >
                            <Icon name="Plus" size={18} />
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => addToCart(product, 1)}
                          className="gap-2 bg-[#FF8C00] hover:bg-[#FF8C00]/90"
                        >
                          <Icon name="Plus" size={16} />
                          Добавить
                        </Button>
                      )}
                    </div>
                    
                    <div className="text-right">
                      {quantity > 0 ? (
                        <>
                          <div className="text-lg font-bold text-[#FF8C00]">{price.toLocaleString()} ₽</div>
                          {discount > 0 && (
                            <div className="text-xs text-gray-400 line-through">
                              {(product.priceMin * quantity).toLocaleString()} ₽
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="text-sm font-medium">от {product.priceMin} ₽</div>
                          <div className="text-xs text-muted-foreground">до {product.priceMax} ₽</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50">
          <div className="w-full space-y-2">
            {totalDiscount > 0 && (
              <div className="flex items-center justify-between px-4">
                <span className="text-sm text-green-600 font-medium">Ваша экономия:</span>
                <span className="text-lg font-bold text-green-600">-{totalDiscount.toLocaleString()} ₽</span>
              </div>
            )}
            <Button
              size="lg"
              className="w-full font-semibold h-14 text-base shadow-lg bg-[#FF8C00] hover:bg-[#FF8C00]/90"
              onClick={() => navigate('/cart')}
            >
              <Icon name="ShoppingCart" size={20} className="mr-2" />
              Оформить заявку • {totalPrice.toLocaleString()} ₽
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}