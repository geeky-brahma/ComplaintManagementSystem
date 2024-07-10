let goButton = document.querySelector('button[type="submit_c"]');
goButton.addEventListener('click', (e) => {
    e.preventDefault();
    const IDType = document.querySelector('input[name="status-by"]:checked').value;
    const ID = document.querySelector('#input-field').value;
    let formData = {
        "IDType": IDType,
        "ID": ID
    };
    sendData(formData);
});

function sendData(formData) {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) { // Assuming your server responds with 200 OK
                console.log("Data received successfully!");
                const response_summary = JSON.parse(this.responseText);
                const data = response_summary['data'];
                updateTable(data);
            } else {
                console.error("Failed to fetch data. Status code: " + xhr.status);
                // Handle error response from server if needed
            }
        }
    };

    xhr.open("POST", "http://127.0.0.1:5000/status");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(formData));
}

function updateTable(data) {
    const table = document.querySelector('#complaint-table');
    table.innerHTML = `<table class="complaint-details" id="complaint-table">
                            <tr>
                            <th>Complaint Id</th>
                            <th>Date</th>
                            <th>Emp No</th>
                            <th>Emp Name</th>
                            <th>Division</th>
                            <th>Department</th>
                            <th>Website</th>
                            <th>Module</th>
                            <th>Desc</th>
                            <!-- <th>Reference Document</th> -->
                            <th>Status</th>
                            <th id='resolved'>Resolution</th>
                            </tr>
                        </table>`; // Clear existing table content

    if (!Array.isArray(data)) {
        console.error('Data received is not an array:', data);
        return;
    }

    data.forEach(entry => {
        if (!Array.isArray(entry)) {
            console.error('Invalid entry format:', entry);
            // return;
        }

        // const [complaintId, date, empNo, empName, division, department, website, module, desc, referenceDoc, status] = entry;
        complaintId = entry.id
        complaintId= entry.id
        empNo= entry.employee_no
        empName= entry.employee_name
        division= entry.division_hq
        department= entry.department
        website= entry.website
        module= entry.module
        desc= entry.description
        // referenceDoc= entry.referenceDoc
        status= entry.status
        date= entry.date
        remarks= entry.remarks
        const newRow = table.insertRow();
        newRow.insertCell(0).textContent = complaintId;
        newRow.insertCell(1).textContent = date;
        newRow.insertCell(2).textContent = empNo;
        newRow.insertCell(3).textContent = empName;
        newRow.insertCell(4).textContent = division;
        newRow.insertCell(5).textContent = department;
        newRow.insertCell(6).textContent = website;
        newRow.insertCell(7).textContent = module;
        newRow.insertCell(8).textContent = desc;
        
        // const linkCell = newRow.insertCell(9);
        // const link = document.createElement('a');
        // link.href = referenceDoc;
        // link.textContent = 'Click here';
        // linkCell.appendChild(link);

        newRow.insertCell(9).textContent = status;
        if (status===`Closed`){
            newRow.insertCell(10).textContent = remarks;
        }
        else{
            document.getElementById('resolved').style.display = 'none';
        }
    });
}

