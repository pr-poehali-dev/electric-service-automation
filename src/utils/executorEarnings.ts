import { Order, ExecutorEarnings, ElectricalItem } from '@/types/electrical';

const INSTALLATION_CATEGORIES = [
  'электромонтажные работы',
  'монтаж',
  'установка',
  'прокладка кабеля',
  'штробление',
  'сборка щита',
  'электрика под ключ'
];

export function isInstallationWork(item: ElectricalItem): boolean {
  const itemName = item.name.toLowerCase();
  const itemCategory = (item.category || '').toLowerCase();
  
  return INSTALLATION_CATEGORIES.some(category => 
    itemName.includes(category) || itemCategory.includes(category)
  );
}

export function calculateExecutorEarnings(order: Order): ExecutorEarnings {
  let installationWorkAmount = 0;
  let productAmount = 0;
  
  order.items.forEach(item => {
    const itemTotal = item.price * item.quantity;
    
    if (isInstallationWork(item)) {
      installationWorkAmount += itemTotal;
    } else {
      productAmount += itemTotal;
    }
  });
  
  const installationEarnings = installationWorkAmount * 0.3;
  const productEarnings = productAmount * 0.5;
  const executorEarnings = installationEarnings + productEarnings;
  const totalAmount = installationWorkAmount + productAmount;
  
  return {
    orderId: order.id,
    totalAmount,
    installationWorkAmount,
    productAmount,
    executorEarnings,
    installationEarnings,
    productEarnings
  };
}

export function calculateTotalEarnings(
  orders: Order[],
  executorId: string,
  startDate?: Date,
  endDate?: Date
): {
  totalOrders: number;
  completedOrders: number;
  totalEarnings: number;
  expectedEarnings: number;
  installationEarnings: number;
  productEarnings: number;
} {
  const filteredOrders = orders.filter(order => {
    if (order.assignedTo !== executorId) return false;
    
    if (startDate || endDate) {
      const orderDate = new Date(order.createdAt);
      if (startDate && orderDate < startDate) return false;
      if (endDate && orderDate > endDate) return false;
    }
    
    return true;
  });
  
  let totalEarnings = 0;
  let expectedEarnings = 0;
  let installationEarnings = 0;
  let productEarnings = 0;
  let completedOrders = 0;
  
  filteredOrders.forEach(order => {
    const earnings = calculateExecutorEarnings(order);
    
    if (order.status === 'completed') {
      totalEarnings += earnings.executorEarnings;
      completedOrders++;
    } else if (order.status === 'in-progress' || order.status === 'confirmed') {
      expectedEarnings += earnings.executorEarnings;
    }
    
    installationEarnings += earnings.installationEarnings;
    productEarnings += earnings.productEarnings;
  });
  
  return {
    totalOrders: filteredOrders.length,
    completedOrders,
    totalEarnings,
    expectedEarnings,
    installationEarnings,
    productEarnings
  };
}
