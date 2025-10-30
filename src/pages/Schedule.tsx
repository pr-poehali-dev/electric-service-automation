import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import OrderProgressBar from '@/components/OrderProgressBar';
import { toast } from '@/hooks/use-toast';

interface Executor {
  id: number;
  name: string;
  rating: number;
  specialization: string[];
  completedOrders: number;
  avatar?: string;
}

const mockExecutors: Executor[] = [
  {
    id: 1,
    name: 'Алексей Иванов',
    rating: 4.9,
    specialization: ['Электропроводка', 'Освещение', 'Розетки'],
    completedOrders: 156
  },
  {
    id: 2,
    name: 'Дмитрий Петров',
    rating: 4.8,
    specialization: ['Электрощитки', 'Автоматика'],
    completedOrders: 98
  },
  {
    id: 3,
    name: 'Сергей Смирнов',
    rating: 4.7,
    specialization: ['Монтаж', 'Диагностика'],
    completedOrders: 67
  }
];

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
];

const Schedule = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedExecutor, setSelectedExecutor] = useState<number>(1);
  const [showExecutorList, setShowExecutorList] = useState(false);

  const executor = mockExecutors.find(e => e.id === selectedExecutor) || mockExecutors[0];

  const handleSubmit = () => {
    if (!selectedDate) {
      toast({
        title: "Выберите дату",
        description: "Укажите удобную дату визита",
        variant: "destructive"
      });
      return;
    }

    if (!selectedTime) {
      toast({
        title: "Выберите время",
        description: "Укажите удобное время визита",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Заявка отправлена!",
      description: "Мастер свяжется с вами для подтверждения"
    });

    setTimeout(() => {
      navigate('/confirmation');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/tasks')} className="gap-2">
              <Icon name="ArrowLeft" size={20} />
              Назад
            </Button>
            <h1 className="font-heading font-bold text-lg">Выбрать удобное время</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-32">
        <div className="max-w-3xl mx-auto space-y-6">
          <OrderProgressBar currentStatus="planning" />

          <Card className="p-6">
            <h2 className="font-bold text-xl mb-6">Выберите дату и время</h2>
            
            <div className="space-y-6">
              <div>
                <Label className="text-base mb-3 block">Дата визита</Label>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>
              </div>

              {selectedDate && (
                <div>
                  <Label className="text-base mb-3 block">Время визита</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        onClick={() => setSelectedTime(time)}
                        className="w-full"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-bold text-xl mb-4">Выберите мастера</h2>
            
            {!showExecutorList ? (
              <div 
                className="border-2 rounded-lg p-4 cursor-pointer hover:border-primary transition-colors"
                onClick={() => setShowExecutorList(true)}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                      {executor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{executor.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{executor.rating}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        • {executor.completedOrders} заказов
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {executor.specialization.map((spec, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Icon name="ChevronDown" size={24} className="text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {mockExecutors.map((exec) => (
                  <div
                    key={exec.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedExecutor === exec.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => {
                      setSelectedExecutor(exec.id);
                      setShowExecutorList(false);
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className="bg-primary/10 text-primary text-lg">
                          {exec.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold">{exec.name}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <div className="flex items-center gap-1">
                            <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                            <span>{exec.rating}</span>
                          </div>
                          <span className="text-muted-foreground">• {exec.completedOrders} заказов</span>
                        </div>
                      </div>

                      {selectedExecutor === exec.id && (
                        <Icon name="Check" size={24} className="text-primary" />
                      )}
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowExecutorList(false)}
                >
                  Свернуть
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
        <div className="container mx-auto px-4 py-4">
          <Button size="lg" className="w-full gap-2" onClick={handleSubmit}>
            Отправить заявку
            <Icon name="Send" size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
