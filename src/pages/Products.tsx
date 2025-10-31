import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { PRODUCTS } from '@/types/electrical';
import { useCart } from '@/contexts/CartContext';

export default function Products() {
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const [filter, setFilter] = useState<'all' | 'switch' | 'outlet'>('all');

  const filteredProducts = PRODUCTS.filter(p => 
    filter === 'all' || p.category === filter
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div 
      className="min-h-screen pb-32"
      style={{
        background: 'linear-gradient(135deg, rgba(30,40,60,0.95) 0%, rgba(50,60,80,0.95) 100%), url(https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=1200&auto=format&fit=crop) center/cover',
      }}
    >
      <div className="max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur shadow-md p-6 space-y-4">
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

          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Все
            </Button>
            <Button
              variant={filter === 'switch' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('switch')}
            >
              Выключатели
            </Button>
            <Button
              variant={filter === 'outlet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('outlet')}
            >
              Розетки
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {filteredProducts.map(product => {
            const inCart = cart.find(item => item.product.id === product.id);
            
            return (
              <Card 
                key={product.id}
                className="overflow-hidden bg-white/95 backdrop-blur hover:shadow-xl transition-all"
              >
                <div className="flex gap-4 p-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                    {product.category === 'switch' ? (
                      <Icon name="Power" size={40} className="text-primary" />
                    ) : (
                      <Icon name="Plug" size={40} className="text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                    
                    {inCart ? (
                      <div className="flex items-center gap-2">
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
                          className="h-8 w-8 p-0"
                        >
                          <Icon name="Minus" size={16} />
                        </Button>
                        <span className="font-bold text-lg w-8 text-center">{inCart.quantity}</span>
                        <Button
                          size="sm"
                          onClick={() => addToCart(product, 1)}
                          className="h-8 w-8 p-0"
                        >
                          <Icon name="Plus" size={16} />
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
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4">
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
