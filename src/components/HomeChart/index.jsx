import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

const index = () => {
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Installed",
        backgroundColor: "rgb(50, 153, 249)",
        data: [170, 200, 185, 240, 280, 300, 156, 254, 198, 120, 178, 210],
        categoryPercentage: 0.9,
        barPercentage: 1,
      },
      {
        label: "Removed",
        backgroundColor: "rgb(255, 99, 132)",
        data: [125, 220, 112, 125, 240, 248, 190, 302, 188, 210, 120, 235],
        categoryPercentage: 0.9,
        barPercentage: 1,
      },
    ],
  };

  return (
    <div className="shadow-xl rounded-2xl p-1 border border-gray-400 mt-3 max-w-[98%] mx-auto">
      <h3 className="text-center text-xl font-semibold mb-2">
        Annual Statistics of Billboard Ads:
      </h3>
      <Bar
        data={data}
        options={{
          responsive: true,
        }}
      />
    </div>
  );
};

export default index;
