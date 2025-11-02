import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import ServiceModal from '@/components/ServiceModal';
import ContactModal from '@/components/ContactModal';
import CalculatorModal from '@/components/CalculatorModal';

export default function Services() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/orders');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      <img 
        src="https://cdn.poehali.dev/files/6c409522-72a0-424a-95d5-7c20d103daa1.jpg"
        alt="Калининград"
        className="w-full h-auto object-cover"
      />

      <div className="max-w-md mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-all" onClick={() => navigate('/orders')}>
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <Icon name="ClipboardList" size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">Мои заявки</h2>
            <p className="text-sm text-gray-600">История и статусы заказов</p>
          </div>
        </div>

        <div className="flex items-center gap-4 cursor-pointer hover:bg-gray-50 p-3 rounded-xl transition-all" onClick={handleNewOrderClick}>
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <Icon name="Plus" size={32} className="text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">Новая заявка</h2>
            <p className="text-sm text-gray-600">Заказать услуги электрика</p>
          </div>
        </div>

        <Card className="bg-blue-50 border-blue-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Icon name="Phone" size={24} className="text-blue-600" />
            <h3 className="font-bold text-lg text-gray-800">Контакты</h3>
          </div>
          
          <div className="space-y-3">
            <a href="tel:+74012520725" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <Icon name="Phone" size={20} className="text-green-600" />
              <div>
                <p className="font-semibold text-gray-800">Позвонить</p>
                <p className="text-sm text-gray-600">+7 (4012) 52-07-25</p>
              </div>
            </a>
            
            <a href="https://t.me/konigelectric" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <Icon name="Send" size={20} className="text-blue-600" />
              <div>
                <p className="font-semibold text-gray-800">Telegram</p>
                <p className="text-sm text-gray-600">@konigelectric</p>
              </div>
            </a>
            
            <a href="https://vk.com/konigelectric" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <Icon name="MessageCircle" size={20} className="text-indigo-600" />
              <div>
                <p className="font-semibold text-gray-800">ВКонтакте</p>
                <p className="text-sm text-gray-600">Бесплатная консультация</p>
              </div>
            </a>
          </div>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Info" size={24} className="text-yellow-600" />
            <h3 className="font-bold text-lg text-gray-800">О нас</h3>
          </div>
          <p className="text-sm text-gray-700 mb-2">
            <strong>БАЛТСЕТЬ | Услуги электрика ³⁹</strong>
          </p>
          <p className="text-sm text-gray-700 mb-2">
            Профессиональные электромонтажные работы в Калининграде и области
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
            <Icon name="Clock" size={16} className="text-orange-600" />
            <span>Работаем: Пн-Вс, 8:00 - 20:00</span>
          </div>
        </Card>
      </div>

      <ServiceModal open={showServiceModal} onClose={() => setShowServiceModal(false)} />
      <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />
      <CalculatorModal open={showCalculatorModal} onClose={handleCalculatorClose} />
    </div>
  );
}