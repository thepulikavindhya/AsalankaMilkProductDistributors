document.addEventListener('DOMContentLoaded', function () {
    const productChart = document.getElementById('productChart');
    const invoiceChart = document.getElementById('invoiceChart');
    const returnChart = document.getElementById('returnChart');
     const paymentChart = document.getElementById('paymentChart');
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
            fetch('get_admin_report_data.php')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                            renderProductChart(data.productData);
                            renderInvoiceChart(data.invoiceData);
                             renderReturnChart(data.returnAmounts);
                             renderPaymentChart(data.paymentAmounts);
                    }else{
                        console.error('Error fetching report data:', data.message);
                        showMessage('Error fetching report data.','error')
                    }
                })
                .catch(error => {
                    console.error('Error fetching report data:', error);
                      showMessage('An error occurred while fetching report data.','error')
                });
        }

    function renderProductChart(productData) {
            const labels = productData.map(item => item.product_name);
            const stocks = productData.map(item => parseFloat(item.stock));

             new Chart(productChart, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                           label: 'Stock',
                            data: stocks,
                            backgroundColor: 'rgba(54, 162, 235, 0.7)', // Blue
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    scales: {
                       y: {
                            beginAtZero: true
                       }
                    }
               }
           });
    }

       function renderInvoiceChart(invoiceData) {
            const labels = invoiceData.map(item => item.payment_method);
            const amounts = invoiceData.map(item => parseFloat(item.total_amount));

            new Chart(invoiceChart, {
                type: 'doughnut',
                data: {
                     labels: labels,
                     datasets: [{
                       label: 'Amounts',
                         data: amounts,
                         backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)'],
                         borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                       borderWidth: 1
                   }]
                }
            });
      }
         function renderReturnChart(returnAmounts) {
            const labels = returnAmounts.map(item => item.return_type);
             const amounts = returnAmounts.map(item => parseFloat(item.total_amount));

             new Chart(returnChart, {
                 type: 'pie',
                data: {
                     labels: labels,
                     datasets: [{
                        label: 'Amount',
                          data: amounts,
                        backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 159, 64, 0.7)'],
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)'],
                         borderWidth: 1
                    }]
                 },
            });

    }
        function renderPaymentChart(paymentAmounts) {
            const labels = paymentAmounts.map(item => item.payment_method);
            const amounts = paymentAmounts.map(item => parseFloat(item.total_paid));

            new Chart(paymentChart, {
                type: 'pie',
                data: {
                     labels: labels,
                     datasets: [{
                        label: 'Amounts',
                         data: amounts,
                            backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)'],
                        borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                         borderWidth: 1
                  }]
                 }

            });
        }

      fetchReportData();

});