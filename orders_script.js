document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('orders-items');
    const searchInput = document.getElementById('search-input');
      const paymentTypeButtons = document.querySelectorAll('.payment-type-button');
     const messageContainer = document.getElementById('message-container');
     const nextBtn = document.getElementById('next-btn');
    let activePaymentType = 'cash';
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
           window.location.href = 'deliverymen.html';
      });

    function fetchOrderData(paymentType) {
         fetch('get_order_data.php', {
            method: 'POST',
                headers: {
                   'Content-Type': 'application/json'
                },
                  body: JSON.stringify({ paymentType })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                     tableBody.innerHTML ='';
                     let i =0;
                        data.orders.forEach(order=>{
                           i++;
                            const newRow = document.createElement('tr');
                            newRow.innerHTML = `
                                <td>${i}</td>
                                <td>${order.product_id}</td>
                                <td>${order.product_name}</td>
                                <td>${order.qty}</td>
                                 <td>${order.amount}</td>
                           `;
                            tableBody.appendChild(newRow);
                       });
                        rowCount =i;
                }else{
                      console.error('Failed to fetch orders:', data.message);
                       showMessage('Failed to fetch orders.', 'error');
                   }
           })
           .catch(error => {
                 console.error('Error fetching orders:', error);
                  showMessage('An error occurred while fetching orders.', 'error');
           });
    }
        searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim().toUpperCase();
        document.querySelectorAll('#orders-items tr').forEach(row => {
            const productId = row.querySelector('td:nth-child(2)').textContent.toUpperCase();
              if (productId.startsWith(searchTerm)) {
                row.style.display = ''; // Show matching rows
            } else {
                row.style.display = 'none'; // Hide non-matching rows
            }
        });
    });

    paymentTypeButtons.forEach(button => {
        button.addEventListener('click', function () {
            paymentTypeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
             activePaymentType = this.getAttribute('data-payment-type');
            fetchOrderData(activePaymentType);
        });
    });
      fetchOrderData(activePaymentType);
});