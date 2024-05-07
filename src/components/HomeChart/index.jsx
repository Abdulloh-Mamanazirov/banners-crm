import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

const index = ({ monthly, title, color }) => {
  // monthly = monthly.sort((a, b) => a.month - b.month);

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
    labels: Object.keys(monthly?.monthly_expenses ?? {}).map((item) =>
      getMonth(item)
    ),
    datasets: [
      {
        label: "Chiqim",
        backgroundColor: "red",
        data: Object.values(monthly.monthly_expenses ?? {}),
        categoryPercentage: 0.9,
        barPercentage: 1,
      },
    ],
  };

  return (
    <div className="shadow-xl rounded-2xl p-1 border border-gray-400 mt-3 max-w-[98%] mx-auto">
      <h3 className="text-center text-xl font-semibold mb-2">
        Oylik {title} statistikasi:
      </h3>
      <Bar
        data={monthly_data}
        options={{
          responsive: true,
        }}
      />
    </div>
  );
};

export default index;
