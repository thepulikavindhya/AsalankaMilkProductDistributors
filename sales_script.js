document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('sales-items');
    const searchInput = document.getElementById('search-input');
    const messageContainer = document.getElementById('message-container');
     const nextBtn = document.getElementById('next-btn');
       const addNewBtn = document.getElementById('add-new-btn');
    let rowCount = 0;

     function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.className = `message-container ${type}`;
        messageContainer.style.display = 'block'; // Show the container
       setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000); // Hide after 3 seconds
    }
      nextBtn.addEventListener('click', function() {
          window.location.href = 'orders.html';
      });
      addNewBtn.addEventListener('click', function() {
          window.location.href = 'bill.html';
      });


    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim().toUpperCase();
        document.querySelectorAll('#sales-items tr').forEach(row => {
            const productId = row.querySelector('td:nth-child(2)').textContent.toUpperCase();
            if (productId.startsWith(searchTerm)) {
                row.style.display = ''; // Show matching rows
            } else {
                row.style.display = 'none'; // Hide non-matching rows
            }
        });
    });

      function fetchSalesData() {
        fetch('get_sales_data.php')
          .then(response => response.json())
          .then(data => {
             if (data.success) {
                  tableBody.innerHTML = '';
                 let i = 0;
                    data.sales.forEach(item=>{
                        i++;
                         const newRow = document.createElement('tr');
                         newRow.innerHTML = `
                                <td>${i}</td>
                              <td>${item.product_id}</td>
                               <td>${item.product_name}</td>
                                <td>${item.qty}</td>
                                <td>${item.amount}</td>
                            `;
                         tableBody.appendChild(newRow);
                    });
                     rowCount=i;
              }else{
                console.error('Error fetching data:', data.message);
                 showMessage('Error fetching sales data.', 'error');
               }
           })
          .catch(error => {
              console.error('Error fetching data:', error);
              showMessage('An error occurred while fetching sales data.', 'error');
          });
    }
   fetchSalesData();

});