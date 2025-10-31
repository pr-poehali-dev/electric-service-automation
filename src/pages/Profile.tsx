import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';

export default function Profile() {
  const navigate = useNavigate();
  const { orders } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <img 
        src="https://cdn.poehali.dev/files/eef76e18-1b64-4ae3-8839-b4fe8da091be.jpg"
        alt="Калининград"
        className="w-full h-32 object-cover"
      />

      <div className="max-w-md mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <Icon name="ArrowLeft" size={24} />
          </Button>
          <h1 className="text-2xl font-bold">Личный кабинет</h1>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Icon name="User" size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Гость</h2>
              <p className="text-sm text-muted-foreground">Клиент</p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start h-14"
              onClick={() => navigate('/orders')}
            >
              <Icon name="ShoppingBag" size={20} className="mr-3" />
              <div className="flex-1 text-left">
                <div className="font-semibold">Мои заявки</div>
                <div className="text-xs text-muted-foreground">История и статусы</div>
              </div>
              <span className="text-sm font-bold text-primary">{orders.length}</span>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-14"
              onClick={() => navigate('/products')}
            >
              <Icon name="Plus" size={20} className="mr-3" />
              <div className="flex-1 text-left">
                <div className="font-semibold">Новая заявка</div>
                <div className="text-xs text-muted-foreground">Заказать услугу</div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-14"
              onClick={() => window.open('https://t.me/konigelectric', '_blank')}
            >
              <Icon name="MessageCircle" size={20} className="mr-3" />
              <div className="flex-1 text-left">
                <div className="font-semibold">Связаться с нами</div>
                <div className="text-xs text-muted-foreground">Telegram поддержка</div>
              </div>
            </Button>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
              <Icon name="Info" size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-1">Телефон для связи</h3>
              <a href="tel:+74012520725" className="text-lg font-bold text-orange-700 hover:text-orange-800">
                +7 (4012) 52-07-25
              </a>
            </div>
          </div>
        </Card>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate('/electrical')}
        >
          <Icon name="Home" size={18} className="mr-2" />
          На главную
        </Button>
      </div>
    </div>
  );
}
