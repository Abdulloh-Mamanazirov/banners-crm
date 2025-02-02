import React, { useRef } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Function to check if a string contains Cyrillic characters
const containsCyrillic = (text) => /[А-Яа-яЁё]/.test(text);

// Function to convert Cyrillic to Latin
const cyrillicToLatin = (text) => {
  const cyrillicToLatinMap = {
    А: "A",
    Б: "B",
    В: "V",
    Г: "G",
    Д: "D",
    Е: "E",
    Ё: "Yo",
    Ж: "J",
    З: "Z",
    И: "I",
    Й: "Y",
    К: "K",
    Л: "L",
    М: "M",
    Н: "N",
    О: "O",
    П: "P",
    Р: "R",
    С: "S",
    Т: "T",
    У: "U",
    Ф: "F",
    Х: "X",
    Ц: "Ts",
    Ч: "Ch",
    Ш: "Sh",
    Щ: "Sh",
    Ъ: "",
    Ы: "Y",
    Ь: "",
    Э: "E",
    Ю: "Yu",
    Я: "Ya",
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "yo",
    ж: "j",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "x",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "sh",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
  };

  return text
    .split("")
    .map((char) => cyrillicToLatinMap[char] || char)
    .join("");
};

const DataTable = ({ data, year }) => {
  const tableRef = useRef();

  if (!data) return null;

  const generatePDF = () => {
    const doc = new jsPDF("landscape");

    // Add header
    doc.setFontSize(18);
    doc.text("Chiqim " + year, 14, 15);

    // Add table
    doc.autoTable({
      html: tableRef.current,
      startY: 25,
      theme: "grid",
      headStyles: { fillColor: [22, 160, 133] },
      styles: { fontSize: 8 },
      didParseCell: (data) => {
        if (containsCyrillic(data.cell.text[0])) {
          data.cell.text = data.cell.text.map(cyrillicToLatin);
        }
      },
    });

    doc.save(`Chiqim ${new Date().toString("uz-Uz")}.pdf`);
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
    const totalSums = new Array(12).fill(0);

    data.forEach((monthData, monthIndex) => {
      monthData.forEach((companyData) => {
        const { label: company, data: totalDebt } = companyData;
        if (!aggregatedData[company]) {
          aggregatedData[company] = new Array(12).fill(0);
        }
        aggregatedData[company][monthIndex] += totalDebt;
        totalSums[monthIndex] += totalDebt;
      });
    });

    const tableRows = [];
    let rowIndex = 1;

    Object.keys(aggregatedData).forEach((company) => {
      const rowData = new Array(14).fill("");
      rowData[0] = rowIndex++;
      rowData[1] = company;
      aggregatedData[company].forEach((debt, index) => {
        rowData[index + 2] = debt;
      });
      tableRows.push(rowData);
    });

    // Add the total sums row
    const totalRow = new Array(14).fill("");
    totalRow[0] = "";
    totalRow[1] = "Jami:";
    totalSums.forEach((sum, index) => {
      totalRow[index + 2] = sum.toLocaleString("uz-Uz");
    });
    tableRows.push(totalRow);

    return tableRows;
  };

  const tableRows = processData();

  return (
    <div>
      <button
        onClick={generatePDF}
        className="border rounded-lg px-3 py-1 bg-red-500 text-white hover:bg-red-600 active:scale-95"
      >
        Chiqimlar <span className="fa-solid fa-file-pdf" />
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
          {tableRows
            .sort(
              (a, b) =>
                b?.reduce((d, e) => !isNaN(e) && +d + +e, 0) -
                a?.reduce((d, e) => !isNaN(e) && +d + +e, 0)
            )
            .map((row, index) => {
              row[0] = index + 1;
              return (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>
                      {containsCyrillic(cell)
                        ? cyrillicToLatin(cell)
                        : cell.toLocaleString("uz-Uz")}
                    </td>
                  ))}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
