import { Bar } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

function sortArray(arr) {
  if (typeof arr !== "object") return;

  const RED = [
    "#c91111",
    "#ffbaba",
    "#ff7b7b",
    "#ff00a9",
    "#ff5252",
    "#ff0065",
    "#ffbfd3",
    "#fb5858",
    "#E7625F",
    "#C85250",
    "#F7BEC0",
    "#AA1945",
    "#DC4731",
    "#FB6090",
    "#EC9EC0",
    "#FF0080",
    "#FF4000",
    "#FB6090",
    "#FF5000",
    "#ffbaba",
    "#ff5252",
    "#E7625F",
    "#AA1945",
    "#FF6000",
    "#ffbaba",
    "#ff5252",
    "#E7625F",
    "#AA1945",
    "#FF7000",
    "#FF8000",
    "#ffbaba",
    "#ff5252",
    "#E7625F",
    "#AA1945",
    "#FF9000",
    "#FFA000",
    "#FFB000",
    "#FFC000",
    "#FFD000",
    "#FFE000",
  ];

  let result = [];
  let map = new Map();

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      if (map.has(arr[i][j].label)) {
        map.get(arr[i][j].label).push(arr[i][j].data);
      } else {
        map.set(arr[i][j].label, [arr[i][j].data]);
      }
    }
  }

  map.forEach((value, key, a) => {
    result.push({
      label: key,
      data: value,
      backgroundColor: RED[result.length],
      categoryPercentage: 0.9,
      barPercentage: 1,
    });
  });

  return result;
}

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
    labels: Object.keys(monthly?.you_need_this ?? {}).map((item) =>
      getMonth(item)
    ),
    datasets: [
      {
        label: "To'langan",
        backgroundColor: "black",
        data: monthly.paid_payment,
        categoryPercentage: 0.9,
        barPercentage: 1,
      },
    ],
  };

  sortArray(monthly?.hh)?.forEach((i) => monthly_data.datasets.push(i));

  return (
    <div className="shadow-xl rounded-2xl p-1 border border-gray-400 mt-3 max-w-[98%] mx-auto">
      <h3 className="text-center text-xl font-semibold mb-2">
        Oylik {title} statistikasi:
      </h3>
      <Bar
        data={monthly_data}
        options={{
          responsive: true,
          scales: {
            y: {
              stacked: true,
            },
            x: {
              stacked: true,
            },
          },
        }}
      />
    </div>
  );
};

export default index;
