
var firebaseConfig = {
    apiKey: "AIzaSyCXsIto8VwJBZsNqMV-6biuvlTYeA5BNes",
    authDomain: "otc-attendance-system.firebaseapp.com",
    projectId: "otc-attendance-system",
    storageBucket: "otc-attendance-system.appspot.com",
    messagingSenderId: "635006131178",
    appId: "1:635006131178:web:ef9fd76457a199d1f17093",
    measurementId: "G-6QR5S9ZRNN"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Create a Firestore reference
var db = firebase.firestore();

attdForm.addEventListener('submit', function(event){
    event.preventDefault();

    // Get user input
    var name = document.getElementById('name').value;
    var dateTimeInput = document.getElementById('dateTime').textContent;
    var latitudeInput = document.getElementById('latitude').value;
    var longitudeInput = document.getElementById('longitude').value;

    // Create a date object based on input
    var dateTime = new Date(dateTimeInput);
    var timestamp = firebase.firestore.Timestamp.fromDate(dateTime);

    var coordinates = {
        latitude: latitudeInput,
        longitude: longitudeInput
    };

    const centerLat = 5.3525842; // Center latitude
    const centerLon = 100.3022794; // Center longitude
    const targetLat = document.getElementById('latitude').value; // Target latitude to check
    const targetLon = document.getElementById('longitude').value; // Target longitude to check
    const radiusKm = 2.0; // Radius in kilometers

    const checkRadius = isWithinRadius(centerLat, centerLon, targetLat, targetLon, radiusKm);

    if (checkRadius){

        // Add data to Firestore
        db.collection('attendance').add({
            name: name,
            timestamp: timestamp,
            coordinates: coordinates
        })
        .then(function(docRef) {
            console.log('Document written with ID: ', docRef.id);
            alert("Attendance Successfully Submitted!");
            // Clear the form after successful submission
            attdForm.reset();
        })
        .catch(function(error) {
            console.error('Error adding document: ', error);
            alert(error);
        });
    } else {
        alert("You are not within 2km radius of OTC Training Centre Office!");
    }

});

// Function to calculate the distance between two coordinates using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {

    const earthRadiusKm = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRadiusKm * c;

    return distance; // Distance in kilometers
}

// Function to check if a coordinate is within a specified radius of a center point
function isWithinRadius(centerLat, centerLon, targetLat, targetLon, radiusKm) {
    const distance = calculateDistance(centerLat, centerLon, targetLat, targetLon);

    return distance <= radiusKm;
}

var refreshButton = document.getElementById('refreshButton');

function displayTimestamp() {

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            // Get the latitude and longitude from the position object
            document.getElementById('latitude').value = position.coords.latitude;
            document.getElementById('longitude').value = position.coords.longitude;

        }, function(error) {
            // Handle errors, e.g., if the user denies permission
            console.error('Error getting location:', error);
            alert(error);
        });
    } else {
        // Geolocation is not available in this browser
        console.error('Geolocation is not available.');
    }

    var currentDate = new Date();
    const malaysiaTimeZone = 'Asia/Kuala_Lumpur';
    // Format the timestamp as desired (e.g., toLocaleString for a user-friendly format)
    var formattedTimestamp = currentDate.toLocaleString('en-US', { timeZone: malaysiaTimeZone });

    // Update the content of the HTML element
    document.getElementById('dateTime').textContent = formattedTimestamp;

}

// Function to refresh the timestamp when the button is clicked
function refreshTimestamp() {
    displayTimestamp();
}
getDateTimeBtn.addEventListener('click', refreshTimestamp);

// Call displayTimestamp initially to display the timestamp when the page loads
displayTimestamp();