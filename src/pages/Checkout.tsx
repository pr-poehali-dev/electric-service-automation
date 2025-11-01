import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import { calculateItemPrice, getDiscount } from '@/types/electrical';
import NewProgressBar from '@/components/NewProgressBar';
import ContactModal from '@/components/ContactModal';

export default function Checkout() {
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

  const totalPrice = cart.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  const totalDiscount = cart.reduce((sum, item) => {
    const discount = getDiscount(item.quantity);
    const basePrice = item.selectedOption === 'install-only' ? item.product.priceInstallOnly : item.product.priceWithWiring;
    const fullPrice = basePrice * item.quantity;
    return sum + (fullPrice * discount / 100);
  }, 0);

  const cableMeters = cart
    .filter(item => item.selectedOption === 'full-wiring')
    .reduce((sum, item) => sum + (item.product.slots * item.quantity * 7), 0);
  
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
      <img 
        src="https://cdn.poehali.dev/files/eef76e18-1b64-4ae3-8839-b4fe8da091be.jpg"
        alt="Калининград"
        className="w-full h-48 object-cover"
      />

      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
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
            <Button
              onClick={() => setShowContactModal(true)}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 p-0 hover:scale-110"
              title="Меню связи"
            >
              <Icon name="Menu" size={24} />
            </Button>
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
                  Номер телефона <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                  Адрес выполнения работ <span className="text-red-500">*</span>
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

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-green-800 font-medium mb-1">💰 Стоимость работ</p>
                <div className="text-3xl font-bold text-green-900">{finalTotal.toLocaleString('ru-RU')} ₽</div>
              </div>
              <Icon name="BadgeCheck" size={48} className="text-green-600" />
            </div>
            {totalDiscount > 0 && (
              <div className="text-sm text-green-700 mb-2">
                ✨ Ваша экономия: {totalDiscount.toLocaleString('ru-RU')} ₽
              </div>
            )}
            {cableMeters > 0 && (
              <div className="text-sm text-green-700">
                📏 Примерный метраж кабеля: {cableMeters} м
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
            <p className="text-sm text-gray-700 mb-3">
              Есть вопросы? Напишите нам во ВКонтакте — мы с радостью проконсультируем вас!
            </p>
            <a
              href="https://vk.com/im?sel=-23524557"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all font-semibold"
            >
              <Icon name="MessageSquare" size={18} />
              Написать ВКонтакте
            </a>
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
