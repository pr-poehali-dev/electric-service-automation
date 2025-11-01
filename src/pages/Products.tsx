import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import ServiceModal from '@/components/ServiceModal';
import NewProgressBar from '@/components/NewProgressBar';

export default function Products() {
  const navigate = useNavigate();
  const { cart } = useCart();
  const [showServiceModal, setShowServiceModal] = useState(false);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const steps = [
    { id: 1, label: 'Выберите услугу', icon: 'List', onClick: () => setShowServiceModal(true) },
    { id: 2, label: 'План работ', icon: 'ClipboardList', onClick: () => totalItems > 0 && navigate('/cart') },
    { id: 3, label: 'Оформление', icon: 'CheckCircle', onClick: () => navigate('/checkout') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <img 
        src="https://cdn.poehali.dev/files/eef76e18-1b64-4ae3-8839-b4fe8da091be.jpg"
        alt="Калининград"
        className="w-full h-32 object-cover"
      />

      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
              >
                <Icon name="ArrowLeft" size={24} />
              </Button>
              <h1 className="text-2xl font-bold text-gray-800">Услуги</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowServiceModal(true)}
                className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all p-0 relative"
                title="Каталог услуг"
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
          
          <NewProgressBar 
            steps={steps}
            currentStep={totalItems > 0 ? 1 : 0}
            hasItems={totalItems > 0}
            cartConfirmed={false}
          />
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
