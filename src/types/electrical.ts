export type RoomType = 'room' | '1-room' | '2-room' | '3-room';

export interface RoomDefaults {
  switches: number;
  outlets: number;
}

export const ROOM_DEFAULTS: Record<RoomType, RoomDefaults> = {
  'room': { switches: 1, outlets: 4 },
  '1-room': { switches: 4, outlets: 8 },
  '2-room': { switches: 5, outlets: 10 },
  '3-room': { switches: 7, outlets: 12 }
};

export const ROOM_LABELS: Record<RoomType, string> = {
  'room': 'Комната',
  '1-room': '1-комнатная квартира',
  '2-room': '2-комнатная квартира',
  '3-room': '3-комнатная квартира'
};

export type ProductType = 'switch-single' | 'switch-double' | 'outlet-single' | 'outlet-double' | 'outlet-triple' | 'outlet-quad' | 'outlet-penta' | 'cable' | 'chandelier';

export type ServiceOption = 'install-only' | 'full-wiring';

export interface Product {
  id: string;
  type: ProductType;
  name: string;
  image: string;
  description: string;
  category: 'switch' | 'outlet' | 'cable' | 'chandelier';
  serviceCategory: 'popular' | 'construction';
  installType: 'rough' | 'finish';
  slots: number;
  priceInstallOnly: number;
  priceWithWiring: number;
  options?: {
    id: string;
    name: string;
    price: number;
  }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption: ServiceOption;
  additionalOptions?: string[];
}

export type OrderStatus = 'pending' | 'confirmed' | 'in-progress' | 'completed';

export interface Order {
  id: string;
  date: string;
  time: string;
  address: string;
  phone: string;
  items: CartItem[];
  status: OrderStatus;
  totalSwitches: number;
  totalOutlets: number;
  totalPoints: number;
  estimatedCable: number;
  estimatedFrames: number;
  createdAt: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  price: string;
  description: string;
}

export const MASTER_VISIT_ID = 'master-visit';

export const PRODUCTS: Product[] = [
  {
    id: MASTER_VISIT_ID,
    type: 'switch-single',
    name: 'Выезд мастера',
    image: 'https://cdn.poehali.dev/files/switch-single.jpg',
    description: 'Обязательная услуга при оформлении заявки',
    category: 'switch',
    serviceCategory: 'popular',
    installType: 'finish',
    slots: 0,
    priceInstallOnly: 500,
    priceWithWiring: 500
  },
  {
    id: 'sw-1',
    type: 'switch-single',
    name: 'Добавить 1 выключатель',
    image: 'https://cdn.poehali.dev/files/switch-single.jpg',
    description: 'Установка выключателя',
    category: 'switch',
    serviceCategory: 'popular',
    installType: 'finish',
    slots: 1,
    priceInstallOnly: 150,
    priceWithWiring: 1500
  },
  {
    id: 'out-1',
    type: 'outlet-single',
    name: 'Добавить розетку',
    image: 'https://cdn.poehali.dev/files/outlet-single.jpg',
    description: 'Установка розетки',
    category: 'outlet',
    serviceCategory: 'popular',
    installType: 'finish',
    slots: 1,
    priceInstallOnly: 250,
    priceWithWiring: 1000
  },
  {
    id: 'chandelier-1',
    type: 'chandelier',
    name: 'Установить/заменить люстру',
    image: 'https://cdn.poehali.dev/files/chandelier.jpg',
    description: 'Установка или замена люстры',
    category: 'chandelier',
    serviceCategory: 'popular',
    installType: 'finish',
    slots: 0,
    priceInstallOnly: 500,
    priceWithWiring: 1500,
    options: [
      {
        id: 'assemble',
        name: 'Сборка люстры',
        price: 500
      }
    ]
  },
  {
    id: 'out-2',
    type: 'outlet-double',
    name: 'Блок из 2-х розеток',
    image: 'https://cdn.poehali.dev/files/outlet-double.jpg',
    description: 'Установка блока розеток со штроблением',
    category: 'outlet',
    serviceCategory: 'construction',
    installType: 'rough',
    slots: 2,
    priceInstallOnly: 500,
    priceWithWiring: 1200
  },
  {
    id: 'out-3',
    type: 'outlet-triple',
    name: 'Блок из 3-х розеток',
    image: 'https://cdn.poehali.dev/files/outlet-triple.jpg',
    description: 'Установка блока розеток со штроблением',
    category: 'outlet',
    serviceCategory: 'construction',
    installType: 'rough',
    slots: 3,
    priceInstallOnly: 750,
    priceWithWiring: 2500
  },
  {
    id: 'out-4',
    type: 'outlet-quad',
    name: 'Блок из 4-х розеток',
    image: 'https://cdn.poehali.dev/files/outlet-quad.jpg',
    description: 'Установка блока розеток со штроблением',
    category: 'outlet',
    serviceCategory: 'construction',
    installType: 'rough',
    slots: 4,
    priceInstallOnly: 1000,
    priceWithWiring: 3000
  },
  {
    id: 'out-5',
    type: 'outlet-penta',
    name: 'Блок из 5 розеток',
    image: 'https://cdn.poehali.dev/files/outlet-penta.jpg',
    description: 'Установка блока розеток со штроблением',
    category: 'outlet',
    serviceCategory: 'construction',
    installType: 'rough',
    slots: 5,
    priceInstallOnly: 1250,
    priceWithWiring: 3500
  },
  {
    id: 'cable-1',
    type: 'cable',
    name: 'Монтаж кабеля 10 пог.м',
    image: 'https://cdn.poehali.dev/files/cable.jpg',
    description: 'Прокладка и монтаж кабеля со штроблением',
    category: 'cable',
    serviceCategory: 'construction',
    installType: 'rough',
    slots: 0,
    priceInstallOnly: 2000,
    priceWithWiring: 2000
  }
];

export function calculateFrames(items: CartItem[]): number {
  let totalFrames = 0;
  
  items.forEach(item => {
    const slots = item.product.slots;
    const quantity = item.quantity;
    
    if (slots === 1 || slots === 2) {
      totalFrames += quantity;
    } else if (slots === 3) {
      totalFrames += quantity;
    } else if (slots === 4) {
      totalFrames += quantity * 2;
    } else if (slots === 5) {
      totalFrames += quantity * 2;
    }
  });
  
  return totalFrames;
}

export function calculateCable(totalPoints: number): number {
  return Math.ceil(totalPoints * 7);
}

export function calculateTotals(items: CartItem[]) {
  let totalSwitches = 0;
  let totalOutlets = 0;
  
  items.forEach(item => {
    const quantity = item.quantity || 0;
    if (item.product.category === 'switch') {
      totalSwitches += quantity;
    } else if (item.product.category === 'outlet') {
      const slots = item.product.slots || 1;
      totalOutlets += quantity * slots;
    }
  });
  
  const totalPoints = totalSwitches + totalOutlets;
  const estimatedCable = calculateCable(totalPoints) || 0;
  const estimatedFrames = calculateFrames(items) || 0;
  
  return {
    totalSwitches: totalSwitches || 0,
    totalOutlets: totalOutlets || 0,
    totalPoints: totalPoints || 0,
    estimatedCable: estimatedCable || 0,
    estimatedFrames: estimatedFrames || 0
  };
}

export function calculateItemPrice(item: CartItem): number {
  let basePrice = 0;
  
  if (item.selectedOption === 'install-only') {
    basePrice = item.product.priceInstallOnly;
  } else {
    basePrice = item.product.priceWithWiring;
  }
  
  let optionsPrice = 0;
  if (item.additionalOptions && item.product.options) {
    item.additionalOptions.forEach(optionId => {
      const option = item.product.options?.find(o => o.id === optionId);
      if (option) {
        optionsPrice += option.price;
      }
    });
  }
  
  const quantity = item.quantity || 1;
  const totalPerItem = basePrice + optionsPrice;
  
  if (quantity >= 20) {
    return Math.round(totalPerItem * 0.7 * quantity);
  } else if (quantity >= 10) {
    return Math.round(totalPerItem * 0.8 * quantity);
  } else if (quantity >= 5) {
    return Math.round(totalPerItem * 0.9 * quantity);
  }
  
  return totalPerItem * quantity;
}

export function getDiscount(quantity: number): number {
  if (quantity >= 20) return 30;
  if (quantity >= 10) return 20;
  if (quantity >= 5) return 10;
  return 0;
}