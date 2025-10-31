import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, Order, calculateTotals, ServiceOption, MASTER_VISIT_ID, PRODUCTS } from '@/types/electrical';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, option?: ServiceOption) => void;
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

  const addToCart = (product: Product, quantity = 1, option: ServiceOption = 'install-only') => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      
      let updatedCart = prev;
      
      if (existing) {
        updatedCart = prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...prev, { product, quantity, selectedOption: option, additionalOptions: [] }];
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
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const updateOption = (productId: string, option: ServiceOption) => {
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, selectedOption: option } : item
      )
    );
  };

  const toggleAdditionalOption = (productId: string, optionId: string) => {
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const options = item.additionalOptions || [];
          if (options.includes(optionId)) {
            return { ...item, additionalOptions: options.filter(id => id !== optionId) };
          } else {
            return { ...item, additionalOptions: [...options, optionId] };
          }
        }
        return item;
      })
    );
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
    
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
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