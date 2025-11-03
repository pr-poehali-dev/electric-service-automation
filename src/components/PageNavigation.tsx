import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import Icon from '@/components/ui/icon';

interface PageNavigationProps {
  onContactClick?: () => void;
}

export default function PageNavigation({ onContactClick }: PageNavigationProps) {
  const navigate = useNavigate();
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white shadow-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')}
          title="На главную"
        >
          <Icon name="Home" size={20} />
        </Button>
        <Button 
          variant="ghost"
          className="h-10 text-sm px-3 relative"
          onClick={() => navigate('/cart')}
          title="Список задач"
        >
          Список задач
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Button>
        {cartCount > 0 && (
          <Button 
            variant="ghost"
            className="h-10 text-sm px-3 text-blue-600 font-semibold"
            onClick={() => navigate('/checkout')}
            title="Продолжить"
          >
            Продолжить
          </Button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => window.open('https://baltset.ru/rating/', '_blank')}
          title="Отзывы"
        >
          <Icon name="Star" size={20} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onContactClick}
          title="Связаться с нами"
        >
          <Icon name="MessageCircle" size={20} />
        </Button>
      </div>
    </div>
  );
}