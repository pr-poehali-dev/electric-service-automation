import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewList from '@/components/reviews/ReviewList';
import PhotoReportUpload from '@/components/reviews/PhotoReportUpload';
import { Order } from '@/types/electrical';
import { Review, PhotoReport } from '@/types/review';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface OrderReviewSectionProps {
  order: Order;
  canLeaveReview: boolean;
  orderReviews: Review[];
  orderPhotoReports: PhotoReport[];
  isAuthenticated: boolean;
  canManageReviews: boolean;
}

export default function OrderReviewSection({ 
  order, 
  canLeaveReview, 
  orderReviews, 
  orderPhotoReports,
  isAuthenticated,
  canManageReviews
}: OrderReviewSectionProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  return (
    <>
      {canLeaveReview && (
        <Card className="p-6 animate-fadeIn bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Icon name="Star" size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2 text-gray-800">Оставьте отзыв о работе</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ваше мнение поможет нам улучшить качество обслуживания
              </p>
              <Button 
                onClick={() => setShowReviewForm(true)}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-md"
              >
                <Icon name="MessageSquare" size={16} className="mr-2" />
                Написать отзыв
              </Button>
            </div>
          </div>
        </Card>
      )}

      {showReviewForm && (
        <ReviewForm
          orderId={order.id}
          onClose={() => setShowReviewForm(false)}
        />
      )}

      {orderReviews.length > 0 && (
        <Card className="p-6 animate-fadeIn">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Icon name="MessageSquare" size={20} className="text-primary" />
            Отзывы ({orderReviews.length})
          </h2>
          <ReviewList reviews={orderReviews} />
        </Card>
      )}

      {isAuthenticated && canManageReviews && (
        <Card className="p-6 animate-fadeIn">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="photo-reports">
              <AccordionTrigger className="text-lg font-bold">
                <div className="flex items-center gap-2">
                  <Icon name="Camera" size={20} className="text-primary" />
                  Фотоотчёты ({orderPhotoReports.length})
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  <Button 
                    onClick={() => setShowPhotoUpload(true)}
                    variant="outline"
                    className="w-full"
                  >
                    <Icon name="Upload" size={16} className="mr-2" />
                    Загрузить фотоотчёт
                  </Button>
                  
                  {orderPhotoReports.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {orderPhotoReports.map((report) => (
                        <div key={report.id} className="border rounded-lg overflow-hidden">
                          <img 
                            src={report.photoUrl} 
                            alt={report.description || 'Фотоотчёт'} 
                            className="w-full h-48 object-cover"
                          />
                          {report.description && (
                            <div className="p-2 bg-gray-50 text-sm">
                              {report.description}
                            </div>
                          )}
                          <div className="p-2 bg-gray-100 text-xs text-muted-foreground">
                            {new Date(report.createdAt).toLocaleString('ru-RU')}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      )}

      {showPhotoUpload && (
        <PhotoReportUpload
          orderId={order.id}
          onClose={() => setShowPhotoUpload(false)}
        />
      )}
    </>
  );
}
