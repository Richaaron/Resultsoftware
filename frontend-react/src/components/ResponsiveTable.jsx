import React from "react";

const ResponsiveTable = ({ headers, rows, className = "" }) => {
  return (
    <div className="w-full overflow-x-auto -mx-4 md:mx-0">
      <div className="inline-block min-w-full px-4 md:px-0">
        <table className={`w-full border-collapse ${className}`}>
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="table-header"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="hover:bg-slate-700/20 transition-colors">
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="table-cell"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponsiveTable;
