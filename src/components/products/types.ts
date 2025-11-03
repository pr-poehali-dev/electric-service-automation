export interface ServiceOption {
  id: string;
  name: string;
  price: number;
  quantity: number;
  enabled: boolean;
  description?: string;
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
