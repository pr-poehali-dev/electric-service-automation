import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ContactModal from '@/components/ContactModal';
import PageHeader from '@/components/PageHeader';
import PageNavigation from '@/components/PageNavigation';

export default function Services() {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <PageHeader />
      
      <div className="max-w-md mx-auto">
        <PageNavigation onContactClick={() => setShowContactModal(true)} />

        <div className="p-6 space-y-6">

        <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => navigate('/orders')}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Mail" size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Мои заявки</h2>
              <p className="text-sm text-gray-600">История и статусы</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-all cursor-pointer" onClick={() => navigate('/products')}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Plus" size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Новая заявка</h2>
              <p className="text-sm text-gray-600">Услуги электрика</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-blue-50 border border-blue-200">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Icon name="Phone" size={20} className="text-blue-600" />
            Контакты
          </h3>

          <div className="space-y-3">
            <a href="tel:+74012520725" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <Icon name="Phone" size={20} className="text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Позвонить</p>
                <p className="font-semibold">+7 (4012) 52-07-25</p>
              </div>
            </a>

            <a href="https://t.me/konigelectric" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <Icon name="Send" size={20} className="text-blue-600" />
              <div>
                <p className="text-sm text-gray-500">Telegram</p>
                <p className="font-semibold">@konigelectric</p>
              </div>
            </a>

            <a href="https://vk.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-gray-50 transition-colors">
              <Icon name="MessageCircle" size={20} className="text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">ВКонтакте</p>
                <p className="font-semibold">Задать вопрос</p>
              </div>
            </a>
          </div>
        </Card>

        <Card className="p-6 bg-yellow-50 border border-yellow-200">
          <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
            <Icon name="Info" size={20} className="text-orange-600" />
            О нас
          </h3>
          <p className="text-sm text-gray-700 mb-2">
            ООО "Кёниг Электрик" — профессиональные электромонтажные работы в Калининграде и области
          </p>
          <p className="text-sm text-gray-600 flex items-center gap-2">
            <Icon name="Clock" size={16} className="text-orange-600" />
            Работаем: Пн-Вс, 10:00 - 18:00
          </p>
        </Card>
        </div>
      </div>

      <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />
    </div>
  );
}