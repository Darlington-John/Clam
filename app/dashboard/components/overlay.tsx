'use client';
import Sidebar from './sidebar';
const Overlay = () => {
     return (
          <div
               className={`hidden  fixed  z-40 top-o  left-0   ease-out duration-[0.2s]    overflow-hidden  h-full    lg:flex   items-start backdrop-brightness-[.6]  `}
               id="myOverlay"
          >
               <div className="flex flex-col bg-white h-full  relative">
                    <Sidebar />
               </div>
          </div>
     );
};

export default Overlay;
