import { FaTruck, FaUndo, FaShieldAlt, FaHeadset } from 'react-icons/fa';

export default function TrustBar() {
  return (
    <div className="bg-white border-y border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Free Shipping */}
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <FaTruck className="text-xl text-gray-700" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">משלוח חינם</h3>
              <p className="text-gray-600 text-xs">משלוח חינם בקנייה מעל ₪500</p>
            </div>
          </div>

          {/* Free Returns */}
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <FaUndo className="text-xl text-gray-700" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">החזרות בחינם</h3>
              <p className="text-gray-600 text-xs">החזרה חינם תוך 14 יום</p>
            </div>
          </div>

          {/* Full Warranty */}
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <FaShieldAlt className="text-xl text-gray-700" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">אחריות מלאה</h3>
              <p className="text-gray-600 text-xs">אחריות יצרן על כל המוצרים</p>
            </div>
          </div>

          {/* Customer Service */}
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <FaHeadset className="text-xl text-gray-700" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">שירות לקוחות</h3>
              <p className="text-gray-600 text-xs">זמינים עבורכם בכל שאלה</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
