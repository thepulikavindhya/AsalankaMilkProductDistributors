document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('invoice-items');
    const addRowBtn = document.getElementById('add-row-btn');
    const removeRowBtn = document.getElementById('remove-row-btn');
    const submitBtn = document.getElementById('submit-btn');
    const saveBtn = document.getElementById('save-btn');
     const messageContainer = document.getElementById('message-container');
    const invoiceListBody = document.getElementById('invoice-list-items');
    let rowCount = 0;

  function update_total(){
        let totalAmount = 0;
           document.querySelectorAll('#invoice-items tr').forEach(row => {
                const amountCell = row.querySelector('td:nth-child(6)');
                if (amountCell && !isNaN(parseFloat(amountCell.textContent))) {
                     totalAmount += parseFloat(amountCell.textContent);
                }
           });
           document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
    }

    addRowBtn.addEventListener('click', function () {
        rowCount++;
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${rowCount}</td>
            <td><input type="text" class="product-input"></td>
            <td><input type="number" class="qty-input" value="0"></td>
            <td><input type="number" class="original-price-input" value="0.00"></td>
            <td><input type="number" class="discounted-price-input" value="0.00"></td>
            <td class="amount">0.00</td>
              <td><button class="delete-row-btn">Delete</button></td>
        `;
        tableBody.appendChild(newRow);
        // Event listener to calculate amount on qty, original price, discounted price change
            newRow.querySelectorAll('input[type="number"]').forEach(input => {
                input.addEventListener('input', function() {
                    const qty = parseFloat(newRow.querySelector('.qty-input').value) || 0;
                    const originalPrice = parseFloat(newRow.querySelector('.original-price-input').value) || 0;
                    const discountedPrice = parseFloat(newRow.querySelector('.discounted-price-input').value) || 0;
                     let amount = (qty * (discountedPrice || originalPrice)).toFixed(2);
                    newRow.querySelector('.amount').textContent = amount;
                       update_total();

                });
            });

            // Event listener for delete button
            newRow.querySelector('.delete-row-btn').addEventListener('click', function() {
               newRow.remove();
                  update_total();
                  rowCount=0;
                  document.querySelectorAll('#invoice-items tr').forEach((row, index)=> {
                     rowCount++;
                     row.querySelector('td:first-child').textContent=rowCount;
                  });

            });

    });

    removeRowBtn.addEventListener('click', function () {
       const lastRow = tableBody.lastElementChild;
        if (lastRow) {
           lastRow.remove();
           update_total();
            rowCount=0;
              document.querySelectorAll('#invoice-items tr').forEach((row, index)=> {
                     rowCount++;
                     row.querySelector('td:first-child').textContent=rowCount;
                  });
        }
    });

     saveBtn.addEventListener('click', function () {
           showMessage('Invoice data saved Successfully!','success');

        });


    submitBtn.addEventListener('click', function () {
          const paymentMethod = document.querySelector('input[name="payment_method"]:checked').value;
          const invoiceNo = document.getElementById('invoice_no').value;
          const billDate = document.getElementById('bill_date').value;
          const deliverymanId = document.getElementById('deliveryman_id').value;
          const customer = document.getElementById('customer').value;
         const totalAmount = parseFloat(document.getElementById('total-amount').textContent);
        const items = [];
        document.querySelectorAll('#invoice-items tr').forEach(row => {
            const product = row.querySelector('.product-input').value;
            const qty = parseInt(row.querySelector('.qty-input').value);
            const originalPrice = parseFloat(row.querySelector('.original-price-input').value);
            const discountedPrice = parseFloat(row.querySelector('.discounted-price-input').value);
             const amount = parseFloat(row.querySelector('.amount').textContent);
            items.push({ product, qty, originalPrice, discountedPrice, amount });
        });
          console.log({
            paymentMethod,
            invoiceNo,
             billDate,
            deliverymanId,
            customer,
             totalAmount,
            items
        });

         fetch('save_invoice.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                       paymentMethod,
                        invoiceNo,
                         billDate,
                         deliverymanId,
                         customer,
                          totalAmount,
                         items
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showMessage('Invoice data saved successfully!', 'success');
                         addInvoiceToList(invoiceNo,totalAmount);
                         resetForm();
                           fetch('update_stock_from_bill.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ items })
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                  // Stock updated
                                     console.log('Stock updated successfully');
                                } else {
                                    console.error('Error updating stock:', data.message);
                                     showMessage('Error updating stock.', 'error');
                                }
                            })
                            .catch(error => {
                                console.error('Error updating stock:', error);
                               showMessage('An error occurred while updating stock.', 'error');
                            });
                    } else {
                        showMessage('Error saving invoice data.', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showMessage('An error occurred while saving data.', 'error');
                });


    });
     function addInvoiceToList(invoiceNo,totalAmount){
           const newRow = document.createElement('tr');
            newRow.innerHTML=`
               <td>${invoiceNo}</td>
               <td>${totalAmount.toFixed(2)}</td>
            `;
             invoiceListBody.appendChild(newRow);

     }

      function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.className = `message-container ${type}`;
        messageContainer.style.display = 'block'; // Show the container
       setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000); // Hide after 3 seconds
    }
    function resetForm(){
         document.getElementById('invoice_no').value="";
         document.getElementById('bill_date').value="";
         document.getElementById('deliveryman_id').value="";
         document.getElementById('customer').value="";
         document.getElementById('invoice-items').innerHTML="";
         document.getElementById('total-amount').textContent="0.00";
         rowCount=0;
    }

      // Function to fetch invoices from the database on page load
       function fetchInvoices() {
            fetch('get_invoices.php') // Assuming get_invoices.php is your script
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        invoiceListBody.innerHTML = ''; // Clear existing rows
                        data.invoices.forEach(invoice => {
                             addInvoiceToList(invoice.invoice_no,invoice.amount)
                        });
                    } else {
                        console.error('Failed to fetch invoices:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Error fetching invoices:', error);
                });
        }

        // Fetch invoices on page load
        fetchInvoices();

});