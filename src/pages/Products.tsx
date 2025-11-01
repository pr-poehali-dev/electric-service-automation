import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import ServiceModal from '@/components/ServiceModal';
import ContactModal from '@/components/ContactModal';

export default function Products() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <img 
        src="https://cdn.poehali.dev/files/eef76e18-1b64-4ae3-8839-b4fe8da091be.jpg"
        alt="Калининград"
        className="w-full h-32 object-cover"
      />

      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
              >
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <h1 className="text-2xl font-bold text-gray-800 flex-1">Услуги</h1>
            </div>
            <Button
              onClick={() => setShowContactModal(true)}
              className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 hover:from-blue-600 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 p-0 hover:scale-110"
              title="Меню связи"
            >
              <Icon name="Menu" size={24} />
            </Button>
          </div>
        </div>

        <div className="p-6 text-center space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mx-auto flex items-center justify-center">
              <Icon name="ClipboardList" size={40} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Выберите услуги</h2>
            <p className="text-muted-foreground">
              Нажмите кнопку ниже, чтобы открыть каталог услуг и выбрать нужные работы
            </p>
            <Button
              size="lg"
              onClick={() => setShowServiceModal(true)}
              className="w-full h-14 text-base shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить услуги
            </Button>
          </div>

          {totalItems > 0 && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm text-green-700 font-medium">Выбрано услуг</p>
                  <p className="text-3xl font-bold text-green-900">{totalItems}</p>
                </div>
                <Button
                  onClick={() => navigate('/cart')}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 shadow-lg"
                >
                  Перейти к плану работ →
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ServiceModal open={showServiceModal} onClose={() => setShowServiceModal(false)} />
      <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />
    </div>
  );
}