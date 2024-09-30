async function fetchRequests(donorUsername) {
  try {
    console.log("Fetching requests");
    const response = await fetch(`/request/getRequests?donor=${donorUsername}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    // Check if requests exist in the response
    if (data.requests && Array.isArray(data.requests)) {
      const mainContent = document.getElementById("main-content");
      mainContent.innerHTML = "";

      // Iterate over requests and add them to the main content
      data.requests.forEach((request) => {
        const foodItems = request.availableFood.join(", "); // Join array items into a string

        // Determine the status message based on isAccepted and isRejected flags
        let statusMessage;
        let statusColor; // Add color for the status button
        if (request.isRejected) {
          statusMessage = "Your request has been rejected";
          statusColor = "bg-red-600 hover:bg-red-500";
        } else if (request.isAccepted) {
          statusMessage = "You've got a Deal!";
          statusColor = "bg-green-600 hover:bg-green-500";
        } else {
          statusMessage = "Pending request, waiting to be accepted by donor";
          statusColor = "bg-yellow-600 hover:bg-yellow-500";
        }

        // Display the request details using the Meraki UI component
        mainContent.innerHTML += `
                    <div class="max-w-2xl px-8 py-4 bg-white rounded-lg shadow-md dark:bg-gray-800 mb-4">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-light text-gray-600 dark:text-gray-400">${new Date(
                              request.timestamp
                            ).toLocaleDateString()}</span>
                            <a class="px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform ${statusColor} rounded cursor-pointer" tabindex="0" role="button">${statusMessage}</a>
                        </div>
            
                        <div class="mt-2">
                            <p class="text-xl font-bold text-gray-700 dark:text-white" tabindex="0">Available Food: ${foodItems} ${
          request.isAccepted ? "✔️" : ""
        }</p>
                            ${
                              request.location
                                ? `<p class="mt-2 text-gray-600 dark:text-gray-300">Location: ${request.location}</p>`
                                : ""
                            }
                        </div>
            
                        <div class="flex items-center justify-between mt-4">
                            <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline" tabindex="0">View Details</a>
            
                            <div class="flex items-center">
                                <a class="font-bold text-gray-700 cursor-pointer dark:text-gray-200" tabindex="0">Donor: ${
                                  request.donorUsername
                                }</a>
                            </div>
                        </div>
                    </div>`;
      });

      // data.requests.forEach(request => {
      //     const foodItems = request.availableFood.join(', '); // Join array items into a string
      //     const statusMessage = request.isAccepted ?
      //         'You\'ve got a Deal!' :
      //         'Pending request, waiting to be accepted by donor';

      //     mainContent.innerHTML += `
      //         <div class="request-box">
      //             <p>Available Food: ${foodItems} ${request.isAccepted ? '✔️' : ''}</p>
      //             ${request.location ? `<p>Location: ${request.location}</p>` : ''}
      //             <p><small>Timestamp: ${new Date(request.timestamp).toLocaleString()}</small></p>
      //             <p><strong>Status: ${statusMessage}</strong></p>
      //             <button onclick="${request.isAccepted ? `cancelRequest('${request._id}', '${donorUsername}')` : `acceptRequest('${request._id}', '${donorUsername}')`}">
      //                 ${request.isAccepted ? 'Cancel' : 'Accept'}
      //             </button>
      //         </div>`;
      // });

      // Scroll to the bottom of the main content
      mainContent.scrollTop = mainContent.scrollHeight;
    } else {
      console.error("No requests found for this donor.");
      const mainContent = document.getElementById("main-content");
      mainContent.innerHTML = `<p>No requests found for ${donorUsername}.</p>`;
    }
  } catch (error) {
    console.error("Error fetching requests:", error);
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = `<p>Error fetching requests: ${error.message}</p>`;
  }
}

function showChat(event) {
  event.preventDefault(); // Prevent the default anchor behavior

  const mainContent = document.getElementById("main-content");
  const accountsContainer = document.querySelector(".accounts-container");
  // Clear main content before displaying chat
  mainContent.innerHTML = "";

  // Create chat HTML
  const chatHTML = `
        <h3>Chat with a Donor</h3>
        <p>Start your conversation here...</p>
    `;
  // Show the accounts container again
  accountsContainer.style.display = "block";
  // Set mainContent to display chat
  mainContent.innerHTML = chatHTML;
}

// async function acceptRequest(requestId , donorUsername) {
//     try {
//         const response = await fetch(`/request/acceptRequest/${requestId}`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (response.ok) {
//             const data = await response.json();
//             console.log('Request accepted:', data);
//             // Optionally, refresh the requests after accepting
//             fetchRequests(donorUsername); // Make sure to store the current donor username
//             fetchAcceptedRequests();
//         } else {
//             console.error('Failed to accept request');
//         }
//     } catch (error) {
//         console.error('Error accepting request:', error);
//     }
// }

// async function cancelRequest(requestId, donorUsername) {
//     try {
//         const response = await fetch(`/request/cancelRequest/${requestId}`, {
//             method: 'PATCH',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         if (response.ok) {
//             const data = await response.json();
//             console.log('Request cancelled:', data);
//             // Optionally, refresh the requests after cancelling
//             fetchRequests(donorUsername); // Make sure to store the current donor username
//             fetchAcceptedRequests()
//         } else {
//             console.error('Failed to cancel request');
//         }
//     } catch (error) {
//         console.error('Error cancelling request:', error);
//     }
// }

// function initMap() {
//     // Define map options
//     var mapOptions = {
//         center: { lat: 0, lng: 0 }, // Default coordinates
//         zoom: 8
//     };
//     // Create the map
//     var map = new google.maps.Map(document.getElementById('map'), mapOptions);
// }

// let map, selectedLatLng;

//         function loadGoogleMapsScript(callback) {
//           const existingScript = document.getElementById('googleMaps');

//           if (!existingScript) {
//             const script = document.createElement('script');
//             script.src = "https://maps.googleapis.com/maps/api/js?key=GOOGLE_MAPS_API_KEY&loading=async&libraries=maps&v=beta";
//             script.id = 'googleMaps';
//             document.head.appendChild(script);

//             // Ensure the script is loaded before executing callback
//             script.onload = () => {
//               if (callback) callback();
//             };
//           } else {
//             // If the script is already loaded, immediately call the callback
//             if (callback) callback();
//           }
//         }

//         function initMap() {
//           try {
//             // Create a new map instance
//             map = new google.maps.Map(document.getElementById("map"), {
//               center: { lat: 37.42, lng: -122.1 },  // Set your desired coordinates
//               zoom: 14,
//               mapId: "4504f8b37365c3d0",  // Optional map styling ID
//             });

//             // Create a marker (optional)
//             const marker = new google.maps.Marker({
//               position: { lat: 37.42, lng: -122.1 },
//               map: map,
//             });

//             // Listen for clicks on the map to get coordinates
//             map.addListener("click", (e) => {
//               selectedLatLng = e.latLng;
//               console.log("Location selected:", selectedLatLng.lat(), selectedLatLng.lng());

//               // Update marker position on map click
//               marker.setPosition(selectedLatLng);
//             });

//           } catch (error) {
//             console.error('Error initializing the map:', error);
//           }
//         }

//         function showLocationPicker(event) {
//           event.preventDefault();
//           document.getElementById('location-modal').classList.remove('hidden');
//           if (!map) {
//             // Load the Google Maps script and initialize the map
//             loadGoogleMapsScript(initMap);
//           }
//         }

//         function saveLocation() {
//           if (selectedLatLng) {
//             console.log("Selected location:", selectedLatLng.lat(), selectedLatLng.lng());
//           } else {
//             console.log("No location selected.");
//           }
//         }

//         function closeModal() {
//           document.getElementById('location-modal').classList.add('hidden');
//         }

async function showDeliveryboy(event) {
  event.preventDefault(); // Prevent default anchor behavior

  const mainContent = document.getElementById("main-content");
  const accountsContainer = document.querySelector(".accounts-container");

  // Hide the accounts container
  accountsContainer.style.display = "none";

  // Clear main content
  mainContent.innerHTML = "";

  // Fetch delivery boys from the server
  try {
    const response = await fetch("/deliveryboy/getAllDeliveryBoys");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    const deliveryBoys = data.deliveryBoys || [];

    const deliveryBoyHTML = `
    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-4">Add Delivery Boys</h3>
    
    <div id="delivery-boys-list" class="space-y-4">
        ${deliveryBoys
          .map(
            (boy) => `
            <div class="flex max-w-md overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <div class="w-2/3 p-4">
                    <h1 class="text-lg font-bold text-gray-800 dark:text-white">${boy.deliveryBoyName}</h1>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Available for delivery</p>
                </div>
                <div class="w-1/3 flex items-center justify-end p-4">
                    <button class="px-2 py-1 text-xs font-bold text-white uppercase transition-colors duration-300 transform bg-gray-800 rounded dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:bg-gray-700 dark:focus:bg-gray-600 add-delivery-boy-btn" data-id="${boy.deliveryBoyName}">Add</button>
                </div>
            </div>
        `
          )
          .join("")}
    </div>

    <div class="mt-6 max-w-md">
        <form id="add-delivery-boy-form" class="bg-white rounded-lg shadow-lg dark:bg-gray-800 p-4">
            <h4 class="text-lg font-bold text-gray-800 dark:text-white mb-4">Add New Delivery Boy</h4>
            <div class="form-group mb-4">
                <label for="delivery-boy-name" class="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">Name:</label>
                <input type="text" id="delivery-boy-name" class="form-control block w-full px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="Enter delivery boy's name" required>
            </div>
            <button type="submit" class="px-4 py-2 text-sm font-bold text-white uppercase bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:bg-indigo-700">Add Delivery Boy</button>
        </form>
    </div>
`;

    mainContent.innerHTML = deliveryBoyHTML;

    // Add event listeners for each "Add" button
    document.querySelectorAll(".add-delivery-boy-btn").forEach((button) => {
      button.addEventListener("click", async function () {
        const deliveryBoyId = this.getAttribute("data-id");
        await addDeliveryBoyToUser(deliveryBoyId);
      });
    });

    // Add event listener for form submission to add new delivery boys
    document
      .getElementById("add-delivery-boy-form")
      .addEventListener("submit", async function (e) {
        e.preventDefault();

        const deliveryBoyName =
          document.getElementById("delivery-boy-name").value;

        e.target.reset();
        await addDeliveryBoyToUser(deliveryBoyName);
        showDeliveryboy(event); // Refresh the list
      });
  } catch (error) {
    console.error("Error fetching delivery boys:", error);
  }
}

// Updated client-side function to send deliveryBoyName
async function addDeliveryBoyToUser(deliveryBoyName) {
  try {
    const response = await fetch("/deliveryboy/addDeliveryBoyToUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ deliveryBoyName }), // Sending the deliveryBoyName
    });

    const result = await response.json();
    if (result.success) {
      console.log("Delivery boy added to user successfully");
    } else {
      console.error("Error adding delivery boy to user:", result.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
