"use client";

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"
      />
    </svg>
);

export function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname() || ""; 

  // LOGIC:
  // 1. Gold Pages -> Gold WhatsApp
  // 2. Silver Pages (which include /silver AND /category) -> Silver WhatsApp
  // 3. Everything else -> Default (Silver) WhatsApp

  const isGoldPage = pathname.startsWith('/gold');
  
  // Checks if the user is on a "Silver" related page
  const isSilverPage = pathname.startsWith('/silver') || pathname.startsWith('/category');

  let whatsappLink = "https://wa.link/4i25z5"; // Default to Silver Link
  let buttonColorClass = "bg-green-500 hover:bg-green-600";
  let labelText = "Contact Us";

  if (isGoldPage) {
    whatsappLink = "https://wa.link/j4sszv";
    buttonColorClass = "bg-green-500 hover:bg-green-600"; // Gold Color
    labelText = "Gold Inquiry";
  } else {
    // This covers Home, Silver, and Category pages
    whatsappLink = "https://wa.link/4i25z5";
    buttonColorClass = "bg-green-500 hover:bg-green-600";
    labelText = "Contact Us";
  }

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        className={`flex items-center gap-3 text-white rounded-full p-3 shadow-lg transition-colors ${buttonColorClass}`}
      >
        <WhatsAppIcon className="h-7 w-7" />
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ width: 0, opacity: 0, marginRight: 0 }}
              animate={{ width: 'auto', opacity: 1, marginRight: '0.5rem' }}
              exit={{ width: 0, opacity: 0, marginRight: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="font-semibold text-sm whitespace-nowrap overflow-hidden"
            >
              {labelText}
            </motion.span>
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}