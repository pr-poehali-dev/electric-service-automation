import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import Icon from './ui/icon';
import { useState } from 'react';
import { Service } from '@/types/services';
import { toast } from '@/hooks/use-toast';

interface ServiceCardProps {
  service: Service;
  onAddToCart: (quantity: number) => void;
}

const ServiceCard = ({ service, onAddToCart }: ServiceCardProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    onAddToCart(quantity);
    toast({
      title: "Добавлено в список задач",
      description: `${service.title} × ${quantity}`
    });
    setQuantity(1);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      {service.image ? (
        <img src={service.image} alt={service.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Icon name={service.icon as any} size={64} className="text-primary" />
        </div>
      )}
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">{service.title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              {service.oldPrice && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-muted-foreground line-through">
                    {service.oldPrice.toLocaleString()} ₽
                  </span>
                  {service.discount && (
                    <Badge variant="destructive" className="text-xs">
                      -{service.discount}%
                    </Badge>
                  )}
                </div>
              )}
              <span className="text-2xl font-bold text-primary">
                {service.price.toLocaleString()} ₽
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Icon name="Minus" size={16} />
              </Button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Icon name="Plus" size={16} />
              </Button>
            </div>
          </div>

          <Button 
            className="w-full" 
            onClick={handleAdd}
          >
            <Icon name="Plus" size={18} className="mr-2" />
            Добавить в корзину
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;