const today = new Date();
const options: any = { year: 'numeric', month: 'short' };
export const formattedDate = today
     .toLocaleDateString('en-US', options)
     .toUpperCase();

export function formatDate(isoString: string): string {
     const date = new Date(isoString);
     const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
     };
     return new Intl.DateTimeFormat('en-US', options).format(date);
}
