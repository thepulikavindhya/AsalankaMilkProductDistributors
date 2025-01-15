document.addEventListener('DOMContentLoaded', function () {
    const invoiceNoInput = document.getElementById('invoice_no');
    const amountDueInput = document.getElementById('amount_due');
    const amountPaidInput = document.getElementById('amount_paid');
    const remainingAmountInput = document.getElementById('remaining_amount');
    const creditBalanceInput = document.getElementById('credit_balance');
    const savePaymentBtn = document.getElementById('save-payment-btn');
    const messageContainer = document.getElementById('message-container');
    const paymentListBody = document.getElementById('payment-list-items');
    const creditLimit = 10000;
    const searchPaymentsInput = document.getElementById('search-payments');
     const checkDetailsBody = document.getElementById('check-details-items');
    const addCheckDetailsBtn = document.getElementById('add-check-details-btn');
     let rowCount = 0;

     function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.className = `message-container ${type}`;
        messageContainer.style.display = 'block'; // Show the container
       setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000); // Hide after 3 seconds
    }

    invoiceNoInput.addEventListener('input', function () {
        const invoiceNo = invoiceNoInput.value.trim();
        if (invoiceNo) {
            fetch('get_payment_data.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ invoiceNo })
            })
                .then(response => response.json())
                 .then(data => {
                    if (data.success) {
                         amountDueInput.value = data.amount_due;
                        updateRemainingAmount();
                         fetchPreviousPayments(invoiceNo)
                         fetchCheckDetails(invoiceNo);

                    } else {
                        amountDueInput.value = '';
                         remainingAmountInput.value = '';
                           creditBalanceInput.value = '';
                        paymentListBody.innerHTML = '';
                          checkDetailsBody.innerHTML='';
                        console.error('Error fetching payment data:', data.message);
                         showMessage('Error fetching payment data.','error');
                    }
                })
                .catch(error => {
                     amountDueInput.value = '';
                    remainingAmountInput.value = '';
                     creditBalanceInput.value ='';
                       paymentListBody.innerHTML ='';
                     checkDetailsBody.innerHTML ='';
                     console.error('Error fetching payment data:', error);
                    showMessage('An error occurred while fetching payment data.','error');
                });
        } else {
             amountDueInput.value = '';
             remainingAmountInput.value = '';
              creditBalanceInput.value ='';
                paymentListBody.innerHTML ='';
                checkDetailsBody.innerHTML='';
        }
    });

     amountPaidInput.addEventListener('input', updateRemainingAmount);

    function updateRemainingAmount() {
        const amountDue = parseFloat(amountDueInput.value) || 0;
        const amountPaid = parseFloat(amountPaidInput.value) || 0;
        const remainingAmount = amountDue - amountPaid;
         remainingAmountInput.value = remainingAmount.toFixed(2);
          const creditBalance = (creditLimit - remainingAmount) >0 ? (creditLimit - remainingAmount).toFixed(2) : 0.00;
            creditBalanceInput.value= creditBalance;
    }

   savePaymentBtn.addEventListener('click',function(){
           const invoiceNo = invoiceNoInput.value.trim();
           const amountPaid = parseFloat(amountPaidInput.value) || 0;
           const creditBalance = parseFloat(creditBalanceInput.value) || 0;
           if(invoiceNo && amountPaid > 0){
                 fetch('save_payment.php', {
                    method: 'POST',
                    headers: {
                         'Content-Type': 'application/json'
                   },
                    body: JSON.stringify({
                         invoiceNo,
                          amountPaid,
                         creditBalance
                    })
                 })
                  .then(response => response.json())
                 .then(data => {
                    if(data.success){
                         showMessage('Payment data saved successfully!', 'success');
                           addPaymentToList(invoiceNo,amountPaid,creditBalance)
                           amountPaidInput.value = '0';
                          invoiceNoInput.value ='';
                           amountDueInput.value ='';
                            remainingAmountInput.value='';
                           creditBalanceInput.value ='';
                            fetchCheckDetails(invoiceNo);
                    }else{
                       console.error('Error saving payment data:', data.message);
                         showMessage('Error saving payment data.', 'error');
                   }
              })
              .catch(error => {
                        console.error('Error saving payment data:', error);
                          showMessage('An error occurred while saving payment data.', 'error');
                  });
             }else{
                 showMessage('Please enter all the details correctly!', 'error');
            }
   });
    function addPaymentToList(invoiceNo, amountPaid, creditBalance){
           const newRow = document.createElement('tr');
            newRow.innerHTML=`
               <td>${invoiceNo}</td>
               <td>${(typeof amountPaid === 'number' ? amountPaid.toFixed(2) : '0.00')}</td>
                 <td>${(typeof creditBalance === 'number' ? creditBalance.toFixed(2) : '0.00')}</td>
                   <td><button class="delete-row-btn">Delete</button></td>
            `;
             paymentListBody.appendChild(newRow);
               // Event listener for delete button
             newRow.querySelector('.delete-row-btn').addEventListener('click', function() {
                 const invoiceNo = newRow.querySelector('td:first-child').textContent;
                    fetch('delete_payment.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                 },
                                 body: JSON.stringify({
                                    invoiceNo
                                })
                         })
                         .then(response => response.json())
                         .then(data => {
                             if (data.success) {
                                 showMessage('Payment record deleted successfully!', 'success');
                                  newRow.remove();
                                   fetchPaymentList();
                                  fetchCheckDetails(invoiceNo);
                              } else {
                                   showMessage('Error deleting payment record.', 'error');
                             }
                        })
                        .catch(error => {
                           console.error('Error:', error);
                            showMessage('An error occurred while deleting data.', 'error');
                       });

             });

     }
      addCheckDetailsBtn.addEventListener('click', function() {
           const invoiceNo = invoiceNoInput.value.trim();
         if(invoiceNo){
             rowCount++;
              const newRow = document.createElement('tr');
            newRow.innerHTML = `
               <td>${rowCount}</td>
               <td>${invoiceNo}</td>
                 <td><input type="date" class="issue-date-input" ></td>
                  <td><input type="date" class="expiry-date-input"></td>
                 <td><input type="number" class="check-amount-input" value="0.00"></td>
                     <td><button class="save-edit-btn">Save</button> <button class="delete-row-btn">Delete</button></td>
             `;
             checkDetailsBody.appendChild(newRow);
                newRow.querySelector('.save-edit-btn').addEventListener('click', function(){
                     const issueDate = newRow.querySelector('.issue-date-input').value;
                     const expiryDate = newRow.querySelector('.expiry-date-input').value;
                       const checkAmount = parseFloat(newRow.querySelector('.check-amount-input').value);
                       if(invoiceNo && issueDate && expiryDate && !isNaN(checkAmount)){
                            fetch('save_check_details.php',{
                                  method: 'POST',
                                 headers: {
                                       'Content-Type': 'application/json'
                                   },
                                 body: JSON.stringify({
                                    invoiceNo,
                                    issueDate,
                                   expiryDate,
                                    checkAmount
                                    })
                            })
                               .then(response => response.json())
                               .then(data => {
                                   if (data.success) {
                                      showMessage('Check data saved successfully!', 'success');
                                        fetchCheckDetails(invoiceNo);

                                    } else {
                                        showMessage('Error saving check data.', 'error');
                                   }
                            })
                             .catch(error => {
                                 console.error('Error:', error);
                                   showMessage('An error occurred while saving data.', 'error');
                               });
                          }else{
                               showMessage('Please fill all the details correctly!', 'error');
                         }
                });
              newRow.querySelector('.delete-row-btn').addEventListener('click', function() {
                const invoiceNo = newRow.querySelector('td:nth-child(2)').textContent;
                 const issueDate = newRow.querySelector('.issue-date-input').value;
                 fetch('delete_check_details.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                 },
                                 body: JSON.stringify({
                                    invoiceNo,
                                   issueDate
                                })
                         })
                         .then(response => response.json())
                         .then(data => {
                             if (data.success) {
                                  showMessage('Check detail deleted successfully!', 'success');
                                 newRow.remove();
                                  fetchCheckDetails(invoiceNo);
                              } else {
                                  showMessage('Error deleting check details.', 'error');
                             }
                        })
                        .catch(error => {
                           console.error('Error:', error);
                            showMessage('An error occurred while deleting data.', 'error');
                       });

             });

         }else{
             showMessage('Please Enter Invoice number!', 'error');
         }

       });
    function fetchCheckDetails(invoiceNo) {
             fetch('get_check_details.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ invoiceNo })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                         checkDetailsBody.innerHTML = '';
                           let i =0;
                        data.checkDetails.forEach(check => {
                            i++;
                         const newRow = document.createElement('tr');
                         newRow.innerHTML =`
                           <td>${i}</td>
                             <td>${check.invoice_no}</td>
                             <td><input type="date" class="issue-date-input" value="${check.issue_date}" ></td>
                              <td><input type="date" class="expiry-date-input" value="${check.expiry_date}"></td>
                            <td><input type="number" class="check-amount-input" value="${check.check_amount}"></td>
                                 <td><button class="save-edit-btn">Save</button>  <button class="delete-row-btn">Delete</button></td>
                         `;
                         checkDetailsBody.appendChild(newRow);
                        newRow.querySelector('.save-edit-btn').addEventListener('click', function(){
                             const issueDate = newRow.querySelector('.issue-date-input').value;
                              const expiryDate = newRow.querySelector('.expiry-date-input').value;
                                 const checkAmount = parseFloat(newRow.querySelector('.check-amount-input').value);
                             if(invoiceNo && issueDate && expiryDate && !isNaN(checkAmount)){
                                  fetch('save_check_details.php',{
                                      method: 'POST',
                                      headers: {
                                          'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                           invoiceNo,
                                            issueDate,
                                           expiryDate,
                                            checkAmount
                                        })
                                })
                                .then(response => response.json())
                                 .then(data => {
                                     if (data.success) {
                                          showMessage('Check data saved successfully!', 'success');
                                           fetchCheckDetails(invoiceNo);
                                       } else {
                                           showMessage('Error saving check data.', 'error');
                                      }
                                })
                                 .catch(error => {
                                     console.error('Error:', error);
                                      showMessage('An error occurred while saving data.', 'error');
                                 });
                               }else{
                                   showMessage('Please fill all the details correctly!', 'error');
                               }
                        });
                         newRow.querySelector('.delete-row-btn').addEventListener('click', function() {
                               const invoiceNo = newRow.querySelector('td:nth-child(2)').textContent;
                                 const issueDate = newRow.querySelector('.issue-date-input').value;
                                fetch('delete_check_details.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                 },
                                 body: JSON.stringify({
                                    invoiceNo,
                                    issueDate
                                })
                         })
                         .then(response => response.json())
                         .then(data => {
                             if (data.success) {
                                 showMessage('Check detail deleted successfully!', 'success');
                                 newRow.remove();
                                 fetchCheckDetails(invoiceNo);
                               } else {
                                  showMessage('Error deleting check detail.', 'error');
                             }
                        })
                        .catch(error => {
                           console.error('Error:', error);
                            showMessage('An error occurred while deleting data.', 'error');
                       });
                             });

                        });

                    } else {
                        console.error('Failed to fetch check details:', data.message);
                         showMessage('Failed to fetch check details.', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error fetching check details:', error);
                     showMessage('An error occurred while fetching check details.', 'error');
                });
         }
    function fetchPreviousPayments(invoiceNo) {
            fetch('get_previous_payments.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ invoiceNo })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                         paymentListBody.innerHTML = '';
                        data.payments.forEach(payment => {
                            addPaymentToList(payment.invoice_no,payment.amount_paid,payment.credit_balance)
                         });
                    } else {
                         paymentListBody.innerHTML = '';
                       console.error('Failed to fetch previous payment list:', data.message);
                         showMessage('Failed to fetch previous payments.', 'error');
                    }
                })
                 .catch(error => {
                     paymentListBody.innerHTML = '';
                    console.error('Error fetching previous payment list:', error);
                    showMessage('An error occurred while fetching previous payments.', 'error');
                });
        }


     function fetchPaymentList() {
            fetch('get_payments.php')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        paymentListBody.innerHTML = '';
                        data.payments.forEach(payment => {
                            addPaymentToList(payment.invoice_no,payment.amount_paid,payment.credit_balance);
                         });
                    } else {
                        console.error('Failed to fetch payment list:', data.message);
                        showMessage('Failed to fetch payment list.', 'error');
                    }
                })
                 .catch(error => {
                    console.error('Error fetching payment list:', error);
                       showMessage('An error occurred while fetching payment data.', 'error');
                });
        }

        // Fetch payment list on page load
      fetchPaymentList();
     fetchPreviousPayments("");
      fetchCheckDetails("");
   searchPaymentsInput.addEventListener('input', function () {
         const searchTerm = searchPaymentsInput.value.trim().toUpperCase();
        document.querySelectorAll('#payment-list-items tr').forEach(row => {
             const invoiceNo = row.querySelector('td:first-child').textContent.toUpperCase();
             if (invoiceNo.startsWith(searchTerm)) {
                 row.style.display = ''; // Show matching rows
            } else {
               row.style.display = 'none'; // Hide non-matching rows
            }
         });
     });
});