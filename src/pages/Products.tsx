import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ContactModal from '@/components/ContactModal';
import PageHeader from '@/components/PageHeader';
import PageNavigation from '@/components/PageNavigation';
import ServiceContainerCard from '@/components/products/ServiceContainerCard';
import { useProductsLogic } from '@/components/products/useProductsLogic';

export default function Products() {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);

  const {
    containers,
    servicesContainers,
    wiringContainers,
    toggleContainer,
    toggleOption,
    updateOptionQuantity,
    calculateContainerTotal,
    calculateGrandTotal,
    handleAddToCart,
    hasAnyEnabledOptions
  } = useProductsLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-32">
      <PageHeader />

      <div className="max-w-md mx-auto">
        <PageNavigation onContactClick={() => setShowContactModal(true)} />

        <div className="p-6 space-y-6">
          <h2 className="text-2xl font-bold mb-2">Электромонтажные работы</h2>
          
          <Button
            onClick={() => navigate('/calculator')}
            variant="outline"
            className="w-full border-2 border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold"
          >
            <Icon name="Calculator" size={18} className="mr-2" />
            Рассчитать количество точек по типу объекта
          </Button>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-4">
                Услуги электрика
              </h3>
              <div className="space-y-3">
                {servicesContainers.map((container) => {
                  const actualIndex = containers.findIndex(c => c.productId === container.productId);
                  return (
                    <ServiceContainerCard
                      key={container.productId}
                      container={container}
                      actualIndex={actualIndex}
                      toggleContainer={toggleContainer}
                      toggleOption={toggleOption}
                      updateOptionQuantity={updateOptionQuantity}
                      calculateContainerTotal={calculateContainerTotal}
                    />
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-4">
                Электромонтаж проводки
              </h3>
              <div className="space-y-3">
                {wiringContainers.map((container) => {
                  const actualIndex = containers.findIndex(c => c.productId === container.productId);
                  return (
                    <ServiceContainerCard
                      key={container.productId}
                      container={container}
                      actualIndex={actualIndex}
                      toggleContainer={toggleContainer}
                      toggleOption={toggleOption}
                      updateOptionQuantity={updateOptionQuantity}
                      calculateContainerTotal={calculateContainerTotal}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {hasAnyEnabledOptions && (
            <Card className="mt-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-800">ИТОГО</span>
                  <span className="text-3xl font-bold text-green-600">
                    {calculateGrandTotal().toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  Добавить в список задач
                </Button>
              </div>
            </Card>
          )}

          <div className="mt-6 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 p-4 text-center border-t space-y-2">
              <p className="text-xs text-gray-500">
                Welcome to <a href="https://t.me/konigelectric" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Telegram</a> 🚀
              </p>
              <p className="text-xs text-gray-500">Спасибо за ваш выбор!</p>
              <p className="text-xs text-gray-500 mt-1">📞 +7 (4012) 52-07-25</p>
            </div>
          </div>
        </div>
      </div>

      <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />
    </div>
  );
}
