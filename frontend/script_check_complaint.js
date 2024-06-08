let goButton = document.querySelector('button[type="submit_c"]');
goButton.addEventListener('click', (e) => {
    e.preventDefault();
    const IDType = document.querySelector('input[name="status-by"]:checked').value;
    const ID = document.querySelector('#input-field').value;
    console.log(IDType, ID)
    let formData = {
        "IDType": IDType,
        "ID": ID 
    };
    sendData(formData);
})

function sendData(formData) {
    // Create XMLHttpRequest object
    let xhr = new XMLHttpRequest();

    // Callback function to handle response
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 201) {
                console.log("Data sent successfully!");
                // Handle successful response from server if needed
                response_summary = JSON.parse(this.responseText)
                // response_summary = this.responseText
                console.log(response_summary)
                data = response_summary['data']
                for (let i = 0; i < data.length; i++){
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
                        status: data[i][9]
                    };
                    const table = document.querySelector('#complaint-table');
      
                    // Create a new row and add the data
                    const newRow = table.insertRow();
                    newRow.insertCell(0).textContent = newData.complaintId;
                    newRow.insertCell(1).textContent = newData.empNo;
                    newRow.insertCell(2).textContent = newData.empName;
                    newRow.insertCell(3).textContent = newData.division;
                    newRow.insertCell(4).textContent = newData.department;
                    newRow.insertCell(5).textContent = newData.website;
                    newRow.insertCell(6).textContent = newData.module;
                    newRow.insertCell(7).textContent = newData.desc;
                    newRow.insertCell(8).textContent = newData.referenceDoc;
                    newRow.insertCell(9).textContent = newData.status;
                }
                
            } else {
                console.error("Failed to send data. Status code: " + xhr.status);
                // Handle error response from server if needed
            }
        }
    };

    // Open a POST request to the server
    xhr.open("POST", "http://127.0.0.1:5000/status");

    // Set request headers
    xhr.setRequestHeader("Content-Type", "application/json");

    // Convert form data to JSON and send it to the server
    xhr.send(JSON.stringify(formData));
}


  