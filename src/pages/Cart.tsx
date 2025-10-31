import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import { calculateTotals } from '@/types/electrical';
import ProgressBar from '@/components/ProgressBar';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart } = useCart();

  const totals = calculateTotals(cart);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
              Добавьте товары для формирования заявки
            </p>
            <Button onClick={() => navigate('/products')}>
              Перейти к выбору товаров
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-32">
      <div className="max-w-md mx-auto">
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
          
          <ProgressBar 
            currentStep={2}
            steps={['Помещение', 'Товары', 'Заявка', 'Готово']}
          />
        </div>

        <div className="p-6 space-y-4">
          {cart.map(item => (
            <Card key={item.product.id} className="p-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                  {item.product.category === 'switch' ? (
                    <Icon name="Power" size={28} className="text-primary" />
                  ) : (
                    <Icon name="Plug" size={28} className="text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">{item.product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {item.product.description}
                  </p>
                  <div className="flex items-center justify-between">
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
                        className="h-8 w-8 p-0"
                      >
                        <Icon name="Plus" size={16} />
                      </Button>
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
            </Card>
          ))}

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <h3 className="font-bold text-lg mb-4">📊 Автоматический расчёт</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Всего выключателей:</span>
                <span className="font-bold text-lg">{totals.totalSwitches}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Всего розеток:</span>
                <span className="font-bold text-lg">{totals.totalOutlets}</span>
              </div>
              <div className="h-px bg-blue-200 my-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Общее кол-во точек:</span>
                <span className="font-bold text-lg text-primary">{totals.totalPoints}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Примерный метраж кабеля:</span>
                <span className="font-bold text-lg text-primary">~{totals.estimatedCable} м</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Необходимо рамок:</span>
                <span className="font-bold text-lg text-primary">{totals.estimatedFrames} шт</span>
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-4">
              * Расчёт кабеля: количество точек × 7 метров
            </p>
          </Card>

          <Button
            size="lg"
            onClick={() => navigate('/products')}
            variant="outline"
            className="w-full h-12"
          >
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить ещё товары
          </Button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4">
        <div className="max-w-md mx-auto">
          <Button
            size="lg"
            className="w-full font-semibold h-14 text-base shadow-lg"
            onClick={() => navigate('/checkout')}
          >
            Оформить заявку ({totals.totalPoints} точек)
          </Button>
        </div>
      </div>
    </div>
  );
}