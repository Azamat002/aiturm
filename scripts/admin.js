import {firebaseConfig} from "../scripts/firebase.js";

var usersRef = firebase.database().ref('users');
// let adminsRef = firebase.database().ref('admins')
var database = firebase.database();
var adminsRef = database.ref('admins');

usersRef.once('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();
        var row = document.createElement("tr");

        var usernameCell = document.createElement("td");
        usernameCell.innerHTML = childData.username;
        row.appendChild(usernameCell);

        var nameCell = document.createElement("td");
        nameCell.innerHTML = childData.name;
        row.appendChild(nameCell);

        var emailCell = document.createElement("td");
        emailCell.innerHTML = childData.email;
        row.appendChild(emailCell);

        var genderCell = document.createElement("td");
        genderCell.innerHTML = childData.gender;
        row.appendChild(genderCell);

        var groupCell = document.createElement("td");
        groupCell.innerHTML = childData.group;
        row.appendChild(groupCell);

        var specCell = document.createElement("td");
        specCell.innerHTML = childData.specialization;
        row.appendChild(specCell);

        var phoneCell = document.createElement("td");
        phoneCell.innerHTML = childData.phoneNumber;
        row.appendChild(phoneCell);

        var signInCell = document.createElement("td");
        signInCell.innerHTML = childData.signInMethod;
        row.appendChild(signInCell);

        var bioCell = document.createElement("td");
        bioCell.innerHTML = childData.bio;
        row.appendChild(bioCell);

        // ... добавьте остальные ячейки

        /**
         * Edit
         * */


        var editCell = document.createElement("button");
        editCell.style.width = "100%"
        editCell.innerHTML = "Edit";
        row.appendChild(editCell);

        editCell.addEventListener("click", function () {
            // Получаем данные пользователя из строки таблицы
            var username = childData.username;
            var name = childData.name;
            var email = childData.email;
            var gender = childData.gender;
            var group = childData.group;
            var spec = childData.specialization;
            var phone = childData.phoneNumber;
            var bio = childData.bio;

            // Создаем модальное окно
            var modal = document.createElement("div");
            modal.className = "modal";

            // Создаем форму для редактирования данных пользователя
            var form = document.createElement("form");
            form.method = "post";

            // Создаем поля формы
            var usernameInput = document.createElement("input");
            usernameInput.type = "text";
            usernameInput.name = "username";
            usernameInput.value = username;
            form.appendChild(usernameInput);

            var nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.name = "name";
            nameInput.value = name;
            form.appendChild(nameInput);

            var emailInput = document.createElement("input");
            emailInput.type = "email";
            emailInput.name = "email";
            emailInput.value = email;
            form.appendChild(emailInput);


            var genderInput = document.createElement("div");

            var maleLabel = document.createElement("label");
            maleLabel.innerHTML = "Male";
            var maleRadio = document.createElement("input");
            maleRadio.type = "radio";
            maleRadio.name = "gender";
            maleRadio.value = "Male";
            genderInput.appendChild(maleLabel);
            genderInput.appendChild(maleRadio);

            var femaleLabel = document.createElement("label");
            femaleLabel.innerHTML = "Female";
            var femaleRadio = document.createElement("input");
            femaleRadio.type = "radio";
            femaleRadio.name = "gender";
            femaleRadio.value = "Female";
            genderInput.appendChild(femaleLabel);
            genderInput.appendChild(femaleRadio);

            form.appendChild(genderInput);


            var groupInput = document.createElement("input");
            groupInput.type = "text";
            groupInput.name = "group";
            groupInput.value = group;
            form.appendChild(groupInput);

            var phoneInput = document.createElement("input");
            phoneInput.type = "tel";
            phoneInput.name = "phone";
            phoneInput.value = "+" + phone;
            // phoneInput.readOnly = true
            form.appendChild(phoneInput);

            var bioInput = document.createElement("input");
            bioInput.type = "text";
            bioInput.name = "bio";
            bioInput.value = bio;
            form.appendChild(bioInput);

            //Select option for SPEC
            var specInput = document.createElement("select");
            specInput.name = "spec";
            specInput.id = "spec";

// Information technologies
            var infoTechGroup = document.createElement("optgroup");
            infoTechGroup.label = "Information technologies";

            var cscOption = document.createElement("option");
            cscOption.value = "CSc";
            cscOption.innerHTML = "Computer Science";
            infoTechGroup.appendChild(cscOption);

            var seOption = document.createElement("option");
            seOption.value = "SE";
            seOption.innerHTML = "Software Engineering";
            infoTechGroup.appendChild(seOption);

            var bdaOption = document.createElement("option");
            bdaOption.value = "BDA";
            bdaOption.innerHTML = "Big Data Analysis";
            infoTechGroup.appendChild(bdaOption);

            var iaOption = document.createElement("option");
            iaOption.value = "IA";
            iaOption.innerHTML = "Industrial Automation";
            infoTechGroup.appendChild(iaOption);

            var mtOption = document.createElement("option");
            mtOption.value = "MT";
            mtOption.innerHTML = "Media Technologies";
            infoTechGroup.appendChild(mtOption);

            specInput.appendChild(infoTechGroup);

// Information security
            var infoSecGroup = document.createElement("optgroup");
            infoSecGroup.label = "Information security";

            var csOption = document.createElement("option");
            csOption.value = "CS";
            csOption.innerHTML = "Cyber Security";
            infoSecGroup.appendChild(csOption);

            specInput.appendChild(infoSecGroup);

// Communication technologies
            var commTechGroup = document.createElement("optgroup");
            commTechGroup.label = "Communication technologies";

            var tsOption = document.createElement("option");
            tsOption.value = "TS";
            tsOption.innerHTML = "Telecommunication Systems";
            commTechGroup.appendChild(tsOption);

            var stOption = document.createElement("option");
            stOption.value = "ST";
            stOption.innerHTML = "Smart Technologies";
            commTechGroup.appendChild(stOption);

            specInput.appendChild(commTechGroup);

            form.appendChild(specInput);


            // Создаем кнопки для сохранения и отмены изменений
            var saveButton = document.createElement("button");
            saveButton.type = "submit";
            saveButton.innerText = "Save";
            form.appendChild(saveButton);


            // Добавляем форму в модальное окно
            modal.appendChild(form);

            // Добавляем модальное окно на страницу
            document.body.appendChild(modal);

            saveButton.addEventListener("click", function (event) {
                event.preventDefault();

                // Get the selected gender value
                var selectedGender = Array.from(genderInput.getElementsByTagName("input")).find(input => input.checked)?.value.toUpperCase();

                // Check if gender is selected
                if (!selectedGender) {
                    alert("Please select a gender.");
                    return;
                }
                // Get the selected specialization value
                var selectedSpec = specInput.value;

                // Get the new values from the form inputs
                var newUsername = usernameInput.value;
                var newName = nameInput.value;
                var newEmail = emailInput.value;
                var newGroup = groupInput.value;
                var newPhone = phoneInput.value.replace("+", "").replaceAll("(", "").replaceAll(")", "");
                var newBio = bioInput.value;

                // Update the user data object with the new values
                var userData = {
                    username: newUsername,
                    name: newName,
                    email: newEmail,
                    gender: selectedGender,
                    group: newGroup,
                    specialization: selectedSpec,
                    phoneNumber: newPhone,
                    bio: newBio
                };



                // Update the user data in the Firebase Realtime Database
                usersRef.child(childSnapshot.key).update(userData);

                // Close the modal
                modal.remove();

                // Reload the page
                location.reload();

            });


            modal.appendChild(form);
            document.body.appendChild(modal);

            // Добавляем кнопку для закрытия модального окна
            var closeButton = document.createElement('button');
            closeButton.classList.add('close-button');
            closeButton.innerHTML = 'Cancel';
            form.appendChild(closeButton);

            closeButton.addEventListener('click', function () {
                modal.remove();
            });
        });

        /**
         * Delete
         * */
        var delCell = document.createElement("button");
        delCell.setAttribute("data-key", childSnapshot.key);
        delCell.style.padding = "10px";
        delCell.style.width = "100%"
        delCell.innerHTML = "Delete";
        row.appendChild(delCell);

        document.getElementById("usersTable").appendChild(row);

        delCell.addEventListener('click', function () {
            if (confirm("Are you sure you want to delete the user: @" + childData.username + ", " + childData.name + "?")) {
                // Удаляем пользователя из базы данных
                usersRef.child(childSnapshot.key).remove();

                // Удаляем пользователя из Firebase Authentication
                var user = firebase.auth().currentUser;
                user.delete().then(function () {
                    alert("User removed from Firebase Authentication");
                }).catch(function (error) {
                    alert("Error while deleting user from Firebase Authentication:", error);
                });

                // Удаляем строку с пользователем из таблицы
                row.remove();
            }
        });

    });
});


// Get a reference to the logout button
const logoutButton = document.getElementById('logoutButton');

// Add a click event listener to the logout button
logoutButton.addEventListener('click', () => {
    // Call the signOut() method to log the user out
    firebase.auth().signOut()
        .then(() => {
            // Logout successful, redirect or perform other actions
            window.location.href = 'register.html'; // Redirect to the login page
        })
        .catch((error) => {
            // Handle any errors that occur during logout
            alert(error.message);
        });
});

// Предполагается, что вы уже инициализировали Firebase Realtime Database и получили ссылку на базу данных
var databaseRef = firebase.database().ref('admins');

// Функция для обновления имени пользователя в элементе
function updateElementWithUserName(userName) {
    var element = document.getElementById('adminNameID');
    if (element) {
        element.querySelector('a').textContent = userName;
    }
}

// Слушатель события onAuthStateChanged для получения имени пользователя
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var userID = user.uid;

        // Получение имени пользователя из Firebase Realtime Database
        databaseRef.child(userID).once('value', function(snapshot) {
            var userData = snapshot.val();
            if (userData) {
                var userName = userData.name;
                updateElementWithUserName(userName);
            }
        });
    }
});

