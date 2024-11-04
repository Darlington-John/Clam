import Image from 'next/image';
import sparkles from '~/public/icons/sparkles.svg';
import avatar from '~/public/images/blueMain4.png';
import down from '~/public/icons/chevron-down.svg';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import x from '~/public/icons/xgrey.svg';
import bars from '~/public/icons/menu-alt.svg';
import { useDashboard } from '~/app/context/dashboard-context';
import { useUser } from '~/app/context/auth-context';
const Header = () => {
     const { isOverlayOpen, setIsOverlayOpen } = useDashboard();
     const linkname = usePathname();
     const [icon, setIcon] = useState(bars);

     useEffect(() => {
          const overlayElement = document.getElementById('myOverlay');
          if (!overlayElement) {
               return;
          }
          overlayElement.style.width = '0%';
          setIsOverlayOpen(false);
          setIcon(bars);
     }, [linkname, setIsOverlayOpen]);
     const handleToggleOverlay = () => {
          toggleOverlay();
          setIsOverlayOpen(!isOverlayOpen);
     };
     const { user } = useUser();
     return (
          <header className="flex items-center justify-between  w-full py-3 px-6  xl:px-3 sticky top-0 bg-lightestGrey z-20 ">
               <Image
                    src={icon}
                    alt=""
                    className="hidden w-6 lg:flex  "
                    onClick={handleToggleOverlay}
               />

               <div className="text-sm  flex gap-2 items-center  py-1 px-2 rounded-full bg-white ">
                    <Image
                         src={avatar}
                         className="w-6 h-6 object-cover rounded-full "
                         alt=""
                    />
                    <h1>{user?.email}</h1>
                    <Image
                         src={down}
                         className="w-5 h-5 object-cover rounded-full "
                         alt=""
                    />
               </div>
               <button className="flex items-center gap-2 px-3 py-2 norm-mid  text-purple xl:text-sm">
                    <Image className="" src={sparkles} alt="" />
                    <span className="sm:hidden">Assistant</span>
               </button>
          </header>
     );
};

export default Header;

export const toggleOverlay = () => {
     const overlayElement = document.getElementById('myOverlay');
     if (!overlayElement) {
          return;
     }

     if (overlayElement.style.width === '100%') {
          overlayElement.style.width = '0%';
     } else {
          overlayElement.style.width = '100%';
     }
};
