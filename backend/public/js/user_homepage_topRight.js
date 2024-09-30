document.addEventListener("DOMContentLoaded", fetchAcceptedRequests);

async function fetchAcceptedRequests() {
  try {
    const response = await fetch("/request/getAcceptedRequests", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_jwt")}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const acceptedRequests = data.acceptedRequests;

    const topRightSection = document.querySelector(".top-right-section");
    topRightSection.innerHTML = "";

    // Check if acceptedRequests is an array and has items
    if (Array.isArray(acceptedRequests) && acceptedRequests.length > 0) {
      for (const request of acceptedRequests) {
        if (!request.post_id) {
          console.error("Missing post_id for request:", request);
          continue; // Skip this request
        }

        // Create a div for each request
        const requestDiv = document.createElement("div");
        requestDiv.classList.add("accepted-request");

        requestDiv.innerHTML = `
              <p>Donor: ${request.donorUsername}</p>
              <p>Available Food: ${request.availableFood.join(", ")}</p>
              <p>Location: ${request.location || "N/A"}</p>
              <p><small>Timestamp: ${new Date(
                request.timestamp
              ).toLocaleString()}</small></p>
              
              <label for="delivery-boy-${
                request._id
              }">Assign Delivery Boy:</label>
              <select id="delivery-boy-${request._id}">
            <option value="">Select Delivery Boy</option>
              </select>

              <button id="fetch-delivery-${request._id}" data-post-id="${
          request.post_id
        }">
            Fetch Nearby Delivery Boys
              </button>

              <button style='color: blue;' id="assign-delivery-${request._id}" data-request-id="${request._id}" >Assign</button>
          `;

        topRightSection.appendChild(requestDiv);

        // Add event listener to the fetch button
        document
          .getElementById(`fetch-delivery-${request._id}`)
          .addEventListener("click", async function () {
            console.log("Fetch button clicked for postId:", request.post_id);
            const postId = this.getAttribute("data-post-id");

            // Call the function to fetch nearby delivery boys
            const nearbyDeliveryBoys = await fetchNearbyDeliveryBoys(postId);


            // Update the dropdown with the fetched nearby delivery boys
            const deliveryBoySelect = document.getElementById(
              `delivery-boy-${request._id}`
            );
            deliveryBoySelect.innerHTML =
              '<option value="">Select Delivery Boy</option>' +
              nearbyDeliveryBoys
                .map(
                  (boy) =>
                    `<option value="${boy._id}">${boy.deliveryBoyName} - ${
                      typeof boy.distance === "number" && boy.distance !== null
                        ? (boy.distance / 1000).toFixed(2)
                        : "N/A"
                    } km</option>` // Convert meters to kilometers
                )
                .join("");

            console.log("Nearby Delivery Boys:", nearbyDeliveryBoys);
          });

        // Add event listener to the assign button
        document
          .getElementById(`assign-delivery-${request._id}`)
          .addEventListener("click", async function () {
            const requestId = this.getAttribute("data-request-id");
            const deliveryBoySelect = document.getElementById(
              `delivery-boy-${request._id}`
            );
            const selectedDeliveryBoy = deliveryBoySelect.value;

            if (!selectedDeliveryBoy) {
              alert("Please select a delivery boy.");
              return;
            }

            // Prompt the user to input the delivery location
            const deliveryLocation = prompt(
              "Please enter the delivery location:"
            );

            if (!deliveryLocation) {
              alert("Delivery location is required.");
              return;
            }

            // Call the function to assign the order
            await assignOrder(requestId, selectedDeliveryBoy, deliveryLocation);
          });
      }
    } else {
      topRightSection.innerHTML = "<p>No accepted requests found.</p>";
    }
  } catch (error) {
    console.error("Error fetching accepted requests:", error);
  }
}

async function fetchNearbyDeliveryBoys(postId) {
  try {
    const url = "http://localhost:9500";
    const response = await fetch(
      `${url}/deliveryboy/findNearbyPosts?postId=${postId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user_jwt")}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch nearby delivery boys");
    }

    const data = await response.json();
    return data.closestDeliveryBoys || [];
  } catch (error) {
    console.error("Error fetching nearby delivery boys:", error);
    return [];
  }
}

async function assignOrder(requestId, deliveryBoyId, deliveryLocation) {
  try {
    const response = await fetch("/order/assignOrder", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("user_jwt")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requestId,
        deliveryBoyId,
        deliveryLocation,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to assign order.");
    }

    const result = await response.json();
    alert("Order assigned successfully!");
  } catch (error) {
    console.error("Error assigning order:", error);
  }
}
