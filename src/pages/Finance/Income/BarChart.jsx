import { useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

const index = ({ monthly, title, color }) => {
  const chartRef = useRef();
  const modalRef = useRef();
  const [modalData, setModalData] = useState();

  function getMonth(month) {
    switch (String(month)) {
      case "1":
        return "Yanvar";
      case "2":
        return "Fevral";
      case "3":
        return "Mart";
      case "4":
        return "Aprel";
      case "5":
        return "May";
      case "6":
        return "Iyun";
      case "7":
        return "Iyul";
      case "8":
        return "Avgust";
      case "9":
        return "Sentabr";
      case "10":
        return "Oktabr";
      case "11":
        return "Noyabr";
      case "12":
        return "Dekabr";
    }
  }

  const monthly_data = {
    labels: Object.keys(monthly?.you_need_this ?? {}).map((item) =>
      getMonth(item)
    ),
    datasets: [
      {
        label: "To'langan",
        backgroundColor: "darkblue",
        data: monthly.paid_payment,
        categoryPercentage: 0.9,
        barPercentage: 1,
      },
      {
        label: "To'lanishi kerak",
        backgroundColor: "blue",
        data: Object.values(monthly.you_need_this ?? {}),
        categoryPercentage: 0.9,
        barPercentage: 1,
      },
    ],
  };

  return (
    <>
      <div className="shadow-xl rounded-2xl p-1 border border-gray-400 mt-3 max-w-[98%] mx-auto">
        <h3 className="text-center text-xl font-semibold mb-2">
          Oylik {title} statistikasi:
        </h3>
        <Bar
          data={monthly_data}
          options={{
            responsive: true,
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
              },
            },
            onClick: (event) => {
              const elements = chartRef.current.getElementsAtEventForMode(
                event,
                "nearest",
                { intersect: true },
                true
              );
              if (elements.length) {
                const index = elements[0].index;
                // const datasetIndex = elements[0].datasetIndex;
                // const label = monthly_data.datasets[datasetIndex].label;
                // const value = monthly_data.datasets[datasetIndex].data[index];
                modalRef.current.showModal();
                setModalData(index + 1);
              }
            },
          }}
          ref={chartRef}
        />
      </div>

      {/* modal */}
      <dialog
        ref={modalRef}
        className="bg-white p-3 border rounded-lg backdrop:bg-black/30 md:w-1/3"
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="font-medium text-lg">{getMonth(modalData + 1)} oyi</h3>
          <button
            onClick={() => {
              setModalData(null);
              modalRef.current.close();
            }}
            type="button"
            className="w-8 h-8 border rounded-full hover:bg-gray-50"
          >
            <span className="fa-solid fa-close" />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <table className="text-center">
            <thead>
              <tr>
                <th className="border p-2">Kompaniya</th>
                <th className="border p-2">Summa</th>
              </tr>
            </thead>
            <tbody>
              {monthly?.hh?.[modalData] &&
                Object.entries(monthly?.hh?.[modalData])?.map?.(
                  ([name, payments], ind) => (
                    <tr key={ind}>
                      <td className="border p-1">{name}</td>
                      <td className="border p-1">
                        {Number(
                          payments.reduce((a, b) => a + b, 0)
                        ).toLocaleString("uz-Uz")}
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>
      </dialog>
    </>
  );
};

export default index;
