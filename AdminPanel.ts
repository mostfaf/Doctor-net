import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRequestStore } from '../store/useRequestStore';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface Request {
  id: string;
  phone: string;
  issue: string;
  status: string;
  created_at: string;
}

const AdminPanel: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [filter, setFilter] = useState<string>('all');
  const { requests, updateRequest, deleteRequest } = useRequestStore();

  const login = () => {
    if (password === 'drnet2025') {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError(language === 'ar' ? 'كلمة المرور غير صحيحة' : 'Incorrect password');
      new Audio('https://cdn.pixabay.com/audio/2023/02/15/14-16-37-826_200x200.mp3').play();
    }
  };

  const exportCSV = () => {
    const headers = language === 'ar' ? ['رقم الطلب', 'رقم الهاتف', 'المشكلة', 'الحالة', 'تاريخ الإنشاء'] : ['Request ID', 'Phone', 'Issue', 'Status', 'Created At'];
    const rows = requests.map(r => [
      r.id,
      r.phone,
      `"${r.issue.replace(/"/g, '""')}"`,
      r.status,
      new Date(r.created_at).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US'),
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([new Blob(['\ufeff', csv])], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'support_requests.csv';
    link.click();
  };

  const filteredRequests = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {!isLoggedIn ? (
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-2xl font-semibold text-center text-blue-900">
            {language === 'ar' ? 'تسجيل دخول الإدارة' : 'Admin Login'}
          </h2>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={language === 'ar' ? 'كلمة المرور' : 'Password'}
          />
          <Button onClick={login} className="w-full">
            {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
          </Button>
          {error && (
            <Alert className="alert-error">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Select value={language} onValueChange={(value) => setLanguage(value as 'ar' | 'en')}>
            <SelectTrigger>
              <SelectValue placeholder="اللغة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ar">العربية</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-blue-900">
              {language === 'ar' ? 'الطلبات' : 'Requests'}
            </h2>
            <div className="flex space-x-2">
              <Button onClick={exportCSV}>{language === 'ar' ? 'تصدير CSV' : 'Export CSV'}</Button>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="تصفية" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
                  <SelectItem value="قيد الانتظار">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</SelectItem>
                  <SelectItem value="قيد التنفيذ">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</SelectItem>
                  <SelectItem value="مكتمل">{language === 'ar' ? 'مكتمل' : 'Completed'}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={language} onValueChange={(value) => setLanguage(value as 'ar' | 'en')}>
                <SelectTrigger>
                  <SelectValue placeholder="اللغة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table id="requests">
            <TableHeader>
              <TableRow>
                <TableHead>{language === 'ar' ? 'رقم الطلب' : 'Request ID'}</TableHead>
                <TableHead>{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</TableHead>
                <TableHead>{language === 'ar' ? 'المشكلة' : 'Issue'}</TableHead>
                <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                <TableHead>{language === 'ar' ? 'تاريخ الإنشاء' : 'Created At'}</TableHead>
                <TableHead>{language === 'ar' ? 'الإجراءات' : 'Actions'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map(req => (
                <TableRow key={req.id}>
                  <TableCell>{req.id}</TableCell>
                  <TableCell>
                    <a href={`https://wa.me/${req.phone.replace(/[^0-9]/g, '')}`} className="text-blue-600 underline" target="_blank">
                      {req.phone}
                    </a>
                  </TableCell>
                  <TableCell>{req.issue}</TableCell>
                  <TableCell>
                    <Select
                      value={req.status}
                      onValueChange={(value) => updateRequest(req.id, { status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="قيد الانتظار">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</SelectItem>
                        <SelectItem value="قيد التنفيذ">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</SelectItem>
                        <SelectItem value="مكتمل">{language === 'ar' ? 'مكتمل' : 'Completed'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>{new Date(req.created_at).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}</TableCell>
                  <TableCell>
                    <Button variant="destructive" onClick={() => deleteRequest(req.id)}>
                      {language === 'ar' ? 'حذف' : 'Delete'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </motion.div>
  );
};

export default AdminPanel;
