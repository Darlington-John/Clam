import Image from 'next/image';
import logo from '~/public/images/Logo.png';
import home from '~/public/icons/home.svg';
import book from '~/public/icons/book-open-.svg';
import { toggleOverlay } from './header';
import xmark from '~/public/icons/xgrey.svg';
import { useUser } from '~/app/context/auth-context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const Sidebar = ({ hidden }: any) => {
     const { user } = useUser();

     const linkname = usePathname();
     return (
          <section
               className={`h-full w-[260px] px-6 pt-10 pb-5 flex flex-col gap-6 items-start shrink-0  xl:w-[200px] xl:pt-5 xl:px-2  bg-white lg:w-[260px]    ${
                    hidden && 'lg:hidden'
               }`}
          >
               <div className="flex  items-center justify-between  w-full">
                    <Image
                         src={logo}
                         alt=""
                         className="w-[110px] xl:w-[90px] shrink-0"
                    />
                    <button
                         onClick={toggleOverlay}
                         className="shrink-0 p-1 bg-lightPurple  text-black w-8  h-8  rounded-full flex items-center justify-center  hidden lg:flex "
                    >
                         <Image src={xmark} alt="" />
                    </button>
               </div>
               <h1 className="text-grey text-sm">YOUR BOOKS</h1>
               <div className="h-full  w-full flex flex-col gap-2">
                    <Link
                         href={'/dashboard'}
                         className={`  rounded-lg py-2 px-3 text-[22px] fancy flex items-center  gap-2  w-full xl:text-xl  ${
                              linkname === '/dashboard' && ' bg-[#F1F1F4]'
                         }`}
                    >
                         <Image src={home} alt="" className="w-5 h-5  " />
                         <span>Overview</span>
                    </Link>
                    {user?.books?.map((book: any) => (
                         <Link
                              href={`/dashboard/books/${book._id}`}
                              className={`  rounded-lg py-2 px-3 text-[22px] fancy flex items-center  gap-2  w-full xl:text-xl  ${
                                   linkname ===
                                        `/dashboard/books/${book._id}` &&
                                   ' bg-[#F1F1F4]'
                              }`}
                              key={book._id}
                         >
                              <Image src={home} alt="" className="w-5 h-5  " />
                              <span className="line-clamp-1">{book.name}</span>
                         </Link>
                    ))}
               </div>
               <button className="bg-purple text-white flex items-center   h-[32px] text-sm  norm-mid    gap-2  shrink-0  w-auto py-2 px-3 rounded-full ">
                    <Image src={book} alt="" className="w-5 h-5" />
                    <span>New Book</span>
               </button>
          </section>
     );
};

export default Sidebar;
