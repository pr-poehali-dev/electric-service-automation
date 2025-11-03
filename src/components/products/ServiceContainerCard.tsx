import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Checkbox } from '@/components/ui/checkbox';
import { ServiceContainer, ServiceOption } from './types';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ServiceContainerCardProps {
  container: ServiceContainer;
  actualIndex: number;
  toggleContainer: (index: number) => void;
  toggleOption: (containerIndex: number, optionId: string) => void;
  updateOptionQuantity: (containerIndex: number, optionId: string, newQuantity: number) => void;
  calculateContainerTotal: (container: ServiceContainer) => number;
}

export default function ServiceContainerCard({
  container,
  actualIndex,
  toggleContainer,
  toggleOption,
  updateOptionQuantity,
  calculateContainerTotal
}: ServiceContainerCardProps) {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    main: true,
    construction: false,
    panel: false
  });

  const handleSectionToggle = (section: string) => {
    setExpandedSections({
      main: section === 'main',
      construction: section === 'construction',
      panel: section === 'panel'
    });
  };

  const isSingleOption = container.options.length === 1;
  const singleOption = isSingleOption ? container.options[0] : null;

  const calculateOptionPrice = (option: ServiceOption) => {
    if (option.customPrice) return 'По запросу';
    
    let price = option.price * option.quantity;
    
    if (option.discount && option.quantity >= option.discount.minQuantity) {
      price = price * (1 - option.discount.percent / 100);
    }
    
    return `${price.toLocaleString('ru-RU')} ₽`;
  };

  const getDiscountLabel = (option: ServiceOption) => {
    if (!option.discount) return null;
    return `Скидка ${option.discount.percent}% от ${option.discount.minQuantity} шт.`;
  };

  const renderOption = (option: ServiceOption) => {
    const hasDiscount = option.discount && option.quantity >= option.discount.minQuantity;
    
    return (
      <div 
        key={option.id}
        className={`p-3 rounded-lg transition-all ${
          option.enabled ? 'bg-green-100' : 'bg-white'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <Checkbox
              id={`${container.productId}-${option.id}`}
              checked={option.enabled}
              onCheckedChange={() => toggleOption(actualIndex, option.id)}
            />
            <label 
              htmlFor={`${container.productId}-${option.id}`}
              className="text-sm font-medium cursor-pointer flex-1"
            >
              {option.name}
              {option.unit && <span className="text-xs text-gray-500 ml-1">({option.unit})</span>}
              {option.customPrice && (
                <p className="text-xs text-blue-600 mt-1">
                  Полная замена старого вводного кабеля, либо наращивание существующего
                </p>
              )}
              {option.id === 'gas-sensor' && (
                <p className="text-xs text-blue-600 mt-1">
                  Перенос газоанализаторов в квартире с перекладкой проводки
                </p>
              )}
            </label>
          </div>
          
          {option.enabled ? (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  updateOptionQuantity(actualIndex, option.id, option.quantity - 1);
                }}
                className="h-8 w-8 p-0 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                <Icon name="Minus" size={16} />
              </Button>
              <span className="font-bold text-lg min-w-[2rem] text-center">{option.quantity}</span>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  updateOptionQuantity(actualIndex, option.id, option.quantity + 1);
                }}
                className="h-8 w-8 p-0 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Icon name="Plus" size={16} />
              </Button>
            </div>
          ) : (
            <span className="text-green-600 font-bold text-sm">
              {option.customPrice ? 'По запросу' : `+${option.price} ₽`}
            </span>
          )}
        </div>
        
        {option.enabled && option.discount && (
          <div className={`text-xs mt-2 ml-8 ${hasDiscount ? 'text-green-700 font-semibold' : 'text-gray-500'}`}>
            {getDiscountLabel(option)}
            {hasDiscount && ' ✓ Применена!'}
          </div>
        )}
      </div>
    );
  };

  if (isSingleOption && singleOption) {
    return (
      <Card key={container.productId} className="overflow-hidden">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1 flex items-center gap-2">
              <h4 className="font-semibold text-base">{container.productName}</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Icon name="Info" size={14} className="text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Цены для высоты потолков до 3.5м. Выше — +50%</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {renderOption(singleOption)}
          
          {calculateContainerTotal(container) > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Итого за услугу:</span>
                <span className="text-2xl font-bold text-green-600">
                  {calculateContainerTotal(container).toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  }

  const constructionOptions = container.options.filter(opt => opt.group === 'construction');
  const panelOptions = container.options.filter(opt => opt.group === 'panel');
  const otherOptions = container.options.filter(opt => !opt.group);

  return (
    <Card key={container.productId} className="overflow-hidden">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => toggleContainer(actualIndex)}
      >
        <div className="flex-1 flex items-center gap-2">
          <h4 className="font-semibold text-base">{container.productName}</h4>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Icon name="Info" size={14} className="text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Цены для высоты потолков до 3.5м. Выше — +50%</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Icon 
          name={container.expanded ? 'ChevronUp' : 'ChevronDown'} 
          size={20} 
          className="text-gray-400"
        />
      </div>

      {container.expanded && (
        <div className="px-4 pb-4 space-y-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => handleSectionToggle('main')}
            >
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-700">Уточните задачу:</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Icon name="Info" size={14} className="text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Цены для высоты потолков до 3.5м. Выше — +50%</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Icon 
                name={expandedSections.main ? 'ChevronUp' : 'ChevronDown'} 
                size={18} 
                className="text-gray-500"
              />
            </div>
            
            {expandedSections.main && otherOptions.length > 0 && (
              <div className="space-y-2 mt-3">
                {otherOptions.map(renderOption)}
              </div>
            )}
          </div>

          {panelOptions.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => handleSectionToggle('panel')}
              >
                <h5 className="text-sm font-bold text-gray-800">Монтаж и сборка электрощитов</h5>
                <Icon 
                  name={expandedSections.panel ? 'ChevronUp' : 'ChevronDown'} 
                  size={18} 
                  className="text-gray-500"
                />
              </div>
              
              {expandedSections.panel && (
                <div className="space-y-2 mt-3">
                  {panelOptions.map(renderOption)}
                </div>
              )}
            </div>
          )}

          {constructionOptions.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => handleSectionToggle('construction')}
              >
                <h5 className="text-sm font-bold text-gray-800">Строительные работы</h5>
                <Icon 
                  name={expandedSections.construction ? 'ChevronUp' : 'ChevronDown'} 
                  size={18} 
                  className="text-gray-500"
                />
              </div>
              
              {expandedSections.panel && (
                <div className="space-y-2 mt-3">
                  {panelOptions.map(renderOption)}
                </div>
              )}
            </div>
          )}

          {calculateContainerTotal(container) > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">Итого за услугу:</span>
                <span className="text-2xl font-bold text-green-600">
                  {calculateContainerTotal(container).toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}