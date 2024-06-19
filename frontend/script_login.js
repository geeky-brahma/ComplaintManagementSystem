const name = document.querySelector('#name') || null
const id = document.querySelector('#id')
const password = document.querySelector('input[type="password"]')
const submitBtn = document.querySelector('button[type="submit"]');

if (name == null) { // Login page
    submitBtn.addEventListener('click', () => {
        event.preventDefault();

        let formData = {
            "id": id.value,
            "password": password.value
        };
        // sendData(formData);
        // Create a new XMLHttpRequest object
        const xhr = new XMLHttpRequest();



        // Define the onload function to handle the response
        xhr.onload = function () {
            if (xhr.status === 201) {
                // Request was successful
                const responseData = JSON.parse(xhr.responseText);
                // Process the response data here
                console.log(responseData);

                data = responseData['data']
                validateData(data)

            } else {
                // Request failed
                console.error("Error:", xhr.status);
            }
        };

        // Open a POST request to the server
        xhr.open("POST", "http://127.0.0.1:5000/login_users");

        // Set request headers
        xhr.setRequestHeader("Content-Type", "application/json");

        // Convert form data to JSON and send it to the server
        xhr.send(JSON.stringify(formData));



    })
}
else { // Register page is open

    submitBtn.addEventListener('click', () => {
        event.preventDefault();

        let formData = {
            "name": name.value,
            "id": id.value,
            "password": password.value
        };
        // sendData(formData);
        // Create a new XMLHttpRequest object
        const xhr = new XMLHttpRequest();



        // Define the onload function to handle the response
        xhr.onload = function () {
            if (xhr.status === 201) {
                // Request was successful
                const responseData = JSON.parse(xhr.responseText);
                // Process the response data here
                console.log(responseData);

                data = responseData['data']
                validateData(data)

            } else {
                // Request failed
                console.error("Error:", xhr.status);
            }
        };

        // Open a POST request to the server
        xhr.open("POST", "http://127.0.0.1:5000/login_users");

        // Set request headers
        xhr.setRequestHeader("Content-Type", "application/json");

        // Convert form data to JSON and send it to the server
        xhr.send(JSON.stringify(formData));



    })

}

const validateData = (data) => {
    if (!data.name) {
        alertBox(data);
    } else {
        sessionStorage.name = data.name;
        sessionStorage.role = data.role;
        sessionStorage.id = data.id;
        location.href = 'ADMIN.html';
    }
}

const alertBox = (data) => {
    const alertContainer = document.querySelector('.alert-box');
    const alertMsg = document.querySelector('.alert');
    alertMsg.innerHTML = data['alert'];

    alertContainer.style.top = `5%`;
    setTimeout(() => {
        alertContainer.style.top = null;
    }, 5000);
}