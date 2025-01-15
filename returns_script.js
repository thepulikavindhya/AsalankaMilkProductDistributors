document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('returns-items');
    const searchInput = document.getElementById('search-input');
    const messageContainer = document.getElementById('message-container');
     const nextBtn = document.getElementById('next-btn');
     const returnTypeButtons = document.querySelectorAll('.return-type-button');
       let rowCount = 0;
     let activeReturnType = 'customer';

    function showMessage(message, type) {
        messageContainer.textContent = message;
        messageContainer.className = `message-container ${type}`;
        messageContainer.style.display = 'block';
       setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000);
    }
      nextBtn.addEventListener('click', function() {
          window.location.href = 'reports.html';
      });
    function fetchReturnsData(returnType) {
          fetch('get_returns_data.php',{
                 method: 'POST',
                headers: {
                   'Content-Type': 'application/json'
               },
                 body: JSON.stringify({ returnType })
          })
            .then(response => response.json())
            .then(data => {
                 if (data.success) {
                   tableBody.innerHTML ='';
                     let i =0;
                        data.returns.forEach(item=>{
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


        searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim().toUpperCase();
        document.querySelectorAll('#returns-items tr').forEach(row => {
            const productId = row.querySelector('td:nth-child(2)').textContent.toUpperCase();
            if (productId.startsWith(searchTerm)) {
                row.style.display = ''; // Show matching rows
            } else {
                row.style.display = 'none'; // Hide non-matching rows
            }
        });
    });

    returnTypeButtons.forEach(button => {
        button.addEventListener('click', function () {
            returnTypeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
             activeReturnType = this.getAttribute('data-return-type');
              fetchReturnsData(activeReturnType);
        });
    });

     fetchReturnsData(activeReturnType);

});