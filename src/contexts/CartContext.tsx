import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, Order, ServiceOption, Payment, PaymentStatus } from '@/types/electrical';
import { useNotifications } from './NotificationContext';
import {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity,
  updateItemOption,
  toggleItemAdditionalOption
} from './cart/cartOperations';
import {
  createOrderFromCart,
  updateOrderInList,
  addPaymentToOrder,
  updatePaymentInOrder,
  formatOrderForDatabase,
  formatOrderForPlanfix,
  parseOrderFromDatabase
} from './cart/orderOperations';
import {
  loadOrdersFromApi,
  saveOrderToApi,
  syncOrderToPlanfix,
  updateOrderStatusInApi,
  assignExecutorInApi
} from './cart/apiService';

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
  assignExecutor: (orderId: string, electricianId: string, electricianName: string) => void;
  addPayment: (orderId: string, payment: Omit<Payment, 'id' | 'createdAt'>) => void;
  updatePaymentStatus: (orderId: string, paymentId: string, status: PaymentStatus) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const notificationsContext = useNotifications();
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('electrical-cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const dbOrders = await loadOrdersFromApi();
        const formattedOrders: Order[] = dbOrders.map(parseOrderFromDatabase);
        setOrders(formattedOrders);
      } catch (err) {
        console.error('Failed to load orders from DB:', err);
        const saved = localStorage.getItem('electrical-orders');
        if (saved) {
          setOrders(JSON.parse(saved));
        }
      }
      setOrdersLoaded(true);
    };

    loadOrders();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('electrical-cart', JSON.stringify(cart));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [cart]);

  useEffect(() => {
    if (ordersLoaded) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('electrical-orders', JSON.stringify(orders));
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [orders, ordersLoaded]);

  const addToCart = (product: Product, quantity = 1, option: ServiceOption = 'install-only', additionalOptions?: string[]) => {
    setCart(prev => addItemToCart(prev, product, quantity, option, additionalOptions));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => removeItemFromCart(prev, productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => updateItemQuantity(prev, productId, quantity));
  };

  const updateOption = (productId: string, option: ServiceOption) => {
    setCart(prev => updateItemOption(prev, productId, option));
  };

  const toggleAdditionalOption = (productId: string, optionId: string) => {
    setCart(prev => toggleItemAdditionalOption(prev, productId, optionId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const createOrder = (orderData: Omit<Order, 'id' | 'items' | 'createdAt' | 'totalSwitches' | 'totalOutlets' | 'totalPoints' | 'estimatedCable' | 'estimatedFrames'>) => {
    const newOrder = createOrderFromCart(cart, orderData);

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    
    const dbOrderData = formatOrderForDatabase(newOrder);
    saveOrderToApi(dbOrderData).catch(err => 
      console.error('DB save failed:', err)
    );
    
    const planfixData = formatOrderForPlanfix(newOrder);
    syncOrderToPlanfix(planfixData).catch(err => 
      console.error('Planfix sync failed:', err)
    );
    
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
    
    setOrders(prev => updateOrderInList(prev, orderId, { status }));
    
    updateOrderStatusInApi(orderId, status).catch(err => 
      console.error('Failed to update order status in DB:', err)
    );
    
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

  const assignExecutor = (orderId: string, electricianId: string, electricianName: string) => {
    setOrders(prev => 
      updateOrderInList(prev, orderId, { 
        assignedTo: electricianId, 
        assignedToName: electricianName 
      })
    );
    
    assignExecutorInApi(orderId, electricianId, electricianName).catch(err => 
      console.error('Failed to assign executor in DB:', err)
    );
    
    if (notificationsContext && electricianId) {
      notificationsContext.addNotification({
        type: 'info',
        orderId: orderId,
        title: 'Исполнитель назначен',
        message: `На заявку #${orderId.slice(-6)} назначен мастер: ${electricianName}`
      });
    }
  };

  const addPayment = (orderId: string, paymentData: Omit<Payment, 'id' | 'createdAt'>) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        return addPaymentToOrder(order, paymentData);
      })
    );

    if (notificationsContext) {
      notificationsContext.addNotification({
        type: 'info',
        orderId: orderId,
        title: 'Платеж добавлен',
        message: `Платеж на сумму ${paymentData.amount.toLocaleString()} ₽ добавлен к заявке #${orderId.slice(-6)}`
      });
    }
  };

  const updatePaymentStatus = (orderId: string, paymentId: string, status: PaymentStatus) => {
    setOrders(prev =>
      prev.map(order => {
        if (order.id !== orderId) return order;
        return updatePaymentInOrder(order, paymentId, status);
      })
    );
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
        updateOrderStatus,
        assignExecutor,
        addPayment,
        updatePaymentStatus
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
