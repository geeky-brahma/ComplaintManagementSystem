document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('complaintForm');
    const employeeNoInput = document.getElementById('employee-no');
    const errorElement = document.getElementById('employee-no-error');

    const departmentDropdown = document.getElementById('department');
    const websiteDropdown = document.getElementById('website');
    const moduleDropdown = document.getElementById('module');

    let departments = [];

    try {
        const response = await fetch('http://127.0.0.1:5000/department');
        if (!response.ok) {
            throw new Error('Failed to fetch department data.');
        }
        const data = await response.json();
        departments = data.data;

        // Populate the department dropdown with the fetched data
        departmentDropdown.innerHTML = '<option value="">Select Department</option>';
        const uniqueDepartments = [...new Set(departments.map(item => item.department))];
        uniqueDepartments.forEach(department => {
            const departmentOption = document.createElement('option');
            departmentOption.value = department;
            departmentOption.text = department;
            departmentDropdown.appendChild(departmentOption);
        });

        // Call updateWebsiteDropdown to initialize the website dropdown based on the default selected department
        updateWebsiteDropdown();
    } catch (error) {
        console.error('Error:', error);
    }

    const updateWebsiteDropdown = () => {
        const selectedDepartment = departmentDropdown.value;
        const filteredWebsites = departments.filter(item => item.department === selectedDepartment);

        // Clear the existing options
        websiteDropdown.innerHTML = '<option value="">Select Website</option>';
        moduleDropdown.innerHTML = '<option value="">Select Module</option>';

        // Populate the website dropdown
        const uniqueWebsites = [...new Set(filteredWebsites.map(item => item.module))];
        uniqueWebsites.forEach(website => {
            const websiteOption = document.createElement('option');
            websiteOption.value = website;
            websiteOption.text = website;
            websiteDropdown.appendChild(websiteOption);
        });

        // Call updateModuleDropdown to initialize the module dropdown based on the default selected website
        updateModuleDropdown();
    };

    const updateModuleDropdown = () => {
        const selectedWebsite = websiteDropdown.value;
        const filteredModules = departments.filter(item => item.module === selectedWebsite);

        // Clear the existing options
        moduleDropdown.innerHTML = '<option value="">Select Module</option>';

        // Populate the module dropdown
        filteredModules.forEach(item => {
            const moduleOption = document.createElement('option');
            moduleOption.value = item.sub_module;
            moduleOption.text = item.sub_module;
            moduleDropdown.appendChild(moduleOption);
        });
    };

    departmentDropdown.addEventListener('change', updateWebsiteDropdown);
    websiteDropdown.addEventListener('change', updateModuleDropdown);

    // const departmentDropdown = document.getElementById('department')
    // const websiteDropdown = document.getElementById('website')
    // const moduleDropdown = document.getElementById('module')

    // try {
    //     const response = await fetch('http://127.0.0.1:5000/department');
    //     if (!response.ok) {
    //         throw new Error('Failed to fetch department data.');
    //     }
    //     const data = await response.json();
    //     const departments = data.data;

    //     // Populate the dropdowns with the fetched data
    //     departments.forEach(item => {
    //         const departmentOption = document.createElement('option');
    //         departmentOption.value = item.department;
    //         departmentOption.text = item.department;
    //         departmentDropdown.appendChild(departmentOption);

    //         const websiteOption = document.createElement('option');
    //         websiteOption.value = item.module;
    //         websiteOption.text = item.module;
    //         websiteDropdown.appendChild(websiteOption);

    //         const moduleOption = document.createElement('option');
    //         moduleOption.value = item.sub_module;
    //         moduleOption.text = item.sub_module;
    //         moduleDropdown.appendChild(moduleOption);
    //     });
    // } catch (error) {
    //     console.error('Error:', error);
    // }

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
            date = new Date(now).toISOString().split('T')[0];
            // const year = now.getFullYear();
            // const month = now.getMonth() + 1; // Months are zero-indexed
            // const day = now.getDate();

            // Create FormData object
            let formData = new FormData();
            formData.append('employeeNo', document.querySelector("#employee-no").value);
            formData.append('employeeName', document.querySelector("#employee-name").value);
            formData.append('divisionHQ', document.querySelector("#division-hq").value);
            formData.append('department', document.querySelector("#department").value);
            formData.append('website', document.querySelector("#website").value);
            formData.append('module', document.querySelector("#module").value);
            formData.append('description', document.querySelector("#description").value);
            formData.append('date', date);
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
                sessionStorage.setItem('complaintId', responseData['complaintId']);
                if (sessionStorage.getItem('complaintId') !== null) {
                    // Redirect to a new page after successful submission
                    window.location.href = 'SUCESSFUL_RAISE_COMPLAINT.html';
                }
                // window.onbeforeunload = function () {
                //     return ""
                // }
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