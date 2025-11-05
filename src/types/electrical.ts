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

export type ServiceOption = 'install-only' | 'full-wiring' | 'repair';

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

export type PaymentStatus = 'unpaid' | 'partially_paid' | 'paid' | 'refunded' | 'pending';

export type PaymentMethod = 'cash' | 'card' | 'bank_transfer' | 'yookassa' | 'tinkoff' | 'sberbank';

export interface Payment {
  id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: number;
  confirmedAt?: number;
  externalId?: string;
  receiptUrl?: string;
  description?: string;
}

export interface GoogleCalendarEvent {
  id: string;
  orderId: string;
  eventId: string;
  summary: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  status: 'confirmed' | 'tentative' | 'cancelled';
  createdAt: number;
  updatedAt: number;
}

export interface GoogleKeepNote {
  id: string;
  orderId: string;
  noteId: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface GoogleIntegrationSettings {
  calendarEnabled: boolean;
  keepEnabled: boolean;
  autoSyncCalendar: boolean;
  autoSyncKeep: boolean;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiry?: number;
}

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
  assignedTo?: string;
  assignedToName?: string;
  totalAmount?: number;
  paymentStatus?: PaymentStatus;
  payments?: Payment[];
  paidAmount?: number;
  googleCalendarEventId?: string;
  googleKeepNoteId?: string;
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
    id: 'chandelier-1',
    type: 'chandelier',
    name: 'Люстра',
    image: 'https://cdn.poehali.dev/files/chandelier.jpg',
    description: 'Установка люстры',
    category: 'chandelier',
    serviceCategory: 'popular',
    installType: 'finish',
    slots: 0,
    priceInstallOnly: 1000,
    priceWithWiring: 1000,
    options: [
      {
        id: 'dismantle',
        name: 'Демонтаж люстры',
        price: 500
      },
      {
        id: 'assemble',
        name: 'Сборка люстры',
        price: 500
      }
    ]
  },
  {
    id: 'sw-1',
    type: 'switch-single',
    name: 'Установить выключатель',
    image: 'https://cdn.poehali.dev/files/switch-single.jpg',
    description: 'Установка выключателя',
    category: 'switch',
    serviceCategory: 'popular',
    installType: 'finish',
    slots: 1,
    priceInstallOnly: 250,
    priceWithWiring: 1500
  },
  {
    id: 'out-1',
    type: 'outlet-single',
    name: 'Установить розетку',
    image: 'https://cdn.poehali.dev/files/outlet-single.jpg',
    description: 'Черновые работы со штроблением, сверлением и установкой подрозетника',
    category: 'outlet',
    serviceCategory: 'popular',
    installType: 'finish',
    slots: 1,
    priceInstallOnly: 250,
    priceWithWiring: 850,
    options: [
      {
        id: 'block-2',
        name: 'Блок из 2-х розеток',
        price: 1200
      },
      {
        id: 'block-3',
        name: 'Блок из 3-х розеток',
        price: 2500
      },
      {
        id: 'block-4',
        name: 'Блок из 4-х розеток',
        price: 3000
      },
      {
        id: 'block-5',
        name: 'Блок из 5 розеток',
        price: 3500
      }
    ]
  },

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

export function calculateCable(totalFrames: number): number {
  return Math.ceil(totalFrames * 8);
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
  const estimatedFrames = calculateFrames(items) || 0;
  const estimatedCable = calculateCable(estimatedFrames) || 0;
  
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
  
  const hasInstall = item.additionalOptions?.includes('install') || item.selectedOption === 'install-only';
  const hasWiring = item.additionalOptions?.includes('wiring') || item.selectedOption === 'full-wiring';
  
  if (hasInstall && hasWiring) {
    basePrice = item.product.priceInstallOnly + item.product.priceWithWiring;
  } else if (hasInstall) {
    basePrice = item.product.priceInstallOnly;
  } else if (hasWiring) {
    basePrice = item.product.priceWithWiring;
  } else if (item.selectedOption === 'install-only') {
    basePrice = item.product.priceInstallOnly;
  } else if (item.selectedOption === 'full-wiring') {
    basePrice = item.product.priceWithWiring;
  }
  
  let optionsPrice = 0;
  if (item.additionalOptions && item.product.options) {
    item.additionalOptions.forEach(optionId => {
      if (optionId !== 'install' && optionId !== 'wiring') {
        const option = item.product.options?.find(o => o.id === optionId);
        if (option) {
          optionsPrice += option.price;
        }
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