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

registrarForm.addEventListener('submit', function(event) {

    // Get user input
    var name = document.getElementById('name').value;
    var shift = document.getElementById('shift').value;
    var location = document.getElementById('venue').value;
    var training = document.getElementById('training').value;
    var trainer = document.getElementById('trainer').value;

    // Add data to Firestore
    db.collection('registrar').add({
        name: name,
        shift: shift,
        location: location,
        training: training,
        trainer: trainer
    })
    .then(function (docRef) {
            console.log('Document written with ID: ', docRef.id);
            alert("Registrar Submitted!");
            // Clear the form after successful submission
            registrarForm.reset();
    })
    .catch(function (error){
            console.error('Error adding document: ', error);
            alert(error);
    });

});
