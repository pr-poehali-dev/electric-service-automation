import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { quickServices, electricalServices, Service } from '@/types/services';
import ServiceCard from '@/components/ServiceCard';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'quick' | 'electrical' | null>(null);
  const [cart, setCart] = useState<{ service: Service; quantity: number }[]>([]);

  const addToCart = (service: Service, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.service.id === service.id);
      if (existing) {
        return prev.map(item => 
          item.service.id === service.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { service, quantity }];
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.service.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleGoToTasks = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/tasks');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Zap" className="text-primary" size={24} />
              <div>
                <h1 className="font-heading font-bold text-lg text-foreground">БАЛТСЕТЬ <sup className="text-xs text-primary">³⁹</sup></h1>
                <p className="text-[10px] text-muted-foreground uppercase">Калининград</p>
              </div>
            </div>
            <a href="tel:+74012520725" className="text-base md:text-lg font-bold text-primary hover:text-primary/80 transition-colors">
              +7 (4012) 52-07-25
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!selectedCategory ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Что вас интересует?
              </h2>
              <p className="text-muted-foreground">Выберите категорию услуг</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card 
                className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary group"
                onClick={() => setSelectedCategory('quick')}
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="Zap" size={40} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-2xl">Вызов электрика на час</h3>
                  <p className="text-muted-foreground">Быстрая помощь для простых задач</p>
                </div>
              </Card>

              <Card 
                className="p-8 hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary group"
                onClick={() => setSelectedCategory('electrical')}
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="Wrench" size={40} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-2xl">Электромонтажные работы</h3>
                  <p className="text-muted-foreground">Комплексные работы и монтаж</p>
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6 pb-32">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setSelectedCategory(null)}
                className="gap-2"
              >
                <Icon name="ArrowLeft" size={20} />
                Назад
              </Button>
            </div>

            <div className="text-center space-y-2">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                {selectedCategory === 'quick' ? 'Вызов электрика на час' : 'Электромонтажные работы'}
              </h2>
              <p className="text-muted-foreground">Выберите услуги и добавьте в список задач</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(selectedCategory === 'quick' ? quickServices : electricalServices).map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onAddToCart={(quantity) => addToCart(service, quantity)}
                />
              ))}
            </div>

            <div className="mt-12 max-w-4xl mx-auto space-y-8">
              <Card className="p-6">
                <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                  <Icon name="MessageSquare" size={24} className="text-primary" />
                  Связаться с нами
                </h3>
                <p className="text-muted-foreground mb-4">
                  Есть вопросы? Напишите нам в Telegram
                </p>
                <Button 
                  onClick={() => window.open('https://t.me/konigelectric', '_blank')}
                  className="w-full gap-2"
                >
                  <Icon name="Send" size={20} />
                  Написать в Telegram
                </Button>
              </Card>

              <div className="space-y-4">
                <h3 className="font-bold text-2xl text-center">Отзывы наших клиентов</h3>
                <div style={{height:'800px', overflow:'hidden', position:'relative'}}>
                  <iframe 
                    title="Яндекс Отзывы" 
                    style={{width:'100%', height:'100%', border:'1px solid #e6e6e6', borderRadius:'8px', boxSizing:'border-box'}} 
                    src="https://yandex.ru/maps-reviews-widget/159261695633?comments"
                  />
                  <a 
                    href="https://yandex.ru/maps/org/uslugi_elektrika/159261695633/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      boxSizing:'border-box',
                      textDecoration:'none',
                      color:'#b3b3b3',
                      fontSize:'10px',
                      fontFamily:'YS Text,sans-serif',
                      padding:'0 20px',
                      position:'absolute',
                      bottom:'8px',
                      width:'100%',
                      textAlign:'center',
                      left:0,
                      overflow:'hidden',
                      textOverflow:'ellipsis',
                      display:'block',
                      maxHeight:'14px',
                      whiteSpace:'nowrap'
                    }}
                  >
                    Услуги электрика на карте Калининграда — Яндекс&nbsp;Карты
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Итого • {getTotalItems()} {getTotalItems() === 1 ? 'услуга' : 'услуг'}
                </span>
                <span className="font-bold text-lg">{getTotalPrice().toLocaleString()} ₽</span>
              </div>
              <Button size="lg" className="w-full gap-2" onClick={handleGoToTasks}>
                <Icon name="ListTodo" size={20} />
                Задачи
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
