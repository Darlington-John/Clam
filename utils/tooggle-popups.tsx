'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

// Custom hook for managing popups
export const usePopup = () => {
   const [isVisible, setIsVisible] = useState(false);
   const [isActive, setIsActive] = useState(false);
   const ref = useRef<any>(null);

   const togglePopup = useCallback(() => {
      if (!isActive) {
         setIsActive(true);
         setIsVisible(true);
      } else {
         setIsVisible(false);
         setTimeout(() => setIsActive(false), 500);
      }
   }, [isActive]);
   const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
         setIsVisible(false);
         setTimeout(() => setIsActive(false), 500);
      }
   };

   useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, []);

   return {
      isVisible,
      isActive,
      ref,
      togglePopup,
      setIsVisible,
      setIsActive,
   };
};
