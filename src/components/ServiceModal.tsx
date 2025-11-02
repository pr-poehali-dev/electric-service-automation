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
    const isRepairSelected = inCart?.selectedOption === 'repair';
    const isInstallOrWiringSelected = inCart?.selectedOption === 'install-only' || inCart?.selectedOption === 'full-wiring';
    const showOptions = quantity > 0;

    return (
      <Card key={product.id} className="p-4 hover:shadow-lg transition-all">
        <div className="flex items-start gap-3">
          {!showOptions && (
            <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex-shrink-0 flex items-center justify-center border border-blue-200">
              {product.category === 'switch' ? (
                <Icon name="Power" size={28} className="text-primary" />
              ) : product.category === 'cable' ? (
                <Icon name="Cable" size={28} className="text-primary" />
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
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Icon name="Minus" size={14} />
                  </Button>
                  <span className="font-semibold text-sm px-2 min-w-[2rem] text-center">{quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Icon name="Plus" size={14} />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`${product.id}-install`}
                      checked={inCart?.selectedOption === 'install-only'}
                      onCheckedChange={() => updateOption(product.id, 'install-only')}
                      disabled={isRepairSelected}
                    />
                    <label htmlFor={`${product.id}-install`} className={`text-xs cursor-pointer flex-1 ${isRepairSelected ? 'opacity-50' : ''}`}>
                      +{product.priceInstallOnly} ₽ Установить {product.name.toLowerCase()}
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`${product.id}-wiring`}
                      checked={inCart?.selectedOption === 'full-wiring'}
                      onCheckedChange={() => updateOption(product.id, 'full-wiring')}
                      disabled={isRepairSelected}
                    />
                    <label htmlFor={`${product.id}-wiring`} className={`text-xs cursor-pointer flex-1 ${isRepairSelected ? 'opacity-50' : ''}`}>
                      +{product.priceWithWiring - product.priceInstallOnly} ₽ Подготовить проводку
                    </label>
                  </div>

                  {product.options?.map(option => {
                    const isConduitOption = option.id === 'conduit';
                    const isRepairOption = option.id === 'repair';
                    const disabled = isRepairOption && isInstallOrWiringSelected;

                    return (
                      <div key={option.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`${product.id}-${option.id}`}
                          checked={
                            isRepairOption
                              ? inCart?.selectedOption === 'repair'
                              : inCart?.additionalOptions?.includes(option.id)
                          }
                          onCheckedChange={() => {
                            if (isRepairOption) {
                              updateOption(product.id, 'repair');
                            } else {
                              toggleAdditionalOption(product.id, option.id);
                            }
                          }}
                          disabled={disabled}
                        />
                        <label 
                          htmlFor={`${product.id}-${option.id}`} 
                          className={`text-xs cursor-pointer flex-1 ${disabled ? 'opacity-50' : ''}`}
                        >
                          {isConduitOption ? `+${option.price} ₽ ${option.name}` : (
                            isRepairOption ? `${option.name}` : `+${option.price} ₽ ${option.name}`
                          )}
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t">
                  <span className="text-sm font-bold text-primary">
                    {calculateItemPrice(inCart!).toLocaleString('ru-RU')} ₽
                  </span>
                  <Button
                    size="sm"
                    onClick={() => addToCart(product, quantity)}
                    className="bg-primary hover:bg-primary/90 h-8"
                  >
                    <Icon name="Check" size={14} className="mr-1" />
                    Добавить
                  </Button>
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle>Выберите услуги</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-800">📌 Популярные услуги</h3>
            <div className="space-y-3">
              {popularServices.map(renderServiceCard)}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-800">
              🏗️ Строительные услуги
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              Опционально идут как дополнение для повышения комфорта вашего дома
            </p>
            <div className="space-y-3">
              {constructionServices.map(renderServiceCard)}
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t sticky bottom-0 bg-white">
          {totalItems > 0 ? (
            <Button 
              onClick={onClose} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Icon name="Check" size={18} className="mr-2" />
              Подтвердить ({totalItems})
            </Button>
          ) : (
            <Button onClick={onClose} variant="outline" className="flex-1">
              Закрыть
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}