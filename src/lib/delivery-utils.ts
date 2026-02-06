import { Product } from "./types";

export const calculateDeliveryRange = (
  product: { availability?: string } | Product, 
  startDate: Date = new Date()
) => {
  const start = new Date(startDate);
  
  let minDays = 0;
  let maxDays = 0;

  if (product.availability === 'READY TO SHIP' || product.availability === 'In Stock') {
    minDays = 8;
    maxDays = 10;
  } else {
    // MADE TO ORDER
    minDays = 25;
    maxDays = 28;
  }

  const minDate = new Date(start);
  minDate.setDate(start.getDate() + minDays);

  const maxDate = new Date(start);
  maxDate.setDate(start.getDate() + maxDays);

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