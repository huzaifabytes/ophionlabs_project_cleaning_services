import React from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { 
  useGetAuthMe,
  useAdminLogout,
  getGetAuthMeQueryKey,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  LayoutDashboard, 
  Images, 
  Sparkles, 
  Star, 
  MessageSquare, 
  Users, 
  FileText, 
  Settings,
  LogOut,
  Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

import Dashboard from './Dashboard';
import CarouselManager from './Carousel';
import ServicesManager from './Services';
import ReviewsManager from './Reviews';
import ContactManager from './Contact';
import TeamManager from './Team';
import AboutManager from './About';
import SettingsManager from './Settings';
import SheetsConfig from './Sheets';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/carousel', label: 'Hero Slides', icon: Images },
  { href: '/admin/services', label: 'Services', icon: Sparkles },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/contact', label: 'Submissions', icon: MessageSquare },
  { href: '/admin/team', label: 'Team', icon: Users },
  { href: '/admin/about', label: 'About Text', icon: FileText },
  { href: '/admin/sheets', label: 'Google Sheets', icon: Database },
  { href: '/admin/settings', label: 'Site Settings', icon: Settings },
];

export default function AdminLayout() {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: user, isError, isLoading } = useGetAuthMe({
    query: {
      queryKey: getGetAuthMeQueryKey(),
      retry: false,
    }
  });
  
  const logout = useAdminLogout();

  React.useEffect(() => {
    if (isError) {
      setLocation('/admin/login');
    }
  }, [isError, setLocation]);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        setLocation('/admin/login');
      }
    });
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-secondary text-white md:min-h-screen flex flex-col shadow-xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Clean<span className="text-primary">Pro</span>
          </h2>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">Admin Panel</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || location.startsWith(item.href + '/');
            return (
              <button
                key={item.href}
                onClick={() => setLocation(item.href)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="px-4 py-3 text-sm text-gray-400 mb-2">
            Logged in as <strong className="text-white">{user.username}</strong>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 max-w-[100vw] overflow-x-hidden md:max-w-none">
        <div className="p-6 md:p-8 lg:p-10 max-w-7xl mx-auto">
          <Switch>
            <Route path="/admin/dashboard" component={Dashboard} />
            <Route path="/admin/carousel" component={CarouselManager} />
            <Route path="/admin/services" component={ServicesManager} />
            <Route path="/admin/reviews" component={ReviewsManager} />
            <Route path="/admin/contact" component={ContactManager} />
            <Route path="/admin/team" component={TeamManager} />
            <Route path="/admin/about" component={AboutManager} />
            <Route path="/admin/settings" component={SettingsManager} />
            <Route path="/admin/sheets" component={SheetsConfig} />
            <Route path="/admin" component={() => {
              setLocation('/admin/dashboard');
              return null;
            }} />
          </Switch>
        </div>
      </main>
    </div>
  );
}
