$(document).ready ( function () {
    const authUserBody = document.getElementById("user-admin-body");
    const authUserHeader = document.getElementById("auth-user");
    //Константы для модального окна EDIT
    const editId = document.getElementById("edit-id");
    const editFirstName = document.getElementById("edit-firstName");
    const editLastName = document.getElementById("edit-lastName");
    const editAge = document.getElementById("edit-age");
    const editEmail = document.getElementById("edit-email");
    const editRole = document.getElementById("edit-role");
    let editModal = new bootstrap.Modal(document.getElementById('edit-modal'));

    //Константы для модального окна DELETE
    const deleteId = document.getElementById("delete-id");
    const deleteFirstName = document.getElementById("delete-firstName");
    const deleteLastName = document.getElementById("delete-lastName");
    const deleteAge = document.getElementById("delete-age");
    const deleteEmail = document.getElementById("delete-email");
    const deleteRole = document.getElementById("delete-role");
    let deleteModal = new bootstrap.Modal(document.getElementById('delete-modal'));

    //Константы для модального окна CREATE

    const newFirstName = document.getElementById("new-firstname");
    const newLastName = document.getElementById("new-lastname");
    const newAge = document.getElementById("new-age");
    const newEmail = document.getElementById("new-email");
    const newPassword = document.getElementById("new-password");

    let responseRoleData;
    const fromSelectRole = document.getElementById("edit-role")
    $.ajax({url: "http://localhost:8080/admin/roles", success: function(result){
            responseRoleData =  result;
            fromSelectRole.innerHTML = '';
            for (let i = 0; i < responseRoleData.length; i++) {
                fromSelectRole.append(new Option( responseRoleData[i].name, responseRoleData[i].id));
                // console.log(responseRoleData[i]);
            }
        }});
    let respRolesData = null;
    let formSelectCreate = document.getElementById("newRole");
    $.ajax({url: "http://localhost:8080/admin/roles", success: function(result){
            respRolesData =  result;
            formSelectCreate.innerHTML = '';
            for (let i = 0; i < respRolesData.length; i++) {
                formSelectCreate.append(new Option( respRolesData[i].name, respRolesData[i].id));
                console.log(respRolesData[i]);
            }
        }});
    fetch('http://localhost:8080/admin/all')
        .then(response => response.json())
        .then(users => {
            displayUsers(users);
            // console.log(users);
        })
        .catch(error => console.error(error));

    fetch('http://localhost:8080/admin/user')
        .then(response => response.json())
        .then(user => {
            // console.log(user)
            displayUser(user);
        }).catch(error => console.error(error));


    $(document).on ("click", ".edit-btn", function () {
        const id = $(this).data("id")
        console.log(id);
        openEditModal(id);

    });

    function displayUsers(users) {
        const usersListBody = document.querySelector(".tbodyAdminUserList")
        usersListBody.innerHTML = "";
        for(let i = 0; i < users.length; i++) {
            const userEl = document.createElement("tr");
            const editBtn = document.createElement("td");
            const deleteBtn = document.createElement("td");

            userEl.innerHTML = `
                    <td><p>${users[i].id}</td>
                    <td>${users[i].firstName}</p></td>
                    <td><p>${users[i].lastName}</p></td>
                    <td><p>${users[i].yearOfBirth}</p></td>
                    <td><p>${users[i].email}</p></td>
                    <td><p>${users[i].roles.map(role => role.name.replaceAll('ROLE_', '')).join(', ')}</p></td>`;
            editBtn.innerHTML = `<button data-id="${users[i].id}" type="button" class="btn btn-primary edit-btn" >Edit</button>`;
            deleteBtn.innerHTML = `<button data-id="${users[i].id}" type="button" class="btn btn-danger delete-btn">Delete</button>`;

            userEl.append(editBtn);
            userEl.append(deleteBtn);
            usersListBody.appendChild(userEl);
        }
    }

    function displayUser(person) {
        // console.log(person)
        authUserHeader.textContent = person.email + ' with roles ' + person.roles.map(role => role.name.replaceAll('ROLE_', '')).join(', ');

        authUserBody.innerHTML = '';
        const user = document.createElement('tr');
        user.innerHTML = `
                <td>${person.id}</td>
                <td>${person.firstName}</td>
                <td>${person.lastName}</td>
                <td>${person.yearOfBirth}</td>
                <td>${person.email}</td>
               <td>${person.roles.map(role => role.name.replaceAll('ROLE_', '')).join(', ')}</td>`;
        authUserBody.appendChild(user);
    }
    let editPassword;
    function openEditModal(id) {
        // Найти пользователя по id
        fetch(`http://localhost:8080/admin/${id}`)
            .then(response => response.json())
            .then(async user => {
                // Заполнить поля модального окна данными пользователя
                editId.value = user.id;
                editFirstName.value = user.firstName;
                editLastName.value = user.lastName;
                editAge.value = user.yearOfBirth;
                editEmail.value = user.email;
                editPassword = user.password;
                // console.log(responseRoleData.length);
                editRole.innerHTML = '';
                for (let i = 0; i < responseRoleData.length; i++) {
                    let bool = false;
                    user.roles.map(role => {
                        if(role.name === responseRoleData[i].name) bool = true
                    });
                    fromSelectRole.append(new Option(responseRoleData[i].name, responseRoleData[i].id, false, bool));
                    // console.log(responseRoleData[i]);
                }
                editModal.show();
                $("#edit-submit-btn").data("id", editId.value);
            })
            .catch(error => console.error(error));
    }

    function editUser(id) {
        console.log(id);
        const firstName = editFirstName.value;
        const lastName = editLastName.value;
        const yearOfBirth = editAge.value;
        const email = editEmail.value;
        const password = editPassword;
        let roles = [];
        for (let i = 0; i < fromSelectRole.length; i++) {
            if (fromSelectRole[i].selected) {
                let role = {id: 0, name: ""}
                role.id = i + 1;
                role.name = fromSelectRole[i].name;
                roles.push(role);
            }
        }
        // console.log(firstName, lastName, yearOfBirth, email, roles);
        // console.log(JSON.stringify({firstName, lastName, yearOfBirth, email, roles}))
        fetch(`http://localhost:8080/admin/edit/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({firstName, lastName, yearOfBirth,password , email, roles})
        })
            .then(response => response.json())
            .then(updatedUser => {
                // console.log(`Updated user with id ${updatedUser.id}`);
                fetch('http://localhost:8080/admin/all')
                    .then(response => response.json())
                    .then(users => {
                        displayUsers(users);
                        editModal.hide();
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.log(error));
    }

    $(document).on ("click", "#edit-submit-btn", function () {
        const id = $(this).data("id")
        editUser(id);
    });


    function openDeleteModal(id) {
        // Найти пользователя по id
        fetch(`http://localhost:8080/admin/${id}`)
            .then(response => response.json())
            .then(user => {
                // Заполнить поля модального окна данными пользователя
                deleteId.value = user.id;
                deleteFirstName.value = user.firstName;
                deleteLastName.value = user.lastName;
                deleteAge.value = user.yearOfBirth;
                deleteEmail.value = user.email;
                deleteRole.value = user.roles.map(role => role.name.replaceAll('ROLE_', '')).join(', ');
                // Открыть модальное окно
                deleteModal.show();
                $("#delete-submit").data("id", id);
            })
            .catch(error => console.error(error));
    }

    $(document).on ("click", ".delete-btn", function () {
        const id = $(this).data("id")
        openDeleteModal(id);
    });

    function deleteUser(id) {
        fetch(`http://localhost:8080/admin/delete/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                console.log(`Deleted user with id ${id}`);
                fetch('http://localhost:8080/admin/all')
                    .then(response => response.json())
                    .then(users => {
                        displayUsers(users);
                        deleteModal.hide();
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.log(error));
    }

    $(document).on ("click", "#delete-submit", function () {
        const id = $(this).data("id")
        deleteUser(id);
    });

    function createUser() {
        const name = newFirstName.value;
        const surname = newLastName.value;
        const age = newAge.value;
        const email = newEmail.value;
        const password = newPassword.value;
        let roles = [];
        for (let i = 0; i < formSelectCreate.length; i++) {
            if (formSelectCreate[i].selected) {
                let role = {id: 0, name: ""}
                role.id = i + 1;
                role.name = respRolesData[i].name;
                roles.push(role);
            }
        }
        fetch('http://localhost:8080/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, surname, age, email, password, roles})
        })
            .then(response => response.json())
            .then(user => {
                console.log(`Created user with email ${user.email}`);
                newFirstName.value = '';
                newLastName.value = '';
                newAge.value = '';
                newEmail.value = '';
                newPassword.value = '';
                fromSelectRole.value = '';
                fetch('http://localhost:8080/admin/all')
                    .then(response => response.json())
                    .then(users => {
                        displayUsers(users);
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.log(error));

    }


    $(document).on ("click", "#new-user-btn", function () {
        const id = $(this).data("id")
        createUser();
    });


});