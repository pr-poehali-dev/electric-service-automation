import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import { calculateItemPrice, getDiscount, calculateFrames } from '@/types/electrical';
import PageHeader from '@/components/PageHeader';
import PageNavigation from '@/components/PageNavigation';
import ContactModal from '@/components/ContactModal';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, createOrder } = useCart();
  const [showContactModal, setShowContactModal] = useState(false);

  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    date: '',
    time: ''
  });

  const [errors, setErrors] = useState({
    phone: ''
  });

  const totalPrice = cart.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  const totalDiscount = cart.reduce((sum, item) => {
    const discount = getDiscount(item.quantity);
    const basePrice = item.selectedOption === 'install-only' ? item.product.priceInstallOnly : item.product.priceWithWiring;
    const fullPrice = basePrice * item.quantity;
    return sum + (fullPrice * discount / 100);
  }, 0);

  const wiringItems = cart.filter(item => 
    item.additionalOptions?.includes('wiring') || 
    item.selectedOption === 'full-wiring' ||
    item.additionalOptions?.some(opt => opt.startsWith('block-'))
  );
  
  const totalFrames = wiringItems.reduce((sum, item) => {
    let frames = 0;
    if (item.additionalOptions?.includes('install') || item.selectedOption === 'install-only') {
      frames += item.quantity;
    }
    if (item.additionalOptions?.some(opt => opt.startsWith('block-'))) {
      frames += item.quantity * item.additionalOptions.filter(opt => opt.startsWith('block-')).length;
    }
    return sum + frames;
  }, 0);
  
  const cableMeters = wiringItems.reduce((sum, item) => {
    let meters = 0;
    if (item.additionalOptions?.includes('wiring') || item.selectedOption === 'full-wiring') {
      meters += item.quantity * 8;
    }
    if (item.additionalOptions?.some(opt => opt.startsWith('block-'))) {
      const blockCount = item.additionalOptions.filter(opt => opt.startsWith('block-')).length;
      meters += item.quantity * blockCount * 8;
    }
    return sum + meters;
  }, 0);
  
  const cableCost = Math.round(cableMeters * 100);
  const materialsCost = Math.round(cableMeters * 130);
  const finalTotal = totalPrice + cableCost;

  const validateForm = () => {
    const newErrors = { phone: '' };
    if (!formData.phone || formData.phone.replace(/[^0-9]/g, '').length < 11) {
      newErrors.phone = 'Укажите номер телефона';
    }
    setErrors(newErrors);
    return !newErrors.phone;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const order = createOrder({
      ...formData,
      status: 'pending'
    });

    navigate('/orders', { state: { newOrderId: order.id } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-24">
      <PageHeader />

      <div className="max-w-md mx-auto">
        <PageNavigation onContactClick={() => setShowContactModal(true)} />

        <div className="p-6 space-y-4">
          <Card className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Телефон <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.startsWith('9') && value.length === 10) {
                    value = '8' + value;
                  }
                  setFormData({ ...formData, phone: value });
                }}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.phone ? 'border-red-500 animate-shake' : 'border-gray-300'
                }`}
                placeholder="8 (___) ___-__-__"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Адрес: (желательно)
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Калининград, ул. Пример, 1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Дата
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Время
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-blue-50 border-2 border-blue-200">
            <h3 className="font-bold text-lg mb-4 whitespace-nowrap">
              Стоимость работ в Калининграде
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Строительные работы:</span>
                <span className="font-bold">{totalPrice.toLocaleString('ru-RU')} ₽</span>
              </div>

              {cableMeters > 0 && (
                <>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>~ метраж кабеля:</span>
                    <span className="font-semibold">{cableMeters} м</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Стоимость монтажа кабеля:</span>
                    <span className="font-bold">{cableCost.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Кабель и расходный материал:</span>
                    <span className="font-semibold">{materialsCost.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </>
              )}
              
              {totalFrames > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Необходимо рамок:</span>
                  <span className="font-semibold">{totalFrames} шт</span>
                </div>
              )}

              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Экономия:</span>
                  <span className="font-bold">-{totalDiscount.toLocaleString('ru-RU')} ₽</span>
                </div>
              )}

              <div className="border-t-2 border-dashed border-blue-300 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">ИТОГО:</span>
                  <span className="text-2xl font-bold text-primary">{finalTotal.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            </div>
          </Card>

          <Button
            size="lg"
            onClick={handleSubmit}
            className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Отправить заявку
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate('/cart')}
            className="w-full"
          >
            Назад к плану
          </Button>
        </div>
      </div>

      <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}