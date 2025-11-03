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
        { id: 'install', name: 'Установить люстру', price: 1000, quantity: 1, enabled: false },
        { id: 'dismantle', name: 'Демонтаж люстры', price: 500, quantity: 1, enabled: false },
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
        { id: 'install', name: 'Установить выключатель', price: 250, quantity: 1, enabled: false },
        { id: 'repair', name: 'Ремонт с учётом материалов', price: 1500, quantity: 1, enabled: false },
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
        { id: 'install', name: 'Установить розетку', price: 250, quantity: 1, enabled: false },
        { id: 'repair', name: 'Ремонт с учётом материалов', price: 850, quantity: 1, enabled: false },
      ]
    },
    {
      productId: 'wiring-complex',
      productName: 'Электромонтажные работы',
      productDescription: 'Черновые работы со штроблением, сверлением и установкой подрозетника, замена проводки',
      category: 'outlet',
      sectionCategory: 'wiring',
      expanded: false,
      options: [
        { id: 'add-outlet', name: 'Добавить розетку', price: 850, quantity: 1, enabled: false },
        { id: 'move-switch', name: 'Перенести выключатель', price: 1500, quantity: 1, enabled: false },
        { id: 'block-2', name: 'Блок из 2-х розеток', price: 1200, quantity: 1, enabled: false },
        { id: 'block-3', name: 'Блок из 3-х розеток', price: 2500, quantity: 1, enabled: false },
        { id: 'block-4', name: 'Блок из 4-х розеток', price: 3000, quantity: 1, enabled: false },
        { id: 'move-switch-alt', name: 'Перенести выключатель', price: 3500, quantity: 1, enabled: false },
      ]
    }
  ];
}