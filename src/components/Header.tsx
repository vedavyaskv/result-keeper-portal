
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { LogOut, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header: React.FC = () => {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system."
    });
  };

  return (
    <header className="fixed top-0 w-full bg-white border-b border-gray-200 z-10">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white font-bold rounded p-2">
            SRMS
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            Student Result Management System
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-gray-600" />
            <span className="text-gray-800">{user?.username || 'Admin User'}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
