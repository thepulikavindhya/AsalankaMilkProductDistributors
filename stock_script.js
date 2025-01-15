document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('stock-items');
    const addRowBtn = document.getElementById('add-row-btn');
    const removeRowBtn = document.getElementById('remove-row-btn');
    const searchInput = document.getElementById('search-input');
     const submitBtn = document.getElementById('submit-btn');
    const messageContainer = document.getElementById('message-container');
     const companyReturnsBody = document.getElementById('company-returns-items');
    const customerReturnsBody = document.getElementById('customer-returns-items');
    let rowCount = 0;

    function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.className = `message-container ${type}`;
        messageContainer.style.display = 'block';
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000);
    }

    addRowBtn.addEventListener('click', function () {
        rowCount++;
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
               <td>${rowCount}</td>
              <td><input type="text" class="product-id-input"></td>
               <td><input type="text" class="product-name-input"></td>
             <td><input type="number" class="stock-input" value="0"></td>
                <td><button class="edit-row-btn">Edit</button> <button class="delete-row-btn">Delete</button></td>
           `;
        tableBody.appendChild(newRow);
         // Event listener for edit button
        newRow.querySelector('.edit-row-btn').addEventListener('click', function () {
            enableEditMode(newRow);
        });

        // Event listener for delete button
        newRow.querySelector('.delete-row-btn').addEventListener('click', function () {
            newRow.remove();
            rowCount = 0;
            document.querySelectorAll('#stock-items tr').forEach((row, index) => {
                rowCount++;
                row.querySelector('td:first-child').textContent = rowCount;
            });
        });
    });


    removeRowBtn.addEventListener('click', function () {
        const lastRow = tableBody.lastElementChild;
        if (lastRow) {
            lastRow.remove();
            rowCount = 0;
            document.querySelectorAll('#stock-items tr').forEach((row, index) => {
                rowCount++;
                row.querySelector('td:first-child').textContent = rowCount;
            });
        }
    });

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim().toUpperCase();
        document.querySelectorAll('#stock-items tr').forEach(row => {
            const productId = row.querySelector('td:nth-child(2)').textContent.toUpperCase();
            if (productId.startsWith(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    // Function to fetch stock data from the database
    function fetchStockData() {
        fetch('get_stock.php')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    tableBody.innerHTML = '';
                    let i = 0;
                    data.products.forEach(product => {
                        i++;
                        const newRow = document.createElement('tr');
                        newRow.innerHTML = `
                               <td>${i}</td>
                                <td>${product.product_id}</td>
                                <td>${product.product_name}</td>
                                <td>${product.stock}</td>
                                 <td><button class="edit-row-btn">Edit</button> <button class="delete-row-btn">Delete</button></td>
                              `;
                        tableBody.appendChild(newRow);
                        // Event listener for edit button
                        newRow.querySelector('.edit-row-btn').addEventListener('click', function () {
                            enableEditMode(newRow);
                        });
                        // Event listener for delete button
                        newRow.querySelector('.delete-row-btn').addEventListener('click', function () {
                            const productId = product.product_id;
                            fetch('delete_product.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ productId })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        showMessage('Product deleted successfully!', 'success');
                                        newRow.remove();
                                        fetchStockData();
                                    } else {
                                        showMessage('Error deleting product.', 'error');
                                    }
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                    showMessage('An error occurred while deleting data.', 'error');
                                });
                        });
                    });
                    rowCount = i;
                } else {
                    console.error('Failed to fetch stock:', data.message);
                    showMessage('Failed to fetch stock.', 'error');
                }
            })
            .catch(error => {
                console.error('Error fetching stock:', error);
                showMessage('An error occurred while fetching data.', 'error');
            });
    }


    function fetchReturnsData() {
           fetch('get_returns.php')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                         companyReturnsBody.innerHTML = '';
                        customerReturnsBody.innerHTML = '';
                       let i =0;
                       let j = 0;
                      data.companyReturns.forEach(item =>{
                         i++;
                        const newRow = document.createElement('tr');
                        newRow.innerHTML=`
                           <td>${i}</td>
                            <td>${item.invoice_no}</td>
                             <td>${item.return_date}</td>
                            <td>${item.product}</td>
                           <td>${item.qty}</td>
                           <td>${item.amount}</td>
                        `;
                        companyReturnsBody.appendChild(newRow);
                    });
                    data.customerReturns.forEach(item => {
                           j++;
                             const newRow = document.createElement('tr');
                           newRow.innerHTML=`
                           <td>${j}</td>
                            <td>${item.invoice_no}</td>
                            <td>${item.return_date}</td>
                             <td>${item.product}</td>
                              <td>${item.qty}</td>
                             <td>${item.amount}</td>
                        `;
                         customerReturnsBody.appendChild(newRow);
                    });
                    } else {
                        console.error('Failed to fetch returns:', data.message);
                       showMessage('Failed to fetch returns.', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error fetching returns:', error);
                      showMessage('An error occurred while fetching returns.', 'error');
                });
      }

    // Fetch stock data on page load
     fetchStockData();
    fetchReturnsData();

   function enableEditMode(row) {
        const productIdCell = row.querySelector('td:nth-child(2)');
        const productNameCell = row.querySelector('td:nth-child(3)');
        const stockCell = row.querySelector('td:nth-child(4)');
        const actionsCell = row.querySelector('td:last-child');
        const originalProductId = productIdCell.textContent;
        const originalProductName = productNameCell.textContent;
        const originalStock = stockCell.textContent;

        productIdCell.innerHTML = `<input type="text" class="edit-product-id-input" value="${originalProductId}">`;
        productNameCell.innerHTML = `<input type="text" class="edit-product-name-input" value="${originalProductName}">`;
        stockCell.innerHTML = `<input type="number" class="edit-stock-input" value="${originalStock}">`;
        actionsCell.innerHTML = `<button class="save-edit-btn">Save</button> <button class="cancel-edit-btn">Cancel</button>`;


        row.querySelector('.save-edit-btn').addEventListener('click', function () {
            const editedProductId = row.querySelector('.edit-product-id-input').value;
            const editedProductName = row.querySelector('.edit-product-name-input').value;
            const editedStock = parseInt(row.querySelector('.edit-stock-input').value);
            if (editedProductId && editedProductName && !isNaN(editedStock)) {
                fetch('save_stock.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                         all_data: [{
                           productId:editedProductId,
                           productName: editedProductName,
                           stock: editedStock
                        }]
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            showMessage('Product updated successfully!', 'success');
                            fetchStockData();
                        } else {
                            showMessage('Error updating product.', 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        showMessage('An error occurred while updating data.', 'error');
                    });
            }else{
                  showMessage('Please enter all the details!', 'error');
            }


        });
        row.querySelector('.cancel-edit-btn').addEventListener('click', function () {
           productIdCell.textContent = originalProductId;
           productNameCell.textContent = originalProductName;
           stockCell.textContent = originalStock;
           actionsCell.innerHTML = `<button class="edit-row-btn">Edit</button> <button class="delete-row-btn">Delete</button>`;
           newRow.querySelector('.edit-row-btn').addEventListener('click', function () {
              enableEditMode(row);
         });
         newRow.querySelector('.delete-row-btn').addEventListener('click', function () {
                            const productId = originalProductId;
                            fetch('delete_product.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ productId })
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data.success) {
                                        showMessage('Product deleted successfully!', 'success');
                                         row.remove();
                                        fetchStockData();
                                    } else {
                                        showMessage('Error deleting product.', 'error');
                                    }
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                    showMessage('An error occurred while deleting data.', 'error');
                                });
           });
       });
    }
    // Update stock on the database
     submitBtn.addEventListener('click', function() {
         const rows =  document.querySelectorAll('#stock-items tr');
       let all_data = []
          rows.forEach(newRow =>{
           const productIdCell = newRow.querySelector('td:nth-child(2)');
           const productNameCell = newRow.querySelector('td:nth-child(3)');
             const stockCell = newRow.querySelector('td:nth-child(4)');
            const productId = productIdCell?.textContent;
              const productName = productNameCell?.textContent;
              const stock = parseInt(stockCell?.textContent)
              if(productId && productName && !isNaN(stock)){
                  all_data.push({productId,productName,stock});
                 }
           });
             if(all_data.length>0){
                fetch('save_stock.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      all_data
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showMessage('Product stock saved successfully!', 'success');
                        fetchStockData();
                    } else {
                        showMessage('Error saving stock data.', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showMessage('An error occurred while saving data.', 'error');
                });
             }else{
                 showMessage('Please enter all the details!', 'error');
             }
        });
});