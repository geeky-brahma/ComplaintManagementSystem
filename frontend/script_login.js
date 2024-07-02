const name = document.querySelector('#name') || null
const id = document.querySelector('#id')
const password = document.querySelector('input[type="password"]')
const submitBtn = document.querySelector('button[type="submit"]');

if (name == null) { // Login page
    submitBtn.addEventListener('click', (event) => {
        event.preventDefault();

        let formData = {
            "id": id.value,
            "password": password.value
        };

        // Send data using Fetch API
        fetch('http://127.0.0.1:5000/login_users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Request was successful
            console.log(data);
            
            const responseData = data['data'];
            validateData(responseData);
        })
        .catch(error => {
            // Request failed
            console.error('Error:', error);
        });
    });
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