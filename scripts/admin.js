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

            saveButton.addEventListener("click", function (event) {
                event.preventDefault();

                // Get the selected gender value
                var selectedGender = Array.from(genderInput.getElementsByTagName("input")).find(input => input.checked)?.value.toUpperCase();

                // Check if gender is selected
                if (!selectedGender) {
                    alert("Please select a gender.");
                    return;
                }
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
            form.appendChild(closeButton)

            // Добавляем элементы в контент модального окна
            // modalContent.appendChild(closeButton);
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
            genderInput.className = "genderDiv"
            var maleDiv = document.createElement("div");
            maleDiv.className = "maleDiv"
            var maleRadio = document.createElement("input");
            maleRadio.type = "radio";
            maleRadio.name = "gender";
            maleRadio.value = "MALE";
            maleRadio.style.paddingRight = "10px"
            var maleLabel = document.createElement("label");
            maleLabel.innerHTML = "Male";
            if (gender === "Male") { 
                maleRadio.checked = true;
            }
            maleDiv.appendChild(maleLabel);
            maleDiv.appendChild(maleRadio);
            
            genderInput.appendChild(maleDiv);
            genderInput.appendChild(maleDiv);

            var femaleDiv = document.createElement("div");
            femaleDiv.className = "femaleDiv"
            var femaleLabel = document.createElement("label");
            femaleLabel.innerHTML = "Female";
            var femaleRadio = document.createElement("input");
            femaleRadio.type = "radio";
            femaleRadio.name = "gender";
            femaleRadio.value = "FEMALE";
            if (gender === "Female") {
                femaleRadio.checked = true;
            }
            femaleDiv.appendChild(femaleLabel);
            femaleDiv.appendChild(femaleRadio);
            
            genderInput.appendChild(femaleDiv);
            genderInput.appendChild(femaleDiv);

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
                { value: "Computer Science", label: "Computer Science" },
                { value: "Software Engineering", label: "Software Engineering" },
                { value: "Big Data Analysis", label: "Big Data Analysis" },
                { value: "Industrial Automation", label: "Industrial Automation" },
                { value: "Media Technologies", label: "Media Technologies" }
            ]);
            specInput.appendChild(infoTechGroup);

            var infoSecGroup = createSpecGroup("Information security", [
                { value: "Cyber Security", label: "Cyber Security" }
            ]);
            specInput.appendChild(infoSecGroup);

            var commTechGroup = createSpecGroup("Communication technologies", [
                { value: "Telecommunication Systems", label: "Telecommunication Systems" },
                { value: "Smart Technologies", label: "Smart Technologies" }
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
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var userID = user.uid;

        // Получение имени пользователя из Firebase Realtime Database
        databaseRef.child(userID).once('value', function (snapshot) {
            var userData = snapshot.val();
            if (userData) {
                var userName = userData.name;
                updateElementWithUserName(userName);
            }
        });
    }
});

