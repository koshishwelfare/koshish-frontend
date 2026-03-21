import { useMemo, useState } from 'react';
import Pagination from './Pagination';

const DataTable = ({ columns, rows, emptyText = 'No data found', pageSize = 8 }) => {
  const [page, setPage] = useState(1);

  const safeRows = Array.isArray(rows) ? rows : [];
  const totalItems = safeRows.length;

  const pageRows = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return safeRows.slice(startIndex, startIndex + pageSize);
  }, [safeRows, page, pageSize]);

  const from = totalItems ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-100/80 text-left text-xs uppercase tracking-[0.08em] text-slate-500">
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-bold">{col.label}</th>
            ))}
            </tr>
          </thead>
          <tbody>
          {pageRows.map((row, index) => (
            <tr key={row._id || `${row.id || 'row'}-${index}`} className="border-t border-slate-100 hover:bg-slate-50/70">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-top text-slate-700">
                  {col.render ? col.render(row, index) : (row[col.key] ?? '-')}
                </td>
              ))}
            </tr>
          ))}
          {!pageRows.length && (
            <tr>
              <td className="px-4 py-8 text-center text-slate-500" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-4 py-3">
        <p className="text-xs font-medium text-slate-500">
          Showing {from} to {to} of {totalItems}
        </p>
        <Pagination page={page} pageSize={pageSize} totalItems={totalItems} onChange={setPage} />
      </div>
    </div>
  );
};

export default DataTable;
