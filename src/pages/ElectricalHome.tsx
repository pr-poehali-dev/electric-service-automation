import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import { PortfolioItem } from '@/types/electrical';

const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: '1',
    title: 'ЖК ВЫСОТА 56: Р-Н СЕЛЬМА',
    image: 'https://cdn.poehali.dev/files/dc78d8d9-0436-415f-ade9-9b1e7b215d6e.jpeg',
    price: '100 000 ₽',
    description: 'Полный электромонтаж квартиры'
  },
  {
    id: '2',
    title: 'Установить автомат',
    image: 'https://cdn.poehali.dev/files/dc78d8d9-0436-415f-ade9-9b1e7b215d6e.jpeg',
    price: '1 000 ₽',
    description: 'Установка автоматического выключателя'
  },
  {
    id: '3',
    title: 'Электромонтаж',
    image: 'https://cdn.poehali.dev/files/dc78d8d9-0436-415f-ade9-9b1e7b215d6e.jpeg',
    price: '35 000 ₽',
    description: 'Комплексные работы'
  }
];

export default function ElectricalHome() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [showVideoHint, setShowVideoHint] = useState(true);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-md mx-auto pb-24">
        <div className="bg-white rounded-b-3xl shadow-lg p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">
              УСЛУГИ <span className="text-[#FF8C00]">ЭЛЕКТРИКА</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Рассчитайте стоимость работ за 2 минуты
            </p>
          </div>

          <Card 
            className="p-4 hover:shadow-md transition-all cursor-pointer border-2 hover:border-primary/50"
            onClick={() => navigate('/calculator')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon name="Wrench" size={24} className="text-[#FF8C00]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base">Электромонтажные работы</h3>
                <p className="text-sm text-muted-foreground">ВЫБЕРИТЕ УСЛУГУ</p>
              </div>
              <Icon name="ChevronRight" size={24} className="text-muted-foreground" />
            </div>
          </Card>

          {showVideoHint && (
            <Card className="p-4 bg-orange-50 border-orange-200">
              <div className="flex items-start gap-3">
                <Icon name="Video" size={20} className="text-[#FF8C00] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-900">
                    Видео-инструкция за 2 минуты
                  </p>
                  <button 
                    className="text-xs text-orange-600 hover:underline mt-1"
                    onClick={() => setShowVideoHint(false)}
                  >
                    Посмотреть как работает →
                  </button>
                </div>
              </div>
            </Card>
          )}

          <div className="relative rounded-2xl overflow-hidden shadow-md">
            <img 
              src="https://cdn.poehali.dev/files/dc78d8d9-0436-415f-ade9-9b1e7b215d6e.jpeg"
              alt="Электромонтаж"
              className="w-full h-64 object-cover"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce">
              <Icon name="ChevronDown" size={32} className="text-white drop-shadow-lg" />
            </div>
          </div>

          <Button
            size="lg"
            className="w-full bg-[#0088cc] hover:bg-[#0088cc]/90 text-white font-semibold h-14 text-base shadow-lg"
            onClick={() => window.open('https://t.me/konigelectric', '_blank')}
          >
            НАПИСАТЬ В TELEGRAM
          </Button>
        </div>

        <div className="mt-8 px-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">ПОРТФОЛИО</h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
            {PORTFOLIO_ITEMS.map(item => (
              <Card 
                key={item.id}
                className="min-w-[280px] flex-shrink-0 overflow-hidden cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate('/portfolio')}
              >
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.title}</h3>
                  <p className="text-lg font-bold text-[#FF8C00]">{item.price}</p>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-4 bg-orange-50 border-orange-200">
            <Button
              size="lg"
              className="w-full bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white font-bold h-14 text-base shadow-lg"
              onClick={() => navigate('/calculator')}
            >
              📅 Записаться на бесплатный осмотр →
            </Button>
          </Card>

          <Button
            size="lg"
            variant="outline"
            className="w-full font-semibold h-14 text-base"
            onClick={() => navigate('/calculator')}
          >
            ВЫБРАТЬ УСЛУГУ →
          </Button>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-4 gap-1 p-2">
            <button 
              className="flex flex-col items-center justify-center py-2 gap-1 text-[#FF8C00]"
              onClick={() => navigate('/electrical')}
            >
              <Icon name="Home" size={24} />
              <span className="text-xs font-medium">Меню</span>
            </button>

            <button 
              className="flex flex-col items-center justify-center py-2 gap-1"
              onClick={() => navigate('/orders')}
            >
              <Icon name="Calendar" size={24} className="text-gray-400" />
              <span className="text-xs text-gray-600">Встречи</span>
            </button>

            <button 
              className="flex flex-col items-center justify-center py-2 gap-1"
              onClick={() => navigate('/cart')}
            >
              <div className="relative">
                <Icon name="Briefcase" size={24} className="text-gray-400" />
                {totalItems > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF8C00] rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{totalItems}</span>
                  </div>
                )}
              </div>
              <span className="text-xs text-gray-600">В работе</span>
            </button>

            <button 
              className="flex flex-col items-center justify-center py-2 gap-1"
              onClick={() => navigate('/orders')}
            >
              <Icon name="MessageCircle" size={24} className="text-gray-400" />
              <span className="text-xs text-gray-600">Вопросы</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}