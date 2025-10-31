import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { PRODUCTS } from '@/types/electrical';
import { useCart } from '@/contexts/CartContext';
import ProgressBar from '@/components/ProgressBar';

export default function Products() {
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const [filter, setFilter] = useState<'all' | 'switch' | 'outlet'>('all');

  const filteredProducts = PRODUCTS.filter(p => 
    filter === 'all' || p.category === filter
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-32">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-md p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/calculator')}
            >
              <Icon name="ArrowLeft" size={24} />
            </Button>
            <h1 className="text-2xl font-bold flex-1">Выбор товаров</h1>
          </div>

          <ProgressBar 
            currentStep={2}
            steps={['Помещение', 'Товары', 'Заявка', 'Готово']}
          />

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className="whitespace-nowrap"
            >
              Все товары
            </Button>
            <Button
              variant={filter === 'switch' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('switch')}
              className="whitespace-nowrap"
            >
              Выключатели
            </Button>
            <Button
              variant={filter === 'outlet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('outlet')}
              className="whitespace-nowrap"
            >
              Розетки
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-3">
          {filteredProducts.map(product => {
            const inCart = cart.find(item => item.product.id === product.id);
            
            return (
              <Card 
                key={product.id}
                className="overflow-hidden hover:shadow-lg transition-all bg-white"
              >
                <div className="p-4">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-16 h-16 bg-gray-50 rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-200">
                      {product.category === 'switch' ? (
                        <Icon name="Power" size={32} className="text-primary" />
                      ) : (
                        <Icon name="Plug" size={32} className="text-primary" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base mb-1">{product.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {inCart ? (
                      <div className="flex items-center gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const newQty = inCart.quantity - 1;
                            if (newQty === 0) {
                              return;
                            }
                            addToCart(product, -1);
                          }}
                          className="h-10 w-10 p-0 rounded-full"
                        >
                          <Icon name="Minus" size={18} />
                        </Button>
                        <span className="font-bold text-xl w-10 text-center">{inCart.quantity}</span>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product, 1)}
                          className="h-10 w-10 p-0 rounded-full"
                        >
                          <Icon name="Plus" size={18} />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => addToCart(product, 1)}
                        className="gap-2"
                      >
                        <Icon name="Plus" size={16} />
                        Добавить
                      </Button>
                    )}
                    
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">1 150 ₽</div>
                      <div className="text-xs text-muted-foreground">за точку</div>
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
          <div className="max-w-md mx-auto">
            <Button
              size="lg"
              className="w-full font-semibold h-14 text-base shadow-lg"
              onClick={() => navigate('/cart')}
            >
              <Icon name="ShoppingCart" size={20} className="mr-2" />
              Список задач ({totalItems})
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
