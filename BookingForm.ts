import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRequestStore } from '../store/useRequestStore';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';

const BookingForm: React.FC = () => {
  const [phone, setPhone] = useState<string>('');
  const [issue, setIssue] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [requestId, setRequestId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { addRequest } = useRequestStore();

  const submitRequest = async () => {
    if (!phone || !issue) {
      setMessage('يرجى ملء جميع الحقول');
      new Audio('https://cdn.pixabay.com/audio/2023/02/15/14-16-37-826_200x200.mp3').play();
      return;
    }
    setLoading(true);
    const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    try {
      await addRequest({ id: newId, phone, issue, status: 'قيد الانتظار', created_at: new Date().toISOString() });
      setMessage(`تم إرسال الطلب بنجاح! رقم الطلب: ${newId}`);
      setRequestId(newId);
      setPhone('');
      setIssue('');
      window.open(
        `https://wa.me/201064496440?text=${encodeURIComponent(
          `طلب دعم جديد - رقم الطلب: ${newId}, الهاتف: ${phone}, المشكلة: ${issue}`
        )}`,
        '_blank'
      );
      new Audio('https://cdn.pixabay.com/audio/2023/02/15/14-16-37-826_200x200.mp3').play();
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.ready.then(reg => {
          reg.showNotification('طلب جديد!', {
            body: `طلب جديد من ${phone}: ${issue}`,
            icon: '/src/assets/logo.png',
          });
        });
      }
    } catch (error) {
      setMessage('حدث خطأ أثناء إرسال الطلب');
      console.error(error);
      new Audio('https://cdn.pixabay.com/audio/2023/02/15/14-16-37-826_200x200.mp3').play();
    } finally {
      setLoading(false);
    }
  };

  const copyRequestId = () => {
    navigator.clipboard.writeText(requestId);
    setMessage(`${message} (تم نسخ رقم الطلب)`);
    new Audio('https://cdn.pixabay.com/audio/2023/02/15/14-16-37-826_200x200.mp3').play();
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-blue-900 mb-4 text-center">دكتور نت</h1>
      <p className="text-center text-lg text-blue-700 mb-6">حجز دعم فني بسهولة وسرعة</p>
      <p className="text-center text-xl font-semibold text-blue-900 mb-6">مصطفى عاطف الشوري</p>
      <div className="space-y-4">
        <Input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="رقم الهاتف"
        />
        <Textarea
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          placeholder="وصف المشكلة"
          rows={4}
        />
        <Button
          onClick={submitRequest}
          disabled={loading}
          className="w-full"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
        </Button>
        {message && (
          <Alert className={message.includes('بنجاح') ? 'alert-success' : 'alert-error'}>
            <AlertDescription>
              {message}
              {requestId && (
                <Button
                  onClick={copyRequestId}
                  className="ml-2"
                  variant="outline"
                  size="sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  نسخ رقم الطلب
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </motion.div>
  );
};

export default BookingForm;