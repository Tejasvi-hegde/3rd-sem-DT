// Initialize the map
const map = L.map("map").setView([12.923, 77.502], 13);
var marker, circle;
var latt, longg;

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);



document.getElementById("showpoint").addEventListener("click", showMarker);

  const provider = new GeoSearch.OpenStreetMapProvider();

  const searchControl = new GeoSearch.GeoSearchControl({
    provider: provider,
    style: 'bar',
    showMarker: true,
    showPopup: true,
    autoClose: true,
    searchLabel: 'Search for a place...',
    keepResult: true
  });
  map.addControl(searchControl);
  
  map.on('geosearch/showlocation', function (result) {
    const bbox = [
      result.location.y, result.location.x
    ];
    L.marker(bbox);
  });



map.on("click", (e) => {
  const { lat, lng } = e.latlng; // Get latitude and longitude from the event
  alert(`Coordinates: Latitude ${lat}, Longitude ${lng}`);
});


const points = [
  {
    name: "Point 1",
    coords: [12.92724871568954, 77.5030303001404],
    program: "camera",
  },
  {
    name: "Point 2",
    coords: [12.926642214013153, 77.4955201148987],
    program: "main_with_Trackbars",
  },
  {
    name :"Point 3",
    coords :[12.930696858851618, 77.50137805938722],
    program :"main",
  }
];


function runProgram(programName) {
  console.log(`Running ${programName}...`);

  if (programName === "camera") {
    const closeButton = document.getElementById("close-camera");
    const videoWrapper = document.getElementById("video-wrapper");
    const videoElement = document.getElementById("webcam");
    let stream = null;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoElement) {
          videoElement.srcObject = stream;
        }
        videoWrapper.style.display = "block";
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Could not access the camera. Please check permissions.");
      }
    })();
    closeButton.addEventListener("click", () => {
      if (stream) {
        // Stop all tracks associated with the stream
        stream.getTracks().forEach((track) => track.stop());
        videoElement.srcObject = null;
        videoWrapper.style.display = "none"; 
      }
    });
  } else if(programName=="main_with_Trackbars"){
    
    fetch(`http://localhost:3000/run-program`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ program: programName }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(`Program executed: ${data.message}`);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to execute the program.");
      });

   
  }else if(programName=="main"){

fetch(`http://localhost:3000/run-program`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ program: programName }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(`Program executed: ${data.message}`);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to execute the program.");
      });
  }
}


function showMarker() {

  points.forEach((point) => {
    const yellowIcon = L.icon({
      iconUrl: "/yellow marker.png",
      iconSize: [24, 40],
      iconAnchor: [12, 40],
    });
    L.marker(point.coords, { icon: yellowIcon })
      .addTo(map)
      .bindPopup(`Parking Space: ${point.name}<br>Program: ${point.program}`)
      .on("click", () => {
        runProgram(point.program);
       });
    });

showNearbyParking(latt,longg);

}

if (!navigator.geolocation) {
  console.log("Your browser doesn't support geolocation feature!");
} else {
  setInterval(() => {
    navigator.geolocation.getCurrentPosition(getPosition);
  }, 5000);
}



function getPosition(position) {
  
  latt = position.coords.latitude;
  longg = position.coords.longitude;
  var accuracy = position.coords.accuracy;

  if (latt && longg) {
    const userLocation = L.latLng(latt, longg);

    const redIcon = L.icon({
      iconUrl: "/red marker.png",
      iconSize: [24, 40],
      iconAnchor: [12, 40],
    });

    if (marker) {
      map.removeLayer(marker);
    }
    marker = L.marker([latt, longg], { icon: redIcon }).addTo(map).bindPopup("Your Location");

  console.log(
    "Your coordinate is: Lat: " +
      latt +
      " Long: " +
      longg +
      " Accuracy: " +
      accuracy
  );
}}


async function showNearbyParking(userLat, userLng) {
  const radius = 2500; 

  // Overpass API query to fetch parking spaces
  const overpassQuery = `
    [out:json];
    node
      ["amenity"="parking"]
      (around:${radius},${userLat},${userLng});
    out body;
  `;

  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;

  try {
    
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch parking data.");
    const data = await response.json();

  
    const nearbyParking = data.elements.map((element) => ({
      name: element.tags.name || "Unnamed Parking Spot",
      coords: [element.lat, element.lon],
    }));
    
    const greenIcon = L.icon({
      iconUrl: "/blue marker.png",
      iconSize: [24, 40],
      iconAnchor: [12, 40],
    });

  

    if (nearbyParking.length > 0) {
      nearbyParking.forEach((parking) => {
        L.marker(parking.coords, { icon: greenIcon })
          .addTo(map)
          .bindPopup(`Parking Space: ${parking.name}`);
      });
    } else {
      alert("No nearby parking spaces found within 1.5 km.");
    }
  } catch (error) {
    console.error("Error fetching or displaying parking data:", error);
    alert("Failed to load nearby parking spaces.");
  }
}


document.getElementById("shortest").addEventListener("click", () => {
  
  const pointA = L.latLng(latt, longg);
const pointB = L.latLng(12.92724871568954, 77.5030303001404); // Example coordinates for pointB
const pointC = L.latLng(12.926642214013153, 77.4955201148987); // Example coordinates for pointC


const distances = [
  { point: pointB, distance: pointA.distanceTo(pointB) },
  { point: pointC, distance: pointA.distanceTo(pointC) }
];

// Bubble Sort to sort distances in ascending order
function bubbleSort(arr) {
  let n = arr.length;
  let swapped;

  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if (arr[i].distance > arr[i + 1].distance) {
        // Swap elements
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
    }
    n--;
  } while (swapped);
}

// Sort the distances array
bubbleSort(distances);


const closestPoint = distances[0].point;


if (window.routingControl) {
  map.removeControl(window.routingControl); 
}

window.routingControl = L.Routing.control({
  waypoints: [pointA, closestPoint],
  routeWhileDragging: true,
  lineOptions: {
    styles: [{ color: 'blue', opacity: 0.7, weight: 4 }], // Customize route line style
  },
  createMarker: function () {
    return null; // Suppress default markers
  },
}).addTo(map);


window.routingControl.on("routesfound", () => {
  addCloseButtonToPanel(); 
});


 
  window.routingControl.on("routesfound", () => {
    addCloseButtonToPanel();
  });
});

// Function to add 'X' close button to the route panel
function addCloseButtonToPanel() {
  // Get the route panel element
  const panel = document.querySelector(".leaflet-routing-container");

  if (panel && !panel.querySelector(".close-route-btn")) {
    // Create the close button
    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.className = "close-route-btn";
    closeButton.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      background-color: red;
      color: white;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      font-size: 16px;
      cursor: pointer;
      z-index: 1000;
    `;

    // Append the button to the route panel
    panel.appendChild(closeButton);

  
    closeButton.addEventListener("click", () => {
      if (window.routingControl) {
        map.removeControl(window.routingControl);
        window.routingControl = null;
      }
    });
  }
}