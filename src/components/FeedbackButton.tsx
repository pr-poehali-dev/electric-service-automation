import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (feedback.trim()) {
      console.log('Фидбек:', feedback);
      setSubmitted(true);
      setTimeout(() => {
        setOpen(false);
        setFeedback('');
        setSubmitted(false);
      }, 2000);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-50 group"
        title="Предложить идею"
      >
        <Icon name="MessageSquare" size={24} />
        <span className="absolute -top-1 -left-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          ✨
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="Lightbulb" size={20} className="text-yellow-500" />
              Предложите идею
            </DialogTitle>
            <DialogDescription>
              Поделитесь своими идеями, как мы можем улучшить сервис
            </DialogDescription>
          </DialogHeader>

          {!submitted ? (
            <div className="space-y-4">
              <Textarea
                placeholder="Расскажите, что можно улучшить или какую функцию добавить..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmit}
                  disabled={!feedback.trim()}
                  className="flex-1"
                >
                  <Icon name="Send" size={16} className="mr-2" />
                  Отправить
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <Icon name="Check" size={32} className="text-green-600" />
              </div>
              <p className="text-lg font-semibold text-gray-800">Спасибо за фидбек!</p>
              <p className="text-sm text-gray-600 mt-2">Мы обязательно рассмотрим ваше предложение</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
