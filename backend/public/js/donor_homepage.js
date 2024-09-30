document.getElementById("toggleRequestForm").addEventListener("click", function() {
    toggleVisibility("requestFormSection");
  });

  document.getElementById("togglePostForm").addEventListener("click", function() {
    toggleVisibility("postFormSection");
  });

  document.getElementById("togglePostsList").addEventListener("click", function() {
    toggleVisibility("postsListSection");
  });

  function toggleVisibility(sectionId) {
    const section = document.getElementById(sectionId);
    if (section.style.display === "none" || section.style.display === "") {
      section.style.display = "block";
    } else {
      section.style.display = "none";
    }
  }

  document.querySelectorAll('.show-requests-btn').forEach(button => {
    button.addEventListener('click', async function() {
      const postId = this.getAttribute('data-post-id');
      
      try {
        // Send GET request to get requests for the selected post
        const response = await fetch(`/request/getRequestsForPost?postId=${postId}`);
        const data = await response.json();
        console.log("printing");
  
        if (data.success) {
          // Populate the modal with the list of requests
          const requestsList = document.getElementById('requestsList');
          requestsList.innerHTML = ''; // Clear previous requests
  
          if (data.requests.length > 0) {
            data.requests.forEach(request => {
              const li = document.createElement('li');
              li.innerHTML = `
                <strong>User:</strong> ${request.userUsername}<br>
                <strong>Location:</strong> ${request.location || 'Not provided'}<br>
                <strong>Available Food:</strong> ${request.availableFood.join(', ')}<br>
                ${request.isAccepted ? '<strong>Status:</strong> Accepted Request<br>' : ''}
                ${request.isRejected ? '<strong>Status:</strong> You Rejected this<br>' : ''}
                ${!request.isAccepted && !request.isRejected ? 
                  `<button class="btn btn-success accept-btn" data-request-id="${request._id}">Accept</button>` 
                  : ''}
              `;
              requestsList.appendChild(li);
            });
  
            // Attach event listeners to all "Accept" buttons
            document.querySelectorAll('.accept-btn').forEach(acceptBtn => {
              acceptBtn.addEventListener('click', async function() {
                const requestId = this.getAttribute('data-request-id');
    
                try {
                  // Send PATCH request to accept the request
                  const response = await fetch(`/request/acceptRequest/${requestId}`, {
                    method: 'PATCH',
                  });
  
                  if (response.ok) {
                    const updatedRequest = await response.json();
                    alert(`Request accepted: ${updatedRequest._id}`);
  
                    // Refresh the requests to reflect the updated status
                    const postResponse = await fetch(`/request/getRequestsForPost?postId=${postId}`);
                    const updatedData = await postResponse.json();
  
                    // Update the request list in the modal
                    requestsList.innerHTML = ''; // Clear requests again
  
                    updatedData.requests.forEach(request => {
                      const li = document.createElement('li');
                      li.innerHTML = `
                        <strong>User:</strong> ${request.userUsername}<br>
                        <strong>Location:</strong> ${request.location || 'Not provided'}<br>
                        <strong>Available Food:</strong> ${request.availableFood.join(', ')}<br>
                        ${request.isAccepted ? '<strong>Status:</strong> Accepted Request<br>' : ''}
                        ${request.isRejected ? '<strong>Status:</strong> You Rejected this<br>' : ''}
                      `;
                      requestsList.appendChild(li);
                    });
                  } else {
                    alert('Failed to accept request');
                  }
                } catch (error) {
                  console.error('Error accepting request:', error);
                  alert('An error occurred while accepting the request.');
                }
              });
            });
  
          } else {
            requestsList.innerHTML = '<p>No requests available for this post.</p>';
          }
  
          // Show the modal
          $('#requestsModal').modal('show');
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
        alert('An error occurred while fetching requests.');
      }
    });
  });
  