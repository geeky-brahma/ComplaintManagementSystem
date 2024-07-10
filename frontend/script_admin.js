// const { data } = require("../backend-js/src/controllers/complaintsController");

const inbox = document.querySelector("#inbox");
//i think inbox wasnt declared so added
inbox.addEventListener("click", (e) => {
    // Define Role & ID
    const role = sessionStorage.role;
    const id = sessionStorage.id;
    const name = sessionStorage.name;
    // console.log(name);
    // Define the request URL
    const url = `http://127.0.0.1:5000/all_complaints?role=${role}&id=${id}`;
    // console.log(url);

    // Send data using Fetch API
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((responseData) => {
            // Request was successful
            // console.log(responseData);
            const main_content = document.querySelector("#main-content");
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
                <th>STATUS</th>
            </tr>
            <!-- Table rows can be added here as needed -->
            </table>
            <div id='message' style='color:red'></div>`;

            const data = responseData["data"];
            for (let i = 0; i < data.length; i++) {
                const newData = {
                    complaintId: data[i].id,
                    empNo: data[i].employee_no,
                    empName: data[i].employee_name,
                    division: data[i].division_hq,
                    department: data[i].department,
                    website: data[i].website,
                    module: data[i].module,
                    desc: data[i].description,
                    referenceDoc: data[i].referenceDoc,
                    status: data[i].status,
                    date: data[i].date,
                    currently_with: data[i].currently_with,
                };
                const table = document.querySelector("#complaint-table");

                // Create a new row and add the data
                const newRow = table.insertRow();
                console.log(newData)
                // Add event listener to navigate to the complaint details of that page
                newRow.addEventListener("click", () => {
                    window.location.href = `COMPLAINT_DETAILS.html?complaint_id=${newData.complaintId}`;
                });
                newRow.style.cursor = "pointer";
                if (
                    newData.status === "Closed" ||
                    newData.currently_with != sessionStorage.name
                ) {
                    // console.log("random shittery");
                    // document.getElementById('message').innerHTML = `<center><h2>Nothing to show here!!</h2></center>`
                    continue;
                } else {
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
                    // const linkCell = newRow.insertCell(8);
                    // const link = document.createElement('a');
                    // console.log(newData.referenceDoc);
                    // link.href = newData.referenceDoc;
                    // link.textContent = 'Click here';
                    // linkCell.appendChild(link);
                    newRow.insertCell(9).textContent = newData.status;
                }
            }
        })
        .catch((error) => {
            // Request failed
            console.error("Error:", error);
        });

    const main_content = document.querySelector("#main-content");
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
    </table>`;
});

const logOut = document.querySelector("#logout");

logout.addEventListener("click", (e) => {
    sessionStorage.clear();
    location.href = "WELCOME.html";
});
window.onload = () => {
    if (!sessionStorage.role) {
        location.href = "LOGIN.html";
    }
};

document.getElementById("add_user").addEventListener("click", (e) => {
    if (sessionStorage.role === 'admin') {
        document.querySelector("#main-content").innerHTML = `
        
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

        
            `;
        const registerButton = document.querySelector(
            '.form-actions button[type="submit"]'
        );
        formData = {};
        registerButton.addEventListener("click", (e) => {
            e.preventDefault(); // Prevent the default form submission
            formData["id"] = document.getElementById("employee-id").value;
            formData["password"] = document.getElementById("password").value;
            formData["name"] = document.getElementById("name").value;
            formData["role"] = document.getElementById("role").value;
            // console.log("Form submitted:", { formData });
            const xhr = new XMLHttpRequest();

            // Define the onload function to handle the response
            xhr.onload = function () {
                if (xhr.status === 201) {
                    // Request was successful
                    const responseData = JSON.parse(xhr.responseText);
                    // Process the response data here
                    // console.log(responseData);

                    data = responseData["data"];
                    document.getElementById("status").innerHTML = `
                ${data}
              `;
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
        });
    }
    else {
        document.querySelector("#main-content").innerHTML = `
            <h1>Restricted Content!!</h1>
        `
    }
});
document.getElementById("activate_deactivate_user").addEventListener("click", (e) => {
    if (sessionStorage.role === 'admin') {
        // Create a new XMLHttpRequest object
        const xhr = new XMLHttpRequest();

        // Define the request URL
        const url = `http://127.0.0.1:5000/all_users`;
        // console.log(url);

        // Configure the request
        xhr.open("GET", url);

        // Define the onload function to handle the response
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Request was successful
                const responseData = JSON.parse(xhr.responseText);
                // Process the response data here
                // console.log(responseData);
                main_content = document.querySelector("#main-content");
                main_content.innerHTML = `
            <table class="table" id="users-table">
            <tr>
                <th>EMPLOYEE ID</th>
                <th>EMPLOYEE NAME</th>
                <th>SCOPE</th>
                <th>DROP</th>
            </tr>
            <!-- Table rows can be added here as needed -->
            </table>`;
                data = responseData["data"];
                console.log(data);
                for (let i = 0; i < data.length; i++) {
                    const newData = {
                        empId: data[i].employee_id,
                        empName: data[i].employee_name,
                        scope: data[i].scope,
                        dropped: data[i].dropped,
                    };
                    const table = document.querySelector("#users-table");

                    if (newData.empId === sessionStorage.id) {
                        continue;
                    }

                    // Create a new row and add the data
                    const newRow = table.insertRow();

                    newRow.insertCell(0).textContent = newData.empId;
                    newRow.insertCell(1).textContent = newData.empName;
                    if (newData.scope) {
                        newRow.insertCell(2).textContent = "Admin";
                    } else {
                        newRow.insertCell(2).textContent = "User";
                    }
                    let dropped = newData.dropped;
                    if (dropped) {
                        const activateButton = document.createElement("button");
                        activateButton.textContent = "Activate";
                        activateButton.onclick = function () {
                            const empId = data[i].employee_id;
                            // Fetch API to activate user
                            fetch(`http://127.0.0.1:5000/activate_user/${empId}`, {method : 'POST'})
                                .then((response) => {
                                    if (!response.ok) {
                                        throw new Error(`HTTP error! Status: ${response.status}`);
                                    }
                                    return response.json();
                                })
                                .then((responseData) => {
                                    // Request was successful
                                    // console.log(responseData);
                                    // Remove the row from the table
                                    // const table = document.querySelector("#users-table");
                                    // table.deleteRow(newRow.rowIndex);
                                    activateButton.textContent = "Deactivate";
                                    alert(`User ${newData.empName} Activated`);
                                    dropped = false;
                                    localStorage.setItem('targetElementId', 'activate_deactivate_user');
                                    window.location.reload();
                                })
                                .catch((error) => {
                                    // Request failed
                                    console.error("Error:", error);
                                });
                        };
                        newRow.insertCell(3).appendChild(activateButton);
                    }
                    else {
                        const dropButton = document.createElement("button");
                        dropButton.textContent = "Deactivate";
                        dropButton.onclick = function () {
                            const empId = data[i].employee_id;
                            // Fetch api to http://127.0.0.1:5000/drop_user/${empId}
                            fetch(`http://127.0.0.1:5000/drop_user/${empId}`, { method: 'DELETE' })
                                .then((response) => {
                                    if (!response.ok) {
                                        throw new Error(`HTTP error! Status: ${response.status}`);
                                    }
                                    return response.json();
                                })
                                .then((responseData) => {
                                    // Request was successful
                                    // console.log(responseData);
                                    // Remove the row from the table
                                    // const table = document.querySelector("#users-table");
                                    // table.deleteRow(newRow.rowIndex);
                                    dropButton.textContent = "Activate";
                                    alert(`User ${newData.empName} Dectivated`);
                                    dropped = true;
                                    localStorage.setItem('targetElementId', 'activate_deactivate_user');
                                    window.location.reload();                                    
                                })
                                .catch((error) => {
                                    // Request failed
                                    console.error("Error:", error);
                                });
                        };
                        newRow.insertCell(3).appendChild(dropButton);
                    }
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
    }
    else {
        // document.getElementById("activate_deactivate_user").display = "none";
        main_content = document.querySelector("#main-content");
        main_content.innerHTML = `
                <h1>Restricted Content!!</h1>
            `
    }
});

document.getElementById("sent").addEventListener("click", (e) => {
    // Define Role & ID
    role = sessionStorage.role;
    id = sessionStorage.id;
    name = sessionStorage.name;

    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Define the request URL
    const url = `http://127.0.0.1:5000/sent?role=${role}&id=${id}&name=${name}`;
    // console.log(url);

    // Configure the request
    xhr.open("GET", url);

    // Define the onload function to handle the response
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Request was successful
            const responseData = JSON.parse(xhr.responseText);
            // Process the response data here
            // console.log(responseData);
            main_content = document.querySelector("#main-content");
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
                <th>STATUS</th>
            </tr>
            <!-- Table rows can be added here as needed -->
            </table>
            <div id='message' style='color:red'></div>`;
            data = responseData["data"];
            console.log(responseData);
            for (let i = 0; i < data.length; i++) {
                const newData = {
                    complaintId: data[i].id,
                    empNo: data[i].employee_no,
                    empName: data[i].employee_name,
                    division: data[i].division_hq,
                    department: data[i].department,
                    website: data[i].website,
                    module: data[i].module,
                    desc: data[i].description,
                    referenceDoc: data[i].referenceDoc,
                    status: data[i].status,
                    date: data[i].date,
                    currently_with: data[i].currently_with,
                };
                const table = document.querySelector("#complaint-table");

                // Create a new row and add the data
                const newRow = table.insertRow();

                // Add event listener to navigate to the complaint details of that page
                newRow.addEventListener("click", () => {
                    window.location.href = `COMPLAINT_DETAILS.html?complaint_id=${newData.complaintId}`;
                });
                newRow.style.cursor = "pointer";
                console.log(newData.currently_with)
                if (
                    newData.status === "Closed"
                    ||
                    newData.currently_with === sessionStorage.name
                ) {
                    // console.log("random shittery");
                    // document.getElementById('message').innerHTML = `<center><h2>Nothing to show here!!</h2></center>`
                    continue;
                } else {
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
                    // const linkCell = newRow.insertCell(8);
                    // const link = document.createElement("a");
                    // link.href = newData.referenceDoc;
                    // link.textContent = "Document";
                    // linkCell.appendChild(link);
                    newRow.insertCell(9).textContent = newData.status;
                }
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

    main_content = document.querySelector("#main-content");
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
    </table>
    <div id=''message></div>`;
});


document.getElementById('all_complaints').addEventListener("click", (e) => {
    // Define Role & ID
    const role = sessionStorage.role;
    const id = sessionStorage.id;
    const name = sessionStorage.name;

    if (sessionStorage.role === 'admin') {
        // Define the request URL
        const url = `http://127.0.0.1:5000/all_complaints?role=${role}&id=${id}`;


        // Send data using Fetch API
        fetch(url)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((responseData) => {
                // Request was successful
                // console.log(responseData);
                const main_content = document.querySelector("#main-content");
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
                <th>STATUS</th>
            </tr>
            <!-- Table rows can be added here as needed -->
            </table>`;

                const data = responseData["data"];
                for (let i = 0; i < data.length; i++) {
                    const newData = {
                        complaintId: data[i].id,
                        empNo: data[i].employee_no,
                        empName: data[i].employee_name,
                        division: data[i].division_hq,
                        department: data[i].department,
                        website: data[i].website,
                        module: data[i].module,
                        desc: data[i].description,
                        referenceDoc: data[i].referenceDoc,
                        status: data[i].status,
                        date: data[i].date,
                        currently_with: data[i].currently_with,
                    };
                    const table = document.querySelector("#complaint-table");

                    // Create a new row and add the data
                    const newRow = table.insertRow();

                    // Add event listener to navigate to the complaint details of that page
                    newRow.addEventListener("click", () => {
                        window.location.href = `COMPLAINT_DETAILS.html?complaint_id=${newData.complaintId}`;
                    });
                    newRow.style.cursor = "pointer";

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
                    // const linkCell = newRow.insertCell(8);
                    // const link = document.createElement('a');
                    // console.log(newData.referenceDoc);
                    // link.href = newData.referenceDoc;
                    // link.textContent = 'Click here';
                    // linkCell.appendChild(link);
                    newRow.insertCell(9).textContent = newData.status;
                }
            }
            )
            .catch((error) => {
                // Request failed
                console.error("Error:", error);
            });

        const main_content = document.querySelector("#main-content");
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
            </table>
            `;
    }
    else {
        const main_content = document.querySelector("#main-content");
        main_content.innerHTML = `
            <h1>Restricted Content!!</h1>
        `
    }
});

document.getElementById("reports").addEventListener("click", (e) => {
    const main_content = document.querySelector("#main-content");
    main_content.innerHTML = `<h2>Complaints Report Page</h2>
    <div class="complaint-details-single" style="display: flex; flex-direction: column; justify-content: left;">

        <div>
            <form id="complaintForm" style="padding: 10px">
                <div class="form-group" style="margin-top: 0%;">
                    <label for="start-date">Start Date:</label>
                    <input type="date" id="start-date">
                </div>
                <div class="form-group">
                    <label for="end-date">End Date:</label>
                    <input type="date" id="end-date">
                </div>
                <div class="form-group">
                    <label for="status">Status:</label>
                    <select id="status">
                        <option value="">All</option>
                        <option value="Under Process">Under Process</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
                <button class="submit-button" id="filter">Filter</button>
            </form>
        </div>
        <div style="padding:10px">
            <table class="table" id="complaint-table">
                <thead>
                    <tr>
                        <th>COMPLAINT ID</th>
                        <th>DATE</th>
                        <th>DIVISION</th>
                        <th>DEPARTMENT</th>
                        <th>WEBSITE</th>
                        <th>MODULE</th>
                        <th>DESC</th>
                    </tr>
                </thead>
                <!-- Table rows can be added here as needed -->
                <tbody id='tbody'>
                    <tr id="no-data">
                        <td colspan="7">No complaints to display</td>
                    </tr>
                </tbody>
            </table>
            <div id='message'></div>
        </div>
    </div>`
    document.getElementById('filter').addEventListener('click', fetchComplaints);
    async function fetchComplaints(e) {
        e.preventDefault();
        let startDate = document.getElementById('start-date').value;
        // startDate = formatDate(startDate);
        // console.log(startDate)
        let endDate = document.getElementById('end-date').value;
        // endDate = formatDate(endDate);
        // console.log(endDate)

        // function formatDate(date) {
        //     const [year, month, day] = date.split('-');
        //     return `${day}-${month}-${year}`;
        // }
        const status = document.getElementById('status').value;
        // console.log(status)
        const message = document.getElementById('message');

        try {
            const response = await fetch(`http://127.0.0.1:5000/report?startDate=${startDate}&endDate=${endDate}&status=${status}`);
            let complaints = await response.json();
            complaints = complaints.data;
            // console.log(complaints);
            // const tableBody = document.querySelector('#complaints-table tbody');
            const tableBody = document.querySelector('#tbody');
            const noData = document.getElementById('no-data');
            let total_complaints = 0;
            let closed_complaints = 0;
            let under_process_complaints = 0;

            if (complaints.length > 0) {
                tableBody.innerHTML = '';
                // console.log(complaints.length)
                if (noData) noData.style.display = 'none';
                // noData.style.display = 'none';
                complaints.forEach(complaint => {
                    // console.log(complaint)
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${complaint.id}</td>
                        <td>${complaint.date}</td>
                        <td>${complaint.division_hq}</td>
                        <td>${complaint.department}</td>
                        <td>${complaint.website}</td>
                        <td>${complaint.module}</td>
                        <td>${complaint.description}</td>
                    `;
                    tableBody.appendChild(row);
                    // message.innerHTML = '';
                    total_complaints++;
                    if (complaint.status === 'Closed') closed_complaints++;
                    if (complaint.status === 'Under Process') under_process_complaints++;


                });
                message.innerHTML = `
                        <h3>Total Complaints: ${total_complaints}</h3>
                        <h3>Total Closed: ${closed_complaints++}</h3>
                        <h3>Total Under Process: ${under_process_complaints++}</h3>
                    `;
            } else {
                tableBody.innerHTML = `<tr id="no-data">
                        <td colspan="7">No complaints to display</td>
                    </tr>`;
                message.innerHTML = '';
                // noData.style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    }

    document.addEventListener('DOMContentLoaded', fetchComplaints);
})


document.addEventListener('DOMContentLoaded', () => {
    const name = sessionStorage.name;
    const namedisplay = document.querySelector("#upper-navname");
    console.log(name);
    namedisplay.innerHTML = `${name}`

    if (!sessionStorage.role) {
        location.href = "LOGIN.html";
    }
    if (sessionStorage.role === 'user') {
        document.getElementById('all_complaints').style.display = 'none';
        document.getElementById('add_user').style.display = 'none';
        document.getElementById('activate_deactivate_user').style.display = 'none';
        document.getElementById('reports').style.display = 'none';
    }
});

// Add an event listener to check for the target element after reload
window.addEventListener('DOMContentLoaded', (event) => {
    const targetElementId = localStorage.getItem('targetElementId');
    if (targetElementId) {
        const targetElement = document.getElementById(targetElementId);
        if (targetElement) {
            // Click the target element
            targetElement.click();
        }
        // Remove the item from local storage to prevent multiple clicks
        localStorage.removeItem('targetElementId');
    }
});