import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { PRODUCTS, CartItem } from '@/types/electrical';
import { ServiceContainer } from './types';
import { getInitialContainers } from './initialContainers';

export function useProductsLogic() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [containers, setContainers] = useState<ServiceContainer[]>(getInitialContainers());

  const toggleContainer = (containerIndex: number) => {
    setContainers(prev => prev.map((container, idx) => 
      idx === containerIndex ? { ...container, expanded: !container.expanded } : container
    ));
  };

  const toggleOption = (containerIndex: number, optionId: string) => {
    setContainers(prev => prev.map((container, idx) => {
      if (idx === containerIndex) {
        return {
          ...container,
          options: container.options.map(opt => 
            opt.id === optionId ? { ...opt, enabled: !opt.enabled } : opt
          )
        };
      }
      return container;
    }));
  };

  const updateOptionQuantity = (containerIndex: number, optionId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setContainers(prev => prev.map((container, idx) => {
      if (idx === containerIndex) {
        return {
          ...container,
          options: container.options.map(opt => 
            opt.id === optionId ? { ...opt, quantity: newQuantity } : opt
          )
        };
      }
      return container;
    }));
  };

  const calculateContainerTotal = (container: ServiceContainer) => {
    return container.options
      .filter(opt => opt.enabled && !opt.customPrice)
      .reduce((sum, opt) => {
        let price = opt.price * opt.quantity;
        
        if (opt.discount && opt.quantity >= opt.discount.minQuantity) {
          price = price * (1 - opt.discount.percent / 100);
        }
        
        return sum + price;
      }, 0);
  };

  const calculateGrandTotal = () => {
    return containers.reduce((sum, container) => sum + calculateContainerTotal(container), 0);
  };

  const handleAddToCart = () => {
    containers.forEach(container => {
      container.options.forEach(option => {
        if (option.enabled && !option.customPrice) {
          let product = PRODUCTS.find(p => p.id === container.productId);
          
          if (!product) {
            product = PRODUCTS.find(p => p.id === 'chandelier-1');
          }
          
          if (product) {
            let finalPrice = option.price;
            
            if (option.discount && option.quantity >= option.discount.minQuantity) {
              finalPrice = finalPrice * (1 - option.discount.percent / 100);
            }
            
            if (option.id.startsWith('block-') || option.id === 'add-outlet' || option.id === 'move-switch' || option.id === 'move-switch-alt' || 
                option.id === 'cable-10m' || option.id === 'cable-corrugated' || option.id === 'breaker-install' || 
                option.id === 'breaker-replace' || option.id === 'meter-230v' || option.id === 'meter-380v' || 
                option.id === 'box-surface' || option.id === 'box-flush') {
              const virtualProduct: typeof product = {
                ...product,
                id: `${container.productId}-${option.id}`,
                name: option.name,
                description: option.name,
                priceInstallOnly: finalPrice,
                priceWithWiring: finalPrice
              };
              addToCart(virtualProduct, option.quantity, 'full-wiring');
            } else if (option.id === 'install' || option.id === 'crystal') {
              const virtualProduct: typeof product = {
                ...product,
                id: `${container.productId}-${option.id}`,
                name: option.name,
                description: option.name,
                priceInstallOnly: finalPrice,
                priceWithWiring: finalPrice
              };
              addToCart(virtualProduct, option.quantity, 'install-only');
            } else if (option.id === 'repair' || option.id === 'surface-outlet' || option.id === 'gas-sensor') {
              const virtualProduct: typeof product = {
                ...product,
                id: `${container.productId}-${option.id}`,
                name: option.name,
                description: option.name,
                priceInstallOnly: finalPrice,
                priceWithWiring: finalPrice
              };
              addToCart(virtualProduct, option.quantity, 'full-wiring');
            } else if (option.id === 'dismantle' || option.id === 'assemble') {
              addToCart(product, option.quantity, 'install-only', [option.id]);
            } else {
              addToCart(product, option.quantity);
            }
          }
        }
      });
    });
    navigate('/cart');
  };

  const hasAnyEnabledOptions = containers.some(container => 
    container.options.some(opt => opt.enabled)
  );

  const servicesContainers = containers.filter(c => c.sectionCategory === 'services');
  const wiringContainers = containers.filter(c => c.sectionCategory === 'wiring');

  return {
    containers,
    servicesContainers,
    wiringContainers,
    toggleContainer,
    toggleOption,
    updateOptionQuantity,
    calculateContainerTotal,
    calculateGrandTotal,
    handleAddToCart,
    hasAnyEnabledOptions
  };
}