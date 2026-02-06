import { Product } from "./types";

export const calculateDeliveryRange = (product: Product) => {
  const today = new Date();
  
  let minDays = 0;
  let maxDays = 0;

  if (product.availability === 'READY TO SHIP') {
    minDays = 8;
    maxDays = 10;
  } else {
    // MADE TO ORDER
    minDays = 25;
    maxDays = 28;
  }

  const minDate = new Date(today);
  minDate.setDate(today.getDate() + minDays);

  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDays);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return {
    estimatedRange: `${formatDate(minDate)} - ${formatDate(maxDate)}`,
    minDate,
    maxDate
  };
};