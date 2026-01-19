import React from "react";

function TablePagination({
  columns,
  data,
  page,
//   pageSize,
//   total,
  onPageChange,
  renderActions,
  renderExtra,
  totalPages
}) {
//   const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="w-full">
      
      <div className="w-full overflow-x-auto">
        <table className="min-w-[900px] w-full table-auto border-collapse rounded-lg  bg-white shadow-lg shadow-gray-200">
          <thead className="capitalize text-gray-600/70 font-semibold">
            <tr className="h-12">
              {columns.map((col) => (
                <th key={col.key} className="px-2 py-2 text-left">
                  {col.label}
                </th>
              ))}
              {renderActions && <th className="px-4 py-2">Action</th>}
              {renderExtra && <th className="px-4 py-2">Extra</th>}
            </tr>
          </thead>

          <tbody className=" capitalize pb-6 text-gray-600/70 font-semibold">
            {data.map((row, index) => (
              <tr key={row._id || index} className="h-12 border-t border-gray-200/40">
                {columns.map((col) => (
                  <td key={col.key} className="px-2 py-2">
                    {col.render
                      ? col.render(row, index+1)
                      : row[col.key]}
                  </td>
                ))}

                {renderActions && (
                  <td className="px-4 py-2">{renderActions(row)}</td>
                )}

                {renderExtra && (
                  <td className="px-4 py-2">{renderExtra(row)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (<>
         <div className="flex items-center justify-between mt-4 px-2">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2 place-content-center ">
          <button
         disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className={`px-4 py-1.5 rounded-lg font-medium transition
            ${
              page === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-300 hover:bg-green-400 text-gray-900 hover:cursor-pointer"
            }`}
          >
            Prev
          </button>

          {/* {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`px-3 py-1 rounded border ${
                page === i + 1
                  ? "bg-purple-500 text-white"
                  : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))} */}

          <button
              disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className={`px-4 py-1.5 rounded-lg font-medium transition
            ${
              page === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-green-300 hover:bg-green-400 text-gray-900 hover:cursor-pointer"
            }`}
          >
            Next
          </button>
        </div>
      </div>
      </>)}

   
    </div>
  );
}

export default TablePagination;
