import { useState } from 'react';
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
  const { cart } = useCart();
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <img 
        src="https://cdn.poehali.dev/files/eef76e18-1b64-4ae3-8839-b4fe8da091be.jpg"
        alt="Калининград"
        className="w-full h-48 object-cover"
      />

      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800 flex-1">
              БАЛТСЕТЬ | Услуги электрика ³⁹
            </h1>
            <button
              onClick={() => setShowContactModal(true)}
              className="flex-shrink-0 w-12 h-12 flex items-center justify-center text-gray-700 hover:text-blue-600 transition-colors duration-300"
              title="Меню связи"
            >
              <Icon name="Menu" size={28} />
            </button>
          </div>

          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 p-6 space-y-4">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-800">
                УСЛУГИ ЭЛЕКТРИКА
              </h2>
              <p className="text-lg text-gray-700">
                Рассчитайте стоимость работы в Калининграде за 2 минуты
              </p>
            </div>

            <Button
              onClick={() => setShowCalculatorModal(true)}
              className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
            >
              📋 Анкета для расчёта работ
            </Button>
          </Card>

          {totalItems > 0 && (
            <Button
              size="lg"
              onClick={() => navigate('/cart')}
              className="w-full h-16 text-lg font-bold shadow-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 relative animate-pulse-subtle"
            >
              Перейти к плану работ ({totalItems})
            </Button>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => navigate('/portfolio')}>
              <Icon name="ImageIcon" size={40} className="text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Портфолио</h3>
              <p className="text-sm text-gray-600 mt-1">Наши работы</p>
            </Card>
            <Card className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer" onClick={() => navigate('/profile')}>
              <Icon name="User" size={40} className="text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-800">Личный кабинет</h3>
              <p className="text-sm text-gray-600 mt-1">Мои заявки</p>
            </Card>
          </div>

          <Card className="bg-blue-50 border-blue-200 p-6 text-center">
            <h3 className="font-bold text-lg mb-3 text-gray-800">Наши преимущества</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <Icon name="CheckCircle" size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">Опыт более 10 лет</p>
                  <p className="text-sm text-gray-600">Профессиональная команда</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="CheckCircle" size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">Гарантия на работы</p>
                  <p className="text-sm text-gray-600">Качество подтверждено документально</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Icon name="CheckCircle" size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">Прозрачные цены</p>
                  <p className="text-sm text-gray-600">Никаких скрытых платежей</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ServiceModal open={showServiceModal} onClose={() => setShowServiceModal(false)} />
      <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />
      <CalculatorModal open={showCalculatorModal} onClose={() => setShowCalculatorModal(false)} />

      <style>{`
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}