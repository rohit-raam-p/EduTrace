import PublicNav from '@/components/PublicNav';
import Footer from '@/components/Footer';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicNav />
      <main style={{ paddingTop: '64px' }}>{children}</main>
      <Footer />
    </>
  );
}
