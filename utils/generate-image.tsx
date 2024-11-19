import html2canvas from 'html2canvas';
import { FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

export function generateImage(
   setStatus: (status: 'idle' | 'printing' | 'success' | 'error') => void
) {
   try {
      const element = document.getElementById('to-image');

      if (element) {
         html2canvas(element, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');

            const link = document.createElement('a');
            link.href = imgData;
            link.download = 'clam-statement.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
         });
         setStatus('success');
         toast.success('Entries printed', {
            icon: <FaCheck color="white" />,
         });
      }
   } catch (error) {
      setStatus('error');

      toast.error('Failed to generate PDF');
   }
}
