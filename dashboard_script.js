document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
     const incomeAmount = document.getElementById('income-amount');
     const cashAmount = document.getElementById('cash-amount');
     const creditAmount = document.getElementById('credit-amount');
       const chequeAmount = document.getElementById('cheque-amount');
    const productChart = document.getElementById('productChart');
    const topSellingTableBody = document.getElementById('top-selling-items');
     const stockAlertTableBody = document.getElementById('stock-alert-items');
      const viewTopSellingBtn = document.getElementById('view-top-selling-btn');
     const viewStockAlertBtn = document.getElementById('view-stock-alert-btn');
     const messageContainer = document.getElementById('message-container');
      const addNewBtn = document.getElementById('add-new-btn');
    const modalContainer = document.getElementById('modal-container');
    const modalTitle = document.getElementById('modal-title');
    const modalDataContainer = document.getElementById('modal-data-container');
    const closeBtn = document.querySelector('.close-btn');

    function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.className = `message-container ${type}`;
        messageContainer.style.display = 'block';
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000);
    }
     addNewBtn.addEventListener('click',function(){
       window.location.href = 'stock.html';
   });
   searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim().toUpperCase();
          if (searchTerm) {
              fetch('get_search_data.php',{
              method: 'POST',
                headers: {
                   'Content-Type': 'application/json'
               },
                 body: JSON.stringify({ searchTerm })
             })
             .then(response => response.json())
              .then(data => {
                  if(data.success){
                    renderTopSellingProducts(data.topSellingProducts);
                    renderStockAlert(data.stockAlerts);
                    }else{
                       console.error('Error fetching data:', data.message);
                       showMessage('Error fetching search data.', 'error');
                   }
                })
                .catch(error => {
                     console.error('Error during fetching search data:', error);
                    showMessage('An error occurred while fetching search data.', 'error');
                 });
          }else{
               fetchDashboardData();
         }
    });
    function fetchDashboardData() {
        fetch('get_dashboard_data.php')
          .then(response => response.json())
          .then(data => {
             if (data.success) {
                incomeAmount.textContent = data.total_income;
                 cashAmount.textContent = data.total_cash;
                   creditAmount.textContent = data.total_credit;
                 chequeAmount.textContent = data.total_cheque;
                 renderPaymentChart(data);
                renderTopSellingProducts(data.topSellingProducts);
                 renderStockAlert(data.stockAlerts);

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
  function renderPaymentChart(data) {
    const labels = ['Cash', 'Credit', 'Cheque'];
    const amounts = [
      parseFloat(data.total_cash) || 0,
      parseFloat(data.total_credit) || 0,
      parseFloat(data.total_cheque) || 0,
    ];

    new Chart(productChart, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Amount',
            data: amounts,
            backgroundColor: [
              'rgba(75, 192, 192, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(153, 102, 255, 0.7)',
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(153, 102, 255, 1)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  function renderTopSellingProducts(topSellingProducts) {
    topSellingTableBody.innerHTML = '';
    let i = 0;
    topSellingProducts.forEach((item) => {
      i++;
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
                      <td>${item.product_id}</td>
                      <td>${item.product_name}</td>
                      <td>${item.quantity}</td>
                       <td>${item.total_amount}</td>
                    `;
      topSellingTableBody.appendChild(newRow);
    });
  }
 function renderStockAlert(stockAlerts) {
    stockAlertTableBody.innerHTML = '';
    stockAlerts.forEach((item) => {
      const newRow = document.createElement('tr');
      newRow.innerHTML = `
                      <td>${item.product_id}</td>
                       <td>${item.product_name}</td>
                      <td>${item.stock}</td>
                     
                    `;
      stockAlertTableBody.appendChild(newRow);
    });
  }




  function renderModalTable(data) {
    let tableHTML = '<table><thead><tr>';
    if (modalTitle.textContent == 'Top Selling Products') {
      tableHTML +=
        '<th>No</th><th>Product ID</th><th>Product Name</th><th>Quantity</th><th>Amount</th>';
    } else if (modalTitle.textContent == 'Stock Alert') {
      tableHTML += '<th>No</th><th>Product ID</th><th>Product Name</th><th>Stock</th>';
    }
    tableHTML += '</tr></thead><tbody>';
    let i = 0;
    if (modalTitle.textContent == 'Top Selling Products') {
      data.forEach((item) => {
        i++;
        tableHTML += `<tr><td>${i}</td><td>${item.product_id}</td><td>${item.product_name}</td><td>${item.quantity}</td><td>${item.total_amount}</td></tr>`;
      });
    } else if (modalTitle.textContent == 'Stock Alert') {
      data.forEach((item) => {
        i++;
        tableHTML += `<tr><td>${i}</td><td>${item.product_id}</td><td>${item.product_name}</td><td>${item.stock}</td></tr>`;
      });
    }
    tableHTML += '</tbody></table>';
    modalDataContainer.innerHTML = tableHTML;
  }
  closeBtn.addEventListener('click', function () {
    modalContainer.style.display = 'none';
  });
  window.addEventListener('click', function (event) {
    if (event.target === modalContainer) {
      modalContainer.style.display = 'none';
    }
  });

  fetchDashboardData();
});