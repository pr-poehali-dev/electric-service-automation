import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const PORTFOLIO_ITEMS = [
  {
    id: '1',
    title: 'ЖК ВЫСОТА 56: Р-Н СЕЛЬМА',
    image: 'https://cdn.poehali.dev/files/2348e099-50c3-4e12-ad08-81fd16a99869.jpeg',
    price: '100 000 ₽',
    description: 'Полный электромонтаж трёхкомнатной квартиры. Установлено 45 точек (розеток и выключателей), проложено 320 метров кабеля.'
  },
  {
    id: '2',
    title: 'Установить автомат в щиток',
    image: 'https://cdn.poehali.dev/files/2348e099-50c3-4e12-ad08-81fd16a99869.jpeg',
    price: '1 000 ₽',
    description: 'Установка автоматического выключателя в электрощиток с подключением.'
  },
  {
    id: '3',
    title: 'Электромонтаж комнаты',
    image: 'https://cdn.poehali.dev/files/2348e099-50c3-4e12-ad08-81fd16a99869.jpeg',
    price: '35 000 ₽',
    description: 'Электромонтаж одной комнаты: 12 розеток, 3 выключателя, освещение.'
  },
  {
    id: '4',
    title: 'Замена электропроводки 2-комн',
    image: 'https://cdn.poehali.dev/files/2348e099-50c3-4e12-ad08-81fd16a99869.jpeg',
    price: '75 000 ₽',
    description: 'Полная замена электропроводки в двухкомнатной квартире.'
  },
  {
    id: '5',
    title: 'Монтаж розеточных блоков',
    image: 'https://cdn.poehali.dev/files/2348e099-50c3-4e12-ad08-81fd16a99869.jpeg',
    price: '15 000 ₽',
    description: 'Установка блоков розеток на кухне и в гостиной (8 блоков).'
  },
  {
    id: '6',
    title: 'Установка УЗО и автоматов',
    image: 'https://cdn.poehali.dev/files/2348e099-50c3-4e12-ad08-81fd16a99869.jpeg',
    price: '8 000 ₽',
    description: 'Монтаж УЗО и автоматических выключателей в щитке.'
  },
  {
    id: '7',
    title: 'Электромонтаж кухни',
    image: 'https://cdn.poehali.dev/files/2348e099-50c3-4e12-ad08-81fd16a99869.jpeg',
    price: '25 000 ₽',
    description: 'Электропроводка для кухни с подключением бытовой техники.'
  },
  {
    id: '8',
    title: 'Монтаж освещения',
    image: 'https://cdn.poehali.dev/files/2348e099-50c3-4e12-ad08-81fd16a99869.jpeg',
    price: '12 000 ₽',
    description: 'Установка точечных светильников и люстр (15 точек).'
  }
];

export default function Portfolio() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-md p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/electrical')}
            >
              <Icon name="ArrowLeft" size={24} />
            </Button>
            <h1 className="text-2xl font-bold flex-1">Портфолио</h1>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {PORTFOLIO_ITEMS.map(item => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all">
              <img 
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-base mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#FF8C00]">{item.price}</span>
                  <Button size="sm" onClick={() => navigate('/calculator')}>
                    Заказать похожее
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
