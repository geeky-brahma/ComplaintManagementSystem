// RAISE_NEW_COMPLAINT
let submitButton = document.querySelector('button[type="submit"]');
submitButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    
    // Gather form data
    let formData = {
        employeeNo: document.querySelector("#employee-no").value,
        employeeName: document.querySelector("#employee-name").value,
        divisionHQ: document.querySelector("#division-hq").value,
        department: document.querySelector("#department").value,
        website: document.querySelector("#website").value,
        module: document.querySelector("#module").value,
        description: document.querySelector("#description").value,
        reference: document.querySelector("#reference").value, // If needed
        status: "Under Process"
    };

    // Send form data to the server
    sendData(formData);
});

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
                compID = document.querySelector("#compID")
                compID.innerHTML =`<h2>Complaint ID Generated: ${response_summary['Complaint ID']}</h2>`
            } else {
                console.error("Failed to send data. Status code: " + xhr.status);
                // Handle error response from server if needed
            }
        }
    };

    // Open a POST request to the server
    xhr.open("POST", "http://127.0.0.1:5000/data");

    // Set request headers
    xhr.setRequestHeader("Content-Type", "application/json");

    // Convert form data to JSON and send it to the server
    xhr.send(JSON.stringify(formData));
}




