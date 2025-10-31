import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, createOrder } = useCart();

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    date: '',
    time: ''
  });

  const [errors, setErrors] = useState({
    phone: '',
    address: '',
    date: '',
    time: ''
  });

  const validateForm = () => {
    const newErrors = {
      phone: '',
      address: '',
      date: '',
      time: ''
    };

    if (!formData.phone) {
      newErrors.phone = 'Укажите номер телефона';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Некорректный формат телефона';
    }

    if (!formData.address) {
      newErrors.address = 'Укажите адрес';
    }

    if (!formData.date) {
      newErrors.date = 'Выберите дату';
    }

    if (!formData.time) {
      newErrors.time = 'Выберите время';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(err => err);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const order = createOrder({
      ...formData,
      status: 'pending'
    });

    navigate('/orders', { state: { newOrderId: order.id } });
  };

  if (cart.length === 0) {
    navigate('/products');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-32">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-md p-6 space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/cart')}
            >
              <Icon name="ArrowLeft" size={24} />
            </Button>
            <h1 className="text-2xl font-bold flex-1">Оформление заявки</h1>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <Card className="p-6">
            <h2 className="font-bold text-lg mb-4">Контактные данные</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Номер телефона <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Адрес выполнения работ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Улица, дом, квартира"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-bold text-lg mb-4">Дата и время</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Дата <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="text-sm text-red-500 mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Время <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.time ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.time && (
                  <p className="text-sm text-red-500 mt-1">{errors.time}</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Что произойдёт после оформления?</p>
                <ul className="space-y-1 text-xs">
                  <li>✓ Заявка сохранится в разделе "История заявок"</li>
                  <li>✓ Вы получите уведомление в Telegram</li>
                  <li>✓ Мастер свяжется с вами для уточнения деталей</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg p-4">
        <div className="max-w-md mx-auto">
          <Button
            size="lg"
            className="w-full font-semibold h-14 text-base shadow-lg"
            onClick={handleSubmit}
          >
            <Icon name="CheckCircle" size={20} className="mr-2" />
            Подтвердить заявку
          </Button>
        </div>
      </div>
    </div>
  );
}
