import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  icon: string;
}

interface Order {
  id: string;
  service: string;
  status: 'pending' | 'assigned' | 'in-progress' | 'completed';
  address: string;
  date: string;
  master?: string;
}

interface Master {
  id: string;
  name: string;
  rating: number;
  completedOrders: number;
  specialization: string;
  avatar: string;
}

const services: Service[] = [
  { id: '1', title: 'Установка розеток', description: 'Установка и замена розеток любого типа', price: 'от 500 ₽', icon: 'Plug' },
  { id: '2', title: 'Установка выключателей', description: 'Монтаж одно- и многоклавишных выключателей', price: 'от 400 ₽', icon: 'ToggleLeft' },
  { id: '3', title: 'Монтаж освещения', description: 'Установка люстр, светильников, LED-подсветки', price: 'от 800 ₽', icon: 'Lightbulb' },
  { id: '4', title: 'Сборка щитков', description: 'Монтаж и настройка электрических щитов', price: 'от 3000 ₽', icon: 'Box' },
  { id: '5', title: 'Проводка квартиры', description: 'Полная замена электропроводки в квартире', price: 'от 1200 ₽/м²', icon: 'Cable' },
  { id: '6', title: 'Диагностика', description: 'Поиск неисправностей и консультация', price: 'от 1000 ₽', icon: 'Search' }
];

const masters: Master[] = [
  { id: '1', name: 'Алексей Иванов', rating: 4.9, completedOrders: 247, specialization: 'Все виды работ', avatar: '👨‍🔧' },
  { id: '2', name: 'Дмитрий Петров', rating: 4.8, completedOrders: 189, specialization: 'Щитки и проводка', avatar: '👷' },
  { id: '3', name: 'Сергей Смирнов', rating: 4.7, completedOrders: 156, specialization: 'Освещение', avatar: '⚡' },
  { id: '4', name: 'Михаил Козлов', rating: 4.9, completedOrders: 203, specialization: 'Розетки и выключатели', avatar: '🔌' }
];

const mockOrders: Order[] = [
  { id: 'ORD-001', service: 'Установка розеток', status: 'completed', address: 'ул. Ленина, 45', date: '28.10.2025', master: 'Алексей Иванов' },
  { id: 'ORD-002', service: 'Монтаж освещения', status: 'in-progress', address: 'пр. Победы, 12', date: '30.10.2025', master: 'Сергей Смирнов' },
  { id: 'ORD-003', service: 'Сборка щитков', status: 'assigned', address: 'ул. Мира, 78', date: '31.10.2025', master: 'Дмитрий Петров' }
];

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', address: '', description: '', service: '' });
  const [trackingId, setTrackingId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Ожидает',
      assigned: 'Назначен мастер',
      'in-progress': 'Выполняется',
      completed: 'Завершён'
    };
    return labels[status as keyof typeof labels];
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors];
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Заявка отправлена!",
      description: "Мы свяжемся с вами в ближайшее время"
    });
    setOrderForm({ name: '', phone: '', address: '', description: '', service: '' });
  };

  const statsData = [
    { label: 'Всего заказов', value: '1,247', icon: 'ClipboardList', color: 'text-blue-600' },
    { label: 'Активных', value: '23', icon: 'Clock', color: 'text-orange-600' },
    { label: 'Завершённых', value: '1,198', icon: 'CheckCircle', color: 'text-green-600' },
    { label: 'Средний рейтинг', value: '4.8', icon: 'Star', color: 'text-yellow-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="font-heading font-bold text-xl text-foreground">Электрик PRO</h1>
                <p className="text-xs text-muted-foreground">Калининград</p>
              </div>
            </div>
            <nav className="hidden md:flex gap-6">
              <button onClick={() => setActiveTab('home')} className={`text-sm font-medium transition-colors ${activeTab === 'home' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                Главная
              </button>
              <button onClick={() => setActiveTab('services')} className={`text-sm font-medium transition-colors ${activeTab === 'services' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                Услуги
              </button>
              <button onClick={() => setActiveTab('masters')} className={`text-sm font-medium transition-colors ${activeTab === 'masters' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                Мастера
              </button>
              <button onClick={() => setActiveTab('tracking')} className={`text-sm font-medium transition-colors ${activeTab === 'tracking' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                Отследить заказ
              </button>
            </nav>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Icon name="User" size={16} className="mr-2" />
                    Вход
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Вход в систему</DialogTitle>
                    <DialogDescription>Введите логин и пароль администратора</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Логин</Label>
                      <Input placeholder="admin" />
                    </div>
                    <div>
                      <Label>Пароль</Label>
                      <Input type="password" placeholder="••••••" />
                    </div>
                    <Button className="w-full" onClick={() => { setIsAdmin(true); setActiveTab('admin'); }}>
                      Войти
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button size="sm" onClick={() => setActiveTab('order')}>
                Заказать
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {activeTab === 'home' && (
          <div className="space-y-16 animate-fade-in">
            <section className="text-center space-y-6 py-12">
              <Badge variant="secondary" className="mb-4">⚡ Работаем с 2015 года</Badge>
              <h1 className="font-heading text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Электромонтажные работы<br />в Калининграде
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Профессиональные электрики с опытом более 10 лет. Гарантия на все работы. Выезд в день обращения.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button size="lg" onClick={() => setActiveTab('order')} className="text-lg px-8">
                  <Icon name="Phone" size={20} className="mr-2" />
                  Вызвать электрика
                </Button>
                <Button size="lg" variant="outline" onClick={() => setActiveTab('services')} className="text-lg px-8">
                  <Icon name="List" size={20} className="mr-2" />
                  Все услуги
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-8 mt-12 pt-8 border-t">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">1200+</div>
                  <div className="text-sm text-muted-foreground">выполненных заказов</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">4.8</div>
                  <div className="text-sm text-muted-foreground">средний рейтинг</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">2 часа</div>
                  <div className="text-sm text-muted-foreground">среднее время приезда</div>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <div className="text-center">
                <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Популярные услуги</h2>
                <p className="text-muted-foreground">Выберите нужную услугу или оформите комплексный заказ</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.slice(0, 6).map((service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader>
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                        <Icon name={service.icon as any} className="text-primary group-hover:text-white" size={24} />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-primary">{service.price}</span>
                        <Button size="sm" variant="ghost" onClick={() => { setOrderForm({ ...orderForm, service: service.title }); setActiveTab('order'); }}>
                          Заказать
                          <Icon name="ArrowRight" size={16} className="ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-12">
              <h2 className="font-heading text-3xl font-bold text-center mb-12">Почему выбирают нас</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Icon name="Shield" className="text-primary" size={32} />
                  </div>
                  <h3 className="font-heading font-semibold text-lg">Гарантия качества</h3>
                  <p className="text-sm text-muted-foreground">Официальная гарантия на все работы до 3 лет</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Icon name="Clock" className="text-primary" size={32} />
                  </div>
                  <h3 className="font-heading font-semibold text-lg">Быстрый выезд</h3>
                  <p className="text-sm text-muted-foreground">Приезжаем в течение 2 часов после заявки</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <Icon name="Award" className="text-primary" size={32} />
                  </div>
                  <h3 className="font-heading font-semibold text-lg">Опытные мастера</h3>
                  <p className="text-sm text-muted-foreground">Стаж каждого мастера от 10 лет</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="font-heading text-4xl font-bold mb-4">Наши услуги</h2>
              <p className="text-muted-foreground text-lg">Полный спектр электромонтажных работ</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardHeader>
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <Icon name={service.icon as any} className="text-primary" size={28} />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-primary">{service.price}</span>
                      <Button onClick={() => { setOrderForm({ ...orderForm, service: service.title }); setActiveTab('order'); }}>
                        Заказать
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'masters' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center">
              <h2 className="font-heading text-4xl font-bold mb-4">Наши мастера</h2>
              <p className="text-muted-foreground text-lg">Профессионалы с многолетним опытом</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {masters.map((master) => (
                <Card key={master.id} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="text-6xl mb-4">{master.avatar}</div>
                    <CardTitle className="text-xl">{master.name}</CardTitle>
                    <CardDescription>{master.specialization}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={18} />
                      <span className="font-semibold text-lg">{master.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <Icon name="CheckCircle" size={14} className="inline mr-1" />
                      {master.completedOrders} выполненных заказов
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Icon name="MessageCircle" size={16} className="mr-2" />
                      Связаться
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'order' && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-heading">Оформить заказ</CardTitle>
                <CardDescription>Заполните форму и мы свяжемся с вами в ближайшее время</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOrderSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="service">Выберите услугу</Label>
                    <select
                      id="service"
                      className="w-full p-2 border rounded-md"
                      value={orderForm.service}
                      onChange={(e) => setOrderForm({ ...orderForm, service: e.target.value })}
                      required
                    >
                      <option value="">Выберите услугу...</option>
                      {services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Ваше имя</Label>
                    <Input
                      id="name"
                      placeholder="Иван Иванов"
                      value={orderForm.name}
                      onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 (900) 123-45-67"
                      value={orderForm.phone}
                      onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Адрес</Label>
                    <Input
                      id="address"
                      placeholder="ул. Ленина, д. 10, кв. 5"
                      value={orderForm.address}
                      onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Описание работ</Label>
                    <Textarea
                      id="description"
                      placeholder="Опишите подробно, что необходимо сделать..."
                      rows={4}
                      value={orderForm.description}
                      onChange={(e) => setOrderForm({ ...orderForm, description: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    <Icon name="Send" size={20} className="mr-2" />
                    Отправить заявку
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'tracking' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl font-heading">Отследить заказ</CardTitle>
                <CardDescription>Введите номер заказа для отслеживания статуса</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="ORD-001"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                  />
                  <Button>
                    <Icon name="Search" size={20} />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {trackingId && (
              <Card className="animate-slide-up">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Заказ {trackingId || 'ORD-002'}</CardTitle>
                      <CardDescription>Монтаж освещения</CardDescription>
                    </div>
                    <Badge className={getStatusColor('in-progress')}>
                      {getStatusLabel('in-progress')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Прогресс</span>
                      <span className="font-semibold">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <Icon name="MapPin" className="text-muted-foreground mt-1" size={18} />
                      <div>
                        <div className="font-medium">Адрес</div>
                        <div className="text-sm text-muted-foreground">пр. Победы, 12</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="Calendar" className="text-muted-foreground mt-1" size={18} />
                      <div>
                        <div className="font-medium">Дата выполнения</div>
                        <div className="text-sm text-muted-foreground">30 октября 2025</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Icon name="User" className="text-muted-foreground mt-1" size={18} />
                      <div>
                        <div className="font-medium">Мастер</div>
                        <div className="text-sm text-muted-foreground">Сергей Смирнов</div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-3">Этапы выполнения</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <Icon name="Check" className="text-white" size={14} />
                        </div>
                        <div className="text-sm">Заявка принята</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                          <Icon name="Check" className="text-white" size={14} />
                        </div>
                        <div className="text-sm">Мастер назначен</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 animate-pulse">
                          <Icon name="Loader2" className="text-white animate-spin" size={14} />
                        </div>
                        <div className="text-sm font-medium">Работы выполняются</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0"></div>
                        <div className="text-sm text-muted-foreground">Завершение</div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Icon name="MessageCircle" size={18} className="mr-2" />
                    Связаться с мастером
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'admin' && isAdmin && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-heading text-4xl font-bold">Админ-панель</h2>
                <p className="text-muted-foreground mt-2">Управление заказами и аналитика</p>
              </div>
              <Button variant="outline" onClick={() => { setIsAdmin(false); setActiveTab('home'); }}>
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти
              </Button>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {statsData.map((stat, idx) => (
                <Card key={idx}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center ${stat.color}`}>
                        <Icon name={stat.icon as any} size={20} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Последние заказы</CardTitle>
                <CardDescription>Управление текущими и завершёнными заказами</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-mono text-sm font-semibold text-primary">
                          {order.id.split('-')[1]}
                        </div>
                        <div>
                          <div className="font-semibold">{order.service}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1">
                              <Icon name="MapPin" size={14} />
                              {order.address}
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="Calendar" size={14} />
                              {order.date}
                            </span>
                            {order.master && (
                              <span className="flex items-center gap-1">
                                <Icon name="User" size={14} />
                                {order.master}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusLabel(order.status)}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <Icon name="MoreVertical" size={18} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="border-t bg-white mt-24">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Zap" className="text-white" size={20} />
                </div>
                <span className="font-heading font-bold text-lg">Электрик PRO</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Профессиональные электромонтажные работы в Калининграде с 2015 года
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Услуги</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Розетки и выключатели</li>
                <li>Освещение</li>
                <li>Электрощиты</li>
                <li>Проводка</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (4012) 52-07-25
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@elektrik.org
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} />
                  Калининград
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Режим работы</h4>
              <p className="text-sm text-muted-foreground">
                Пн-Вс: 8:00 - 22:00<br />
                Аварийные вызовы: 24/7
              </p>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Электрик PRO. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;