import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

const index = ({ yearly, title, color }) => {
  const yearly_data = {
    labels: yearly?.map((item) => item?.year),
    datasets: [
      {
        label: title,
        backgroundColor: color,
        data: yearly?.map((item) => item?.total_income),
        categoryPercentage: 0.9,
        barPercentage: 1,
      },
    ],
  };

  return (
    <div className="shadow-xl rounded-2xl p-1 border border-gray-400 mt-3 max-w-[98%] mx-auto">
      <h3 className="text-center text-xl font-semibold mb-2">
        Yillik {title} statistikasi:
      </h3>
      <Bar
        data={yearly_data}
        options={{
          responsive: true,
        }}
      />
    </div>
  );
};

export default index;
