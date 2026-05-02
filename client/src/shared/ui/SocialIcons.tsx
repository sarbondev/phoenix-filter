import type { SVGProps } from "react";

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M13.5 22v-9h3l.5-3.5h-3.5V7c0-1 .5-2 2-2H17V2.2C16.5 2.1 15.4 2 14.3 2 11.9 2 10.5 3.5 10.5 6v3.5H7V13h3.5v9h3z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TelegramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M21.7 4.3c-.3-.3-.7-.4-1.1-.3L3 11.2c-.5.2-.8.6-.8 1.1 0 .5.3.9.8 1.1l4 1.5 1.5 4.7c.1.4.5.7.9.7.3 0 .5-.1.7-.3l2.4-2.5 4.6 3.4c.2.1.4.2.6.2.1 0 .3 0 .4-.1.3-.1.5-.4.6-.7L22 5.4c.1-.4 0-.8-.3-1.1zM9.3 14.3l-.4 3.7-1.1-3.5 8.8-6.7-7.3 6.5z" />
    </svg>
  );
}
