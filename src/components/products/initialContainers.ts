import { PRODUCTS } from '@/types/electrical';
import { ServiceContainer } from './types';

export function getInitialContainers(): ServiceContainer[] {
  const chandelier = PRODUCTS.find(p => p.id === 'chandelier-1');
  
  return [
    {
      productId: 'chandelier-1',
      productName: 'Установить люстру',
      productDescription: chandelier?.description || '',
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
      productDescription: 'Монтаж выключателя в готовое место',
      category: 'switch',
      sectionCategory: 'services',
      expanded: false,
      options: [
        { id: 'install', name: 'Установить выключатель', price: 250, quantity: 1, enabled: false },
      ]
    },
    {
      productId: 'out-install',
      productName: 'Установить розетку',
      productDescription: 'Монтаж розетки в готовое место',
      category: 'outlet',
      sectionCategory: 'services',
      expanded: false,
      options: [
        { id: 'install', name: 'Установить розетку', price: 250, quantity: 1, enabled: false },
      ]
    },
    {
      productId: 'sw-wiring',
      productName: 'Добавить/перенести выключатель',
      productDescription: 'Черновой монтаж проводки для выключателя',
      category: 'switch',
      sectionCategory: 'wiring',
      expanded: false,
      options: [
        { id: 'wiring', name: 'Добавить/перенести выключатель', price: 1500, quantity: 1, enabled: false },
      ]
    },
    {
      productId: 'out-wiring',
      productName: 'Добавить/перенести розетку',
      productDescription: 'Черновой монтаж проводки для розетки',
      category: 'outlet',
      sectionCategory: 'wiring',
      expanded: false,
      options: [
        { id: 'wiring', name: 'Добавить/перенести розетку', price: 850, quantity: 1, enabled: false },
      ]
    },
    {
      productId: 'out-blocks',
      productName: 'Комплексные работы',
      productDescription: 'Группа розеток, объединенных в одну рамку',
      category: 'outlet',
      sectionCategory: 'wiring',
      expanded: false,
      options: [
        { id: 'block-2', name: 'Блок из 2-х розеток', price: 1200, quantity: 1, enabled: false },
        { id: 'block-3', name: 'Блок из 3-х розеток', price: 2500, quantity: 1, enabled: false },
        { id: 'block-4', name: 'Блок из 4-х розеток', price: 3000, quantity: 1, enabled: false },
        { id: 'block-5', name: 'Блок из 5 розеток', price: 3500, quantity: 1, enabled: false },
      ].sort((a, b) => a.price - b.price)
    }
  ];
}
