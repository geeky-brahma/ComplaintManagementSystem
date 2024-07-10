let ID = null;
let currently_with;
let name = sessionStorage.name
console.log(name)
document.addEventListener('DOMContentLoaded', (e) => {
    console.log("Hello World!!");
    const urlParams = new URLSearchParams(window.location.search);
    ID = urlParams.get('complaint_id');
    console.log(ID);
    let formData = {
        "IDType": 'id',
        "ID": ID
    };
    sendData(formData);
    fetchAllUsers();
    // disableCloseForward();

});

const forwardRadio = document.getElementById("forward");
const actionContent = document.getElementById("action-content");
forwardRadio.addEventListener("change", function () {
    if (forwardRadio.checked) {
        actionContent.innerHTML = '<label for="forward-to">Forward to:</label><select id="forward-to"><option value="user1">User1</option><option value="user2">User2</option><option value="user3">User3</option><option value="user4">User4</option></select>';
        fetchAllUsers()
    }
});


const submitButton = document.querySelector('button[type="submit"]');
submitButton.addEventListener('click', () => {
    console.log('Submit Clicked !!');
    const radioButtons = document.getElementsByName('action');
    let selectedValue;
    let formData;
    const textarea = document.getElementById('remarks');
    const textValue = textarea.value;
    const now = new Date();
    // console.log(now)
    const date = new Date(now).toISOString().split('T')[0];
    const time = now.toLocaleTimeString('en-GB'); // 'en-GB' format gives HH:MM:SS
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selectedValue = radioButton.value;
            break;
        }
    }
    if (selectedValue === 'close') {
        console.log("Textarea content:", textValue);
        formData = {
            id: ID,
            status: 'Closed',
            remarks: textValue
        };
    }
    if (selectedValue === 'forward') {
        const dropdown = document.getElementById('forward-to');
        const selectedText = dropdown.options[dropdown.selectedIndex].text;
        console.log("Selected complaint type:", selectedText);
        formData = {
            id: ID,
            forwardedFrom: sessionStorage.name,
            forwardedTo: selectedText,
            remarks: textValue,
            date: date,
            time: time,
            now: now
        };
        console.log(formData);
    }
    // console.log("Selected complaint type:", selectedValue);
    closeForward(formData);
});

async function sendData(formData) {
    try {
        const response = await fetch('http://127.0.0.1:5000/complaint_details', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Failed to send data.');
        }

        const responseData = await response.json();
        console.log('Data sent successfully!', responseData);

        const data = responseData.data[0];
        displayComplaintDetails(data);

        const innerArray = responseData.data[1];
        console.log(innerArray)
        displayHistory(innerArray);
    } catch (error) {
        console.error('Error:', error);
        // Handle error response from server if needed
    }
}

async function closeForward(formData) {
    try {
        const response = await fetch('http://127.0.0.1:5000/close_forward', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Failed to send data.');
        }

        const responseData = await response.json();
        console.log('Data sent successfully!', responseData);

        // Handle response data if needed
        const data = responseData.data;
        document.getElementById('successMessage').innerHTML = `<h2>${data}</h2>`;
        setTimeout(() => {
            location.reload();
        }, 3000);

    } catch (error) {
        console.error('Error:', error);
        // Handle error response from server if needed
    }
}

function displayComplaintDetails(data) {
    // console.log(data)
    data = data[0]
    const newData = {
        complaintId: data.id,
        empNo: data.employee_no,
        empName: data.employee_name,
        division: data.division_hq,
        department: data.department,
        website: data.website,
        module: data.module,
        desc: data.description,
        // referenceDoc: data.referenceDoc,
        referenceDoc: data.reference,
        status: data.status,
        date: data.date,
        currently_with: data.currently_with,
        status: data.status,


        // complaintId: data.id,
        // empNo: data[1],
        // empName: data[2],
        // division: data[3],
        // department: data[4],
        // website: data[5],
        // module: data[6],
        // desc: data[7],
        // referenceDoc: data[8],
        // status: data[9],
        // date: data[10],
        // currently_with: data[12],
        // remarks: data[11]
    };
    // console.log(currently_with)
    currently_with = newData.currently_with;
    // console.log(currently_with)

    document.getElementById('complain-id').innerText = newData.complaintId;
    document.getElementById('complain-description').innerText = newData.desc;
    document.getElementById('website').innerText = newData.website;
    document.getElementById('module').innerText = newData.module;
    document.getElementById('div').innerText = newData.division;
    document.getElementById('employee-name').innerText = newData.empName;
    document.getElementById('employee-no').innerText = newData.empNo;
    document.getElementById('currently_with').innerText = newData.currently_with;
    document.getElementById('status').innerText = newData.status;
    document.getElementById('status').style.color = 'red';
    document.getElementById('status').style.fontWeight = 'bold';
    sessionStorage.status = newData.status;



    const referenceDocElement = document.getElementById('reference-document');
    if (newData.referenceDoc) {
        const link = document.createElement('a');
        // link.href = newData.referenceDoc;
        // link.href = downloadFile(newData.complaintId);
        link.innerText = 'Click here';
        link.style.cursor = 'pointer'
        link.style.color = 'blue'
        link.style.textDecoration = 'underline'
        referenceDocElement.innerHTML = '';
        referenceDocElement.appendChild(link);
        // Add event listener to the link element
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default behavior
            downloadFile(newData.complaintId)

        });

        async function downloadFile(id) {
            try {
                const response = await fetch(`http://localhost:5000/download?id=${id}`);
                if (!response.ok) {
                    throw new Error('File download failed');
                }
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);

                // Create a link element to trigger the download
                const a = document.createElement('a');
                a.href = url;
                a.download = id;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } catch (error) {
                console.error('Error downloading file:', error);
                // Handle error
            }
        }

    } else {
        referenceDocElement.innerText = 'No document available';
    }
    disableCloseForward();
}

function displayHistory(innerArray) {
    const historyPlace = document.getElementById('history');

    if (innerArray && innerArray.length > 0) {
        let html = '';
        for (const element of innerArray) {
            console.log(element)
            html += `
                <div style='border: 1px solid #ddd; padding: 20px;'>
                    <div>Complaint Id: ${element.complaint_id}</div>
                    <div>From: ${element.fwd_from}</div>
                    <div>To: ${element.fwd_to}</div>
                    <div>Remarks: ${element.remarks}</div>
                    <div>Date: ${element.date}</div>
                    <div>Time: ${element.time}</div>
                </div>
            `;
        }
        historyPlace.innerHTML = html;
    } else {
        historyPlace.innerHTML = `<h4 style="color: red;">No History!!!</h4>`;
    }
}


async function fetchAllUsers() {
    try {
        const response = await fetch('http://127.0.0.1:5000/all_users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users.');
        }

        const responseData = await response.json();
        console.log('Fetched users successfully!', responseData);
        populateUserDropdown(responseData.data);
    } catch (error) {
        console.error('Error:', error);
        // Handle error response from server if needed
    }
}

function populateUserDropdown(users) {
    const dropdown = document.getElementById('forward-to');
    dropdown.innerHTML = ''; // Clear any existing options
    users.forEach(user => {
        if (user.employee_name !== sessionStorage.name && user.employee_name !== sessionStorage.currently_with) { // Skip the logged-in user
            const option = document.createElement('option');
            option.value = user.employee_id;
            option.text = user.employee_name;
            dropdown.appendChild(option);
        }
    });
}

function disableCloseForward() {
    if (name !== currently_with || sessionStorage.status === 'Closed') {
        // console.log("Not same")
        document.getElementById('close-forward').style.display = 'none';
    }
    else {
        return
    }
}
window.onload = () => {
    if (!sessionStorage.role) {
        location.href = 'LOGIN.html';
    }
    // disableCloseForward();
};


// or should we redirect to the admin html?

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



document.addEventListener('DOMContentLoaded', () => {
    const name = sessionStorage.name;
    const namedisplay = document.querySelector("#upper-navname");
    console.log(name);
    namedisplay.innerHTML = `${name}`
});