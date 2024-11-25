import Image from 'next/image';
import { useRef, useState } from 'react';
import { useUser } from '~/app/context/auth-context';
import photo from '~/public/icons/photograph.svg';
import danger from '~/public/icons/exclamation.svg';
import loading from '~/public/images/load.svg';
import check from '~/public/icons/check.svg';
import defaultUser from '~/public/icons/default-user.svg';
import folder from '~/public/icons/folder.svg';
import { FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';
const ChangeProfile = (props: any) => {
   const {
      isChangeProfileVisible,
      changeProfile,
      changeProfileRef,
      toggleChangeProfilePopup,
   } = props;
   const { user } = useUser();
   const [error, setError] = useState('');
   const [uploading, setUploading] = useState(false);
   const [profileSaved, setProfileSaved] = useState(false);
   const [file, setFile] = useState<File | null>(null);
   const [imageUrl, setImageUrl] = useState<string | null>(null);
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
         setFile(selectedFile);

         const reader = new FileReader();
         reader.onloadend = () => {
            setImageUrl(reader.result as string);
         };
         reader.readAsDataURL(selectedFile);
      }
   };
   const userId = user?._id;
   const handleUpload = async () => {
      if (uploading) {
         return;
      }
      if (!file || !userId) {
         return;
      }

      setUploading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      try {
         const response = await fetch('/api/upload-profile', {
            method: 'POST',
            body: formData,
         });

         const data = await response.json();
         if (response.ok) {
            setProfileSaved(true);
            toast.success(`Profile photo updated`, {
               icon: <FaCheck color="white" />,
            });
            setTimeout(() => {
               toggleChangeProfilePopup();
               setImageUrl('');
            }, 1000);
         } else {
            setError(data.error || 'An error occured');
         }
      } catch (error) {
         console.error('Upload error:', error);
      } finally {
         setUploading(false);
      }
   };
   const fileInputRef = useRef<HTMLInputElement | null>(null);

   const handleClick = () => {
      if (fileInputRef.current) {
         fileInputRef.current.click();
      }
   };
   return (
      changeProfile && (
         <div
            className={`fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0  `}
         >
            <div
               className={`w-[320px]     pop  duration-300 ease-in-out flex flex-col p-6  gap-4  rounded-2xl bg-white items-center  dark:bg-dark-grey dark:text-white   ${
                  isChangeProfileVisible ? '' : 'pop-hidden'
               }`}
               ref={changeProfileRef}
            >
               <div className="flex flex-col items-center gap-1">
                  <Image src={photo} className="w-10 h-10" alt="" />
                  <h1 className="text-[22px] fancy text-center leading-[28px]">
                     {user.profile
                        ? 'Change profile photo'
                        : 'Upload profile photo'}
                  </h1>
                  <h1 className="text-sm text-grey text-center">
                     {imageUrl
                        ? 'Set this image as your profile image?'
                        : 'Select an image for your profile image'}
                  </h1>
               </div>
               <div className="w-20 h-20 rounded-full overflow-hidden">
                  {imageUrl ? (
                     <div className="w-full h-full relative overflow-hidden rounded-full readingBook">
                        <img
                           src={imageUrl}
                           alt="Selected Profile Preview"
                           className="w-full h-full object-cover"
                        />
                     </div>
                  ) : (
                     <Image
                        src={defaultUser}
                        alt="Current Profile"
                        className="w-full h-full object-cover"
                     />
                  )}
               </div>
               {error && (
                  <div className="w-full flex items-center justify-center gap-2">
                     <div className="bg-pink p-1  rounded-full">
                        <Image src={danger} className="w-3 h-3" alt="" />
                     </div>
                     <h1 className="text-sm text-red  dark:text-pink">
                        {error}
                     </h1>
                  </div>
               )}
               <div className="flex items-center gap-2">
                  <button
                     onClick={imageUrl ? handleUpload : handleClick}
                     disabled={uploading}
                     className="bg-purple text-white px-4 h-[40px]  rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 flex items-center gap-1 norm-mid text-sm w-[146px] justify-center   min-w-[100px]"
                  >
                     <Image
                        className={uploading ? 'w-8' : 'w-5'}
                        src={uploading ? loading : imageUrl ? check : folder}
                        alt=""
                     />
                     <span>
                        {profileSaved
                           ? 'Saved'
                           : uploading
                           ? null
                           : imageUrl
                           ? 'Set as Profile'
                           : 'Select Image'}
                     </span>
                  </button>
                  <input
                     type="file"
                     accept="image/*"
                     onChange={handleFileChange}
                     ref={fileInputRef}
                     className="hidden"
                  />
                  <button
                     onClick={() => {
                        setImageUrl('');
                        toggleChangeProfilePopup();
                     }}
                     className="bg-lightPurple  text-purple px-4 h-[40px] rounded-full hover:ring hover:ring-offset-1  ring-purple duration-300 norm-mid text-sm  dark:bg-dark-purple dark:text-white   "
                  >
                     Cancel
                  </button>
               </div>
            </div>
         </div>
      )
   );
};

export default ChangeProfile;
