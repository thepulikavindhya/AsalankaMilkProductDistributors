document.addEventListener('DOMContentLoaded', function () {
    const salesChartCanvas = document.getElementById('salesChart');
    const stockChartCanvas = document.getElementById('stockChart');
    const topSellingChartCanvas = document.getElementById('topSellingChart');
    const messageContainer = document.getElementById('message-container');


  function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.className = `message-container ${type}`;
        messageContainer.style.display = 'block'; // Show the container
       setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000); // Hide after 3 seconds
    }

    function fetchReportData() {
      fetch('get_comprehensive_report_data.php')
          .then(response => response.json())
          .then(data => {
               if (data.success) {
                   renderSalesChart(data.paymentData);
                    renderStockChart(data.productData);
                    renderTopSellingChart(data.topSellingProducts);
              }else{
                console.error('Error fetching data:', data.message);
                showMessage('Error fetching dashboard data.', 'error');
             }
         })
         .catch(error => {
               console.error('Error fetching data:', error);
              showMessage('An error occurred while fetching dashboard data.', 'error');
            });
    }


  function renderSalesChart(paymentData) {
        const labels = paymentData.map(item => item.payment_method);
        const amounts = paymentData.map(item => parseFloat(item.total_amount));

        new Chart(salesChartCanvas, {
            type: 'pie',
           data: {
                labels: labels,
                datasets: [{
                  label: 'Total Amount',
                    data: amounts,
                    backgroundColor: [
                         'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                         'rgba(255, 206, 86, 0.7)',

                     ],
                   borderColor: [
                       'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                       'rgba(255, 206, 86, 1)',
                     ],
                   borderWidth: 1
                }]
            },
           options: {
                responsive: true,
                maintainAspectRatio: false, // Allow custom aspect ratio
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });
    }
   function renderStockChart(productData) {
        const labels = productData.map(item => item.product_name);
        const stockData = productData.map(item => parseFloat(item.stock));
        new Chart(stockChartCanvas, {
           type: 'bar',
            data: {
               labels: labels,
               datasets: [{
                    label: 'Product Stock',
                    data: stockData,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                     borderColor: 'rgba(75, 192, 192, 1)',
                   borderWidth: 1
               }]
           },
          options: {
                responsive: true,
                maintainAspectRatio: false, // Allow custom aspect ratio
               scales: {
                  y: {
                        beginAtZero: true
                   }
              }
         }
       });
   }
  function renderTopSellingChart(topSellingProducts) {
            const labels = topSellingProducts.map(item => item.product_name);
             const quantities = topSellingProducts.map(item => parseInt(item.quantity));

             new Chart(topSellingChartCanvas, {
                type: 'line',
                 data: {
                  labels: labels,
                    datasets: [{
                       label: 'Top Selling Product Quantities',
                        data: quantities,
                         backgroundColor: 'rgba(255, 99, 132, 0.7)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                       borderWidth: 1
                   }]
               },
                options: {
                     responsive: true,
                       maintainAspectRatio: false, // Allow custom aspect ratio
                     scales: {
                       y: {
                            beginAtZero: true
                         }
                   }
                }
           });
    }

     fetchReportData();

});