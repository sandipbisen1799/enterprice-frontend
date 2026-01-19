import { EllipsisVertical } from "lucide-react";
import React from "react";

function Table({ columns, data, renderActions, renderExtra }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[900px] w-full table-auto border-collapse rounded-lg  bg-white shadow-lg shadow-gray-200">
        <thead className="capitalize text-gray-600/70 font-semibold">
          <tr className="h-12">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-2 text-left whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}

            {renderActions && (
              <th className="px-4 py-2 text-left">Action</th>
            )}

            {renderExtra && (
              <th className="px-4 py-2 text-left">Unblock</th>
            )}
          </tr>
        </thead>

        <tbody className="capitalize text-gray-600/70 font-semibold">
          {data.map((row, index) => (
            <tr
              key={row._id || index}
              className="h-12 border-t border-gray-200/40"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2">
                  {col.render
                    ? col.render(row, (index+1))
                    : row[col.key]}
                </td>
              ))}

              {renderActions && (
                <td className="px-4 py-2">
               
                  {renderActions(row)}
                </td>
              )}

              {renderExtra && (
                <td className="px-4 py-2">
                  {renderExtra(row)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
