import React, { useRef } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DataTable = ({ data, year }) => {
  const tableRef = useRef();

  if (!data) return null;

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add header
    doc.setFontSize(18);
    doc.text("Qarzdorlar " + year, 14, 15);

    // Add table
    doc.autoTable({
      html: tableRef.current,
      startY: 25,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      styles: { fontSize: 8 },
    });

    doc.save(`Qarzdorlar ${new Date().toString("uz-Uz")}.pdf`);
  };

  const months = [
    "Yan",
    "Fev",
    "Mar",
    "Apr",
    "May",
    "Iyn",
    "Iyl",
    "Avg",
    "Sen",
    "Okt",
    "Noy",
    "Dek",
  ];

  const processData = () => {
    const aggregatedData = {};

    Object.keys(data).forEach((month) => {
      Object.keys(data[month]).forEach((company) => {
        if (!aggregatedData[company]) {
          aggregatedData[company] = new Array(12).fill(0);
        }
        const monthIndex = parseInt(month) - 1;
        const totalDebt = data[month][company].reduce(
          (acc, val) => acc + val,
          0
        );
        aggregatedData[company][monthIndex] += totalDebt;
      });
    });

    const tableRows = [];
    let rowIndex = 1;

    Object.keys(aggregatedData).forEach((company) => {
      const rowData = new Array(14).fill("");
      rowData[0] = rowIndex++;
      rowData[1] = company;
      aggregatedData[company].forEach((debt, index) => {
        rowData[index + 2] = debt.toLocaleString("uz-Uz");
      });
      tableRows.push(rowData);
    });

    return tableRows;
  };

  const tableRows = processData();

  return (
    <div>
      <button
        onClick={generatePDF}
        className="border rounded-lg px-3 py-1 bg-red-500 text-white hover:bg-red-600 active:scale-95"
      >
        Qarzdorlar <span className="fa-solid fa-file-pdf" />
      </button>
      <table ref={tableRef} border="1" className="hidden">
        <thead>
          <tr>
            <th>#</th>
            <th>Kompaniya nomi</th>
            {months.map((month, index) => (
              <th key={index}>{month}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
