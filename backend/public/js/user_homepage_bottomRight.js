document.addEventListener("DOMContentLoaded", fetchAssignedOrders);

async function fetchAssignedOrders() {
  try {
    const response = await fetch("/order/getOrders", {
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
    const assignedOrders = data.assignedOrders;

    const ordersContainer = document.getElementById("orders-container");
    ordersContainer.innerHTML = ""; // Clear the container before adding new orders

    if (Array.isArray(assignedOrders) && assignedOrders.length > 0) {
      for (const order of assignedOrders) {
        const statusColor = order.status === "delivered" 
        ? "bg-green-600" 
        : order.status === "picked-up" 
        ? "bg-yellow-600" 
        : "bg-red-600";
    
        const statusMessage = order.status === "delivered" ? "Delivered" : order.status === "picked-up" ? "Picked-Up" : "On-Going";

        // Create a div for each order with Meraki-inspired styling
        const orderDiv = document.createElement("div");
        orderDiv.classList.add("max-w-2xl", "px-8", "py-4", "bg-white", "rounded-lg", "shadow-md", "dark:bg-gray-800", "mb-4");

        orderDiv.innerHTML = `
          <div class="flex items-center justify-between">
            <span class="text-sm font-light text-gray-600 dark:text-gray-400">${new Date(order.timestamp).toLocaleDateString()}</span>
            <a class="px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform ${statusColor} rounded cursor-pointer">${statusMessage}</a>
          </div>

          <div class="mt-2">
            <p class="text-xl font-bold text-gray-700 dark:text-white">Donor: ${order.donorUsername}</p>
            <p class="mt-2 text-gray-600 dark:text-gray-300">Pickup Location: ${order.pickupLocation || "N/A"}</p>
            <p class="mt-2 text-gray-600 dark:text-gray-300">Pickup Coordinates: ${order.pickupLocationCoordinates.coordinates.join(", ")}</p>
            <p class="mt-2 text-gray-600 dark:text-gray-300">Delivery Location: ${order.deliveryLocation || "N/A"}</p>
          </div>

          <div class="flex items-center justify-between mt-4">
            <a href="#" class="text-blue-600 dark:text-blue-400 hover:underline">View Details</a>
           <div class="font-bold text-gray-700 dark:text-gray-200">deliveryboy name: ${order.deliveryBoyName}</div>
 
          </div>
        `;

        // Append the order to the orders container
        ordersContainer.appendChild(orderDiv);
      }
    } else {
      ordersContainer.innerHTML = "<p>No assigned orders found.</p>";
    }
  } catch (error) {
    console.error("Error fetching assigned orders:", error);
  }
}
