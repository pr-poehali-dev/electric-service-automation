import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';
import NotificationBell from '@/components/NotificationBell';

interface PageHeaderProps {
  imageUrl?: string;
}

export default function PageHeader({ imageUrl = 'https://cdn.poehali.dev/files/4b78877a-e24a-4720-b420-fafa87d6a759.jpg' }: PageHeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const getRoleBadge = (role: string) => {
    const badges = {
      client: { text: 'Клиент', color: 'bg-blue-100 text-blue-700' },
      electrician: { text: 'Электрик', color: 'bg-green-100 text-green-700' },
      admin: { text: 'Администратор', color: 'bg-purple-100 text-purple-700' }
    };
    return badges[role as keyof typeof badges] || badges.client;
  };

  return (
    <>
      <div className="relative">
        <img 
          src={imageUrl}
          alt="Калининград"
          className="w-full h-auto object-cover"
        />
        
        <div className="absolute top-4 right-4">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
              <NotificationBell />
              <div className="flex items-center gap-2">
                <Icon name="User" size={18} className="text-gray-600" />
                <div>
                  <div className="text-sm font-semibold">{user.name}</div>
                  <div className={`text-xs px-2 py-0.5 rounded ${getRoleBadge(user.role).color}`}>
                    {getRoleBadge(user.role).text}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={logout}
                title="Выйти"
              >
                <Icon name="LogOut" size={16} />
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setShowLoginModal(true)}
              className="bg-white/95 backdrop-blur-sm text-gray-800 hover:bg-white shadow-lg"
            >
              <Icon name="LogIn" size={18} className="mr-2" />
              Войти
            </Button>
          )}
        </div>
      </div>

      <LoginModal 
        open={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
}