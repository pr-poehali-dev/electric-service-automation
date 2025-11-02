import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface PageNavigationProps {
  onContactClick?: () => void;
}

export default function PageNavigation({ onContactClick }: PageNavigationProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-lg p-4 flex items-center gap-3">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate('/')}
        title="Главная"
      >
        <Icon name="Home" size={20} />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onContactClick}
        title="Связь"
      >
        <Icon name="MessageCircle" size={20} />
      </Button>
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
        onClick={() => navigate('/orders')}
        title="История заказов"
      >
        <Icon name="FileText" size={20} />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate('/cart')}
        title="План работ"
      >
        <Icon name="ClipboardList" size={20} />
      </Button>
      <div className="flex-1" />
      <a 
        href="https://t.me/konigelectric" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 rounded-md transition-colors"
        title="Telegram"
      >
        <Icon name="Send" size={20} />
      </a>
    </div>
  );
}
