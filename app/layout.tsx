import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'سالون | ورزش بافق',description:'رزرو مجموعه‌های ورزشی بافق'};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="fa" dir="rtl"><body>{children}</body></html>; }
