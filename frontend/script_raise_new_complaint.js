document.addEventListener('DOMContentLoaded', async() => {
    const form = document.getElementById('complaintForm');
    const employeeNoInput = document.getElementById('employee-no');
    const errorElement = document.getElementById('employee-no-error');

    const departmentDropdown = document.getElementById('department')
    const websiteDropdown = document.getElementById('website')
    const moduleDropdown = document.getElementById('module')
    
    try {
        const response = await fetch('http://127.0.0.1:5000/department');
        if (!response.ok) {
            throw new Error('Failed to fetch department data.');
        }
        const data = await response.json();
        const departments = data.data;

        // Populate the dropdowns with the fetched data
        departments.forEach(item => {
            const departmentOption = document.createElement('option');
            departmentOption.value = item.department;
            departmentOption.text = item.department;
            departmentDropdown.appendChild(departmentOption);

            const websiteOption = document.createElement('option');
            websiteOption.value = item.module;
            websiteOption.text = item.module;
            websiteDropdown.appendChild(websiteOption);

            const moduleOption = document.createElement('option');
            moduleOption.value = item.sub_module;
            moduleOption.text = item.sub_module;
            moduleDropdown.appendChild(moduleOption);
        });
    } catch (error) {
        console.error('Error:', error);
    }
    
    employeeNoInput.addEventListener('input', () => {
        if (employeeNoInput.value.length === 11) {
            errorElement.style.display = 'none'; // Hide error message if length is correct
        }
    });


    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        const employeeNoValue = employeeNoInput.value;
        if (employeeNoValue.length !== 11) {
            // e.preventDefault(); // Prevent form submission
            errorElement.style.display = 'block'; // Show error message
        } else {
            errorElement.style.display = 'none'; // Hide error message

            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1; // Months are zero-indexed
            const day = now.getDate();

            // Create FormData object
            let formData = new FormData();
            formData.append('employeeNo', document.querySelector("#employee-no").value);
            formData.append('employeeName', document.querySelector("#employee-name").value);
            formData.append('divisionHQ', document.querySelector("#division-hq").value);
            formData.append('department', document.querySelector("#department").value);
            formData.append('website', document.querySelector("#website").value);
            formData.append('module', document.querySelector("#module").value);
            formData.append('description', document.querySelector("#description").value);
            formData.append('date', `${day}-${month}-${year}`);
            formData.append('status', "Under Process");
            formData.append('currentlyWith', 'admin');
            // const fileInput = document.querySelector("#reference");
            // const file = fileInput.files[0];
            // const formData = new FormData();
            // formData.append(`${document.querySelector("#employee-no").value}-${day}-${month}-${year}`, file);
            formData.append('reference', document.querySelector("#reference").files[0]); // Add the file

            try {
                // Send form data to the server using Fetch API
                const response = await fetch('http://127.0.0.1:5000/data', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Failed to send data.');
                }

                const responseData = await response.json();
                console.log('Data sent successfully!', responseData);
                window.onbeforeunload = function () {
                    return ""
                }
                // Display the generated Complaint ID
                document.getElementById('compID').innerHTML = `<h2>Complaint ID Generated: ${responseData['complaintId']}</h2>`;
            } catch (error) {
                console.error('Error:', error);
                // Handle error response from server if needed
                document.getElementById('compID').innerHTML = `<h2>Error: Failed to send data</h2>`;
            }
        }
    });
});