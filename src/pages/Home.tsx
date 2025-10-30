import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    <div className="min-h-screen bg-background pb-24">
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
            
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={handleGoToTasks}
            >
              <Icon name="ShoppingCart" size={24} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!selectedCategory ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-3 mb-8">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Выберите категорию
              </h2>
              <p className="text-muted-foreground text-lg">Нажмите на карточку для продолжения</p>
              <div className="flex justify-center">
                <Icon name="ArrowDown" size={32} className="text-primary animate-bounce" />
              </div>
            </div>

            <div className="space-y-4">
              <Card 
                className="p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary hover:scale-105 group active:scale-95"
                onClick={() => setSelectedCategory('quick')}
              >
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <Icon name="Zap" size={40} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-2xl mb-2 group-hover:text-primary transition-colors">Вызов электрика на час</h3>
                    <p className="text-muted-foreground">Быстрая помощь для простых задач</p>
                  </div>
                  <Icon name="ChevronRight" size={28} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Card>

              <Card 
                className="p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 hover:border-primary hover:scale-105 group active:scale-95"
                onClick={() => setSelectedCategory('electrical')}
              >
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <Icon name="Wrench" size={40} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-2xl mb-2 group-hover:text-primary transition-colors">Электромонтажные работы</h3>
                    <p className="text-muted-foreground">Комплексные работы и монтаж</p>
                  </div>
                  <Icon name="ChevronRight" size={28} className="text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
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

            <div className={selectedCategory === 'quick' ? 'space-y-3' : 'grid md:grid-cols-2 lg:grid-cols-3 gap-4'}>
              {(selectedCategory === 'quick' ? quickServices : electricalServices).map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onAddToCart={(quantity) => addToCart(service, quantity)}
                  layout={selectedCategory === 'quick' ? 'list' : 'grid'}
                />
              ))}
            </div>

            <div className="mt-8 max-w-2xl mx-auto">
              <Card className="p-6 bg-primary/5 border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="MessageCircle" size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">Связаться с нами</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Есть вопросы? Напишите нам в Telegram
                    </p>
                    <Button 
                      onClick={() => window.open('https://t.me/konigelectric', '_blank')}
                      className="w-full gap-2"
                      size="lg"
                    >
                      <Icon name="Send" size={20} />
                      Написать сообщение
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>

      {getTotalItems() > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  {getTotalItems()} {getTotalItems() === 1 ? 'услуга' : 'услуг'}
                </span>
                <span className="font-bold text-xl">{getTotalPrice().toLocaleString()} ₽</span>
              </div>
              <Button 
                size="lg" 
                className="gap-2 flex-1 max-w-xs h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={handleGoToTasks}
              >
                Список задач
                <Icon name="ArrowRight" size={20} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
