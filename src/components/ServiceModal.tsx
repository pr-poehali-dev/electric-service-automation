import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { PRODUCTS, Product, MASTER_VISIT_ID, calculateItemPrice } from '@/types/electrical';
import { useCart } from '@/contexts/CartContext';

interface ServiceModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ServiceModal({ open, onClose }: ServiceModalProps) {
  const { cart, addToCart, updateQuantity, updateOption, toggleAdditionalOption } = useCart();

  const popularServices = PRODUCTS.filter(p => p.serviceCategory === 'popular' && p.id !== MASTER_VISIT_ID);
  const constructionServices = PRODUCTS.filter(p => p.serviceCategory === 'construction');

  const renderServiceCard = (product: Product) => {
    const inCart = cart.find(item => item.product.id === product.id);
    const quantity = inCart?.quantity || 0;

    return (
      <Card key={product.id} className="p-4 hover:shadow-lg transition-all">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex-shrink-0 flex items-center justify-center border border-blue-200">
            {product.category === 'switch' ? (
              <Icon name="Power" size={32} className="text-primary" />
            ) : product.category === 'cable' ? (
              <Icon name="Cable" size={32} className="text-primary" />
            ) : product.category === 'chandelier' ? (
              <Icon name="Lightbulb" size={32} className="text-primary" />
            ) : (
              <Icon name="Plug" size={32} className="text-primary" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base mb-1">{product.name}</h3>
            <p className="text-xs text-muted-foreground mb-2">{product.description}</p>
            
            {quantity === 0 ? (
              <Button
                size="sm"
                onClick={() => addToCart(product, 1)}
                className="w-full bg-primary hover:bg-primary/90"
              >
                <Icon name="Plus" size={16} className="mr-1" />
                Добавить
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                  >
                    <Icon name="Minus" size={14} />
                  </Button>
                  <span className="font-semibold text-sm px-2">{quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                  >
                    <Icon name="Plus" size={14} />
                  </Button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`${product.id}-install`}
                      checked={inCart?.selectedOption === 'install-only'}
                      onCheckedChange={() => updateOption(product.id, 'install-only')}
                    />
                    <label htmlFor={`${product.id}-install`} className="text-xs cursor-pointer">
                      +{product.priceInstallOnly} ₽ Установить {product.name.toLowerCase()}
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`${product.id}-wiring`}
                      checked={inCart?.selectedOption === 'full-wiring'}
                      onCheckedChange={() => updateOption(product.id, 'full-wiring')}
                    />
                    <label htmlFor={`${product.id}-wiring`} className="text-xs cursor-pointer">
                      +{product.priceWithWiring - product.priceInstallOnly} ₽ Подготовить проводку
                    </label>
                  </div>

                  {product.options?.map(option => (
                    <div key={option.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`${product.id}-${option.id}`}
                        checked={inCart?.additionalOptions?.includes(option.id)}
                        onCheckedChange={() => toggleAdditionalOption(product.id, option.id)}
                      />
                      <label htmlFor={`${product.id}-${option.id}`} className="text-xs cursor-pointer">
                        +{option.price} ₽ {option.name}
                      </label>
                    </div>
                  ))}
                </div>

                {inCart && (
                  <div className="text-sm font-bold text-primary">
                    Итого: {calculateItemPrice(inCart).toLocaleString('ru-RU')} ₽
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Выберите услуги</DialogTitle>
          {totalItems > 0 && (
            <Button
              onClick={onClose}
              className="absolute top-4 right-16 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              Подтвердить ({totalItems})
            </Button>
          )}
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-800">📌 Популярные услуги</h3>
            <div className="space-y-3">
              {popularServices.map(renderServiceCard)}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-800">🏗️ Строительные услуги со штроблением</h3>
            <div className="space-y-3">
              {constructionServices.map(renderServiceCard)}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={onClose} className="flex-1">
            Готово
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}