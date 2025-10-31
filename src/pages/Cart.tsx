import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import { calculateTotals, calculatePrice, getDiscount } from '@/types/electrical';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();

  const totals = calculateTotals(cart);
  const totalPrice = cart.reduce((sum, item) => sum + calculatePrice(item.product, item.quantity), 0);
  const totalDiscount = cart.reduce((sum, item) => {
    const discount = getDiscount(item.quantity);
    const fullPrice = item.product.priceMin * item.quantity;
    return sum + (fullPrice * discount / 100);
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <img 
          src="https://cdn.poehali.dev/files/eef76e18-1b64-4ae3-8839-b4fe8da091be.jpg"
          alt="Калининград"
          className="w-full h-32 object-cover"
        />
        <div className="max-w-md mx-auto p-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/products')}
            >
              <Icon name="ArrowLeft" size={24} />
            </Button>
            <h1 className="text-2xl font-bold">Список задач</h1>
          </div>

          <Card className="p-12 text-center">
            <Icon name="ShoppingCart" size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Список пуст</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Добавьте услуги для формирования заявки
            </p>
            <Button 
              onClick={() => navigate('/products')}
              className="bg-[#FF8C00] hover:bg-[#FF8C00]/90"
            >
              Перейти к выбору услуг
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-40">
      <img 
        src="https://cdn.poehali.dev/files/eef76e18-1b64-4ae3-8839-b4fe8da091be.jpg"
        alt="Калининград"
        className="w-full h-32 object-cover"
      />
      
      <div className="w-full">
        <div className="bg-white shadow-md p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/products')}
            >
              <Icon name="ArrowLeft" size={24} />
            </Button>
            <h1 className="text-2xl font-bold flex-1">Список задач</h1>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {cart.map(item => {
            const price = calculatePrice(item.product, item.quantity);
            const discount = getDiscount(item.quantity);
            
            return (
              <Card key={item.product.id} className="p-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex-shrink-0 flex items-center justify-center border border-orange-200">
                    {item.product.category === 'switch' ? (
                      <Icon name="Power" size={28} className="text-[#FF8C00]" />
                    ) : item.product.category === 'cable' ? (
                      <Icon name="Cable" size={28} className="text-[#FF8C00]" />
                    ) : (
                      <Icon name="Plug" size={28} className="text-[#FF8C00]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.product.name}</h3>
                    {discount > 0 && (
                      <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                        <Icon name="TrendingDown" size={12} />
                        Скидка {discount}%
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Icon name="Minus" size={16} />
                        </Button>
                        <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="h-8 w-8 p-0 bg-[#FF8C00] hover:bg-[#FF8C00]/90"
                        >
                          <Icon name="Plus" size={16} />
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-bold text-lg text-[#FF8C00]">{price.toLocaleString()} ₽</div>
                          {discount > 0 && (
                            <div className="text-xs text-gray-400 line-through">
                              {(item.product.priceMin * item.quantity).toLocaleString()} ₽
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Icon name="Trash2" size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <h3 className="font-bold text-lg mb-4">📊 Автоматический расчёт</h3>
            <div className="space-y-3">
              {totals.totalSwitches > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Всего выключателей:</span>
                  <span className="font-bold text-lg">{totals.totalSwitches}</span>
                </div>
              )}
              {totals.totalOutlets > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Всего розеток:</span>
                  <span className="font-bold text-lg">{totals.totalOutlets}</span>
                </div>
              )}
              {totals.totalPoints > 0 && (
                <>
                  <div className="h-px bg-blue-200 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Общее кол-во точек:</span>
                    <span className="font-bold text-lg text-primary">{totals.totalPoints}</span>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Button
            size="lg"
            onClick={() => navigate('/products')}
            variant="outline"
            className="w-full h-12"
          >
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить ещё услуги
          </Button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4 z-50">
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between px-4">
            <div className="text-left">
              <div className="text-sm text-gray-600">Стоимость работ:</div>
              {totalDiscount > 0 && (
                <div className="text-xs text-green-600 font-medium">Экономия: {totalDiscount.toLocaleString()} ₽</div>
              )}
            </div>
            <div className="text-2xl font-bold text-[#FF8C00]">{totalPrice.toLocaleString()} ₽</div>
          </div>
          <Button
            size="lg"
            className="w-full font-semibold h-14 text-base shadow-lg bg-[#FF8C00] hover:bg-[#FF8C00]/90"
            onClick={() => navigate('/checkout')}
          >
            Оформить заявку
          </Button>
        </div>
      </div>
    </div>
  );
}
