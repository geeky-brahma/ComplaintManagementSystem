let ID = null;
document.addEventListener('DOMContentLoaded', (e) => {
    console.log("Hello WOrld!!")
    const urlParams = new URLSearchParams(window.location.search);
    ID = urlParams.get('complaint_id');
    console.log(ID)
    let formData = {
        "IDType": 'id',
        "ID": ID
    };
    sendData(formData);
})

const submitButton = document.querySelector('button[type="submit"]');
submitButton.addEventListener('click', () => {
    console.log('Submit Clicked !!')
    const radioButtons = document.getElementsByName('action');
    let selectedValue;
    let formData;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selectedValue = radioButton.value;
            break;
        }
    }
    if (selectedValue === 'close') {
        const textarea = document.getElementById('remarks');
        const textValue = textarea.value;
        console.log("Textarea content:", textValue);
        formData = {
            id:ID,
            status: 'Closed',
            remarks: textValue
        }
    }
    if (selectedValue === 'forward') {
        const dropdown = document.getElementById('forward-to');
        const selectedText = dropdown.options[dropdown.selectedIndex].text;
        console.log("Selected complaint type:", selectedText);
        formData = {
            id:ID,
            forwarded_to : selectedText
        }
    }
    console.log("Selected complaint type:", selectedValue);
    closeForward(formData)
})

function closeForward(formData){
    // Create XMLHttpRequest object
    let xhr = new XMLHttpRequest();

    // Callback function to handle response
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 201) {
                console.log("Data sent successfully!");
                // Handle successful response from server if needed
                response_summary = JSON.parse(this.responseText)
                // response_summary = this.responseText
                console.log(response_summary)
                data = response_summary['data']
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

                    document.getElementById('complain-id').innerText = newData.complaintId;
                    document.getElementById('complain-description').innerText = newData.desc;
                    document.getElementById('website').innerText = newData.website;
                    document.getElementById('module').innerText = newData.module;
                    document.getElementById('div').innerText = newData.division;
                    document.getElementById('employee-name').innerText = newData.empName;
                    document.getElementById('employee-no').innerText = newData.empNo;
                    // document.getElementById('description').innerText = description;
                    if (newData.referenceDoc) {
                        const link = document.createElement('a');
                        link.href = newData.referenceDoc;
                        link.innerText = newData.referenceDoc;
                        document.getElementById('reference-document').appendChild(link);
                    } else {
                        document.getElementById('reference-document').innerText = "No document available";
                    }
                    // document.getElementById('reference-document').innerText = newData.referenceDoc;

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

function sendData(formData) {
    // Create XMLHttpRequest object
    let xhr = new XMLHttpRequest();

    // Callback function to handle response
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 201) {
                console.log("Data sent successfully!");
                // Handle successful response from server if needed
                response_summary = JSON.parse(this.responseText)
                // response_summary = this.responseText
                console.log(response_summary)
                data = response_summary['data']
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

                    document.getElementById('complain-id').innerText = newData.complaintId;
                    document.getElementById('complain-description').innerText = newData.desc;
                    document.getElementById('website').innerText = newData.website;
                    document.getElementById('module').innerText = newData.module;
                    document.getElementById('div').innerText = newData.division;
                    document.getElementById('employee-name').innerText = newData.empName;
                    document.getElementById('employee-no').innerText = newData.empNo;
                    // document.getElementById('description').innerText = description;
                    if (newData.referenceDoc) {
                        const link = document.createElement('a');
                        link.href = newData.referenceDoc;
                        link.innerText = newData.referenceDoc;
                        document.getElementById('reference-document').appendChild(link);
                    } else {
                        document.getElementById('reference-document').innerText = "No document available";
                    }
                    // document.getElementById('reference-document').innerText = newData.referenceDoc;

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


