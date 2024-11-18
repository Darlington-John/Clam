'use client';
import { useEffect } from 'react';
import { useRef } from 'react';
import Sidebar from './sidebar/sidebar';
const Overlay = () => {
   const ref = useRef<any>(null);
   const toggleOverlay = () => {
      const overlayElement = document.getElementById('myOverlay');
      if (!overlayElement) {
         return;
      }

      if (overlayElement.style.width === '100%') {
         overlayElement.style.width = '0%';
      }
   };

   useEffect(() => {
      const handleClickOutside = (event: any) => {
         if (ref.current && !ref.current.contains(event.target)) {
            toggleOverlay();
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, []);
   return (
      <div
         className={`hidden  fixed  z-40 top-o  left-0   ease-out duration-[0.2s]    overflow-hidden  h-full    lg:flex   items-start backdrop-brightness-[.6]  `}
         id="myOverlay"
      >
         <div className="flex flex-col bg-white h-full  relative" ref={ref}>
            <Sidebar />
         </div>
      </div>
   );
};

export default Overlay;
