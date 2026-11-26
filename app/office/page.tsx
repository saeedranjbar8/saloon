import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/src/modules/auth/session';
export default async function OfficePage(){const user=await getCurrentUser();if(!user)redirect('/login');if(user.role!=='sports_administration')redirect('/unauthorized');return <main className="shell"><header><div className="brand">سالون <small>پنل ادارهٔ ورزش</small></div><a href="/api/auth/logout">خروج</a></header><section className="panel"><h1>داشبورد ادارهٔ ورزش</h1><p>خوش آمدی، {user.name}. این بخش فقط برای ادارهٔ ورزش در دسترس است.</p></section></main>}
