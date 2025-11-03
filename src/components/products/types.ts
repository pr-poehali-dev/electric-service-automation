export interface ServiceOption {
  id: string;
  name: string;
  price: number;
  quantity: number;
  enabled: boolean;
  description?: string;
  unit?: string;
  group?: 'construction' | 'panel';
  discount?: {
    minQuantity: number;
    percent: number;
  };
  customPrice?: boolean;
}

export interface ServiceContainer {
  productId: string;
  productName: string;
  productDescription: string;
  category: string;
  sectionCategory: 'services' | 'wiring';
  options: ServiceOption[];
  expanded: boolean;
}