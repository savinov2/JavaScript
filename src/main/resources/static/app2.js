$(document).ready ( function () {
    const authUserBody = document.getElementById("user-admin-body");
    const authUserHeader = document.getElementById("auth-user");

    fetch('http://localhost:8080/user/this')
        .then(response => response.json())
        .then(user => {
            // console.log(user)
            displayUser(user);
        }).catch(error => console.error(error));


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
});