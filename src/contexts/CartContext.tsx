import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, Order, calculateTotals, ServiceOption, MASTER_VISIT_ID, PRODUCTS } from '@/types/electrical';
import { useNotifications } from './NotificationContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, option?: ServiceOption, additionalOptions?: string[]) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateOption: (productId: string, option: ServiceOption) => void;
  toggleAdditionalOption: (productId: string, optionId: string) => void;
  clearCart: () => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'items' | 'createdAt' | 'totalSwitches' | 'totalOutlets' | 'totalPoints' | 'estimatedCable' | 'estimatedFrames'>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const notificationsContext = useNotifications();
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('electrical-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('electrical-orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('electrical-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('electrical-orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (product: Product, quantity = 1, option: ServiceOption = 'install-only', additionalOptions?: string[]) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      
      let updatedCart = prev;
      
      if (existing) {
        updatedCart = prev.map(item =>
          item.product.id === product.id
            ? { 
                ...item, 
                quantity: item.quantity + quantity,
                additionalOptions: additionalOptions || item.additionalOptions
              }
            : item
        );
      } else {
        const initialOptions: string[] = additionalOptions || [];
        updatedCart = [...prev, { product, quantity, selectedOption: option, additionalOptions: initialOptions }];
      }
      
      // Автоматически добавляем выезд мастера, если его нет и это не сам выезд мастера
      if (product.id !== MASTER_VISIT_ID && !updatedCart.find(item => item.product.id === MASTER_VISIT_ID)) {
        const masterVisitProduct = PRODUCTS.find(p => p.id === MASTER_VISIT_ID);
        if (masterVisitProduct) {
          updatedCart = [...updatedCart, { product: masterVisitProduct, quantity: 1, selectedOption: 'install-only', additionalOptions: [] }];
        }
      }
      
      return updatedCart;
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => {
      // Если удаляется блок розеток с опцией install-blocks, удаляем и Электроустановку
      const item = prev.find(i => i.product.id === productId);
      if (item && item.product.id.includes('block-') && item.additionalOptions?.includes('install-blocks')) {
        const electricalInstallId = `${productId}-electrical-install`;
        return prev.filter(i => i.product.id !== productId && i.product.id !== electricalInstallId);
      }
      
      return prev.filter(item => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => {
      let updatedCart = prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );

      // Если это блок розеток с опцией install-blocks, обновляем количество Электроустановки
      const item = updatedCart.find(i => i.product.id === productId);
      if (item && item.product.id.includes('block-') && item.additionalOptions?.includes('install-blocks')) {
        let outletsCount = 1;
        if (item.product.id.includes('block-2')) outletsCount = 2;
        else if (item.product.id.includes('block-3')) outletsCount = 3;
        else if (item.product.id.includes('block-4')) outletsCount = 4;
        else if (item.product.id.includes('block-5')) outletsCount = 5;

        const totalOutlets = outletsCount * quantity;
        const electricalInstallId = `${productId}-electrical-install`;

        updatedCart = updatedCart.map(i => 
          i.product.id === electricalInstallId 
            ? { ...i, quantity: totalOutlets }
            : i
        );
      }

      return updatedCart;
    });
  };

  const updateOption = (productId: string, option: ServiceOption) => {
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, selectedOption: option } : item
      )
    );
  };

  const toggleAdditionalOption = (productId: string, optionId: string) => {
    setCart(prev => {
      let updatedCart = prev.map(item => {
        if (item.product.id === productId) {
          const options = item.additionalOptions || [];
          if (options.includes(optionId)) {
            return { ...item, additionalOptions: options.filter(id => id !== optionId) };
          } else {
            return { ...item, additionalOptions: [...options, optionId] };
          }
        }
        return item;
      });

      // Если включается опция "install-blocks" для блока розеток
      if (optionId === 'install-blocks' && !prev.find(i => i.product.id === productId)?.additionalOptions?.includes(optionId)) {
        const item = updatedCart.find(i => i.product.id === productId);
        if (item && item.product.id.includes('block-')) {
          // Подсчитываем количество розеток в блоке
          let outletsCount = 1;
          if (item.product.id.includes('block-2')) outletsCount = 2;
          else if (item.product.id.includes('block-3')) outletsCount = 3;
          else if (item.product.id.includes('block-4')) outletsCount = 4;
          else if (item.product.id.includes('block-5')) outletsCount = 5;

          const totalOutlets = outletsCount * item.quantity;

          // Создаем или обновляем Электроустановку
          const electricalInstallId = `${productId}-electrical-install`;
          const existingInstall = updatedCart.find(i => i.product.id === electricalInstallId);
          
          if (existingInstall) {
            updatedCart = updatedCart.map(i => 
              i.product.id === electricalInstallId 
                ? { ...i, quantity: totalOutlets }
                : i
            );
          } else {
            const baseProduct = PRODUCTS.find(p => p.id === 'chandelier-1');
            if (baseProduct) {
              const virtualProduct: Product = {
                ...baseProduct,
                id: electricalInstallId,
                name: 'Электроустановка',
                description: 'Установка розеток/выключателей',
                priceInstallOnly: 250,
                priceWithWiring: 250,
                options: []
              };
              updatedCart = [...updatedCart, { 
                product: virtualProduct, 
                quantity: totalOutlets, 
                selectedOption: 'install-only',
                additionalOptions: []
              }];
            }
          }
        }
      }

      // Если отключается опция "install-blocks", удаляем Электроустановку
      if (optionId === 'install-blocks' && prev.find(i => i.product.id === productId)?.additionalOptions?.includes(optionId)) {
        const electricalInstallId = `${productId}-electrical-install`;
        updatedCart = updatedCart.filter(i => i.product.id !== electricalInstallId);
      }

      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'items' | 'createdAt' | 'totalSwitches' | 'totalOutlets' | 'totalPoints' | 'estimatedCable' | 'estimatedFrames'>) => {
    const totals = calculateTotals(cart);
    
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,
      items: [...cart],
      createdAt: Date.now(),
      ...totals
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    
    // Отправка уведомления о новой заявке
    if (notificationsContext) {
      notificationsContext.addNotification({
        type: 'new_order',
        orderId: newOrder.id,
        title: 'Заявка создана',
        message: `Заявка #${newOrder.id.slice(-6)} успешно создана и отправлена на обработку`
      });
    }
    
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const statusMessages = {
      'pending': 'ожидает подтверждения',
      'confirmed': 'подтверждена и принята в работу',
      'in-progress': 'начата, мастер приступил к работе',
      'completed': 'завершена'
    };
    
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    
    // Отправка уведомления об изменении статуса
    if (notificationsContext) {
      notificationsContext.addNotification({
        type: 'status_change',
        orderId: orderId,
        newStatus: status,
        title: 'Статус заявки изменен',
        message: `Заявка #${orderId.slice(-6)} ${statusMessages[status] || 'обновлена'}`
      });
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateOption,
        toggleAdditionalOption,
        clearCart,
        orders,
        createOrder,
        updateOrderStatus
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}