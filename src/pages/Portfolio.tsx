import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';

const PORTFOLIO_ITEMS = [
  {
    id: '1',
    title: 'ЖК РЫБНАЯ ДЕРЕВНЯ: ОСТРОВ КАНТА',
    image: 'https://cdn.poehali.dev/files/7db6218d-3dca-4c32-bbfe-c06b61adda33.jpg',
    price: '450 000 ₽',
    description: 'Комплексный электромонтаж новой проводки в просторной квартире в элитном ЖК на Острове Канта. Полный цикл работ от прокладки кабеля до установки розеток и выключателей. 9 фото.'
  },
  {
    id: '2',
    title: 'ЖК ВЫСОТА 56: Р-Н СЕЛЬМА',
    image: 'https://cdn.poehali.dev/files/7db6218d-3dca-4c32-bbfe-c06b61adda33.jpg',
    price: '100 000 ₽',
    description: 'Монтаж новой электропроводки в квартире в ЖК Высота 56. Установка розеток, выключателей, прокладка кабельных трасс. Профессиональная работа с гарантией. 3 фото.'
  },
  {
    id: '3',
    title: 'Работа в новостройке',
    image: 'https://cdn.poehali.dev/files/7db6218d-3dca-4c32-bbfe-c06b61adda33.jpg',
    price: '37 500 ₽',
    description: 'Интересный проект монтажа электрики в новой квартире. Установка подрозетников, прокладка кабеля, монтаж выключателей. Качественное выполнение в срок. 5 фото.'
  },
  {
    id: '4',
    title: 'Квартира в Московском районе, с учётом кабеля',
    image: 'https://cdn.poehali.dev/files/7db6218d-3dca-4c32-bbfe-c06b61adda33.jpg',
    price: '52 000 ₽',
    description: 'Полный монтаж электропроводки в квартире в Московском районе. Стоимость включает все материалы: кабель, подрозетники, гофру. Работа под ключ. 4 фото.'
  },
  {
    id: '5',
    title: 'ЖК на Арсенальной - Калининград',
    image: 'https://cdn.poehali.dev/files/7db6218d-3dca-4c32-bbfe-c06b61adda33.jpg',
    price: '150 000 ₽',
    description: 'Электромонтаж в современном ЖК на Арсенальной. Комплексные работы по монтажу электрики: от разводки в щитке до установки розеток и освещения. 3 фото.'
  },
  {
    id: '6',
    title: 'ЖК 3 Кита',
    image: 'https://cdn.poehali.dev/files/7db6218d-3dca-4c32-bbfe-c06b61adda33.jpg',
    price: '38 000 ₽',
    description: 'Электромонтажные работы в квартире в ЖК 3 Кита. Установка розеток, выключателей, монтаж освещения. Аккуратная работа с соблюдением всех норм. 3 фото.'
  },
  {
    id: '7',
    title: 'ЖК «Гурьевский»',
    image: 'https://cdn.poehali.dev/files/7db6218d-3dca-4c32-bbfe-c06b61adda33.jpg',
    price: '34 500 ₽',
    description: 'Монтаж электропроводки в квартире в ЖК Гурьевский. Штробление, прокладка кабеля, установка электроточек. Профессиональный подход к каждой детали. 3 фото.'
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