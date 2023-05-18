import {firebaseConfig} from "../scripts/firebase.js";
// const firebaseConfig = {
//     apiKey: "AIzaSyD3TfKkw2mT1vV4E5X0EWmQ9-Eo3ofhZjI",
//     authDomain: "aiturm-c0f1b.firebaseapp.com",
//     databaseURL: "https://aiturm-c0f1b-default-rtdb.firebaseio.com",
//     projectId: "aiturm-c0f1b",
//     storageBucket: "aiturm-c0f1b.appspot.com",
//     messagingSenderId: "418643223911",
//     appId: "1:418643223911:web:d7620fa50cc0dbd5bafbc2",
//     measurementId: "G-V3QQJ1G23C"
// };
// firebase.initializeApp(firebaseConfig);

// var usersRef = firebase.database().ref('admins');

const signUpButton = document.getElementById('signUp');
const signInBut = document.getElementById('signIn2');
const container = document.getElementById('container');

// Sign Up event listener
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

// Sign In event listener
signInBut.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// Handle sign-up form submission
const signUpForm = document.querySelector('.sign-up-container form');
signUpForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Get the user input values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Create a new user in Firebase Authentication
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User signed up successfully
            const user = userCredential.user;

            // Save the user data in the Realtime Database
            const usersRef = firebase.database().ref('admins');
            const newUserRef = usersRef.push();
            newUserRef.set({
                name: name,
                email: email
            });

            // Redirect to the admin.html page after successful registration
            window.location.href = "Admins.html";
        })
        .catch((error) => {
            // Handle any errors that occur during sign-up
            console.log(error.message);
        });
});


// Get references to the sign-in form elements
const emailInput = document.querySelector('#signIn input[type="email"]');
const passwordInput = document.querySelector('#signIn input[type="password"]');
const signInButton = document.querySelector('#signIn button');

// Handle sign-in form submission
signInButton.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent the form from submitting

    const email = emailInput.value;
    const password = passwordInput.value;

    // Sign in with email and password
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Sign-in successful, redirect to admin.html or perform other actions
            window.location.href = 'Admins.html';
        })
        .catch((error) => {
            // Handle sign-in errors
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode + " " + errorMessage);
            // Display an error message to the user
            // You can update your HTML to show the error message to the user
        });
});
// Create the "admins" table
const database = firebase.database();
const adminsRef = database.ref('admins');

// Check if the "admins" table already exists
adminsRef.once('value', (snapshot) => {
    if (!snapshot.exists()) {
        // If the "admins" table doesn't exist, create it
        adminsRef.set({}); // You can optionally provide initial data inside the set() method
    }
});

// recover pass

document.getElementById('forgetPass').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent the default behavior of following the link

    var email = document.getElementById('emailInput').value;
    if (email) {
        sendPasswordResetEmail(email);
    } else {
        // Handle the case when no email is entered
        alert('Please enter your email');
    }
});

function sendPasswordResetEmail(email) {
    firebase.auth().sendPasswordResetEmail(email)
        .then(function () {
            // Password reset email sent
            // You can redirect the user to a success page or show a notification
            alert('Password reset email sent to ' + email);
        })
        .catch(function (error) {
            // An error occurred
            // You can display the error message to the user
            alert('Error sending password reset email: ' + error.message);
        });
}

