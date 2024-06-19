inbox.addEventListener("click", (e) => {

    // Define Role & ID
    role = sessionStorage.role;
    id = sessionStorage.id;

    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    
    // Define the request URL
    const url = `http://127.0.0.1:5000/all_complaints?role=${role}&id=${id}`;
    console.log(url)

    // Configure the request
    xhr.open("GET", url);

    // Define the onload function to handle the response
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Request was successful
            const responseData = JSON.parse(xhr.responseText);
            // Process the response data here
            console.log(responseData);
            main_content = document.querySelector('#main-content')
            main_content.innerHTML = `
            <table class="table" id="complaint-table">
            <tr>
                <th>COMPLAINT ID</th>
                <th>DATE</th>
                <th>EMPLOYEE NO</th>
                <th>EMPLOYEE NAME</th>
                <th>DIVISION</th>
                <th>DEPARTMENT</th>
                <th>WEBSITE</th>
                <th>MODULE</th>
                <th>DESC</th>
                <th>REFERENCE DOCUMENT</th>
                <th>STATUS</th>
            </tr>
            <!-- Table rows can be added here as needed -->
            </table>`
            data = responseData['data']
            console.log(responseData)
            for (let i = 0; i < data.length; i++) {
                const newData = {
                    complaintId: data[i][0],
                    empNo: data[i][1],
                    empName: data[i][2],
                    division: data[i][3],
                    department: data[i][4],
                    website: data[i][5],
                    module: data[i][6],
                    desc: data[i][7],
                    referenceDoc: data[i][8],
                    status: data[i][9],
                    date: data[i][10]
                };
                const table = document.querySelector('#complaint-table');

                // Create a new row and add the data
                const newRow = table.insertRow();

                // Add event listener to navigate to the complaint details of that page
                newRow.addEventListener('click', () => {
                    window.location.href = `COMPLAINT_DETAILS.html?complaint_id=${newData.complaintId}`;
                });
                newRow.style.cursor = 'pointer';

                newRow.insertCell(0).textContent = newData.complaintId;
                newRow.insertCell(1).textContent = newData.date;
                newRow.insertCell(2).textContent = newData.empNo;
                newRow.insertCell(3).textContent = newData.empName;
                newRow.insertCell(4).textContent = newData.division;
                newRow.insertCell(5).textContent = newData.department;
                newRow.insertCell(6).textContent = newData.website;
                newRow.insertCell(7).textContent = newData.module;
                newRow.insertCell(8).textContent = newData.desc;
                // newRow.insertCell(9).textContent = newData.referenceDoc;
                //updated the reference column to a hyperlink
                const linkCell = newRow.insertCell(8);
                const link = document.createElement('a');
                link.href = newData.referenceDoc;
                link.textContent = 'Click here';
                linkCell.appendChild(link);
                newRow.insertCell(10).textContent = newData.status;

            }
        } else {
            // Request failed
            console.error("Error:", xhr.status);
        }
    };

    // Define the onerror function to handle errors
    xhr.onerror = function () {
        console.error("Request failed");
    };

    // Send the request
    xhr.send();

    main_content = document.querySelector('#main-content')
    main_content.innerHTML = `
    <table class="table">
      <tr>
        <th>COMPLAINT ID</th>
        <th>COMPLAIN CASE ID</th>
        <th>DIV</th>
        <th>DEPARTMENT</th>
        <th>MAGNITUDE</th>
        <th>STATUS</th>
        <th>DATE</th>
      </tr>
      <!-- Table rows can be added here as needed -->
    </table>`


});
const logOut = document.querySelector('.logout');

logout.addEventListener('click', (e) => {
    sessionStorage.clear();
    location.href = 'LOGIN.html';
})
// window.onload = () => {
//     if(!sessionStorage.role){
//         location.href = 'LOGIN.html';
//     } 
// }

document.getElementById('add_user').addEventListener('click', (e) => {
    document.querySelector('#main-content').innerHTML = `
        
                <div class="form-container">
                    <h2>Register New User</h2>
                    <form id="registration-form">
                        <div class="form-group">
                            <label for="employee-id">Employee ID</label>
                            <input type="text" id="employee-id" name="employee-id" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <div class="form-group">
                            <label for="name">Name</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="role">Role</label>
                            <select id="role" name="role" required>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button class='submit-button' type="submit">Register</button>
                        </div>
                    </form>
                    <h3 id="status"></h3>
                </div>

         
    `
    const registerButton = document.querySelector('.form-actions button[type="submit"]');
    formData = {}
    registerButton.addEventListener('click', (e) => {
        e.preventDefault();  // Prevent the default form submission
        formData["id"] = document.getElementById('employee-id').value;
        formData["password"] = document.getElementById('password').value;
        formData["name"] = document.getElementById('name').value;
        formData["role"] = document.getElementById('role').value;
        console.log('Form submitted:', { formData });
        const xhr = new XMLHttpRequest();

        // Define the onload function to handle the response
        xhr.onload = function () {
            if (xhr.status === 201) {
                // Request was successful
                const responseData = JSON.parse(xhr.responseText);
                // Process the response data here
                console.log(responseData);

                data = responseData['data']
                document.getElementById('status').innerHTML = `
                ${data}
              `

            } else {
                // Request failed
                console.error("Error:", xhr.status);
            }
        };

        // Open a POST request to the server
        xhr.open("POST", "http://127.0.0.1:5000/register_users");

        // Set request headers
        xhr.setRequestHeader("Content-Type", "application/json");
        // window.stop()
        // Convert form data to JSON and send it to the server
        xhr.send(JSON.stringify(formData));
    })
})

document.getElementById('sent').addEventListener("click", (e) => {

    // Define Role & ID
    role = sessionStorage.role;
    id = sessionStorage.id;
    name = sessionStorage.name;

    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    
    // Define the request URL
    const url = `http://127.0.0.1:5000/sent?role=${role}&id=${id}&name=${name}`;
    console.log(url)

    // Configure the request
    xhr.open("GET", url);

    // Define the onload function to handle the response
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Request was successful
            const responseData = JSON.parse(xhr.responseText);
            // Process the response data here
            console.log(responseData);
            main_content = document.querySelector('#main-content')
            main_content.innerHTML = `
            <table class="table" id="complaint-table">
            <tr>
                <th>COMPLAINT ID</th>
                <th>DATE</th>
                <th>EMPLOYEE NO</th>
                <th>EMPLOYEE NAME</th>
                <th>DIVISION</th>
                <th>DEPARTMENT</th>
                <th>WEBSITE</th>
                <th>MODULE</th>
                <th>DESC</th>
                <th>REFERENCE DOCUMENT</th>
                <th>STATUS</th>
            </tr>
            <!-- Table rows can be added here as needed -->
            </table>`
            data = responseData['data']
            console.log(responseData)
            for (let i = 0; i < data.length; i++) {
                const newData = {
                    complaintId: data[i][0],
                    empNo: data[i][1],
                    empName: data[i][2],
                    division: data[i][3],
                    department: data[i][4],
                    website: data[i][5],
                    module: data[i][6],
                    desc: data[i][7],
                    referenceDoc: data[i][8],
                    status: data[i][9],
                    date: data[i][10]
                };
                const table = document.querySelector('#complaint-table');

                // Create a new row and add the data
                const newRow = table.insertRow();

                // Add event listener to navigate to the complaint details of that page
                newRow.addEventListener('click', () => {
                    window.location.href = `COMPLAINT_DETAILS.html?complaint_id=${newData.complaintId}`;
                });
                newRow.style.cursor = 'pointer';

                newRow.insertCell(0).textContent = newData.complaintId;
                newRow.insertCell(1).textContent = newData.date;
                newRow.insertCell(2).textContent = newData.empNo;
                newRow.insertCell(3).textContent = newData.empName;
                newRow.insertCell(4).textContent = newData.division;
                newRow.insertCell(5).textContent = newData.department;
                newRow.insertCell(6).textContent = newData.website;
                newRow.insertCell(7).textContent = newData.module;
                newRow.insertCell(8).textContent = newData.desc;
                // newRow.insertCell(9).textContent = newData.referenceDoc;
                //updated the reference column to a hyperlink
                const linkCell = newRow.insertCell(8);
                const link = document.createElement('a');
                link.href = newData.referenceDoc;
                link.textContent = 'Document';
                linkCell.appendChild(link);
                newRow.insertCell(10).textContent = newData.status;

            }
        } else {
            // Request failed
            console.error("Error:", xhr.status);
        }
    };

    // Define the onerror function to handle errors
    xhr.onerror = function () {
        console.error("Request failed");
    };

    // Send the request
    xhr.send();

    main_content = document.querySelector('#main-content')
    main_content.innerHTML = `
    <table class="table">
      <tr>
        <th>COMPLAINT ID</th>
        <th>COMPLAIN CASE ID</th>
        <th>DIV</th>
        <th>DEPARTMENT</th>
        <th>MAGNITUDE</th>
        <th>STATUS</th>
        <th>DATE</th>
      </tr>
      <!-- Table rows can be added here as needed -->
    </table>`


});



