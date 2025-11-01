import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { RoomType, ROOM_DEFAULTS, ROOM_LABELS } from '@/types/electrical';
import { useCart } from '@/contexts/CartContext';

export default function Calculator() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [selectedRoom, setSelectedRoom] = useState<RoomType | ''>('');

  const defaults = selectedRoom ? ROOM_DEFAULTS[selectedRoom as RoomType] : null;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-24">
      <img 
        src="https://cdn.poehali.dev/files/eef76e18-1b64-4ae3-8839-b4fe8da091be.jpg"
        alt="Калининград"
        className="w-full h-32 object-cover"
      />

      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-lg p-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-800 flex-1">
              <span className="font-extrabold text-primary">РАССЧИТАЙТЕ СТОИМОСТЬ РАБОТЫ</span>
              <br />
              <span className="text-lg text-gray-600">ЗА 2 МИНУТЫ</span>
            </h1>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate('/products')}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all p-0 relative"
                title="Услуги"
              >
                <Icon name="List" size={20} />
              </Button>
              {totalItems > 0 && (
                <Button
                  onClick={() => navigate('/cart')}
                  className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all p-0 relative"
                  title="План работ"
                >
                  <Icon name="ShoppingBag" size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                    {totalItems}
                  </span>
                </Button>
              )}
              <Button
                onClick={() => navigate('/profile')}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all p-0"
                title="Личный кабинет"
              >
                <Icon name="User" size={20} />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block text-gray-700">Выберите тип объекта</label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value as RoomType | '')}
                className="w-full p-3 border-2 border-blue-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">-- Выберите тип --</option>
                {Object.entries(ROOM_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {defaults && (
              <>
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-blue-900">
                      📊 Среднее количество для {ROOM_LABELS[selectedRoom as RoomType].toLowerCase()}:
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-primary">{defaults.switches}</div>
                        <div className="text-xs text-muted-foreground">Выключателей</div>
                      </div>
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <div className="text-2xl font-bold text-primary">{defaults.outlets}</div>
                        <div className="text-xs text-muted-foreground">Розеток</div>
                      </div>
                    </div>
                    <p className="text-xs text-blue-700 mt-2">
                      * Среднее значение. Выберите точное количество на следующем экране.
                    </p>
                  </div>
                </Card>

                <div className="space-y-3 pt-4">
                  <h3 className="font-semibold text-lg text-gray-800">Что дальше?</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        1
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Выберите нужные услуги и укажите количество
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        2
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Проверьте план работ и уточните детали
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        3
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Оформите заявку — мы свяжемся с вами
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {defaults && (
          <div className="p-6">
            <Button
              size="lg"
              className="w-full font-semibold h-14 text-base shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => navigate('/products')}
            >
              Выбрать услуги →
            </Button>
          </div>
        )}
      </div>

      <a
        href="tel:+74012520725"
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white rounded-2xl shadow-2xl hover:shadow-3xl flex items-center justify-center transition-all duration-300 hover:scale-110 group z-50"
        title="Связаться с нами"
      >
        <Icon name="Phone" size={28} className="group-hover:animate-wiggle" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
      </a>
    </div>
  );
}
