import { FaTruck, FaUndo, FaShieldAlt, FaHeadset } from 'react-icons/fa';

export default function TrustBar() {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-white border-y border-gray-100">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-3 gap-2 md:gap-8">
          {/* Free Shipping */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 justify-center group text-center md:text-right">
            <div className="flex-shrink-0">
              <div className="icon-geometric group-hover:scale-110 transition-transform duration-300">
                <FaTruck className="text-xl text-primary-600" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xs md:text-sm mb-0.5 md:mb-1">משלוח מהיר</h3>
              <p className="text-gray-600 text-[10px] md:text-xs font-light leading-tight">3-5 ימי עסקים</p>
            </div>
          </div>

          {/* Full Warranty */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 justify-center group text-center md:text-right">
            <div className="flex-shrink-0">
              <div className="icon-geometric group-hover:scale-110 transition-transform duration-300">
                <FaShieldAlt className="text-xl text-yellow-600" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xs md:text-sm mb-0.5 md:mb-1">אחריות מלאה</h3>
              <p className="text-gray-600 text-[10px] md:text-xs font-light leading-tight">אחריות יצרן על כל המוצרים</p>
            </div>
          </div>

          {/* Customer Service */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 justify-center group text-center md:text-right">
            <div className="flex-shrink-0">
              <div className="icon-geometric group-hover:scale-110 transition-transform duration-300">
                <FaHeadset className="text-xl text-purple-600" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xs md:text-sm mb-0.5 md:mb-1">שירות לקוחות</h3>
              <p className="text-gray-600 text-[10px] md:text-xs font-light leading-tight">זמינים עבורכם בכל שאלה</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
