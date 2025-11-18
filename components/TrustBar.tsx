import { FaTruck, FaUndo, FaShieldAlt, FaHeadset } from 'react-icons/fa';

export default function TrustBar() {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-white border-y border-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Free Shipping */}
          <div className="flex items-center gap-4 justify-center md:justify-start group">
            <div className="flex-shrink-0">
              <div className="icon-geometric group-hover:scale-110 transition-transform duration-300">
                <FaTruck className="text-xl text-primary-600" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">משלוח חינם</h3>
              <p className="text-gray-600 text-xs font-light">משלוח חינם בקנייה מעל ₪500</p>
            </div>
          </div>

          {/* Free Returns */}
          <div className="flex items-center gap-4 justify-center md:justify-start group">
            <div className="flex-shrink-0">
              <div className="icon-geometric group-hover:scale-110 transition-transform duration-300">
                <FaUndo className="text-xl text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">החזרות בחינם</h3>
              <p className="text-gray-600 text-xs font-light">החזרה חינם תוך 14 יום</p>
            </div>
          </div>

          {/* Full Warranty */}
          <div className="flex items-center gap-4 justify-center md:justify-start group">
            <div className="flex-shrink-0">
              <div className="icon-geometric group-hover:scale-110 transition-transform duration-300">
                <FaShieldAlt className="text-xl text-yellow-600" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">אחריות מלאה</h3>
              <p className="text-gray-600 text-xs font-light">אחריות יצרן על כל המוצרים</p>
            </div>
          </div>

          {/* Customer Service */}
          <div className="flex items-center gap-4 justify-center md:justify-start group">
            <div className="flex-shrink-0">
              <div className="icon-geometric group-hover:scale-110 transition-transform duration-300">
                <FaHeadset className="text-xl text-purple-600" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">שירות לקוחות</h3>
              <p className="text-gray-600 text-xs font-light">זמינים עבורכם בכל שאלה</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
