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
      .filter(opt => opt.enabled)
      .reduce((sum, opt) => sum + opt.price * opt.quantity, 0);
  };

  const calculateGrandTotal = () => {
    return containers.reduce((sum, container) => sum + calculateContainerTotal(container), 0);
  };

  const handleAddToCart = () => {
    containers.forEach(container => {
      container.options.forEach(option => {
        if (option.enabled) {
          let product = PRODUCTS.find(p => p.id === container.productId);
          
          if (!product) {
            product = PRODUCTS.find(p => p.id === 'chandelier-1');
          }
          
          if (product) {
            if (option.id.startsWith('block-') || option.id === 'add-outlet' || option.id === 'move-switch' || option.id === 'move-switch-alt') {
              const virtualProduct: typeof product = {
                ...product,
                id: `${container.productId}-${option.id}`,
                name: option.name,
                description: option.name,
                priceInstallOnly: option.price,
                priceWithWiring: option.price
              };
              addToCart(virtualProduct, option.quantity, 'full-wiring');
            } else if (option.id === 'install') {
              const virtualProduct: typeof product = {
                ...product,
                id: `${container.productId}-install`,
                name: option.name,
                description: option.name,
                priceInstallOnly: option.price,
                priceWithWiring: option.price
              };
              addToCart(virtualProduct, option.quantity, 'install-only');
            } else if (option.id === 'repair') {
              const virtualProduct: typeof product = {
                ...product,
                id: `${container.productId}-repair`,
                name: option.name,
                description: option.name,
                priceInstallOnly: option.price,
                priceWithWiring: option.price
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