import { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import axios from "axios";

const index = () => {
  // data = {
  //   julius_caesar: [
  //     60.0, 52.0, 84.0, 10.0, 26.0, 75.0, 14.0, 35.0, 30.0, 48.0, 60.0, 77.0,
  //   ],
  // };

  const chartRef = useRef();
  const chartModalRef = useRef();
  //   const modalRef = useRef();
  //   const [modalData, setModalData] = useState();
  const [data, setData] = useState({});
  const [year, setYear] = useState(new Date().getFullYear());
  const months = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ];

  async function getData() {
    try {
      const res = await axios.get(`orders/julius_caesar/${year}/`);
      setData(res.data);
    } catch (error) {
      return;
    }
  }

  useEffect(() => {
    getData();
  }, [year]);

  const chart_data = {
    labels: data?.julius_caesar?.map((_, ind) => months[ind]),
    datasets: [
      {
        label: "Band %",
        backgroundColor: "rgb(34 197 94)",
        data: data.julius_caesar,
        categoryPercentage: 0.9,
        barPercentage: 1,
      },
    ],
  };

  function openChartModal() {
    chartModalRef.current.showModal();
  }

  function closeChartModal() {
    chartModalRef.current.close();
  }

  return (
    <>
      <button onClick={openChartModal} className="btn btn-sm mt-1">
        Bandlik statistikasi
      </button>
      <dialog
        ref={chartModalRef}
        className="bg-white p-3 border rounded-lg backdrop:bg-black/30 w-screen md:w-1/2"
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-xl font-semibold mb-2">Oylik statistika:</h3>
          <button
            onClick={closeChartModal}
            type="button"
            className="w-8 h-8 border rounded-full hover:bg-gray-50"
          >
            <span className="fa-solid fa-close" />
          </button>
        </div>
        <input
          type="number"
          min={2000}
          defaultValue={year}
          onChange={(e) => setYear(e.target.value)}
          className="border border-gray-500 p-1 rounded-lg"
        />
        <div className="mt-3 max-w-[100vw] h-full mx-auto">
          <Bar
            data={chart_data}
            options={{
              responsive: true,
              // onClick: (event) => {
              //   const elements = chartRef.current.getElementsAtEventForMode(
              //     event,
              //     "nearest",
              //     { intersect: true },
              //     true
              //   );
              //   if (elements.length) {
              //     const index = elements[0].index;
              //     // const datasetIndex = elements[0].datasetIndex;
              //     // const label = chart_data.datasets[datasetIndex].label;
              //     // const value = chart_data.datasets[datasetIndex].data[index];
              //     modalRef.current.showModal();
              //     setModalData(index);
              //   }
              // },
            }}
            ref={chartRef}
          />
        </div>

        {/* modal */}
        {/* <dialog
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
              {monthly?.hh?.[modalData]?.map?.((item, ind) => (
                <tr key={ind}>
                  <td className="border p-1">{item?.label}</td>
                  <td className="border p-1">
                    {Number(item?.data).toLocaleString("uz-Uz")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </dialog> */}
      </dialog>
    </>
  );
};

export default index;
