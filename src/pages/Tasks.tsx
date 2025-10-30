import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Service, CustomTask } from '@/types/services';
import OrderProgressBar from '@/components/OrderProgressBar';
import { toast } from '@/hooks/use-toast';

const Tasks = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<{ service: Service; quantity: number }[]>([]);
  const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
  const [customTaskText, setCustomTaskText] = useState('');
  const [isCustomTaskDialogOpen, setIsCustomTaskDialogOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateQuantity = (serviceId: string, newQuantity: number) => {
    const updated = cart.map(item => 
      item.service.id === serviceId ? { ...item, quantity: Math.max(0, newQuantity) } : item
    ).filter(item => item.quantity > 0);
    
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeFromCart = (serviceId: string) => {
    const updated = cart.filter(item => item.service.id !== serviceId);
    setCart(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
    toast({
      title: "Удалено",
      description: "Услуга удалена из списка задач"
    });
  };

  const addCustomTask = () => {
    if (!customTaskText.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите описание задачи",
        variant: "destructive"
      });
      return;
    }

    const newTask: CustomTask = {
      id: `custom-${Date.now()}`,
      description: customTaskText,
      priceStatus: 'pending'
    };

    setCustomTasks([...customTasks, newTask]);
    setCustomTaskText('');
    setIsCustomTaskDialogOpen(false);
    toast({
      title: "Задача добавлена",
      description: "Менеджер рассчитает стоимость"
    });
  };

  const removeCustomTask = (taskId: string) => {
    setCustomTasks(customTasks.filter(t => t.id !== taskId));
  };

  const getTotalPrice = () => {
    const servicesTotal = cart.reduce((sum, item) => sum + (item.service.price * item.quantity), 0);
    const customTotal = customTasks.reduce((sum, task) => sum + (task.price || 0), 0);
    return servicesTotal + customTotal;
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0) + customTasks.length;
  };

  const handleContinue = () => {
    if (cart.length === 0 && customTasks.length === 0) {
      toast({
        title: "Список пуст",
        description: "Добавьте услуги для продолжения",
        variant: "destructive"
      });
      return;
    }
    navigate('/schedule');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
              <Icon name="ArrowLeft" size={20} />
              Назад
            </Button>
            <h1 className="font-heading font-bold text-lg">Список задач</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
        <div className="max-w-3xl mx-auto space-y-6">
          <OrderProgressBar currentStatus="planning" />

          <div className="text-center mb-6">
            <Button 
              variant="link" 
              className="text-primary underline"
              onClick={() => navigate('/order-history')}
            >
              История заявок
            </Button>
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-xl">Выбранные услуги</h2>
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить
              </Button>
            </div>

            {cart.length === 0 && customTasks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Список задач пуст</p>
                <Button variant="link" onClick={() => navigate('/')}>
                  Добавить услуги
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map(item => (
                  <Card key={item.service.id} className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.service.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.service.description}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.service.id, item.quantity - 1)}
                            >
                              <Icon name="Minus" size={14} />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                            >
                              <Icon name="Plus" size={14} />
                            </Button>
                          </div>
                          <span className="font-bold text-primary">
                            {(item.service.price * item.quantity).toLocaleString()} ₽
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.service.id)}
                      >
                        <Icon name="X" size={18} />
                      </Button>
                    </div>
                  </Card>
                ))}

                {customTasks.map(task => (
                  <Card key={task.id} className="p-4 border-dashed">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">Своя задача</h3>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        <div className="mt-3">
                          <span className="text-sm italic text-muted-foreground">
                            {task.priceStatus === 'pending' ? 'Запрос цены' : `${task.price?.toLocaleString()} ₽`}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeCustomTask(task.id)}
                      >
                        <Icon name="X" size={18} />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>

          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
            <div className="flex items-start gap-3">
              <Icon name="Video" size={24} className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-1">Видео - узнайте возможности сервиса за 2 минуты</h3>
                <Button variant="link" className="p-0 h-auto text-primary">
                  Посмотреть видео
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Dialog open={isCustomTaskDialogOpen} onOpenChange={setIsCustomTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="text-primary underline p-0">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить свою задачу
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить свою задачу</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="custom-task">Опишите, что нужно сделать</Label>
                    <Textarea
                      id="custom-task"
                      placeholder="Например: проверить проводку в ванной комнате"
                      value={customTaskText}
                      onChange={(e) => setCustomTaskText(e.target.value)}
                      rows={4}
                      className="mt-2"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Менеджер рассчитает стоимость и свяжется с вами
                  </p>
                  <Button onClick={addCustomTask} className="w-full">
                    Добавить задачу
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Итого</span>
              <span className="text-2xl text-primary">
                {getTotalPrice().toLocaleString()} ₽
                {customTasks.some(t => t.priceStatus === 'pending') && ' + расчёт'}
              </span>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
        <div className="container mx-auto px-4 py-4">
          <Button size="lg" className="w-full gap-2" onClick={handleContinue}>
            Выбрать удобное время
            <Icon name="ArrowRight" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
