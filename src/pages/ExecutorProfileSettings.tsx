import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Icon from '@/components/ui/icon';
import PageHeader from '@/components/PageHeader';
import PageNavigation from '@/components/PageNavigation';
import ContactModal from '@/components/ContactModal';
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
  const [showContactModal, setShowContactModal] = useState(false);
  
  const [diplomaFile, setDiplomaFile] = useState<File | null>(null);
  const [carFile, setCarFile] = useState<File | null>(null);
  const [toolsFile, setToolsFile] = useState<File | null>(null);
  
  const [hasChanges, setHasChanges] = useState(false);

  if (!executorProfile || !user) {
    navigate('/orders');
    return null;
  }

  const handleFileChange = (type: 'diploma' | 'car' | 'tools', file: File | null) => {
    if (type === 'diploma') setDiplomaFile(file);
    if (type === 'car') setCarFile(file);
    if (type === 'tools') setToolsFile(file);
  };

  const handleChange = (field: string, value: any) => {
    setHasChanges(true);
    if (field === 'hasCar') setHasCar(value);
    if (field === 'hasTools') setHasTools(value);
    if (field === 'isActive') setIsActive(value);
    if (field === 'hasDiploma') setHasDiploma(value);
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
    setHasChanges(false);
    navigate('/orders');
  };

  const currentRank = RANKS[executorProfile.rank];
  const isPro = executorProfile.isPro;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-24">
        <PageHeader />

        <div className="max-w-md mx-auto">
          <PageNavigation onContactClick={() => setShowContactModal(true)} />
          
          <div className="bg-white shadow-lg p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-800">Профиль</h1>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <ExecutorStatsCard profile={executorProfile} />

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900">Статус "Профи"</h3>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Icon name="Info" className="h-4 w-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-xs">Подтвердите диплом, автомобиль и инструменты для получения 50% от электромонтажных работ сразу</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                {isPro ? (
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 px-3 py-1.5 rounded-full shadow-md">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <Icon name="Award" className="h-3 w-3" />
                      ПРОФИ
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="space-y-3">
                {/* Диплом */}
                <div className="border border-gray-200 rounded-lg p-3 hover:border-purple-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Switch checked={hasDiploma} onCheckedChange={(val) => handleChange('hasDiploma', val)} />
                      <Label className="text-sm font-medium">Диплом специалиста</Label>
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
                      <Input
                        id="diploma-upload"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange('diploma', e.target.files?.[0] || null)}
                        className="text-xs"
                      />
                      {diplomaFile && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <Icon name="FileCheck" className="h-3 w-3" />
                          {diplomaFile.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Автомобиль */}
                <div className="border border-gray-200 rounded-lg p-3 hover:border-blue-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Switch checked={hasCar} onCheckedChange={(val) => handleChange('hasCar', val)} />
                      <Label className="text-sm font-medium">Автомобиль</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Icon name="Info" className="h-3 w-3" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">+10% к доходу</p>
                        </TooltipContent>
                      </Tooltip>
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
                      <Input
                        id="car-upload"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange('car', e.target.files?.[0] || null)}
                        className="text-xs"
                      />
                      {carFile && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <Icon name="FileCheck" className="h-3 w-3" />
                          {carFile.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Инструменты */}
                <div className="border border-gray-200 rounded-lg p-3 hover:border-green-200 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Switch checked={hasTools} onCheckedChange={(val) => handleChange('hasTools', val)} />
                      <Label className="text-sm font-medium">Инструменты</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Icon name="Info" className="h-3 w-3" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">+5% к доходу</p>
                        </TooltipContent>
                      </Tooltip>
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
                      <Input
                        id="tools-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('tools', e.target.files?.[0] || null)}
                        className="text-xs"
                      />
                      {toolsFile && (
                        <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                          <Icon name="FileCheck" className="h-3 w-3" />
                          {toolsFile.name}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Активность */}
                <div className="border border-gray-200 rounded-lg p-3 hover:border-amber-200 transition-colors">
                  <div className="flex items-center gap-2">
                    <Switch checked={isActive} onCheckedChange={(val) => handleChange('isActive', val)} />
                    <Label className="text-sm font-medium">Принимаю заказы</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Icon name="Info" className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">+5% к доходу</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </Card>

            <div className="pt-3">
              <ContactModal open={showContactModal} onClose={() => setShowContactModal(false)} />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Электромонтаж:</span>
                  <span className="font-semibold text-gray-900">
                    {isPro ? '50%' : '30%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Другие услуги:</span>
                  <span className="font-semibold text-gray-900">50%</span>
                </div>
              </div>
              {!isPro && hasDiploma && hasCar && hasTools && (
                <div className="mt-3 p-2 bg-purple-100 rounded-lg">
                  <p className="text-xs text-purple-800 flex items-center gap-1">
                    <Icon name="Sparkles" className="h-3 w-3" />
                    После проверки документов получите 50% сразу!
                  </p>
                </div>
              )}
            </Card>

            <div className="space-y-3">
              <Button 
                onClick={handleSave}
                disabled={!hasChanges}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
                size="lg"
              >
                <Icon name="Save" className="mr-2 h-4 w-4" />
                Сохранить
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                На главную
              </Button>
            </div>