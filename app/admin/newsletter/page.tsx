'use client';

import { useEffect, useState } from 'react';
import { FaEnvelope, FaCheckCircle, FaTimesCircle, FaDownload, FaSearch } from 'react-icons/fa';
import { supabase, NewsletterSubscriber } from '@/lib/supabase';

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'unsubscribed'>('all');

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;
      setSubscribers(data || []);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      alert('שגיאה בטעינת המנויים');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const csvHeaders = ['Email', 'Name', 'Status', 'Source', 'Promo Code Sent', 'Subscribed At', 'Unsubscribed At'];
    const csvRows = filteredSubscribers.map(sub => [
      sub.email,
      sub.full_name || '',
      sub.status,
      sub.source || '',
      sub.promo_code_sent ? 'Yes' : 'No',
      new Date(sub.subscribed_at).toLocaleDateString('he-IL'),
      sub.unsubscribed_at ? new Date(sub.unsubscribed_at).toLocaleDateString('he-IL') : '',
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (sub.full_name?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: subscribers.length,
    active: subscribers.filter(s => s.status === 'active').length,
    unsubscribed: subscribers.filter(s => s.status === 'unsubscribed').length,
    promoSent: subscribers.filter(s => s.promo_code_sent).length,
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">ניהול ניוזלטר</h1>
        <p className="text-gray-600">
          ניהול ומעקב אחר מנויי הניוזלטר
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">סך הכל מנויים</p>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <div className="bg-primary-100 p-4 rounded-full">
              <FaEnvelope className="text-primary-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">מנויים פעילים</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="bg-green-100 p-4 rounded-full">
              <FaCheckCircle className="text-green-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">בוטלו</p>
              <p className="text-3xl font-bold text-red-600">{stats.unsubscribed}</p>
            </div>
            <div className="bg-red-100 p-4 rounded-full">
              <FaTimesCircle className="text-red-600 text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">קודים שנשלחו</p>
              <p className="text-3xl font-bold text-primary-600">{stats.promoSent}</p>
            </div>
            <div className="bg-primary-100 p-4 rounded-full">
              <span className="text-primary-600 text-2xl">🎁</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="חפש לפי מייל או שם..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">כל הסטטוסים</option>
            <option value="active">פעילים</option>
            <option value="unsubscribed">בוטלו</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <FaDownload />
            ייצא ל-CSV
          </button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">טוען מנויים...</p>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="p-12 text-center">
            <FaEnvelope className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">
              {searchTerm || filterStatus !== 'all'
                ? 'לא נמצאו מנויים התואמים לחיפוש'
                : 'אין מנויים עדיין'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    מייל
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    שם
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    סטטוס
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    מקור
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    קוד נשלח
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    תאריך הצטרפות
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaEnvelope className="text-gray-400" />
                        <span className="text-gray-900">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {subscriber.full_name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          subscriber.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {subscriber.status === 'active' ? 'פעיל' : 'בוטל'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {subscriber.source || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {subscriber.promo_code_sent ? (
                        <span className="text-green-600">✓ כן</span>
                      ) : (
                        <span className="text-gray-400">✗ לא</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(subscriber.subscribed_at).toLocaleDateString('he-IL', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results count */}
      {!loading && filteredSubscribers.length > 0 && (
        <div className="mt-4 text-center text-gray-600">
          מציג {filteredSubscribers.length} מתוך {subscribers.length} מנויים
        </div>
      )}
    </div>
  );
}
