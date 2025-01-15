document.addEventListener('DOMContentLoaded', function () {
    const reportButtons = document.querySelectorAll('.report-button');
    const reportContainer = document.getElementById('report-container');
    const reportTitle = document.getElementById('report-title');
    const reportContent = document.getElementById('report-content');
     const balanceChart = document.getElementById('balanceChart');
    const customerReturnContent = document.getElementById('customer-return-content');
    const companyReturnContent = document.getElementById('company-return-content');
     const returnTablesContainer = document.getElementById('return-tables');
    const messageContainer = document.getElementById('message-container');


    function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.className = `message-container ${type}`;
        messageContainer.style.display = 'block';
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000);
    }

    reportButtons.forEach(button => {
        button.addEventListener('click', function () {
            const reportType = this.getAttribute('data-report');
            reportTitle.textContent = this.textContent;
            reportContent.innerHTML = '';
            balanceChart.style.display = 'none';
            returnTablesContainer.style.display = 'none';
            reportContainer.style.display = 'block';

            if (reportType === 'balance') {
                  fetch('get_balance_report.php')
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                           reportContent.innerHTML = '';
                             if(data.balanceData.length>0){
                                 renderBalanceChart(data.balanceData);
                                 balanceChart.style.display = 'block';
                            } else {
                                    reportContent.innerHTML = '<p>No balance data available.</p>';
                                 }
                        } else {
                              console.error('Error fetching balance data:', data.message);
                                 showMessage('Error fetching balance data.', 'error');
                           }
                    })
                     .catch(error => {
                            console.error('Error fetching balance data:', error);
                             showMessage('An error occurred while fetching balance data.', 'error');
                        });

            }else if (reportType === 'return') {
                fetch('get_report_data.php', {
                     method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                     body: JSON.stringify({ reportType })
                 })
                 .then(response => response.json())
                   .then(data => {
                    if (data.success) {
                        customerReturnContent.innerHTML = '';
                        companyReturnContent.innerHTML = '';
                        if(data.customerReturns.length >0 || data.companyReturns.length >0){
                            renderReturnTables(data.customerReturns, data.companyReturns);
                            returnTablesContainer.style.display = 'block';
                        }else{
                            reportContent.innerHTML = '<p>No data available for returns.</p>';
                         }

                      } else {
                         console.error('Error fetching report data:', data.message);
                            showMessage('Error fetching report data.', 'error');
                      }
                })
                 .catch(error => {
                       console.error('Error fetching report data:', error);
                         showMessage('An error occurred while fetching report data.', 'error');
                   });
            }else{
                 fetch('get_report_data.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ reportType })
                })
                .then(response => response.json())
                  .then(data => {
                    if (data.success) {
                           if(data.reportData.length>0){
                                 renderReportTable(data.reportData, reportType);
                            }else{
                                  reportContent.innerHTML = `<p>No data available for ${reportType} report.</p>`;
                            }

                        } else {
                             console.error('Error fetching report data:', data.message);
                                showMessage('Error fetching report data.', 'error');
                        }
                    })
                  .catch(error => {
                            console.error('Error fetching report data:', error);
                             showMessage('An error occurred while fetching report data.', 'error');
                      });
            }


        });
    });

     function renderReportTable(reportData, reportType) {
            let tableHTML = '<table><thead><tr>';
            if(reportType=='inventory'){
                tableHTML += '<th>No</th><th>Product ID</th><th>Product Name</th><th>Stock</th>';
            } else if (reportType === 'cash' || reportType === 'credit' || reportType === 'cheque') {
                  tableHTML += '<th>No</th><th>Invoice No</th><th>Bill Date</th><th>Customer</th><th>Amount</th>';
            }
             tableHTML += '</tr></thead><tbody>';
             let i = 0;
            reportData.forEach(item => {
               i++;
                tableHTML += '<tr>';
                 if(reportType=='inventory'){
                       tableHTML += `<td>${i}</td><td>${item.product_id}</td><td>${item.product_name}</td><td>${item.stock}</td>`;
                   }else if (reportType === 'cash' || reportType === 'credit' || reportType === 'cheque') {
                         tableHTML += `<td>${i}</td><td>${item.invoice_no}</td><td>${item.bill_date}</td><td>${item.customer}</td><td>${item.total_amount}</td>`;
                    }

                tableHTML += '</tr>';
            });
            tableHTML += '</tbody></table>';
            reportContent.innerHTML = tableHTML;
     }
     function renderReturnTables(customerReturns, companyReturns){
           let customerTableHTML = '<table><thead><tr><th>No</th><th>Invoice No</th><th>Return Date</th><th>Customer</th><th>Amount</th></tr></thead><tbody>';
          let companyTableHTML = '<table><thead><tr><th>No</th><th>Invoice No</th><th>Return Date</th><th>Customer</th><th>Amount</th></tr></thead><tbody>';
           let i =0;
           customerReturns.forEach(item => {
              i++;
               customerTableHTML +=`<tr><td>${i}</td><td>${item.invoice_no}</td><td>${item.return_date}</td><td>${item.customer}</td><td>${item.total_amount}</td></tr>`;
           });
           customerTableHTML += '</tbody></table>';
         let j =0;
            companyReturns.forEach(item => {
             j++;
             companyTableHTML +=`<tr><td>${j}</td><td>${item.invoice_no}</td><td>${item.return_date}</td><td>${item.customer}</td><td>${item.total_amount}</td></tr>`;
            });
            companyTableHTML += '</tbody></table>';

          customerReturnContent.innerHTML = customerTableHTML;
           companyReturnContent.innerHTML= companyTableHTML;


     }
       function renderBalanceChart(balanceData) {
            const labels = balanceData.map(item => item.invoice_no);
            const amounts = balanceData.map(item => parseFloat(item.amount));
            const remainingAmounts = balanceData.map(item => parseFloat(item.remaining_amount));

             new Chart(balanceChart, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                           label: 'Amount',
                            data: amounts,
                            backgroundColor: 'rgba(54, 162, 235, 0.7)', // Blue
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                           label: 'Remaining Amount',
                            data: remainingAmounts,
                           backgroundColor: 'rgba(255, 99, 132, 0.7)', // Red
                            borderColor: 'rgba(255, 99, 132, 1)',
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
});