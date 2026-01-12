const canvasElement = document.getElementById("bar-chart");
const config = {
  type: "bar",
  data: {
    labels: ["2018", "2019", "2020", "2021", "2022", "2023"],
    datasets: [
      {
        label: "Total comments",
        data: [100, 200, 550, 300, 370, 90],
      },
    ],
  },
};
const barChart = new Chart(canvasElement, config);
