import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  BarChart3, 
  Calendar, 
  File, 
  Home, 
  LogOut, 
  Menu, 
  Settings, 
  Users, 
  Bell, 
  Search,
  Flame,
  ChevronRight,
  MessageSquare,
  LayoutDashboard,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type NavItemProps = {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
};

const NavItem = ({ to, icon: Icon, label, active }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 overflow-hidden ${
        active 
          ? "bg-gradient-to-r from-success-green/90 to-light-green/60 text-white shadow-md" 
          : "text-white/80 hover:bg-gradient-to-r hover:from-success-green/20 hover:to-light-green/10 hover:text-white"
      }`}
    >
      <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${active ? "bg-white/20" : "bg-cambridge-blue/20"}`}>
        <Icon size={18} className={active ? "text-white" : "text-cambridge-blue"} />
      </div>
      <span className={`font-poppins ${active ? "text-white font-medium" : "font-normal"}`}>{label}</span>
      {active && (
        <ChevronRight className="absolute right-3 h-4 w-4 text-white/70" />
      )}
    </Link>
  );
};

type MainLayoutProps = {
  children: React.ReactNode;
};

const DashboardLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentPath = location.pathname;
  const [user, setUser] = useState<any>(null);

  // Save sidebar state to localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarOpen');
    if (savedState !== null) {
      setSidebarOpen(savedState === 'true');
    }
    
    // Fetch user data
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        setUser(data.session.user);
      }
    };
    
    fetchUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    localStorage.setItem('sidebarOpen', String(newState));
  };

  const handleRefresh = () => {
    window.location.reload();
    toast({
      title: "Refreshed",
      description: "Dashboard data has been refreshed.",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const navItems = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/documents", icon: File, label: "Documents" },
    { to: "/schedule", icon: Calendar, label: "Schedule" },
    { to: "/trainers", icon: Users, label: "Trainers" },
    { to: "/reports", icon: BarChart3, label: "Reports" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-white to-tea-green/20">
      {/* Enhanced Sidebar Design */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out border-r border-cambridge-blue/30 bg-gradient-to-b from-oxford-blue via-oxford-blue/95 to-charcoal/90 shadow-lg ${
          sidebarOpen ? "w-72" : "w-20"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-cambridge-blue/20">
          <Link 
            to="/dashboard" 
            className={`flex items-center gap-3 ${!sidebarOpen ? "opacity-0 w-0 overflow-hidden" : ""}`}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-vibrant-green to-success-green flex items-center justify-center shadow-md">
              <Flame className="h-6 w-6 text-white" />
            </div>
            <h1 className="font-poppins font-bold tracking-tight text-white text-lg">
              Inspire Safety
            </h1>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-white hover:bg-cambridge-blue/20 rounded-lg"
          >
            <Menu size={20} />
          </Button>
        </div>

        <div className="flex-1 py-6 px-3 overflow-y-auto">
          <div className={`mb-6 px-2 ${!sidebarOpen ? "opacity-0 h-0 overflow-hidden" : ""}`}>
            <h2 className="text-xs uppercase font-raleway font-semibold text-tea-green tracking-wider pl-2 mb-4">Main Menu</h2>
          </div>
          <nav className="space-y-2.5 px-2">
            {navItems.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={currentPath === item.to}
              />
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-cambridge-blue/20 bg-gradient-to-br from-charcoal/90 to-oxford-blue/95">
          <div className="flex items-center gap-3">
            <Avatar className="border border-tea-green/20 h-10 w-10 shadow-sm">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-gradient-to-br from-success-green to-vibrant-green text-white font-poppins">
                {user ? (user.email?.substring(0, 2).toUpperCase() || "UN") : "UN"}
              </AvatarFallback>
            </Avatar>
            {sidebarOpen && (
              <div>
                <p className="text-white text-sm font-medium font-poppins">
                  {user ? (user.user_metadata?.name || user.email?.split('@')[0] || "User") : "User"}
                </p>
                <p className="text-tea-green/70 text-xs font-open-sans">
                  {user ? user.email : "user@example.com"}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main 
        className={`flex-1 transition-all duration-300 bg-gradient-to-br from-white to-tea-green/20 ${
          sidebarOpen ? "ml-72" : "ml-20"
        }`}
      >
        {/* Enhanced top navbar */}
        <header className="h-16 border-b border-cambridge-blue/30 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-charcoal/70" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-10 bg-white/80 border-cambridge-blue/30 focus:border-success-green/50 rounded-xl font-raleway"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative rounded-xl border-cambridge-blue/30 text-charcoal hover:text-success-green hover:border-success-green/50">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-success-green text-white text-xs flex items-center justify-center shadow-sm font-poppins">
                    3
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[300px] border-cambridge-blue/30 glass-panel">
                <DropdownMenuLabel className="font-poppins">Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-cambridge-blue/20" />
                <div className="max-h-[300px] overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <DropdownMenuItem key={i} className="flex flex-col items-start py-3 focus:bg-success-green/5 cursor-pointer">
                      <div className="font-medium font-poppins">New training scheduled</div>
                      <div className="text-xs font-raleway text-charcoal">
                        Fire Safety Training in Chennai Region
                      </div>
                      <div className="text-xs text-cambridge-blue mt-1 font-open-sans">
                        10 minutes ago
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative flex items-center gap-2 border-cambridge-blue/30 hover:border-success-green/50 rounded-xl bg-white/80" size="sm">
                  <Avatar className="h-8 w-8 border border-cambridge-blue/30">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-gradient-to-br from-success-green to-vibrant-green text-white font-poppins">
                      {user ? (user.email?.substring(0, 2).toUpperCase() || "UN") : "UN"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm text-oxford-blue font-poppins">
                    {user ? (user.user_metadata?.name || user.email?.split('@')[0] || "User") : "User"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-cambridge-blue/30 glass-panel">
                <DropdownMenuLabel className="font-poppins">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-cambridge-blue/20" />
                <DropdownMenuItem onClick={() => navigate("/settings")} className="focus:bg-success-green/5 cursor-pointer font-raleway">Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")} className="focus:bg-success-green/5 cursor-pointer font-raleway">Settings</DropdownMenuItem>
                <DropdownMenuSeparator className="bg-cambridge-blue/20" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:bg-red-50 cursor-pointer font-raleway">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
