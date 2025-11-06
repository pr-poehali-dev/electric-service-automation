import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Order } from '@/types/electrical';

interface OrderProgressSectionProps {
  order: Order;
}

const STATUS_LABELS = {
  'pending': 'Ожидает подтверждения',
  'confirmed': 'Подтверждена',
  'in-progress': 'В работе',
  'completed': 'Завершена'
};

const STATUS_COLORS = {
  'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'confirmed': 'bg-blue-100 text-blue-800 border-blue-300',
  'in-progress': 'bg-orange-100 text-orange-800 border-orange-300',
  'completed': 'bg-green-100 text-green-800 border-green-300'
};

const getProgressPercentage = (status: Order['status']) => {
  switch (status) {
    case 'pending': return 25;
    case 'confirmed': return 50;
    case 'in-progress': return 75;
    case 'completed': return 100;
    default: return 0;
  }
};

export default function OrderProgressSection({ order }: OrderProgressSectionProps) {
  const progress = getProgressPercentage(order.status);

  return (
    <Card className="p-6 animate-fadeIn">
      <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Icon name="Activity" size={20} className="text-primary" />
        Статус выполнения
      </h2>
      
      <div className="relative pt-1 mb-6">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full border ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-primary">
              {progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-200">
          <div 
            style={{ width: `${progress}%` }} 
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500 rounded-full"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            progress >= 25 ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'
          }`}>
            <Icon name="FileText" size={18} />
          </div>
          <span className={progress >= 25 ? 'font-semibold text-gray-800' : 'text-muted-foreground'}>
            Заявка создана
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            progress >= 50 ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'
          }`}>
            <Icon name="CheckCircle" size={18} />
          </div>
          <span className={progress >= 50 ? 'font-semibold text-gray-800' : 'text-muted-foreground'}>
            Заявка подтверждена
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            progress >= 75 ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'
          }`}>
            <Icon name="Wrench" size={18} />
          </div>
          <span className={progress >= 75 ? 'font-semibold text-gray-800' : 'text-muted-foreground'}>
            Работа в процессе
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            progress >= 100 ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-400'
          }`}>
            <Icon name="Award" size={18} />
          </div>
          <span className={progress >= 100 ? 'font-semibold text-gray-800' : 'text-muted-foreground'}>
            Работа завершена
          </span>
        </div>
      </div>
    </Card>
  );
}
