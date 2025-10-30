import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import ServiceCard from '@/components/ServiceCard';
import TasksButton from '@/components/TasksButton';
import ExecutorSelect from '@/components/ExecutorSelect';
import OrderProgressBar from '@/components/OrderProgressBar';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  icon: string;
  quantity?: number;
}

const services: Service[] = [
  { id: '1', title: 'Установка розеток', description: 'Установка и замена розеток любого типа', price: 500, icon: 'Plug', quantity: 0 },
  { id: '2', title: 'Установка выключателей', description: 'Монтаж одно- и многоклавишных выключателей', price: 400, icon: 'ToggleLeft', quantity: 0 },
  { id: '3', title: 'Монтаж освещения', description: 'Установка люстр, светильников, LED-подсветки', price: 800, icon: 'Lightbulb', quantity: 0 },
  { id: '4', title: 'Сборка щитков', description: 'Монтаж и настройка электрических щитов', price: 3000, icon: 'Box', quantity: 0 },
  { id: '5', title: 'Проводка квартиры', description: 'Полная замена электропроводки в квартире', price: 1200, icon: 'Cable', quantity: 0 },
  { id: '6', title: 'Диагностика', description: 'Поиск неисправностей и консультация', price: 1000, icon: 'Search', quantity: 0 }
];

interface Executor {
  id: number;
  name: string;
  phone: string;
  rating: number;
  experience_years: number;
}

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [servicesList, setServicesList] = useState(services);
  const [executorsList, setExecutorsList] = useState<Executor[]>([]);
  const [selectedExecutor, setSelectedExecutor] = useState<number | null>(null);
  
  const [scenario, setScenario] = useState<'A' | 'B' | null>(null);
  const [repairType, setRepairType] = useState('');
  const [calcType, setCalcType] = useState('simple');
  const [switchCount, setSwitchCount] = useState(5);
  const [socketCount, setSocketCount] = useState(10);
  const [lightingType, setLightingType] = useState('');
  const [powerEquipment, setPowerEquipment] = useState<string[]>([]);
  const [installType, setInstallType] = useState('');
  const [hasWires, setHasWires] = useState('');
  
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const updateQuantity = (serviceId: string, change: number) => {
    setServicesList(prev => prev.map(s => {
      if (s.id === serviceId) {
        const newQty = Math.max(0, (s.quantity || 0) + change);
        return { ...s, quantity: newQty };
      }
      return s;
    }));
  };

  const getTotalPrice = () => {
    return servicesList.reduce((sum, s) => sum + (s.price * (s.quantity || 0)), 0);
  };

  const getTotalItems = () => {
    return servicesList.reduce((sum, s) => sum + (s.quantity || 0), 0);
  };

  const getCartItems = () => {
    return servicesList.filter(s => (s.quantity || 0) > 0);
  };

  useEffect(() => {
    const fetchExecutors = async () => {
      try {
        const response = await fetch('https://functions.poehali.dev/46dcbdcd-c306-4a31-b776-f6e34eba609f');
        const data = await response.json();
        if (data.executors) {
          setExecutorsList(data.executors);
        }
      } catch (error) {
        console.error('Error fetching executors:', error);
      }
    };
    fetchExecutors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const cartItems = getCartItems();
    if (cartItems.length === 0) {
      toast({
        title: "Ошибка",
        description: "Добавьте услуги в заявку",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/5c3c68df-2e41-4012-81fd-e134547810fb', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_id: Date.now(),
          client_name: 'Клиент из веб-формы',
          phone,
          address,
          services: cartItems.map(item => ({
            service_id: parseInt(item.id),
            quantity: item.quantity || 1,
            price: item.price
          })),
          scheduled_date: date,
          scheduled_time: time,
          notes,
          executor_id: selectedExecutor
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Заявка создана!",
          description: `Номер заявки: #${data.order_id}. Мы свяжемся с вами в ближайшее время.`
        });
        
        setTimeout(() => {
          window.open('https://t.me/konigelectric', '_blank');
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже.",
        variant: "destructive"
      });
    }
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
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.location.href = user?.role === 'admin' ? '/admin' : user?.role === 'executor' ? '/executor' : '/profile'}
                >
                  <Icon name="User" size={18} />
                  <span className="hidden md:inline text-sm">{user?.name}</span>
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/login'}
                >
                  <Icon name="LogIn" size={18} className="md:mr-2" />
                  <span className="hidden md:inline">Войти</span>
                </Button>
              )}
              <a href="tel:+74012520725" className="text-base md:text-lg font-bold text-primary hover:text-primary/80 transition-colors">
                +7 (4012) 52-07-25
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fade-in pb-24">
            <section className="space-y-4">
              <div className="text-center space-y-2">
                <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                  Услуги электрика
                </h2>
                <p className="text-muted-foreground text-sm">Выберите услугу и добавьте в заявку</p>
              </div>
              <div className="grid gap-3">
                {servicesList.map((service) => (
                  <Card key={service.id} className="overflow-hidden bg-card border hover:shadow-md transition-all">
                    <div className="flex items-stretch">
                      <div className="w-20 flex-shrink-0 bg-primary/5 flex items-center justify-center">
                        <Icon name={service.icon as any} className="text-primary" size={32} />
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 pr-3">
                            <h3 className="font-semibold text-sm text-foreground leading-tight mb-1">
                              {service.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">{service.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs text-muted-foreground">от</span>
                            <span className="text-xl font-bold text-primary">{service.price}</span>
                            <span className="text-xs text-muted-foreground">₽</span>
                          </div>
                          {(service.quantity || 0) === 0 ? (
                            <Button 
                              size="sm" 
                              className="h-9 px-4 text-xs font-semibold"
                              onClick={() => updateQuantity(service.id, 1)}
                            >
                              Добавить
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-9 w-9 p-0 text-lg"
                                onClick={() => updateQuantity(service.id, -1)}
                              >
                                −
                              </Button>
                              <span className="text-lg font-bold w-8 text-center">{service.quantity}</span>
                              <Button 
                                size="sm" 
                                className="h-9 w-9 p-0 text-lg"
                                onClick={() => updateQuantity(service.id, 1)}
                              >
                                +
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {getTotalItems() > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-primary shadow-2xl p-4 z-50">
                  <div className="container mx-auto flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Итого • {getTotalItems()} услуг</span>
                      <span className="text-2xl font-bold text-foreground">{getTotalPrice().toLocaleString()} ₽</span>
                    </div>
                    <TasksButton 
                      count={getTotalItems()} 
                      onClick={() => setActiveTab('cart')} 
                    />
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('home')}>
                <Icon name="ArrowLeft" size={18} />
              </Button>
              <h2 className="font-heading text-2xl font-bold">Ваша заявка</h2>
            </div>
            
            <OrderProgressBar currentStatus="new" />
            
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Выбранные услуги</h3>
              <div className="space-y-3 mb-6">
                {getCartItems().map((item) => (
                  <div key={item.id} className="flex justify-between items-center pb-3 border-b">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{item.quantity} × {item.price} ₽</div>
                      <div className="text-sm text-muted-foreground">{(item.quantity || 0) * item.price} ₽</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t-2 border-primary">
                <span className="font-bold text-lg">Итого:</span>
                <span className="font-bold text-2xl text-primary">{getTotalPrice().toLocaleString()} ₽</span>
              </div>
            </Card>

            <Card className="p-6">
              <ExecutorSelect
                executors={executorsList}
                value={selectedExecutor}
                onChange={setSelectedExecutor}
              />
            </Card>

            <Button size="lg" className="w-full" onClick={() => setActiveTab('order')}>
              Продолжить оформление
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
          </div>
        )}

        {activeTab === 'order' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="flex items-center gap-2 mb-6">
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('cart')}>
                <Icon name="ArrowLeft" size={18} />
              </Button>
              <h2 className="font-heading text-2xl font-bold">Оформить заявку</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!scenario && (
                <Card className="p-6">
                  <Label className="text-base font-semibold mb-4 block">Что вас интересует?</Label>
                  <div className="space-y-3">
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full h-auto py-4 text-left justify-start"
                      onClick={() => setScenario('A')}
                    >
                      <Icon name="Home" className="mr-3" size={24} />
                      <div>
                        <div className="font-semibold">Электромонтажные работы в квартире</div>
                        <div className="text-xs text-muted-foreground">Полный расчёт проекта</div>
                      </div>
                    </Button>
                    <Button 
                      type="button"
                      variant="outline" 
                      className="w-full h-auto py-4 text-left justify-start"
                      onClick={() => setScenario('B')}
                    >
                      <Icon name="Lightbulb" className="mr-3" size={24} />
                      <div>
                        <div className="font-semibold">Установка люстры, выключателя или розеток</div>
                        <div className="text-xs text-muted-foreground">Быстрая заявка</div>
                      </div>
                    </Button>
                  </div>
                </Card>
              )}

              {scenario === 'A' && (
                <>
                  <Card className="p-6">
                    <Label className="text-base font-semibold mb-3 block">Тип ремонта</Label>
                    <RadioGroup value={repairType} onValueChange={setRepairType}>
                      <div className="space-y-2">
                        {['Новостройка', 'Капитальный ремонт', 'Частичный ремонт', 'Не знаю → консультация'].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <RadioGroupItem value={type} id={type} />
                            <Label htmlFor={type} className="cursor-pointer">{type}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </Card>

                  <Card className="p-6">
                    <Label className="text-base font-semibold mb-3 block">Тип расчёта</Label>
                    <Select value={calcType} onValueChange={setCalcType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Упрощённый</SelectItem>
                        <SelectItem value="detailed">Точный</SelectItem>
                      </SelectContent>
                    </Select>
                  </Card>

                  {calcType === 'detailed' && (
                    <>
                      <Card className="p-6 space-y-4">
                        <div>
                          <Label>Количество выключателей</Label>
                          <Input type="number" value={switchCount} onChange={(e) => setSwitchCount(Number(e.target.value))} />
                        </div>
                        <div>
                          <Label>Количество розеток</Label>
                          <Input type="number" value={socketCount} onChange={(e) => setSocketCount(Number(e.target.value))} />
                        </div>
                      </Card>

                      <Card className="p-6">
                        <Label className="text-base font-semibold mb-3 block">Тип освещения</Label>
                        <RadioGroup value={lightingType} onValueChange={setLightingType}>
                          <div className="space-y-2">
                            {['Стандартное', 'Сложное (ленты, умный свет)', 'Не знаю'].map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <RadioGroupItem value={type} id={type} />
                                <Label htmlFor={type} className="cursor-pointer">{type}</Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </Card>

                      <Card className="p-6">
                        <Label className="text-base font-semibold mb-3 block">Мощное оборудование</Label>
                        <div className="space-y-2">
                          {['Плита', 'Кондиционер', 'Стиральная машина', 'Бойлер', 'Тёплый пол'].map((equipment) => (
                            <div key={equipment} className="flex items-center space-x-2">
                              <Checkbox 
                                id={equipment}
                                checked={powerEquipment.includes(equipment)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setPowerEquipment([...powerEquipment, equipment]);
                                  } else {
                                    setPowerEquipment(powerEquipment.filter(e => e !== equipment));
                                  }
                                }}
                              />
                              <Label htmlFor={equipment} className="cursor-pointer">{equipment}</Label>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </>
                  )}
                </>
              )}

              {scenario === 'B' && (
                <>
                  <Card className="p-6">
                    <Label className="text-base font-semibold mb-3 block">Что устанавливаем?</Label>
                    <RadioGroup value={installType} onValueChange={setInstallType}>
                      <div className="space-y-2">
                        {['Люстра / светильник', 'Розетка / выключатель', 'Автомат защиты', 'Несколько устройств'].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <RadioGroupItem value={type} id={type} />
                            <Label htmlFor={type} className="cursor-pointer">{type}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </Card>

                  <Card className="p-6">
                    <Label className="text-base font-semibold mb-3 block">Есть ли провода?</Label>
                    <RadioGroup value={hasWires} onValueChange={setHasWires}>
                      <div className="space-y-2">
                        {['Да', 'Нужно подвести', 'Не знаю'].map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={option} />
                            <Label htmlFor={option} className="cursor-pointer">{option}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </Card>
                </>
              )}

              {scenario && (
                <>
                  <Card className="p-6 space-y-4">
                    <div>
                      <Label htmlFor="phone">Телефон *</Label>
                      <Input 
                        id="phone"
                        type="tel" 
                        placeholder="+7" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Адрес *</Label>
                      <Input 
                        id="address"
                        placeholder="Улица, дом, квартира" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Желаемая дата *</Label>
                      <Input 
                        id="date"
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Удобное время</Label>
                      <Select value={time} onValueChange={setTime}>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите время" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Утро</SelectItem>
                          <SelectItem value="day">День</SelectItem>
                          <SelectItem value="evening">Вечер</SelectItem>
                          <SelectItem value="any">Без разницы</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="notes">Дополнительные пожелания</Label>
                      <Textarea 
                        id="notes"
                        placeholder="Например: 70 розеток" 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </Card>

                  <Card className="p-6">
                    <ExecutorSelect
                      executors={executorsList}
                      value={selectedExecutor}
                      onChange={setSelectedExecutor}
                    />
                  </Card>

                  <Button type="submit" size="lg" className="w-full">
                    Оформить заявку
                    <Icon name="Send" size={18} className="ml-2" />
                  </Button>
                </>
              )}
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;