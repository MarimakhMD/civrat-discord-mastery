import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function DashboardLayout() {
  return (
    <div className="flex h-screen bg-dark-900 text-white overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:pl-0 min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto pt-20 pb-8">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"><Outlet /></div>
        </main>
      </div>
    </div>
  );
}
