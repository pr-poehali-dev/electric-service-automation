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

export type ProductType = 'switch-single' | 'switch-double' | 'outlet-single' | 'outlet-double' | 'outlet-triple' | 'outlet-quad' | 'outlet-penta' | 'cable';

export interface Product {
  id: string;
  type: ProductType;
  name: string;
  image: string;
  description: string;
  category: 'switch' | 'outlet' | 'cable';
  slots: number;
  priceMin: number;
  priceMax: number;
  includesInstallation: boolean;
  includesWiring: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
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

export const PRODUCTS: Product[] = [
  {
    id: 'sw-1',
    type: 'switch-single',
    name: 'Добавить 1 выключатель',
    image: 'https://cdn.poehali.dev/files/switch-single.jpg',
    description: 'Разметка, штрабление, укладка кабеля, установка подрозетников включены. Без заделки и материалов.',
    category: 'switch',
    slots: 1,
    priceMin: 150,
    priceMax: 1500,
    includesInstallation: true,
    includesWiring: false
  },
  {
    id: 'out-1',
    type: 'outlet-single',
    name: 'Добавить розетку',
    image: 'https://cdn.poehali.dev/files/outlet-single.jpg',
    description: 'Разметка, штрабление, укладка кабеля, установка подрозетников включены. Без заделки и материалов.',
    category: 'outlet',
    slots: 1,
    priceMin: 250,
    priceMax: 1000,
    includesInstallation: true,
    includesWiring: false
  },
  {
    id: 'out-2',
    type: 'outlet-double',
    name: 'Блок из 2-х розеток',
    image: 'https://cdn.poehali.dev/files/outlet-double.jpg',
    description: 'Разметка, штрабление, укладка кабеля, установка подрозетников включены. Без заделки и материалов.',
    category: 'outlet',
    slots: 2,
    priceMin: 500,
    priceMax: 1200,
    includesInstallation: true,
    includesWiring: false
  },
  {
    id: 'out-3',
    type: 'outlet-triple',
    name: 'Блок из 3-х розеток',
    image: 'https://cdn.poehali.dev/files/outlet-triple.jpg',
    description: 'Разметка, штрабление, укладка кабеля, установка подрозетников включены. Без заделки и материалов.',
    category: 'outlet',
    slots: 3,
    priceMin: 750,
    priceMax: 2500,
    includesInstallation: true,
    includesWiring: false
  },
  {
    id: 'out-4',
    type: 'outlet-quad',
    name: 'Блок из 4-х розеток',
    image: 'https://cdn.poehali.dev/files/outlet-quad.jpg',
    description: 'Разметка, штрабление, укладка кабеля, установка подрозетников включены. Без заделки и материалов.',
    category: 'outlet',
    slots: 4,
    priceMin: 1000,
    priceMax: 3000,
    includesInstallation: true,
    includesWiring: false
  },
  {
    id: 'out-5',
    type: 'outlet-penta',
    name: 'Блок из 5 розеток',
    image: 'https://cdn.poehali.dev/files/outlet-penta.jpg',
    description: 'Разметка, штрабление, укладка кабеля, установка подрозетников включены. Без заделки и материалов.',
    category: 'outlet',
    slots: 5,
    priceMin: 1250,
    priceMax: 3500,
    includesInstallation: true,
    includesWiring: false
  },
  {
    id: 'cable-1',
    type: 'cable',
    name: 'Монтаж кабеля 10 пог.м',
    image: 'https://cdn.poehali.dev/files/cable.jpg',
    description: 'Прокладка и монтаж кабеля. Материалы не входят.',
    category: 'cable',
    slots: 0,
    priceMin: 2000,
    priceMax: 2000,
    includesInstallation: true,
    includesWiring: true
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

export function calculatePrice(product: Product, quantity: number): number {
  const basePrice = product.priceMin;
  
  if (quantity >= 20) {
    return Math.round(basePrice * 0.7 * quantity);
  } else if (quantity >= 10) {
    return Math.round(basePrice * 0.8 * quantity);
  } else if (quantity >= 5) {
    return Math.round(basePrice * 0.9 * quantity);
  }
  
  return basePrice * quantity;
}

export function getDiscount(quantity: number): number {
  if (quantity >= 20) return 30;
  if (quantity >= 10) return 20;
  if (quantity >= 5) return 10;
  return 0;
}
