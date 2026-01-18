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
      'product_type',
      'material',
      'is_featured',
      'is_active',
      'sizes',
      'prices',
      'compare_prices',
      'stock_quantities',
      'variant_colors'
    ];

    const carpetExample = [
      'שטיח מודרני אפור',
      'שטיח איכותי ומעוצב לסלון',
      'carpet',
      'צמר',
      'no',
      'yes',
      '160×230|160×230|200×290|200×290',
      '1500|1500|2000|2000',
      '2000|2000|2500|2500',
      '10|5|8|3',
      'אפור|בז\'|אפור|בז\''
    ];

    const plantExample = [
      'מונסטרה דלישיוזה',
      'צמח טרופי גדול ומרשים לבית',
      'plant',
      '',
      'no',
      'yes',
      '',
      '150',
      '200',
      '5',
      ''
    ];

    const csvContent = [
      headers.join(','),
      carpetExample.map(cell => `"${cell}"`).join(','),
      plantExample.map(cell => `"${cell}"`).join(',')
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'products_template.csv';
    link.click();
  };

  const handleDownloadReference = async () => {
    try {
      const response = await fetch('/api/products/attribute-reference');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בהורדת קובץ הייחוס');
      }

      // Create CSV content
      const sections = [];

      // Categories
      if (data.categories?.length > 0) {
        sections.push('=== סגנונות (Categories) ===');
        sections.push('slug,name');
        data.categories.forEach((item: any) => {
          sections.push(`${item.slug},${item.name}`);
        });
        sections.push('');
      }

      // Colors
      if (data.colors?.length > 0) {
        sections.push('=== צבעים (Colors) ===');
        sections.push('slug,name');
        data.colors.forEach((item: any) => {
          sections.push(`${item.slug},${item.name}`);
        });
        sections.push('');
      }

      // Shapes
      if (data.shapes?.length > 0) {
        sections.push('=== צורות (Shapes) ===');
        sections.push('slug,name');
        data.shapes.forEach((item: any) => {
          sections.push(`${item.slug},${item.name}`);
        });
        sections.push('');
      }

      // Spaces
      if (data.spaces?.length > 0) {
        sections.push('=== חללים (Spaces) ===');
        sections.push('slug,name');
        data.spaces.forEach((item: any) => {
          sections.push(`${item.slug},${item.name}`);
        });
        sections.push('');
      }

      // Plant Types
      if (data.plantTypes?.length > 0) {
        sections.push('=== סוגי צמחים (Plant Types) ===');
        sections.push('slug,name');
        data.plantTypes.forEach((item: any) => {
          sections.push(`${item.slug},${item.name}`);
        });
        sections.push('');
      }

      // Plant Sizes
      if (data.plantSizes?.length > 0) {
        sections.push('=== גדלי צמחים (Plant Sizes) ===');
        sections.push('slug,name');
        data.plantSizes.forEach((item: any) => {
          sections.push(`${item.slug},${item.name}`);
        });
        sections.push('');
      }

      // Plant Light Requirements
      if (data.plantLight?.length > 0) {
        sections.push('=== דרישות אור (Plant Light) ===');
        sections.push('slug,name');
        data.plantLight.forEach((item: any) => {
          sections.push(`${item.slug},${item.name}`);
        });
        sections.push('');
      }

      // Plant Care Levels
      if (data.plantCare?.length > 0) {
        sections.push('=== רמות טיפול (Plant Care) ===');
        sections.push('slug,name');
        data.plantCare.forEach((item: any) => {
          sections.push(`${item.slug},${item.name}`);
        });
        sections.push('');
      }

      // Plant Pet Safety
      if (data.plantPetSafety?.length > 0) {
        sections.push('=== בטיחות לחיות (Plant Pet Safety) ===');
        sections.push('slug,name');
        data.plantPetSafety.forEach((item: any) => {
          sections.push(`${item.slug},${item.name}`);
        });
        sections.push('');
      }

      const csvContent = sections.join('\n');
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'attribute_reference.csv';
      link.click();
    } catch (error: any) {
      alert('❌ ' + error.message);
    }
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

      // Scroll to results section after brief delay
      setTimeout(() => {
        document.getElementById('import-results')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
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
          <li>מלא את הפרטים הבסיסיים בקובץ ה-CSV</li>
          <li>שמור את הקובץ</li>
          <li>העלה את הקובץ כאן</li>
          <li><strong>לאחר הייבוא:</strong> ערוך כל מוצר להוספת תמונות, צבעים, קטגוריות ופרטים נוספים</li>
        </ol>

        <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">💡 טיפים חשובים:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
            <li>השתמש בתו <code className="bg-blue-100 px-1">|</code> (pipe) להפרדה בין מידות, מחירים ומלאי</li>
            <li>ערכים אפשריים ל-is_featured ו-is_active: <code className="bg-blue-100 px-1">yes/no</code></li>
            <li>שטיחים: הוסף מספר מידות מופרדות ב-|</li>
            <li>עציצים: השאר את שדה sizes ריק (ישתמש במחיר בודד)</li>
            <li>כמות מלאי היא אופציונלית - אם לא מצוינת, ברירת המחדל היא 0</li>
            <li><strong>variant_colors:</strong> כל מידה יכולה להיות משויכת לצבע נפרד עם מלאי משלו</li>
            <li><strong>תמונות וקטגוריות:</strong> יתווספו ידנית בעורך המוצר לאחר הייבוא</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-900 mb-2">🎨 מעקב מלאי לפי מידה+צבע:</h3>
          <p className="text-sm text-purple-800 mb-2">
            כדי לנהל מלאי נפרד לכל שילוב של מידה וצבע, חזור על המידה עם צבע שונה:
          </p>
          <pre className="bg-white p-3 rounded text-xs overflow-x-auto border border-purple-200">
{`sizes: 160×230|160×230|200×290|200×290
variant_colors: אפור|בז'|אפור|בז'
prices: 1500|1500|2000|2000
stock_quantities: 10|5|8|3`}
          </pre>
          <p className="text-xs text-purple-700 mt-2">
            זה יצור 4 וריאנטים: 160×230 אפור (10 במלאי), 160×230 בז' (5 במלאי), 200×290 אפור (8 במלאי), 200×290 בז' (3 במלאי)
          </p>
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2">✅ מה כלול בייבוא CSV:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-green-800">
            <li>שם ותיאור מוצר</li>
            <li>סוג מוצר (שטיח/עציץ)</li>
            <li>מידות ומחירים</li>
            <li>מלאי ומחירי השוואה</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-900 mb-2">⚠️ מה דורש עריכה ידנית:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
            <li>תמונות מוצר</li>
            <li>צבעים לכל וריאנט</li>
            <li>קטגוריות וסגנונות</li>
            <li>צורות וחללים (לשטיחים)</li>
            <li>תכונות צמח (לעציצים)</li>
          </ul>
        </div>
      </div>

      {/* Template Download */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">1. הורד תבנית CSV</h2>
        <p className="text-gray-600 mb-4">
          הורד את קובץ התבנית עם דוגמאות לשטיח ולעציץ
        </p>
        <button
          onClick={handleDownloadTemplate}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <FaDownload />
          הורד תבנית CSV
        </button>
      </div>

      {/* CSV Format Reference */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📄 מבנה הקובץ - שדות בסיסיים</h2>
        <p className="text-gray-600 mb-4">
          הקובץ כולל רק את השדות הבסיסיים. תמונות, צבעים, קטגוריות ותכונות נוספות יתווספו בעריכה ידנית.
        </p>
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
                <td className="border border-gray-300 px-4 py-2 font-mono">product_type</td>
                <td className="border border-gray-300 px-4 py-2">✅</td>
                <td className="border border-gray-300 px-4 py-2">סוג מוצר</td>
                <td className="border border-gray-300 px-4 py-2">carpet / plant</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">material</td>
                <td className="border border-gray-300 px-4 py-2">❌</td>
                <td className="border border-gray-300 px-4 py-2">חומר</td>
                <td className="border border-gray-300 px-4 py-2">צמר</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">is_featured</td>
                <td className="border border-gray-300 px-4 py-2">❌</td>
                <td className="border border-gray-300 px-4 py-2">מוצר מומלץ (ברירת מחדל: no)</td>
                <td className="border border-gray-300 px-4 py-2">yes / no</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">is_active</td>
                <td className="border border-gray-300 px-4 py-2">❌</td>
                <td className="border border-gray-300 px-4 py-2">מוצר פעיל (ברירת מחדל: yes)</td>
                <td className="border border-gray-300 px-4 py-2">yes / no</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">sizes</td>
                <td className="border border-gray-300 px-4 py-2">⚠️</td>
                <td className="border border-gray-300 px-4 py-2">מידות (חובה לשטיחים, ריק לעציצים)</td>
                <td className="border border-gray-300 px-4 py-2">160×230|200×290|240×340</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">prices</td>
                <td className="border border-gray-300 px-4 py-2">✅</td>
                <td className="border border-gray-300 px-4 py-2">מחירים (חייב להתאים למספר המידות)</td>
                <td className="border border-gray-300 px-4 py-2">1500|2000|2500</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">compare_prices</td>
                <td className="border border-gray-300 px-4 py-2">❌</td>
                <td className="border border-gray-300 px-4 py-2">מחירי השוואה</td>
                <td className="border border-gray-300 px-4 py-2">2000|2500|3000</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 font-mono">stock_quantities</td>
                <td className="border border-gray-300 px-4 py-2">❌</td>
                <td className="border border-gray-300 px-4 py-2">כמויות מלאי (ברירת מחדל: 0)</td>
                <td className="border border-gray-300 px-4 py-2">10|5|3</td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="border border-gray-300 px-4 py-2 font-mono">variant_colors</td>
                <td className="border border-gray-300 px-4 py-2">❌</td>
                <td className="border border-gray-300 px-4 py-2">צבע לכל וריאנט (מלאי נפרד לכל שילוב מידה+צבע)</td>
                <td className="border border-gray-300 px-4 py-2">אפור|בז'|אפור|בז'</td>
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
        <div
          id="import-results"
          className={`rounded-lg shadow-md p-6 ${result.errorCount === 0 ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'}`}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            {result.errorCount === 0 ? (
              <>
                <FaCheckCircle className="text-3xl text-green-600" />
                <span className="text-green-900">הייבוא הושלם בהצלחה!</span>
              </>
            ) : (
              <>
                <FaTimesCircle className="text-3xl text-red-600" />
                <span className="text-red-900">שים לב! נמצאו שגיאות בייבוא</span>
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
            <div className="mt-6">
              <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 mb-4">
                <h3 className="font-bold text-red-900 text-xl mb-2 flex items-center gap-2">
                  <FaTimesCircle className="text-red-600" />
                  פירוט מלא של השגיאות ({result.errors.length})
                </h3>
                <p className="text-red-800 text-sm">
                  תקן את השגיאות הבאות בקובץ ה-CSV ונסה שוב להעלות את השורות שנכשלו
                </p>
              </div>

              <div className="bg-white rounded-lg border-2 border-red-200 shadow-lg max-h-96 overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-red-100 sticky top-0 shadow">
                    <tr>
                      <th className="px-4 py-3 text-right border-b-2 border-red-200 font-bold text-red-900">
                        שורה בקובץ
                      </th>
                      <th className="px-4 py-3 text-right border-b-2 border-red-200 font-bold text-red-900">
                        שדה בעייתי
                      </th>
                      <th className="px-4 py-3 text-right border-b-2 border-red-200 font-bold text-red-900">
                        תיאור השגיאה
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.errors.map((error, index) => (
                      <tr
                        key={index}
                        className={`hover:bg-red-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-3 border-b border-gray-200 font-bold text-red-700">
                          שורה {error.row}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-blue-700">
                            {error.field}
                          </code>
                        </td>
                        <td className="px-4 py-3 border-b border-gray-200 text-red-700 font-medium">
                          {error.message}
                        </td>
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
