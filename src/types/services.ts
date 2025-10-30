export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  icon?: string;
  image?: string;
  category: 'quick' | 'electrical';
}

export interface CartItem extends Service {
  quantity: number;
}

export interface CustomTask {
  id: string;
  description: string;
  priceStatus: 'pending' | 'quoted';
  price?: number;
}

export interface OrderStatus {
  code: string;
  label: string;
  description: string;
}

export const quickServices: Service[] = [
  { 
    id: 'q1', 
    title: 'Установить розетку', 
    description: 'Быстрая установка розетки', 
    price: 250, 
    icon: 'Plug',
    category: 'quick'
  },
  { 
    id: 'q2', 
    title: 'Установить светильник', 
    description: 'Монтаж светильника', 
    price: 1500, 
    icon: 'Lightbulb',
    category: 'quick'
  },
  { 
    id: 'q3', 
    title: 'Вызов мастера', 
    description: 'Диагностика и консультация', 
    price: 500, 
    icon: 'User',
    category: 'quick'
  }
];

export const electricalServices: Service[] = [
  {
    id: 'e1',
    title: 'Тёплый пол от электрощитка',
    description: 'Комплекс подготовительных электромонтажных работ под установку электрического тёплого пола',
    price: 5500,
    icon: 'Flame',
    category: 'electrical'
  },
  {
    id: 'e2',
    title: 'Добавить 1 выключатель',
    description: 'Добавить / перенести',
    price: 1500,
    oldPrice: 2500,
    discount: 40,
    icon: 'ToggleLeft',
    category: 'electrical'
  },
  {
    id: 'e3',
    title: 'Добавить розетку 230V',
    description: 'Добавить / перенести',
    price: 850,
    oldPrice: 1200,
    discount: 29,
    icon: 'Plug',
    category: 'electrical'
  },
  {
    id: 'e4',
    title: 'Блок из 2-х розеток',
    description: 'Добавить 2 розетки',
    price: 1200,
    oldPrice: 1900,
    discount: 37,
    icon: 'Plug2',
    category: 'electrical'
  },
  {
    id: 'e5',
    title: 'Блок из 3-х розеток',
    description: 'Добавить 3 розетки',
    price: 2500,
    icon: 'Cable',
    category: 'electrical'
  },
  {
    id: 'e6',
    title: 'Блок из 4-х розеток',
    description: 'Добавить 4 розетки',
    price: 3000,
    icon: 'Cable',
    category: 'electrical'
  },
  {
    id: 'e7',
    title: 'Блок из 5 розеток',
    description: 'Добавить 5 розеток',
    price: 3500,
    icon: 'Cable',
    category: 'electrical'
  },
  {
    id: 'e8',
    title: 'Монтаж кабеля 10 метров',
    description: 'Монтаж кабеля по потолку, с учетом материала',
    price: 2000,
    oldPrice: 3500,
    discount: 43,
    icon: 'GitBranch',
    category: 'electrical'
  },
  {
    id: 'e9',
    title: 'Расходка до 75м²',
    description: 'Крепеж и расходные материалы электрика',
    price: 10000,
    oldPrice: 15000,
    discount: 33,
    icon: 'Box',
    category: 'electrical'
  }
];

export const orderStatuses: OrderStatus[] = [
  { code: 'planning', label: 'Планирование', description: 'Заявка принята и планируется' },
  { code: 'scheduled', label: 'Встреча назначена', description: 'Дата и время согласованы' },
  { code: 'in_progress', label: 'В работе', description: 'Мастер выполняет работу' },
  { code: 'completed', label: 'Завершено', description: 'Работа выполнена' },
  { code: 'cancelled', label: 'Отменено', description: 'Заказ отменён' }
];
