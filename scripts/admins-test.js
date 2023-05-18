
import { firebaseConfig } from "../scripts/firebase.js";

var usersRef = firebase.database().ref('users');
let adminRef = firebase.database().ref('admins');

// Edit User Data
var editButtons = document.getElementsByClassName("editButton");

Array.from(editButtons).forEach(function (button) {
    button.addEventListener("click", function () {
        var modal = document.createElement("div");
        modal.classList.add("modal");

        var formDiv = document.createElement("div");
        formDiv.id = "form";

        var formTable = document.createElement("table");

        var headers = ["Username", "Name", "Email", "Gender", "Group", "Specialization", "Phone", "Bio"];
        var placeholders = ["Username", "Name", "Email", "", "Group", "", "Phone", "Bio"];
        var inputTypes = ["text", "text", "email", "radio", "text", "select", "tel", "text"];
        var inputNames = ["username", "name", "email", "gender", "group", "spec", "phone", "bio"];

        // Create header row
        var headerRow = document.createElement("tr");
        for (var i = 0; i < headers.length; i++) {
            var headerCell = document.createElement("th");
            headerCell.innerHTML = headers[i];
            headerRow.appendChild(headerCell);
        }
        formTable.appendChild(headerRow);

        // Create input row
        var inputRow = document.createElement("tr");
        for (var i = 0; i < inputTypes.length; i++) {
            var inputCell = document.createElement("td");

            if (inputTypes[i] === "radio") {
                var radioDiv = document.createElement("div");
                radioDiv.classList.add("form-control");

                var maleLabel = document.createElement("label");
                maleLabel.innerHTML = "Male";
                var maleRadio = document.createElement("input");
                maleRadio.type = "radio";
                maleRadio.name = "gender";
                maleRadio.value = "Male";
                radioDiv.appendChild(maleLabel);
                radioDiv.appendChild(maleRadio);

                var femaleLabel = document.createElement("label");
                femaleLabel.innerHTML = "Female";
                var femaleRadio = document.createElement("input");
                femaleRadio.type = "radio";
                femaleRadio.name = "gender";
                femaleRadio.value = "Female";
                radioDiv.appendChild(femaleLabel);
                radioDiv.appendChild(femaleRadio);

                inputCell.appendChild(radioDiv);
            } else if (inputTypes[i] === "select") {
                var specInput = document.createElement("select");
                specInput.name = "spec";
                specInput.id = "spec";

                var infoTechGroup = document.createElement("optgroup");
                infoTechGroup.label = "Information Technologies";

                var cscOption = document.createElement("option");
                cscOption.value = "CSc";
                cscOption.innerHTML = "Computer Science";
                infoTechGroup.appendChild(cscOption);

                // Add more options here

                specInput.appendChild(infoTechGroup);
                inputCell.appendChild(specInput);
            } else {
                var input = document.createElement("input");
                input.type = inputTypes[i];
                input.name = inputNames[i];
                input.placeholder = placeholders[i];
                inputCell.appendChild(input);
            }

            inputRow.appendChild(inputCell);
        }
        formTable.appendChild(inputRow);

        formDiv.appendChild(formTable);
        modal.appendChild(formDiv);
        document.body.appendChild(modal);

        var submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.innerHTML = "Submit";
        formDiv.appendChild(submitButton);

        formDiv.addEventListener("submit", function (e) {
            e.preventDefault();

            // Check if gender is selected
            var selectedGender = document.querySelector('input[name="gender"]:checked')?.value.toUpperCase();
            if (!selectedGender) {
                alert("Please select a gender.");
                return;
            }

            // Get the selected specialization value
            var selectedSpec = specInput.value;

            // Get the new values from the form inputs
            var newUsername = document.getElementsByName("username")[0].value;
            var newName = document.getElementsByName("name")[0].value;
            var newEmail = document.getElementsByName("email")[0].value;
            var newGroup = document.getElementsByName("group")[0].value;
            var newPhone = document.getElementsByName("phone")[0].value.replace("+", "").replaceAll("(", "").replaceAll(")", "");
            var newBio = document.getElementsByName("bio")[0].value;

            // Update the user data object with the new values
            var userData = {
                username: newUsername,
                name: newName,
                email: newEmail,
                gender: selectedGender,
                group: newGroup,
                specialization: selectedSpec,
                phoneNumber: newPhone,
                bio: newBio,
            };

            // Update the user data in the Firebase Realtime Database
            usersRef.child(button.getAttribute("data-key")).update(userData);

            // Close the modal
            modal.remove();

            // Reload the page
            location.reload();
        });

        var cancelButton = document.createElement("button");
        cancelButton.classList.add("cancelButton");
        cancelButton.innerHTML = "Cancel";
        formDiv.appendChild(cancelButton);

        cancelButton.addEventListener("click", function () {
            modal.remove();
        });
    });
});

// Delete User
var delButtons = document.getElementsByClassName("deleteButton");

Array.from(delButtons).forEach(function (button) {
    button.addEventListener("click", function () {
        if (
            confirm(
                "Are you sure you want to delete the user: @" +
                button.getAttribute("data-username") +
                ", " +
                button.getAttribute("data-name") +
                "?"
            )
        ) {
            // Remove the user from the database
            usersRef.child(button.getAttribute("data-key")).remove();

            // Remove the user from Firebase Authentication
            var user = firebase.auth().currentUser;
            user
                .delete()
                .then(function () {
                    console.log("User removed from Firebase Authentication");
                })
                .catch(function (error) {
                    console.error(
                        "Error while deleting user from Firebase Authentication:",
                        error
                    );
                });

            // Remove the user row from the table
            button.parentElement.parentElement.remove();
        }
    });
});

// Logout
var logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", function () {
    firebase
        .auth()
        .signOut()
        .then(function () {
            // Logout successful, redirect or perform other actions
            window.location.href = "register.html"; // Redirect to the login page
        })
        .catch(function (error) {
            // Handle any errors that occur during logout
            console.log(error.message);
        });
});


// import { firebaseConfig } from "../scripts/firebase.js";
//
// var usersRef = firebase.database().ref('users');
// let adminRef = firebase.database().ref('admins');
//
// // Edit User Data
// var editButtons = document.getElementsByClassName("editButton");
//
// Array.from(editButtons).forEach(function (button) {
//     button.addEventListener("click", function () {
//         var modal = document.createElement("div");
//         modal.classList.add("modal");
//
//         var form = document.createElement("form");
//         form.classList.add("form");
//         form.id = "form";
//
//         var usernameInput = document.createElement("input");
//         usernameInput.type = "text";
//         usernameInput.name = "username";
//         usernameInput.placeholder = "Username";
//         form.appendChild(usernameInput);
//
//         var nameInput = document.createElement("input");
//         nameInput.type = "text";
//         nameInput.name = "name";
//         nameInput.placeholder = "Name";
//         form.appendChild(nameInput);
//
//         var emailInput = document.createElement("input");
//         emailInput.type = "email";
//         emailInput.name = "email";
//         emailInput.placeholder = "Email";
//         form.appendChild(emailInput);
//
//         var genderInput = document.createElement("div");
//         genderInput.classList.add("form-control");
//
//         var maleLabel = document.createElement("label");
//         maleLabel.innerHTML = "Male";
//         var maleRadio = document.createElement("input");
//         maleRadio.type = "radio";
//         maleRadio.name = "gender";
//         maleRadio.value = "Male";
//         genderInput.appendChild(maleLabel);
//         genderInput.appendChild(maleRadio);
//
//         var femaleLabel = document.createElement("label");
//         femaleLabel.innerHTML = "Female";
//         var femaleRadio = document.createElement("input");
//         femaleRadio.type = "radio";
//         femaleRadio.name = "gender";
//         femaleRadio.value = "Female";
//         genderInput.appendChild(femaleLabel);
//         genderInput.appendChild(femaleRadio);
//
//         form.appendChild(genderInput);
//
//         var groupInput = document.createElement("input");
//         groupInput.type = "text";
//         groupInput.name = "group";
//         groupInput.placeholder = "Group";
//         form.appendChild(groupInput);
//
//         var specInput = document.createElement("select");
//         specInput.name = "spec";
//         specInput.id = "spec";
//
//         var infoTechGroup = document.createElement("optgroup");
//         infoTechGroup.label = "Information Technologies";
//
//         var cscOption = document.createElement("option");
//         cscOption.value = "CSc";
//         cscOption.innerHTML = "Computer Science";
//         infoTechGroup.appendChild(cscOption);
//
//         var seOption = document.createElement("option");
//         seOption.value = "SE";
//         seOption.innerHTML = "Software Engineering";
//         infoTechGroup.appendChild(seOption);
//
//         var bdaOption = document.createElement("option");
//         bdaOption.value = "BDA";
//         bdaOption.innerHTML = "Big Data Analysis";
//         infoTechGroup.appendChild(bdaOption);
//
//         var iaOption = document.createElement("option");
//         iaOption.value = "IA";
//         iaOption.innerHTML = "Industrial Automation";
//         infoTechGroup.appendChild(iaOption);
//
//         var mtOption = document.createElement("option");
//         mtOption.value = "MT";
//         mtOption.innerHTML = "Media Technologies";
//         infoTechGroup.appendChild(mtOption);
//
//         specInput.appendChild(infoTechGroup);
//
//         var infoSecGroup = document.createElement("optgroup");
//         infoSecGroup.label = "Information security";
//
//         var csOption = document.createElement("option");
//         csOption.value = "CS";
//         csOption.innerHTML = "Cyber Security";
//         infoSecGroup.appendChild(csOption);
//
//         specInput.appendChild(infoSecGroup);
//
//         var commTechGroup = document.createElement("optgroup");
//         commTechGroup.label = "Communication technologies";
//
//         var tsOption = document.createElement("option");
//         tsOption.value = "TS";
//         tsOption.innerHTML = "Telecommunication Systems";
//         commTechGroup.appendChild(tsOption);
//
//         specInput.appendChild(commTechGroup);
//
//         form.appendChild(specInput);
//
//         var phoneInput = document.createElement("input");
//         phoneInput.type = "tel";
//         phoneInput.name = "phone";
//         phoneInput.placeholder = "Phone";
//         form.appendChild(phoneInput);
//
//         var bioInput = document.createElement("input");
//         bioInput.type = "text";
//         bioInput.name = "bio";
//         bioInput.placeholder = "Bio";
//         form.appendChild(bioInput);
//
//         var submitButton = document.createElement("button");
//         submitButton.type = "submit";
//         submitButton.innerHTML = "Submit";
//         form.appendChild(submitButton);
//
//         form.addEventListener("submit", function (e) {
//             e.preventDefault();
//
//             // Check if gender is selected
//             var selectedGender = document.querySelector(
//                 'input[name="gender"]:checked'
//             )?.value.toUpperCase();
//             if (!selectedGender) {
//                 alert("Please select a gender.");
//                 return;
//             }
//
//             // Get the selected specialization value
//             var selectedSpec = specInput.value;
//
//             // Get the new values from the form inputs
//             var newUsername = usernameInput.value;
//             var newName = nameInput.value;
//             var newEmail = emailInput.value;
//             var newGroup = groupInput.value;
//             var newPhone = phoneInput.value.replace("+", "").replaceAll("(", "").replaceAll(")", "");
//             var newBio = bioInput.value;
//
//             // Update the user data object with the new values
//             var userData = {
//                 username: newUsername,
//                 name: newName,
//                 email: newEmail,
//                 gender: selectedGender,
//                 group: newGroup,
//                 specialization: selectedSpec,
//                 phoneNumber: newPhone,
//                 bio: newBio,
//             };
//
//             // Update the user data in the Firebase Realtime Database
//             usersRef.child(button.getAttribute("data-key")).update(userData);
//
//             // Close the modal
//             modal.remove();
//
//             // Reload the page
//             location.reload();
//         });
//
//         modal.appendChild(form);
//         document.body.appendChild(modal);
//
//         var cancelButton = document.createElement("button");
//         cancelButton.classList.add("cancelButton");
//         cancelButton.innerHTML = "Cancel";
//         modal.appendChild(cancelButton);
//
//         cancelButton.addEventListener("click", function () {
//             modal.remove();
//         });
//     });
// });
//
// // Delete User
// var delButtons = document.getElementsByClassName("deleteButton");
//
// Array.from(delButtons).forEach(function (button) {
//     button.addEventListener("click", function () {
//         if (
//             confirm(
//                 "Are you sure you want to delete the user: @" +
//                 button.getAttribute("data-username") +
//                 ", " +
//                 button.getAttribute("data-name") +
//                 "?"
//             )
//         ) {
//             // Remove the user from the database
//             usersRef.child(button.getAttribute("data-key")).remove();
//
//             // Remove the user from Firebase Authentication
//             var user = firebase.auth().currentUser;
//             user
//                 .delete()
//                 .then(function () {
//                     console.log("User removed from Firebase Authentication");
//                 })
//                 .catch(function (error) {
//                     console.error(
//                         "Error while deleting user from Firebase Authentication:",
//                         error
//                     );
//                 });
//
//             // Remove the user row from the table
//             button.parentElement.parentElement.remove();
//         }
//     });
// });
//
// // Logout
// var logoutButton = document.getElementById("logoutButton");
//
// logoutButton.addEventListener("click", function () {
//     firebase
//         .auth()
//         .signOut()
//         .then(function () {
//             // Logout successful, redirect or perform other actions
//             window.location.href = "register.html"; // Redirect to the login page
//         })
//         .catch(function (error) {
//             // Handle any errors that occur during logout
//             console.log(error.message);
//         });
// });
