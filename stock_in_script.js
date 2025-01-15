document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('stock-in-items');
    const searchInput = document.getElementById('search-input');
    const messageContainer = document.getElementById('message-container');
     const addNewBtn = document.getElementById('add-new-btn');
      const nextBtn = document.getElementById('next-btn');
      let rowCount = 0;
     function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.className = `message-container ${type}`;
        messageContainer.style.display = 'block'; // Show the container
       setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000); // Hide after 3 seconds
    }
     addNewBtn.addEventListener('click',function(){
       window.location.href = 'stock.html';
   });
    nextBtn.addEventListener('click', function() {
         window.location.href = 'sales.html';
    });


    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim().toUpperCase();
        document.querySelectorAll('#stock-in-items tr').forEach(row => {
            const productId = row.querySelector('td:nth-child(2)').textContent.toUpperCase();
              if (productId.startsWith(searchTerm)) {
                row.style.display = ''; // Show matching rows
            } else {
                row.style.display = 'none'; // Hide non-matching rows
            }
        });
    });


    // Function to fetch stock data from the database
    function fetchStockData() {
            fetch('get_stock_data.php')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                         tableBody.innerHTML = '';
                         let i =0;
                        data.products.forEach(product => {
                             i++;
                             const newRow = document.createElement('tr');
                            newRow.innerHTML = `
                                 <td>${i}</td>
                                <td>${product.product_id}</td>
                                <td>${product.product_name}</td>
                                <td>${product.stock}</td>
                              `;
                                tableBody.appendChild(newRow);
                        });
                         rowCount = i;

                    } else {
                        console.error('Failed to fetch stock:', data.message);
                         showMessage('Failed to fetch stock.','error');
                    }
                })
                .catch(error => {
                    console.error('Error fetching stock:', error);
                     showMessage('An error occurred while fetching data.', 'error');
                });
        }

        // Fetch stock data on page load
        fetchStockData();


});