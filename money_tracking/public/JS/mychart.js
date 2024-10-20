document.addEventListener('DOMContentLoaded', function() {
  const ctx = document.getElementById('myChart');
  const chartData = JSON.parse(document.getElementById('chartData').textContent);

  new Chart(ctx, {
      type: 'line',
      data: {
          labels: chartData.labels,
          datasets: [{
              label: 'Income',
              data: chartData.income,
              borderColor: 'rgb(75, 192, 192)',
              borderWidth: 3,
              lineTension: 0.5
          },
          {
              label: 'Expenses',
              data: chartData.expense,
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 3,
              lineTension: 0.5
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          },
      }
  });
});