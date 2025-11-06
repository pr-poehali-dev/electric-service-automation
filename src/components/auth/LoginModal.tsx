import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const normalizePhone = (phoneValue: string): string => {
    let normalized = phoneValue.replace(/\D/g, '');
    if (normalized.startsWith('7')) {
      normalized = '8' + normalized.slice(1);
    }
    if (normalized.startsWith('9') && normalized.length === 10) {
      normalized = '8' + normalized;
    }
    return normalized;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const normalizedPhone = normalizePhone(phone);
      const success = await login(normalizedPhone, password);
      if (success) {
        onSuccess?.();
        onClose();
      } else {
        setError('Неверный телефон или пароль');
      }
    } catch (err) {
      setError('Ошибка входа');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPhone('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Вход в систему</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium mb-2">Телефон</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="8 (900) 000-00-01"
              className="w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Пароль</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••"
              className="w-full"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <Icon name="AlertCircle" size={16} className="text-red-600" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          <div className="bg-blue-50 p-3 rounded-lg text-xs text-gray-600">
            <p className="font-semibold mb-1">Тестовые аккаунты:</p>
            <p>• Клиент: 89000000001 / 1234</p>
            <p>• Электрик: 89000000002 / 1234</p>
            <p>• Админ: 89000000003 / 1234</p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}