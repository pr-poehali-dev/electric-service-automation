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

export type ProductType = 'switch-single' | 'switch-double' | 'outlet-single' | 'outlet-double' | 'outlet-triple' | 'outlet-quad' | 'outlet-penta';

export interface Product {
  id: string;
  type: ProductType;
  name: string;
  image: string;
  description: string;
  category: 'switch' | 'outlet';
  slots: number;
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
    name: 'Одинарный выключатель',
    image: 'https://cdn.poehali.dev/files/switch-single.jpg',
    description: 'Стандартный одноклавишный выключатель',
    category: 'switch',
    slots: 1
  },
  {
    id: 'sw-2',
    type: 'switch-double',
    name: 'Двойной выключатель',
    image: 'https://cdn.poehali.dev/files/switch-double.jpg',
    description: 'Двухклавишный выключатель',
    category: 'switch',
    slots: 1
  },
  {
    id: 'out-1',
    type: 'outlet-single',
    name: 'Одинарная розетка',
    image: 'https://cdn.poehali.dev/files/outlet-single.jpg',
    description: 'Стандартная розетка',
    category: 'outlet',
    slots: 1
  },
  {
    id: 'out-2',
    type: 'outlet-double',
    name: 'Двойной блок розеток',
    image: 'https://cdn.poehali.dev/files/outlet-double.jpg',
    description: 'Блок из 2 розеток',
    category: 'outlet',
    slots: 2
  },
  {
    id: 'out-3',
    type: 'outlet-triple',
    name: 'Тройной блок розеток',
    image: 'https://cdn.poehali.dev/files/outlet-triple.jpg',
    description: 'Блок из 3 розеток',
    category: 'outlet',
    slots: 3
  },
  {
    id: 'out-4',
    type: 'outlet-quad',
    name: 'Четверной блок розеток',
    image: 'https://cdn.poehali.dev/files/outlet-quad.jpg',
    description: 'Блок из 4 розеток',
    category: 'outlet',
    slots: 4
  },
  {
    id: 'out-5',
    type: 'outlet-penta',
    name: 'Пятерной блок розеток',
    image: 'https://cdn.poehali.dev/files/outlet-penta.jpg',
    description: 'Блок из 5 розеток',
    category: 'outlet',
    slots: 5
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
    const quantity = item.quantity;
    if (item.product.category === 'switch') {
      totalSwitches += quantity;
    } else {
      totalOutlets += quantity * item.product.slots;
    }
  });
  
  const totalPoints = totalSwitches + totalOutlets;
  const estimatedCable = calculateCable(totalPoints);
  const estimatedFrames = calculateFrames(items);
  
  return {
    totalSwitches,
    totalOutlets,
    totalPoints,
    estimatedCable,
    estimatedFrames
  };
}
