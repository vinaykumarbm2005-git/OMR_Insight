import React from 'react';
import { cn } from './Button';

const Table = ({ columns, data, className, rowKey = 'id' }) => {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-border bg-white', className)}>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-border">
          <tr>
            {columns.map((col, index) => (
              <th key={index} scope="col" className={cn('px-6 py-3 font-semibold', col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row[rowKey] || rowIndex} className="hover:bg-gray-50/50 transition-colors">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className={cn('px-6 py-3', col.cellClassName)}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export { Table };
