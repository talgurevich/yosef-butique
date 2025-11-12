'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowRight, FaUpload, FaDownload, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

type ValidationError = {
  row: number;
  field: string;
  message: string;
};

type ImportResult = {
  success: boolean;
  message: string;
  successCount: number;
  errorCount: number;
  errors: ValidationError[];
};

export default function BulkUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        alert('אנא בחר קובץ CSV בלבד');
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'name',
      'description',
      'material',
      'categories',
      'is_featured',
      'is_active',
      'sizes',
      'prices',
      'compare_prices',
      'stock_quantities'
    ];

    const exampleRow = [
      'שטיח מודרני אפור',
      'שטיח איכותי ומעוצב לסלון',
      'צמר',
      'סלון,חדר שינה',
      'yes',
      'yes',
      '160×230|200×290|240×340',
      '1500|2000|2500',
      '2000|2500|3000',
      '' // optional - defaults to 0
    ];

    const csvContent = [
      headers.join(','),
      exampleRow.map(cell => `"${cell}"`).join(',')
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products_template.csv';
    link.click();
  };

  const handleUpload = async () => {
    if (!file) {
      alert('אנא בחר קובץ');
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/products/bulk-import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בהעלאת הקובץ');
      }

      setResult(data);

      if (data.success) {
        alert(`✅ הייבוא הושלם בהצלחה!\n\nנוספו ${data.successCount} מוצרים\n${data.errorCount > 0 ? `${data.errorCount} שגיאות` : ''}`);
      } else {
        alert(`⚠️ הייבוא הושלם עם שגיאות\n\nנוספו ${data.successCount} מוצרים\n${data.errorCount} שגיאות`);
      }
    } catch (error: any) {
      alert('❌ ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4"
        >
          <FaArrowRight className="ml-2" />
          חזרה לרשימת מוצרים
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">העלאת מוצרים מ-CSV</h1>
        <p className="text-gray-600 mt-2">
          העלה קובץ CSV להוספת מוצרים מרובים בבת אחת
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-bold text-blue-900 mb-4">📋 הוראות שימוש</h2>
        <ol className="list-decimal list-inside space-y-2 text-blue-800">
          <li>הורד את קובץ התבנית לדוגמה</li>
          <li>מלא את הפרטים בקובץ ה-CSV</li>
          <li>שמור את הקובץ</li>
          <li>העלה את הקובץ כאן</li>
        </ol>

        <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 טיפים חשובים:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
            <li>השתמש בתו <code className="bg-blue-100 px-1">|</code> (pipe) להפרדה בין מידות, מחירים ומלאי</li>
            <li>השתמש בפסיק להפרדה בין קטגוריות: <code className="bg-blue-100 px-1">סלון,חדר שינה</code></li>
            <li>ערכים אפשריים ל-is_featured ו-is_active: <code className="bg-blue-100 px-1">yes/no</code></li>
            <li>כל מוצר חייב לכלול לפחות מידה אחת עם מחיר</li>
            <li>כמות מלאי היא אופציונלית - אם לא מצוינת, ברירת המחדל היא 0</li>
            <li>שים <code className="bg-blue-100 px-1">""</code> (מרכאות) סביב ערכים עם פסיקים</li>
          </ul>
        </div>
      </div>

      {/* Template Download */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">1. הורד תבנית</h2>
        <p className="text-gray-600 mb-4">
          הורד קובץ תבנית לדוגמה עם כל השדות הנדרשים
        </p>
        <button
          onClick={handleDownloadTemplate}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <FaDownload />
          הורד קובץ תבנית לדוגמה
        </button>
      </div>

      {/* CSV Format Reference */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📄 מבנה הקובץ</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-right">שדה</th>
                <th className="border border-gray-300 px-4 py-2 text-right">חובה</th>
                <th className="border border-gray-300 px-4 py-2 text-right">תיאור</th>
                <th className="border border-gray-300 px-4 py-2 text-right">דוגמה</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">name</td>
                <td className="border border-gray-300 px-4 py-2">✅</td>
                <td className="border border-gray-300 px-4 py-2">שם המוצר</td>
                <td className="border border-gray-300 px-4 py-2">שטיח מודרני אפור</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">description</td>
                <td className="border border-gray-300 px-4 py-2">❌</td>
                <td className="border border-gray-300 px-4 py-2">תיאור המוצר</td>
                <td className="border border-gray-300 px-4 py-2">שטיח איכותי לסלון</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">material</td>
                <td className="border border-gray-300 px-4 py-2">❌</td>
                <td className="border border-gray-300 px-4 py-2">חומר</td>
                <td className="border border-gray-300 px-4 py-2">צמר</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">categories</td>
                <td className="border border-gray-300 px-4 py-2">❌</td>
                <td className="border border-gray-300 px-4 py-2">קטגוריות (מופרדות בפסיק)</td>
                <td className="border border-gray-300 px-4 py-2">סלון,חדר שינה</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">is_featured</td>
                <td className="border border-gray-300 px-4 py-2">❌</td>
                <td className="border border-gray-300 px-4 py-2">מוצר מומלץ</td>
                <td className="border border-gray-300 px-4 py-2">yes / no</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">is_active</td>
                <td className="border border-gray-300 px-4 py-2">❌</td>
                <td className="border border-gray-300 px-4 py-2">מוצר פעיל</td>
                <td className="border border-gray-300 px-4 py-2">yes / no</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">sizes</td>
                <td className="border border-gray-300 px-4 py-2">✅</td>
                <td className="border border-gray-300 px-4 py-2">מידות (מופרדות ב-|)</td>
                <td className="border border-gray-300 px-4 py-2">160×230|200×290</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">prices</td>
                <td className="border border-gray-300 px-4 py-2">✅</td>
                <td className="border border-gray-300 px-4 py-2">מחירים (מופרדים ב-|)</td>
                <td className="border border-gray-300 px-4 py-2">1500|2000</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">compare_prices</td>
                <td className="border border-gray-300 px-4 py-2">❌</td>
                <td className="border border-gray-300 px-4 py-2">מחירי השוואה (מופרדים ב-|)</td>
                <td className="border border-gray-300 px-4 py-2">2000|2500</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">stock_quantities</td>
                <td className="border border-gray-300 px-4 py-2">❌</td>
                <td className="border border-gray-300 px-4 py-2">כמויות מלאי (מופרדות ב-|) - ברירת מחדל: 0</td>
                <td className="border border-gray-300 px-4 py-2">10|5</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* File Upload */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">2. העלה קובץ CSV</h2>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <FaUpload className="text-5xl text-gray-400 mb-4" />
            <p className="text-gray-700 font-semibold mb-2">
              {file ? file.name : 'לחץ לבחירת קובץ CSV'}
            </p>
            <p className="text-gray-500 text-sm">או גרור ושחרר כאן</p>
          </label>
        </div>

        {file && (
          <div className="mt-6">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                  מייבא מוצרים...
                </>
              ) : (
                <>
                  <FaUpload />
                  התחל ייבוא
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className={`rounded-lg shadow-md p-6 ${result.errorCount === 0 ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            {result.errorCount === 0 ? (
              <>
                <FaCheckCircle className="text-green-600" />
                <span className="text-green-900">הייבוא הושלם בהצלחה!</span>
              </>
            ) : (
              <>
                <FaTimesCircle className="text-yellow-600" />
                <span className="text-yellow-900">הייבוא הושלם עם שגיאות</span>
              </>
            )}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <p className="text-sm text-gray-600 mb-1">מוצרים שנוספו</p>
              <p className="text-3xl font-bold text-green-600">{result.successCount}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-red-200">
              <p className="text-sm text-gray-600 mb-1">שגיאות</p>
              <p className="text-3xl font-bold text-red-600">{result.errorCount}</p>
            </div>
          </div>

          {result.errors && result.errors.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-800 mb-2">פירוט שגיאות:</h3>
              <div className="bg-white rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-right border-b">שורה</th>
                      <th className="px-4 py-2 text-right border-b">שדה</th>
                      <th className="px-4 py-2 text-right border-b">שגיאה</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.errors.map((error, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border-b">{error.row}</td>
                        <td className="px-4 py-2 border-b font-mono text-xs">{error.field}</td>
                        <td className="px-4 py-2 border-b text-red-600">{error.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <Link
              href="/admin/products"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              חזרה לרשימת מוצרים
            </Link>
            <button
              onClick={() => {
                setFile(null);
                setResult(null);
              }}
              className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ייבא קובץ נוסף
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
