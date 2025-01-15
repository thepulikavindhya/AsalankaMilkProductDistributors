document.addEventListener('DOMContentLoaded', function () {
  const tableBody = document.getElementById('return-items');
  const addRowBtn = document.getElementById('add-row-btn');
  const submitBtn = document.getElementById('submit-btn');
   const messageContainer = document.getElementById('message-container');
  let rowCount = 0;

  function update_total(){
      let totalAmount = 0;
         document.querySelectorAll('#return-items tr').forEach(row => {
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
                document.querySelectorAll('#return-items tr').forEach((row, index)=> {
                   rowCount++;
                   row.querySelector('td:first-child').textContent=rowCount;
                });

          });
  });

  submitBtn.addEventListener('click', function () {
      const returnType = document.querySelector('input[name="return_type"]:checked').value;
      const invoiceNo = document.getElementById('invoice_no').value;
      const billDate = document.getElementById('bill_date').value;
      const returnDate = document.getElementById('return_date').value;
      const deliverymanId = document.getElementById('deliveryman_id').value;
      const customer = document.getElementById('customer').value;
      const reason = document.getElementById('reason').value;
     const totalAmount = parseFloat(document.getElementById('total-amount').textContent);

      const items = [];
      document.querySelectorAll('#return-items tr').forEach(row => {
          const product = row.querySelector('.product-input').value;
          const qty = parseInt(row.querySelector('.qty-input').value);
          const originalPrice = parseFloat(row.querySelector('.original-price-input').value);
          const discountedPrice = parseFloat(row.querySelector('.discounted-price-input').value);
          const amount = parseFloat(row.querySelector('.amount').textContent);

          items.push({ product, qty, originalPrice, discountedPrice, amount });
      });
       console.log({
          returnType,
          invoiceNo,
          billDate,
          returnDate,
          deliverymanId,
          customer,
          reason,
           totalAmount,
          items
      });
       fetch('save_return.php', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      returnType,
                      invoiceNo,
                      billDate,
                      returnDate,
                      deliverymanId,
                      customer,
                      reason,
                       totalAmount,
                      items
                  })
              })
              .then(response => response.json())
              .then(data => {
                  if (data.success) {
                      showMessage('Return data saved successfully!', 'success');
                       resetForm(); // Clear the form
                  } else {
                      showMessage('Error saving return data.', 'error');
                  }
              })
              .catch(error => {
                  console.error('Error:', error);
                  showMessage('An error occurred while saving data.', 'error');
              });
  });

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
       document.getElementById('return_date').value="";
       document.getElementById('deliveryman_id').value="";
       document.getElementById('customer').value="";
       document.getElementById('reason').value="";
       document.getElementById('return-items').innerHTML="";
       document.getElementById('total-amount').textContent="0.00";
       rowCount = 0;
  }
});