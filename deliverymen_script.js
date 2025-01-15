document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('deliverymen-items');
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
         window.location.href = 'vendors.html';
     });

    addNewBtn.addEventListener('click', function () {
         addNewRow();
    });

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim().toUpperCase();
        document.querySelectorAll('#deliverymen-items tr').forEach(row => {
            const deliverId = row.querySelector('td:nth-child(2)').textContent.toUpperCase();
            if (deliverId.startsWith(searchTerm)) {
                row.style.display = ''; // Show matching rows
            } else {
                row.style.display = 'none'; // Hide non-matching rows
            }
        });
    });

      function addNewRow(){
           rowCount++;
            const newRow = document.createElement('tr');
           newRow.innerHTML = `
               <td>${rowCount}</td>
               <td><input type="text" class="deliver-id-input"></td>
                <td><input type="text" class="name-input"></td>
                <td><input type="text" class="contact-no-input"></td>
                <td><input type="number" class="age-input" value="0"></td>
                  <td><input type="text" class="no-of-invoice-input"></td>
                 <td><button class="save-row-btn">Save</button> <button class="delete-row-btn">Delete</button></td>
           `;
           tableBody.appendChild(newRow);
            newRow.querySelector('.save-row-btn').addEventListener('click', function() {
                    const deliverId = newRow.querySelector('.deliver-id-input').value;
                     const name = newRow.querySelector('.name-input').value;
                    const contactNo = newRow.querySelector('.contact-no-input').value;
                    const age = parseInt(newRow.querySelector('.age-input').value);
                   const noOfInvoice = newRow.querySelector('.no-of-invoice-input').value;

                  if(deliverId && name && !isNaN(age)){
                         fetch('save_deliveryman.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                 },
                                 body: JSON.stringify({
                                    deliverId,
                                     name,
                                   contactNo,
                                     age,
                                   noOfInvoice
                                })
                         })
                         .then(response => response.json())
                         .then(data => {
                             if (data.success) {
                                 showMessage('Deliveryman saved successfully!', 'success');
                                   fetchDeliverymenData();
                              } else {
                                  showMessage('Error saving deliveryman data.', 'error');
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

            // Event listener for delete button
             newRow.querySelector('.delete-row-btn').addEventListener('click', function() {
                 const deliverId = newRow.querySelector('.deliver-id-input').value;
                  fetch('delete_deliveryman.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                 },
                                 body: JSON.stringify({
                                    deliverId
                                })
                         })
                         .then(response => response.json())
                         .then(data => {
                             if (data.success) {
                                 showMessage('Deliveryman deleted successfully!', 'success');
                                 newRow.remove();
                                   fetchDeliverymenData();
                              } else {
                                   showMessage('Error deleting deliveryman.', 'error');
                             }
                        })
                        .catch(error => {
                           console.error('Error:', error);
                             showMessage('An error occurred while deleting data.', 'error');
                       });

            });
      }


        function fetchDeliverymenData() {
            fetch('get_deliverymen_data.php')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                         tableBody.innerHTML = '';
                        let i =0;
                        data.deliverymen.forEach(deliveryman => {
                              i++;
                            const newRow = document.createElement('tr');
                            newRow.innerHTML = `
                                   <td>${i}</td>
                                <td>${deliveryman.deliver_id}</td>
                                <td>${deliveryman.name}</td>
                                <td>${deliveryman.contact_no}</td>
                                 <td>${deliveryman.age}</td>
                                 <td>${deliveryman.no_of_invoice}</td>
                                  <td><button class="delete-row-btn">Delete</button></td>
                            `;
                              tableBody.appendChild(newRow);

                               newRow.querySelector('.delete-row-btn').addEventListener('click', function() {
                                   const deliverId = deliveryman.deliver_id;
                                  fetch('delete_deliveryman.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                 },
                                 body: JSON.stringify({
                                    deliverId
                                })
                         })
                         .then(response => response.json())
                         .then(data => {
                             if (data.success) {
                                showMessage('Deliveryman deleted successfully!', 'success');
                                 newRow.remove();
                                   fetchDeliverymenData();
                              } else {
                                    showMessage('Error deleting deliveryman.', 'error');
                             }
                        })
                        .catch(error => {
                           console.error('Error:', error);
                            showMessage('An error occurred while deleting data.', 'error');
                       });
                               });

                        });
                        rowCount =i;

                    } else {
                        console.error('Failed to fetch deliverymen:', data.message);
                         showMessage('Failed to fetch deliverymen.', 'error');
                    }
                })
               .catch(error => {
                    console.error('Error fetching deliverymen:', error);
                    showMessage('An error occurred while fetching data.', 'error');
                });
        }

        // Fetch vendor data on page load
        fetchDeliverymenData();
});