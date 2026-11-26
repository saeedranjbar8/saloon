import Link from 'next/link';
export default function Unauthorized(){return <main className="loginShell"><section className="panel"><h1>دسترسی مجاز نیست</h1><p>این صفحه برای نقش حساب شما نیست.</p><Link href="/">بازگشت</Link></section></main>}
