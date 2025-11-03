import { PRODUCTS } from '@/types/electrical';
import { ServiceContainer } from './types';

export function getInitialContainers(): ServiceContainer[] {
  return [
    {
      productId: 'chandelier-1',
      productName: 'Установить люстру',
      productDescription: 'Установка люстры, заменить светильник',
      category: 'chandelier',
      sectionCategory: 'services',
      expanded: false,
      options: [
        { id: 'crystal', name: 'Установка хрустальных подвесок', price: 3500, quantity: 1, enabled: false },
        { id: 'install', name: 'Установить люстру', price: 1000, quantity: 1, enabled: false },
        { id: 'dismantle', name: 'Демонтаж светильника', price: 500, quantity: 1, enabled: false },
        { id: 'assemble', name: 'Сборка люстры', price: 500, quantity: 1, enabled: false },
      ]
    },
    {
      productId: 'sw-install',
      productName: 'Установить выключатель',
      productDescription: 'Установка выключателя, ремонт',
      category: 'switch',
      sectionCategory: 'services',
      expanded: false,
      options: [
        { id: 'repair', name: 'Ремонт с учётом материалов', price: 1500, quantity: 1, enabled: false },
        { id: 'install', name: 'Установить выключатель', price: 250, quantity: 1, enabled: false },
      ]
    },
    {
      productId: 'out-install',
      productName: 'Установить розетку',
      productDescription: 'Установка розеток, ремонт',
      category: 'outlet',
      sectionCategory: 'services',
      expanded: false,
      options: [
        { id: 'repair', name: 'Ремонт с учётом материалов', price: 1500, quantity: 1, enabled: false, discount: { minQuantity: 5, percent: 10 } },
        { id: 'surface-outlet', name: 'Накладная розетка', price: 500, quantity: 1, enabled: false },
        { id: 'install', name: 'Установить розетку', price: 250, quantity: 1, enabled: false },
      ]
    },
    {
      productId: 'wiring-complex',
      productName: 'Электромонтажные работы',
      productDescription: 'Черновые работы со штроблением, сверлением и установкой подрозетника, замена проводки в квартире',
      category: 'outlet',
      sectionCategory: 'wiring',
      expanded: true,
      options: [
        { id: 'block-5', name: 'Блок из 5 розеток +закладная', price: 8000, quantity: 1, enabled: false },
        { id: 'gas-sensor', name: 'Перенос газовых детекторов', price: 3500, quantity: 1, enabled: false },
        { id: 'block-4', name: 'Блок из 4-х розеток', price: 3000, quantity: 1, enabled: false },
        { id: 'block-3', name: 'Блок из 3-х розеток', price: 2500, quantity: 1, enabled: false },
        { id: 'move-switch', name: 'Перенести выключатель', price: 1500, quantity: 1, enabled: false },
        { id: 'block-2', name: 'Блок из 2-х розеток', price: 1200, quantity: 1, enabled: false },
        { id: 'add-outlet', name: 'Добавить розетку', price: 850, quantity: 1, enabled: false },
        { id: 'box-flush', name: 'Бокс скрытого монтажа', price: 8500, quantity: 1, enabled: false, group: 'panel' },
        { id: 'meter-380v', name: 'Установка электросчётчика 380V', price: 5500, quantity: 1, enabled: false, group: 'panel' },
        { id: 'meter-230v', name: 'Установка электросчётчика 230V', price: 3500, quantity: 1, enabled: false, group: 'panel' },
        { id: 'breaker-replace', name: 'Замена автомата с учётом материала', price: 3500, quantity: 1, enabled: false, group: 'panel' },
        { id: 'box-surface', name: 'Бокс открытого монтажа', price: 2500, quantity: 1, enabled: false, group: 'panel' },
        { id: 'breaker-install', name: 'Установка автомата защиты', price: 1000, quantity: 1, enabled: false, discount: { minQuantity: 10, percent: 50 }, group: 'panel' },
        { id: 'input-cable', name: 'Новый вводной кабель', price: 0, quantity: 1, enabled: false, group: 'panel', customPrice: true },
        { id: 'cable-10m', name: 'Монтаж кабеля 10 метров', price: 2000, quantity: 1, enabled: false, group: 'construction' },
        { id: 'drilling-porcelain', name: 'Сверление керамогранита', price: 500, quantity: 1, enabled: false, unit: 'лунка', group: 'construction' },
        { id: 'electrical-install', name: 'Электроустановка', price: 250, quantity: 1, enabled: false, unit: 'изделие', group: 'construction' },
        { id: 'cable-corrugated', name: 'Монтаж кабеля в трубе', price: 220, quantity: 1, enabled: false, unit: 'п.м.', group: 'construction' },
      ]
    }
  ];
}