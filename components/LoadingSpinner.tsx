'use client';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        {/* Custom Loader */}
        <div className="loader mb-6 mx-auto"></div>

        {/* Loading text */}
        <p className="text-lg font-semibold text-gray-700">
          טוען...
        </p>

        <style jsx>{`
          .loader {
            width: 32px;
            height: 84px;
            border-radius: 0 0 20px 20px;
            position: relative;
            background: #A3B18A radial-gradient(circle 5px at 50% 85%, #C1784D 100%, transparent 0);
          }
          .loader:before,
          .loader:after {
            content: "";
            position: absolute;
            left: 0;
            bottom: 0;
            width: 32px;
            height: 84px;
            border-radius: 0 0 20px 20px;
            background: #A3B18A;
            opacity: 0.8;
            transform: rotate(60deg);
            transform-origin: 50% 85%;
            z-index: -2;
            animation: rotate 1s infinite linear alternate;
          }
          .loader:after {
            animation: rotate2 1s infinite linear alternate;
            opacity: 0.5;
          }
          @keyframes rotate {
            0%, 20% {
              transform: rotate(0deg);
            }
            80%, 100% {
              transform: rotate(30deg);
            }
          }
          @keyframes rotate2 {
            0%, 20% {
              transform: rotate(0deg);
            }
            80%, 100% {
              transform: rotate(60deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
