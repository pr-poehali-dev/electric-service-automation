import { Card } from './ui/card';
import { Button } from './ui/button';
import Icon from './ui/icon';
import { useState } from 'react';

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: string;
  image?: string;
  onAddToCart: (quantity: number) => void;
}

const ServiceCard = ({ title, description, price, icon, image, onAddToCart }: ServiceCardProps) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {image ? (
        <img src={image} alt={title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Icon name={icon as any} size={64} className="text-primary" />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">{price.toLocaleString()} ₽</span>
          
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
          className="w-full mt-4" 
          onClick={() => {
            onAddToCart(quantity);
            setQuantity(1);
          }}
        >
          <Icon name="Plus" size={18} className="mr-2" />
          Добавить
        </Button>
      </div>
    </Card>
  );
};

export default ServiceCard;
