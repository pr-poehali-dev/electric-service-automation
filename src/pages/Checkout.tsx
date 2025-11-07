import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import { calculateItemPrice, getDiscount, calculateFrames } from '@/types/electrical';
import NewProgressBar from '@/components/NewProgressBar';
import ContactModal from '@/components/ContactModal';
import PageHeader from '@/components/PageHeader';
import PageNavigation from '@/components/PageNavigation';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, createOrder } = useCart();
  const [showContactModal, setShowContactModal] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    comments: '',
    projectFiles: [] as File[]
  });

  const [errors, setErrors] = useState({
    customerName: '',
    phone: '',
    address: '',
    date: '',
    time: ''
  });

  const validateForm = () => {
    const newErrors = {
      customerName: '',
      phone: '',
      address: '',
      date: '',
      time: ''
    };

    if (!formData.customerName) {
      newErrors.customerName = 'Укажите ваше имя';
    }

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

  const fireConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const order = createOrder({
      ...formData,
      status: 'pending'
    });

    fireConfetti();
    
    setTimeout(() => {
      navigate('/orders', { state: { newOrderId: order.id } });
    }, 1500);
  };

  const totalPrice = cart.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  const totalDiscount = cart.reduce((sum, item) => {
    const discount = getDiscount(item.quantity);
    const basePrice = item.selectedOption === 'install-only' ? item.product.priceInstallOnly : item.product.priceWithWiring;
    const fullPrice = basePrice * item.quantity;
    return sum + (fullPrice * discount / 100);
  }, 0);

  const wiringItems = cart.filter(item => item.selectedOption === 'full-wiring');
  const totalFrames = calculateFrames(wiringItems);
  const cableMeters = totalFrames * 8;
  
  const cableCost = cableMeters * 100;
  const finalTotal = totalPrice + cableCost;

  const steps = [
    { id: 1, label: 'Выберите услугу', icon: 'List' },
    { id: 2, label: 'План работ', icon: 'ClipboardList', onClick: () => navigate('/cart') },
    { id: 3, label: 'Оформление', icon: 'CheckCircle2' }
  ];

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-32">
      <PageHeader />

      <div className="max-w-md mx-auto">
        <PageNavigation onContactClick={() => setShowContactModal(true)} />
        
        <div className="bg-white shadow-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/cart')}
            >
              <Icon name="ArrowLeft" size={24} />
            </Button>
            <h1 className="text-2xl font-bold text-gray-800 flex-1">Запись к мастеру</h1>
          </div>

          <NewProgressBar 
            steps={steps}
            currentStep={3}
            hasItems={true}
            cartConfirmed={true}
          />
        </div>

        <div className="p-6 space-y-6">
          <Card className="p-6 animate-fadeIn">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Icon name="User" size={20} className="text-primary" />
              Контактные данные
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Ваше имя <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Как к вам обращаться"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    errors.customerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.customerName && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <Icon name="AlertCircle" size={14} />
                    {errors.customerName}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Номер телефона <span className="text-red-500">*</span>
                </label>
                <InputMask
                  mask="8 (999) 999-99-99"
                  value={formData.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    let digitsOnly = value.replace(/\D/g, '');
                    
                    if (digitsOnly.startsWith('7')) {
                      digitsOnly = '8' + digitsOnly.slice(1);
                    }
                    
                    if (digitsOnly.startsWith('9') && digitsOnly.length <= 10) {
                      digitsOnly = '8' + digitsOnly;
                    }
                    
                    if (digitsOnly.length >= 11) {
                      const formatted = '8 (' + digitsOnly.slice(1, 4) + ') ' + digitsOnly.slice(4, 7) + '-' + digitsOnly.slice(7, 9) + '-' + digitsOnly.slice(9, 11);
                      setFormData({ ...formData, phone: formatted });
                    } else {
                      setFormData({ ...formData, phone: value });
                    }
                  }}
                  placeholder="8 (___) ___-__-__"
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <Icon name="AlertCircle" size={14} />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Адрес: (желательно)
                </label>
                <input
                  type="text"
                  placeholder="Улица, дом, квартира"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <Icon name="AlertCircle" size={14} />
                    {errors.address}
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 animate-fadeIn">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Icon name="Calendar" size={20} className="text-primary" />
              Дата и время
            </h2>
            
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
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && (
                  <p className="text-xs text-red-500 mt-1">{errors.date}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Время <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    errors.time ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Выберите</option>
                  <option value="09:00">09:00</option>
                  <option value="10:00">10:00</option>
                  <option value="11:00">11:00</option>
                  <option value="12:00">12:00</option>
                  <option value="13:00">13:00</option>
                  <option value="14:00">14:00</option>
                  <option value="15:00">15:00</option>
                  <option value="16:00">16:00</option>
                  <option value="17:00">17:00</option>
                  <option value="18:00">18:00</option>
                </select>
                {errors.time && (
                  <p className="text-xs text-red-500 mt-1">{errors.time}</p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 animate-fadeIn">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Icon name="MessageSquare" size={20} className="text-primary" />
              Остались пожелания к заявке?
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-2 block">
                  Подробно опишите суть и особенности задачи: крайние сроки завершения работ, особенности подъезда автомобиля для разгрузки инструмента, наличие подведенных коммуникаций, наличие проекта и тд.
                </label>
                <textarea
                  placeholder="Например: нужен подъём на 5 этаж, лифта нет. Работы желательно до 15 числа..."
                  value={formData.comments}
                  onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[100px]"
                  rows={4}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Прикрепить проект (если есть)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.dwg,.dxf"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setFormData({ ...formData, projectFiles: files });
                  }}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg text-sm"
                />
                {formData.projectFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {formData.projectFiles.map((file, idx) => (
                      <p key={idx} className="text-xs text-green-600 flex items-center gap-1">
                        <Icon name="FileCheck" size={14} />
                        {file.name}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm text-green-800 font-medium mb-1">Стоимость работ</h3>
                <div className="text-3xl font-bold text-green-900">{finalTotal.toLocaleString('ru-RU')} ₽</div>
              </div>
            </div>
            {totalDiscount > 0 && (
              <div className="text-sm text-green-700 mb-2">
                ✨ Ваша экономия: {totalDiscount.toLocaleString('ru-RU')} ₽
              </div>
            )}
            {cableMeters > 0 && (
              <div className="text-sm text-green-700">
                📏 Материалы (кабель и крепёж): ~{cableCost.toLocaleString('ru-RU')} ₽
              </div>
            )}
          </Card>

          <Card className="p-6 bg-blue-50 border-blue-200 animate-fadeIn">
            <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
              <Icon name="HelpCircle" size={20} className="text-blue-600" />
              Что произойдет после оформления?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">1</div>
                <div>
                  <p className="font-semibold text-gray-800">Подтверждение заявки</p>
                  <p className="text-sm text-gray-600">Мастер свяжется с вами в течение часа</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">2</div>
                <div>
                  <p className="font-semibold text-gray-800">Осмотр объекта</p>
                  <p className="text-sm text-gray-600">Мастер приедет в указанное время для оценки</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">3</div>
                <div>
                  <p className="font-semibold text-gray-800">Выполнение работ</p>
                  <p className="text-sm text-gray-600">Качественно и в срок</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 animate-fadeIn">
            <div className="flex items-center gap-3 mb-3">
              <Icon name="MessageCircle" size={24} className="text-indigo-600" />
              <h3 className="font-bold text-lg">Бесплатная консультация</h3>
            </div>
            <p className="text-sm text-gray-700">
              Есть вопросы? Напишите нам во ВКонтакте — мы с радостью проконсультируем вас!
            </p>
          </Card>

          <Button
            size="lg"
            onClick={handleSubmit}
            className="w-full h-14 text-base font-semibold shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Icon name="CheckCircle" size={20} className="mr-2" />
            Оформить заявку
          </Button>
        </div>
      </div>

      <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}