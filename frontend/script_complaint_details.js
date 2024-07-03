let ID = null;

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
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Months are zero-indexed
    const day = now.getDate();
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
            date: `${day}/${month}/${year}`
        };
        console.log(formData);
    }
    console.log("Selected complaint type:", selectedValue);
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
        document.getElementById('status').innerHTML = `<h2>${data}</h2>`;
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
        currently_with: data.currently_with

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

    document.getElementById('complain-id').innerText = newData.complaintId;
    document.getElementById('complain-description').innerText = newData.desc;
    document.getElementById('website').innerText = newData.website;
    document.getElementById('module').innerText = newData.module;
    document.getElementById('div').innerText = newData.division;
    document.getElementById('employee-name').innerText = newData.empName;
    document.getElementById('employee-no').innerText = newData.empNo;
    document.getElementById('currently_with').innerText = newData.currently_with;




    const referenceDocElement = document.getElementById('reference-document');
    if (newData.referenceDoc) {
        const link = document.createElement('a');
        // link.href = newData.referenceDoc;
        // link.href = downloadFile(newData.complaintId);
        link.innerText = 'Click here';
        link.style.cursor='pointer'
        link.style.color='blue'
        link.style.textDecoration='underline'
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
                </div>
            `;
        }
        historyPlace.innerHTML = html;
    } else {
        historyPlace.innerHTML = `<h4 style="color: red;">No History!!!</h4>`;
    }
}




