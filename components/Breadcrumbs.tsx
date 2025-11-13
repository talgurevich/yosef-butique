import Link from 'next/link';
import { FaChevronLeft, FaHome } from 'react-icons/fa';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center space-x-2 space-x-reverse text-sm">
          {/* Home */}
          <li>
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-primary-600 transition-colors"
            >
              <FaHome className="text-base" />
            </Link>
          </li>

          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center">
                <FaChevronLeft className="text-gray-400 text-xs mx-2" />
                {isLast || !item.href ? (
                  <span className="text-gray-900 font-semibold">{item.label}</span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
