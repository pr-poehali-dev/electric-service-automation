import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { RoomType, ROOM_DEFAULTS, ROOM_LABELS } from '@/types/electrical';

export default function Calculator() {
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<RoomType>('room');

  const defaults = ROOM_DEFAULTS[selectedRoom];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-24">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-md p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/electrical')}
            >
              <Icon name="ArrowLeft" size={24} />
            </Button>
            <h1 className="text-2xl font-bold flex-1">Калькулятор электромонтажа</h1>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Тип помещения</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value as RoomType)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {Object.entries(ROOM_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-blue-900">
                  📊 Рекомендуемое количество для {ROOM_LABELS[selectedRoom].toLowerCase()}:
                </p>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{defaults.switches}</div>
                    <div className="text-xs text-muted-foreground">Выключателей</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{defaults.outlets}</div>
                    <div className="text-xs text-muted-foreground">Розеток</div>
                  </div>
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  * Это средние значения. Вы можете выбрать точное количество на следующем экране.
                </p>
              </div>
            </Card>

            <div className="space-y-3 pt-4">
              <h3 className="font-semibold text-lg">Что дальше?</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    1
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Выберите нужные выключатели и розетки
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    2
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Мы автоматически рассчитаем метраж кабеля (× 7 метров на точку)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    3
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Получите список необходимых материалов для закупки
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Button
            size="lg"
            className="w-full font-semibold h-14 text-base shadow-lg"
            onClick={() => navigate('/products')}
          >
            Перейти к выбору товаров →
          </Button>
        </div>
      </div>
    </div>
  );
}
