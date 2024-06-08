inbox.addEventListener("click", (e) => {
    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    
    // Define the request URL
    const url = "http://127.0.0.1:5000/all_complaints";
    
    // Configure the request
    xhr.open("GET", url);
    
    // Define the onload function to handle the response
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Request was successful
            const responseData = JSON.parse(xhr.responseText);
            // Process the response data here
            console.log(responseData);
            main_content = document.querySelector('#main-content')
            main_content.innerHTML= `
            <table class="table" id="complaint-table">
            <tr>
                <th>COMPLAINT ID</th>
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
            // Request failed
            console.error("Error:", xhr.status);
        }
    };
    
    // Define the onerror function to handle errors
    xhr.onerror = function() {
        console.error("Request failed");
    };
    
    // Send the request
    xhr.send();

    main_content = document.querySelector('#main-content')
    main_content.innerHTML= `
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
