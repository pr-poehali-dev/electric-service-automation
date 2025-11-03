import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Zap" className="text-primary" size={24} />
            <div>
              <h1 className="font-heading font-bold text-lg text-foreground">БАЛТСЕТЬ <sup className="text-xs text-primary">³⁹</sup></h1>
              <p className="text-[10px] text-muted-foreground uppercase">Калининград</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => window.location.href = user?.role === 'admin' ? '/admin' : user?.role === 'executor' ? '/executor' : '/profile'}
              >
                <Icon name="User" size={18} />
                <span className="hidden md:inline text-sm">{user?.name}</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/login'}
              >
                <Icon name="LogIn" size={18} className="md:mr-2" />
                <span className="hidden md:inline">Войти</span>
              </Button>
            )}
            <a href="tel:+74012520725" className="text-base md:text-lg font-bold text-primary hover:text-primary/80 transition-colors">
              +7 (4012) 52-07-25
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
