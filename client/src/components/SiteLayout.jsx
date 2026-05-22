import { Outlet } from 'react-router-dom';
import Footer from './Footer';

export default function SiteLayout() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-resuem-bg">
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
