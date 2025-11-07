import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ContactModal from '@/components/ContactModal';
import PageHeader from '@/components/PageHeader';
import PageNavigation from '@/components/PageNavigation';
import ServiceContainerCard from '@/components/products/ServiceContainerCard';
import SurveyDialog from '@/components/products/SurveyDialog';
import { useProductsLogic } from '@/components/products/useProductsLogic';

export default function Products() {
  const navigate = useNavigate();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showSurveyDialog, setShowSurveyDialog] = useState(false);

  const {
    containers,
    servicesContainers,
    wiringContainers,
    toggleContainer,
    toggleOption,
    updateOptionQuantity,
    updateVoltage,
    calculateContainerTotal,
    calculateGrandTotal,
    handleAddToCart,
    hasAnyEnabledOptions,
    hasWiringOptions,
    calculateEstimatedCableMeters
  } = useProductsLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-32">
      <PageHeader />

      <div className="max-w-md md:max-w-4xl lg:max-w-6xl mx-auto">
        <PageNavigation onContactClick={() => setShowContactModal(true)} />

        <div className="p-6 space-y-6">


          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-700 mb-3 hidden">Быстрые услуги</h3>
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
                      updateVoltage={updateVoltage}
                      calculateContainerTotal={calculateContainerTotal}
                    />
                  );
                })}
              </div>
                
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
                      updateVoltage={updateVoltage}
                      calculateContainerTotal={calculateContainerTotal}
                    />
                  );
                })}
              </div>
              
              {!hasAnyEnabledOptions && (
                <Button
                  onClick={() => setShowSurveyDialog(true)}
                  variant="outline"
                  className="w-full mt-4 border-2 border-blue-400 bg-white hover:bg-blue-50 text-blue-700 font-semibold"
                >
                  Рассчитать стоимость
                </Button>
              )}
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
                
                {hasWiringOptions && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700">
                      💡 Примерный метраж кабеля: <span className="font-bold">{calculateEstimatedCableMeters()}м</span>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      Автоматически добавлено: Монтаж кабеля (100₽/м)
                    </p>
                  </div>
                )}
                
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


        </div>
      </div>

      <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />
      <SurveyDialog open={showSurveyDialog} onClose={() => setShowSurveyDialog(false)} />
    </div>
  );
}