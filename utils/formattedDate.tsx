const today = new Date();
const options: any = { year: 'numeric', month: 'short' };
export const formattedDate = today
   .toLocaleDateString('en-US', options)
   .toUpperCase();
export function formatDate(isoString: string): string {
   try {
      if (!isoString) throw new Error('Invalid ISO string');

      const date = new Date(isoString);

      if (isNaN(date.getTime())) throw new Error('Invalid date');

      const options: Intl.DateTimeFormatOptions = {
         year: 'numeric',
         month: 'short',
         day: 'numeric',
      };

      return new Intl.DateTimeFormat('en-US', options).format(date);
   } catch (error) {
      return 'Invalid Date';
   }
}
