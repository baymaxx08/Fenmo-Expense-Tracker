import React from 'react';

/**
 * Loading skeleton rows for expense table
 */
export function LoadingSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <tr key={i} className="border-b hover:bg-gray-50">
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          </td>
          <td className="px-6 py-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
          </td>
          <td className="px-6 py-4 text-right">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20 ml-auto"></div>
          </td>
        </tr>
      ))}
    </>
  );
}
