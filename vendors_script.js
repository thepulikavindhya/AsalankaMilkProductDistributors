document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('vendors-items');
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
           window.location.href = 'returns.html';
      });
    addNewBtn.addEventListener('click', function () {
          addNewRow();
    });

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim().toUpperCase();
        document.querySelectorAll('#vendors-items tr').forEach(row => {
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
                <td><input type="number" class="credit-limit-input" value="0.00"></td>
                <td><input type="text" class="joined-date-input"></td>
                <td><button class="save-row-btn">Save</button> <button class="delete-row-btn">Delete</button></td>
           `;
           tableBody.appendChild(newRow);

             newRow.querySelector('.save-row-btn').addEventListener('click', function() {
                    const deliverId = newRow.querySelector('.deliver-id-input').value;
                    const name = newRow.querySelector('.name-input').value;
                    const contactNo = newRow.querySelector('.contact-no-input').value;
                    const creditLimit = parseFloat(newRow.querySelector('.credit-limit-input').value);
                    const joinedDate = newRow.querySelector('.joined-date-input').value;
                  if(deliverId && name && !isNaN(creditLimit)){
                         fetch('save_vendor.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                 },
                                 body: JSON.stringify({
                                    deliverId,
                                    name,
                                   contactNo,
                                    creditLimit,
                                    joinedDate
                                })
                         })
                         .then(response => response.json())
                         .then(data => {
                             if (data.success) {
                                showMessage('Vendor saved successfully!', 'success');
                                  fetchVendorData();
                              } else {
                                    showMessage('Error saving vendor data.', 'error');
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
                  fetch('delete_vendor.php', {
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
                                showMessage('Vendor Deleted successfully!', 'success');
                                 newRow.remove();
                                   fetchVendorData();
                              } else {
                                  showMessage('Error deleting vendor.', 'error');
                             }
                        })
                        .catch(error => {
                           console.error('Error:', error);
                            showMessage('An error occurred while deleting data.', 'error');
                       });
            });
     }

       // Function to fetch vendor data from the database
        function fetchVendorData() {
            fetch('get_vendor_data.php')
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                         tableBody.innerHTML = '';
                         let i =0;
                        data.vendors.forEach(vendor => {
                            i++;
                            const newRow = document.createElement('tr');
                            newRow.innerHTML = `
                                  <td>${i}</td>
                                <td>${vendor.deliver_id}</td>
                                <td>${vendor.name}</td>
                                 <td>${vendor.contact_no}</td>
                                <td>${vendor.credit_limit}</td>
                                <td>${vendor.joined_date}</td>
                                 <td><button class="delete-row-btn">Delete</button></td>
                            `;
                              tableBody.appendChild(newRow);
                           newRow.querySelector('.delete-row-btn').addEventListener('click', function() {
                               const deliverId = vendor.deliver_id;
                                fetch('delete_vendor.php', {
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
                                showMessage('Vendor Deleted successfully!', 'success');
                                 newRow.remove();
                                   fetchVendorData();
                              } else {
                                  showMessage('Error deleting vendor.', 'error');
                             }
                        })
                        .catch(error => {
                           console.error('Error:', error);
                            showMessage('An error occurred while deleting data.', 'error');
                       });
                             });
                        });
                         rowCount=i;
                    } else {
                         console.error('Failed to fetch vendors:', data.message);
                          showMessage('Failed to fetch vendors.', 'error');
                    }
                })
                 .catch(error => {
                    console.error('Error fetching vendors:', error);
                     showMessage('An error occurred while fetching data.', 'error');
                });
        }

        // Fetch vendor data on page load
        fetchVendorData();
});