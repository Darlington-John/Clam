export function formatTime(isoString: string) {
   const date = new Date(isoString);

   let hours = date.getHours();
   const minutes = date.getMinutes();
   const ampm = hours >= 12 ? 'PM' : 'AM';

   // Convert 24-hour time to 12-hour time
   hours = hours % 12 || 12; // '0' hour should be '12'

   // Pad minutes to always be two digits
   const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

   return `${hours}:${formattedMinutes} ${ampm}`;
}
