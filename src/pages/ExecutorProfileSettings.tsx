import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import PageHeader from '@/components/PageHeader';
import ExecutorStatsCard from '@/components/executor/ExecutorStatsCard';
import { useAuth } from '@/contexts/AuthContext';
import { RANKS, checkProStatus } from '@/types/electrical';

export default function ExecutorProfileSettings() {
  const navigate = useNavigate();
  const { user, updateUser, getExecutorProfile } = useAuth();
  const executorProfile = getExecutorProfile();

  const [hasCar, setHasCar] = useState(user?.hasCar || false);
  const [hasTools, setHasTools] = useState(user?.hasTools || false);
  const [isActive, setIsActive] = useState(user?.isActive || false);
  const [hasDiploma, setHasDiploma] = useState(user?.hasDiploma || false);
  
  const [diplomaFile, setDiplomaFile] = useState<File | null>(null);
  const [carFile, setCarFile] = useState<File | null>(null);
  const [toolsFile, setToolsFile] = useState<File | null>(null);

  if (!executorProfile || !user) {
    navigate('/orders');
    return null;
  }

  const handleFileChange = (type: 'diploma' | 'car' | 'tools', file: File | null) => {
    if (type === 'diploma') setDiplomaFile(file);
    if (type === 'car') setCarFile(file);
    if (type === 'tools') setToolsFile(file);
  };

  const handleSave = () => {
    const updates: any = {
      hasCar,
      hasTools,
      isActive,
      hasDiploma
    };

    if (diplomaFile) {
      updates.diplomaVerified = false;
    }
    if (carFile) {
      updates.carVerified = false;
    }
    if (toolsFile) {
      updates.toolsVerified = false;
    }

    const updatedProfile = { ...executorProfile, ...updates };
    const shouldBecomePro = checkProStatus(updatedProfile);

    if (shouldBecomePro) {
      updates.isPro = true;
      updates.proUnlockedAt = Date.now();
    }

    updateUser(updates);
    navigate('/orders');
  };

  const currentRank = RANKS[executorProfile.rank];
  const isPro = executorProfile.isPro;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <PageHeader />

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/orders')}
            className="-ml-2"
          >
            <Icon name="ArrowLeft" className="h-4 w-4 mr-1" />
            Назад
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Настройки профиля</h1>
        </div>
        <ExecutorStatsCard profile={executorProfile} />

        <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Статус "Профи"</h3>
              <p className="text-sm text-gray-600">
                Подтвердите документы для получения 50% от электромонтажных работ
              </p>
            </div>
            {isPro ? (
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-bold text-white flex items-center gap-1">
                  <Icon name="Award" className="h-4 w-4" />
                  ПРОФИ
                </span>
              </div>
            ) : (
              <div className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-gray-600">Стандарт</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Диплом */}
            <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors bg-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Switch checked={hasDiploma} onCheckedChange={setHasDiploma} />
                  <Label className="text-sm font-medium">
                    Диплом специалиста
                  </Label>
                </div>
                {user.diplomaVerified && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Icon name="CheckCircle" className="h-4 w-4" />
                    <span className="text-xs">Проверено</span>
                  </div>
                )}
              </div>
              {hasDiploma && (
                <div>
                  <Label htmlFor="diploma-upload" className="text-xs text-gray-600">
                    Загрузите фото диплома
                  </Label>
                  <Input
                    id="diploma-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('diploma', e.target.files?.[0] || null)}
                    className="mt-2"
                  />
                  {diplomaFile && (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <Icon name="FileCheck" className="h-3 w-3" />
                      {diplomaFile.name}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Автомобиль */}
            <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors bg-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Switch checked={hasCar} onCheckedChange={setHasCar} />
                  <Label className="text-sm font-medium">
                    Есть автомобиль (+10% бонус)
                  </Label>
                </div>
                {user.carVerified && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Icon name="CheckCircle" className="h-4 w-4" />
                    <span className="text-xs">Проверено</span>
                  </div>
                )}
              </div>
              {hasCar && (
                <div>
                  <Label htmlFor="car-upload" className="text-xs text-gray-600">
                    Загрузите фото СТС или ПТС
                  </Label>
                  <Input
                    id="car-upload"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileChange('car', e.target.files?.[0] || null)}
                    className="mt-2"
                  />
                  {carFile && (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <Icon name="FileCheck" className="h-3 w-3" />
                      {carFile.name}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Инструменты */}
            <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors bg-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Switch checked={hasTools} onCheckedChange={setHasTools} />
                  <Label className="text-sm font-medium">
                    Есть инструменты (+5% бонус)
                  </Label>
                </div>
                {user.toolsVerified && (
                  <div className="flex items-center gap-1 text-green-600">
                    <Icon name="CheckCircle" className="h-4 w-4" />
                    <span className="text-xs">Проверено</span>
                  </div>
                )}
              </div>
              {hasTools && (
                <div>
                  <Label htmlFor="tools-upload" className="text-xs text-gray-600">
                    Загрузите фото инструментов
                  </Label>
                  <Input
                    id="tools-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange('tools', e.target.files?.[0] || null)}
                    className="mt-2"
                  />
                  {toolsFile && (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <Icon name="FileCheck" className="h-3 w-3" />
                      {toolsFile.name}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Активность */}
            <div className="border-2 border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-colors bg-white">
              <div className="flex items-center gap-2">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <Label className="text-sm font-medium">
                  Активен (принимаю заказы) (+5% бонус)
                </Label>
              </div>
              <p className="text-xs text-gray-500 mt-2 ml-10">
                Включите, если готовы принимать новые заказы
              </p>
            </div>
          </div>
        </Card>

        {/* Информация о комиссиях */}
        <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Icon name="Info" className="h-5 w-5" />
            Ваша комиссия
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">Электромонтажные работы:</span>
              <span className="font-bold text-blue-900">
                {isPro ? '50%' : '30% → 50% через 3 месяца'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">Другие услуги:</span>
              <span className="font-bold text-blue-900">50%</span>
            </div>
          </div>
          {!isPro && hasDiploma && hasCar && hasTools && (
            <div className="mt-4 p-3 bg-purple-100 border border-purple-300 rounded-lg">
              <p className="text-xs text-purple-800">
                <Icon name="Sparkles" className="h-4 w-4 inline mr-1" />
                После проверки документов вы получите статус "Профи" и 50% комиссию сразу!
              </p>
            </div>
          )}
        </Card>

        <div className="space-y-3">
          <Button 
            onClick={handleSave} 
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg" 
            size="lg"
          >
            <Icon name="Save" className="mr-2" />
            Сохранить изменения
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/orders')} 
            className="w-full border-2 hover:bg-gray-50"
            size="lg"
          >
            Отмена
          </Button>
        </div>
      </div>
    </div>
  );
}