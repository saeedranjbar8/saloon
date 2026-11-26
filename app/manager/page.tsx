import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/src/modules/auth/session';
export default async function ManagerPage(){const user=await getCurrentUser();if(!user)redirect('/login');if(user.role!=='facility_manager')redirect('/unauthorized');return <main className="shell"><header><div className="brand">سالون <small>پنل مدیر مجموعه</small></div><a href="/api/auth/logout">خروج</a></header><section className="panel"><h1>پنل مدیر مجموعه</h1><p>خوش آمدی، {user.name}. این بخش فقط برای مدیر مجموعه در دسترس است.</p><Link href="/">رفتن به فهرست مجموعه‌ها</Link></section></main>}

