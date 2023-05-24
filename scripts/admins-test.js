import {firebaseConfig} from "../scripts/firebase.js";

var usersRef = firebase.database().ref('users');
let adminRef = firebase.database().ref('admins');

// ...
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

    // Создаем контент модального окна
    var modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    // Добавляем кнопку для закрытия модального окна
    var closeButton = document.createElement("button");
    closeButton.innerHTML = "Close";
    closeButton.addEventListener("click", function () {
        modal.remove();
    });

    // Создаем форму для редактирования данных
    var form = document.createElement("form");
    form.id = "form";
    form.className = "form";
    form.method = "post";

    // Создаем поля формы и заполняем их значениями текущего пользователя
    var usernameInput = createInputField("text", "username", username);
    var nameInput = createInputField("text", "name", name);
    var emailInput = createInputField("email", "email", email);
    var genderInput = createGenderInput(gender);
    var groupInput = createInputField("text", "group", group);
    var phoneInput = createInputField("tel", "phone", "+" + phone);
    var bioInput = createInputField("text", "bio", bio);
    var specInput = createSpecSelect(spec);

    // Создаем кнопку для сохранения изменений
    var saveButton = document.createElement("button");
    saveButton.type = "submit";
    saveButton.innerHTML = "Save";

    // Добавляем обработчик события submit формы
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Получаем значения полей формы
        var newUsername = usernameInput.value;
        var newName = nameInput.value;
        var newEmail = emailInput.value;
        var newGender = getSelectedGenderValue(genderInput);
        var newGroup = groupInput.value;
        var newPhone = phoneInput.value.replace("+", "").replaceAll("(", "").replaceAll(")", "");
        var newBio = bioInput.value;
        var newSpec = specInput.value;

        // Обновляем данные пользователя
        var userData = {
            username: newUsername,
            name: newName,
            email: newEmail,
            gender: newGender,
            group: newGroup,
            specialization: newSpec,
            phoneNumber: newPhone,
            bio: newBio
        };

        // Обновляем данные пользователя в Firebase Realtime Database
        usersRef.child(childSnapshot.key).update(userData);

        // Закрываем модальное окно
        modal.remove();

        // Перезагружаем страницу
        location.reload();
    });

    // Добавляем элементы в форму
    form.appendChild(usernameInput);
    form.appendChild(nameInput);
    form.appendChild(emailInput);
    form.appendChild(genderInput);
    form.appendChild(groupInput);
    form.appendChild(phoneInput);
    form.appendChild(bioInput);
    form.appendChild(specInput);
    form.appendChild(saveButton);

    // Добавляем элементы в контент модального окна
    modalContent.appendChild(closeButton);
    modalContent.appendChild(form);

    // Добавляем контент модального окна в модальное окно
    modal.appendChild(modalContent);

    // Добавляем модальное окно на страницу
    document.body.appendChild(modal);
});

// ...

// Функция для создания поля ввода
function createInputField(type, name, value) {
    var input = document.createElement("input");
    input.type = type;
    input.name = name;
    input.value = value;
    return input;
}

// Функция для создания поля выбора пола
function createGenderInput(gender) {
    var genderInput = document.createElement("div");

    var maleLabel = document.createElement("label");
    maleLabel.innerHTML = "Male";
    var maleRadio = document.createElement("input");
    maleRadio.type = "radio";
    maleRadio.name = "gender";
    maleRadio.value = "Male";
    if (gender === "Male") {
        maleRadio.checked = true;
    }
    genderInput.appendChild(maleLabel);
    genderInput.appendChild(maleRadio);

    var femaleLabel = document.createElement("label");
    femaleLabel.innerHTML = "Female";
    var femaleRadio = document.createElement("input");
    femaleRadio.type = "radio";
    femaleRadio.name = "gender";
    femaleRadio.value = "Female";
    if (gender === "Female") {
        femaleRadio.checked = true;
    }
    genderInput.appendChild(femaleLabel);
    genderInput.appendChild(femaleRadio);

    return genderInput;
}

// Функция для получения значения выбранного пола
function getSelectedGenderValue(genderInput) {
    var selectedGender = genderInput.querySelector("input:checked");
    if (selectedGender) {
        return selectedGender.value;
    }
    return null;
}

// Функция для создания поля выбора специализации
function createSpecSelect(spec) {
    var specInput = document.createElement("select");
    specInput.name = "spec";
    specInput.id = "spec";

    var infoTechGroup = createSpecGroup("Information technologies", [
        {value: "CSc", label: "Computer Science"},
        {value: "SE", label: "Software Engineering"},
        {value: "BDA", label: "Big Data Analysis"},
        {value: "IA", label: "Industrial Automation"},
        {value: "MT", label: "Media Technologies"}
    ]);
    specInput.appendChild(infoTechGroup);

    var infoSecGroup = createSpecGroup("Information security", [
        {value: "CS", label: "Cyber Security"}
    ]);
    specInput.appendChild(infoSecGroup);

    var commTechGroup = createSpecGroup("Communication technologies", [
        {value: "TS", label: "Telecommunication Systems"},
        {value: "ST", label: "Smart Technologies"}
    ]);
    specInput.appendChild(commTechGroup);

    if (spec) {
        specInput.value = spec;
    }

    return specInput;
}

// Функция для создания группы специализаций
function createSpecGroup(label, options) {
    var group = document.createElement("optgroup");
    group.label = label;

    for (var i = 0; i < options.length; i++) {
        var option = document.createElement("option");
        option.value = options[i].value;
        option.innerHTML = options[i].label;
        group.appendChild(option);
    }

    return group;
}


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




// old edit button
//         editCell.addEventListener("click", function () {
//             // Получаем данные пользователя из строки таблицы
//             var username = childData.username;
//             var name = childData.name;
//             var email = childData.email;
//             var gender = childData.gender;
//             var group = childData.group;
//             var spec = childData.specialization;
//             var phone = childData.phoneNumber;
//             var bio = childData.bio;
//
//             // Создаем модальное окно
//             var modal = document.createElement("div");
//             modal.className = "modal";
//
//             // form starts here
//             var form = document.createElement("form");
//             form.id = "form"
//             form.className = "form"
//             form.method = "post";
//
//
//             // Создаем поля формы
//             var usernameInput = document.createElement("input");
//             usernameInput.type = "text";
//             usernameInput.name = "username";
//             usernameInput.value = username;
//             divControl.appendChild(usernameInput);
//
//             var nameInput = document.createElement("input");
//             nameInput.type = "text";
//             nameInput.name = "name";
//             nameInput.value = name;
//             divControl.appendChild(nameInput);
//
//             var emailInput = document.createElement("input");
//             emailInput.type = "email";
//             emailInput.name = "email";
//             emailInput.value = email;
//             divControl.appendChild(emailInput);
//
//
//             var genderInput = document.createElement("div");
//
//             var maleLabel = document.createElement("label");
//             maleLabel.innerHTML = "Male";
//             var maleRadio = document.createElement("input");
//             maleRadio.type = "radio";
//             maleRadio.name = "gender";
//             maleRadio.value = "Male";
//             genderInput.appendChild(maleLabel);
//             genderInput.appendChild(maleRadio);
//
//             var femaleLabel = document.createElement("label");
//             femaleLabel.innerHTML = "Female";
//             var femaleRadio = document.createElement("input");
//             femaleRadio.type = "radio";
//             femaleRadio.name = "gender";
//             femaleRadio.value = "Female";
//             genderInput.appendChild(femaleLabel);
//             genderInput.appendChild(femaleRadio);
//
//             divControl.appendChild(genderInput);
//
//
//             var groupInput = document.createElement("input");
//             groupInput.type = "text";
//             groupInput.name = "group";
//             groupInput.value = group;
//             divControl.appendChild(groupInput);
//
//             var phoneInput = document.createElement("input");
//             phoneInput.type = "tel";
//             phoneInput.name = "phone";
//             phoneInput.value = "+" + phone;
//             // phoneInput.readOnly = true
//             divControl.appendChild(phoneInput);
//
//             var bioInput = document.createElement("input");
//             bioInput.type = "text";
//             bioInput.name = "bio";
//             bioInput.value = bio;
//             divControl.appendChild(bioInput);
//
//             //Select option for SPEC
//             var specInput = document.createElement("select");
//             specInput.name = "spec";
//             specInput.id = "spec";
//
// // Information technologies
//             var infoTechGroup = document.createElement("optgroup");
//             infoTechGroup.label = "Information technologies";
//
//             var cscOption = document.createElement("option");
//             cscOption.value = "CSc";
//             cscOption.innerHTML = "Computer Science";
//             infoTechGroup.appendChild(cscOption);
//
//             var seOption = document.createElement("option");
//             seOption.value = "SE";
//             seOption.innerHTML = "Software Engineering";
//             infoTechGroup.appendChild(seOption);
//
//             var bdaOption = document.createElement("option");
//             bdaOption.value = "BDA";
//             bdaOption.innerHTML = "Big Data Analysis";
//             infoTechGroup.appendChild(bdaOption);
//
//             var iaOption = document.createElement("option");
//             iaOption.value = "IA";
//             iaOption.innerHTML = "Industrial Automation";
//             infoTechGroup.appendChild(iaOption);
//
//             var mtOption = document.createElement("option");
//             mtOption.value = "MT";
//             mtOption.innerHTML = "Media Technologies";
//             infoTechGroup.appendChild(mtOption);
//
//             specInput.appendChild(infoTechGroup);
//
// // Information security
//             var infoSecGroup = document.createElement("optgroup");
//             infoSecGroup.label = "Information security";
//
//             var csOption = document.createElement("option");
//             csOption.value = "CS";
//             csOption.innerHTML = "Cyber Security";
//             infoSecGroup.appendChild(csOption);
//
//             specInput.appendChild(infoSecGroup);
//
// // Communication technologies
//             var commTechGroup = document.createElement("optgroup");
//             commTechGroup.label = "Communication technologies";
//
//             var tsOption = document.createElement("option");
//             tsOption.value = "TS";
//             tsOption.innerHTML = "Telecommunication Systems";
//             commTechGroup.appendChild(tsOption);
//
//             var stOption = document.createElement("option");
//             stOption.value = "ST";
//             stOption.innerHTML = "Smart Technologies";
//             commTechGroup.appendChild(stOption);
//
//             specInput.appendChild(commTechGroup);
//
//             divControl.appendChild(specInput);
//
//
//             // Создаем кнопки для сохранения и отмены изменений
//             var saveButton = document.createElement("button");
//             saveButton.type = "submit";
//             saveButton.innerText = "Save";
//             divControl.appendChild(saveButton);
//
//
//             // Добавляем форму в модальное окно
//             modal.appendChild(form);
//
//             // Добавляем модальное окно на страницу
//             document.body.appendChild(modal);
//
//             saveButton.addEventListener("click", function (event) {
//                 event.preventDefault();
//
//                 // Get the selected gender value
//                 var selectedGender = Array.from(genderInput.getElementsByTagName("input")).find(input => input.checked)?.value.toUpperCase();
//
//                 // Check if gender is selected
//                 if (!selectedGender) {
//                     alert("Please select a gender.");
//                     return;
//                 }
//                 // Get the selected specialization value
//                 var selectedSpec = specInput.value;
//
//                 // Get the new values from the form inputs
//                 var newUsername = usernameInput.value;
//                 var newName = nameInput.value;
//                 var newEmail = emailInput.value;
//                 var newGroup = groupInput.value;
//                 var newPhone = phoneInput.value.replace("+", "").replaceAll("(", "").replaceAll(")", "");
//                 var newBio = bioInput.value;
//
//                 // Update the user data object with the new values
//                 var userData = {
//                     username: newUsername,
//                     name: newName,
//                     email: newEmail,
//                     gender: selectedGender,
//                     group: newGroup,
//                     specialization: selectedSpec,
//                     phoneNumber: newPhone,
//                     bio: newBio
//                 };
//
//
//                 // Update the user data in the Firebase Realtime Database
//                 usersRef.child(childSnapshot.key).update(userData);
//
//                 // Close the modal
//                 modal.remove();
//
//                 // Reload the page
//                 location.reload();
//
//             });
//
//
//             modal.appendChild(form);
//             document.body.appendChild(modal);
//
//             // Добавляем кнопку для закрытия модального окна
//             var closeButton = document.createElement('button');
//             closeButton.classList.add('close-button');
//             closeButton.innerHTML = 'Cancel';
//             form.appendChild(closeButton);
//
//             closeButton.addEventListener('click', function () {
//                 modal.remove();
//             });
//         });