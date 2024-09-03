import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chatDate'
})
export class ChatDatePipe implements PipeTransform {

  transform(createdAt: Date): string {
    const date = new Date(createdAt);
    const now = new Date();

    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      // The message is from today
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12; // Convert to 12-hour format
      const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
      return `${formattedHours}:${formattedMinutes} ${ampm}`; // e.g., "9:05 AM"
    }
    else if (diffInDays === 1) {
      return 'Yesterday';
    }
    else {
      // For messages older than yesterday, display date in "MM/DD/YYYY" format
      const options: Intl.DateTimeFormatOptions = { month: '2-digit', day: '2-digit', year: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }
  }
}
