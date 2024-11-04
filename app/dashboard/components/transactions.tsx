import Image from 'next/image';
import empty from '~/public/images/empty.svg';
const Transactions = () => {
     return (
          <section className="flex  items-start gap-4  flex-col  ">
               <h1 className="text-[22px] text-black  fancy">
                    More Recent transactions
               </h1>
               <div className="flex items-center gap-4 w-full  rounded-lg border border-[#DFDDE3]  p-4 justify-center  h-[320px]">
                    <div className="flex items-center gap-3 flex-col">
                         <Image src={empty} alt="" className="w-20 h-20" />
                         <h1 className="text-[17px] sm:text-base text-black">
                              No entries yet
                         </h1>
                         <p className="text-sm text-grey leading-[20px] text-center">
                              Your most recent entries <br />
                              will show up here.
                         </p>
                    </div>
               </div>
          </section>
     );
};

export default Transactions;
