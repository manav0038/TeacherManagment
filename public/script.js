document.addEventListener('DOMContentLoaded', () => {
    showAllTeachers();
});

function showAllTeachers() {
    fetch('/api/teachers')
        .then(response => response.json())
        .then(data => {
            const content = document.getElementById('content');
            content.innerHTML = '<h2>All Teachers</h2>';
            if (data.length === 0) {
                content.innerHTML += '<p>No teachers found.</p>';
            } else {
                let table = '<table><tr><th>Name</th><th>Age</th><th>Date of Birth</th><th>Number of Classes</th><th>Actions</th></tr>';
                data.forEach(teacher => {
                    table += `<tr>
                        <td>${teacher.fullName}</td>
                        <td>${teacher.age}</td>
                        <td>${new Date(teacher.dateOfBirth).toLocaleDateString()}</td>
                        <td>${teacher.numberOfClasses}</td>
                        <td>
                            <button onclick="showUpdateTeacherForm('${teacher._id}')">Edit</button>
                            <button onclick="deleteTeacher('${teacher._id}')">Delete</button>
                        </td>
                    </tr>`;
                });
                table += '</table>';
                content.innerHTML += table;
            }
        });
}

function showAddTeacherForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>Add a Teacher</h2>
        <form id="addTeacherForm">
            <label for="fullName">Full Name:</label><br>
            <input type="text" id="fullName" name="fullName"><br>
            <label for="age">Age:</label><br>
            <input type="number" id="age" name="age"><br>
            <label for="dateOfBirth">Date of Birth:</label><br>
            <input type="date" id="dateOfBirth" name="dateOfBirth"><br>
            <label for="numberOfClasses">Number of Classes:</label><br>
            <input type="number" id="numberOfClasses" name="numberOfClasses"><br><br>
            <input type="button" value="Submit" onclick="addTeacher()">
        </form>
    `;
}

function addTeacher() {
    const form = document.getElementById('addTeacherForm');
    const formData = new FormData(form);
    const data = {
        fullName: formData.get('fullName'),
        age: formData.get('age'),
        dateOfBirth: formData.get('dateOfBirth'),
        numberOfClasses: formData.get('numberOfClasses')
    };

    fetch('/api/teachers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
        showAllTeachers();
    });
}

function showUpdateTeacherForm(id) {
    fetch(`/api/teachers/${id}`)
        .then(response => response.json())
        .then(teacher => {
            const content = document.getElementById('content');
            content.innerHTML = `
                <h2>Update Teacher</h2>
                <form id="updateTeacherForm">
                    <label for="fullName">Full Name:</label><br>
                    <input type="text" id="fullName" name="fullName" value="${teacher.fullName}"><br>
                    <label for="age">Age:</label><br>
                    <input type="number" id="age" name="age" value="${teacher.age}"><br>
                    <label for="dateOfBirth">Date of Birth:</label><br>
                    <input type="date" id="dateOfBirth" name="dateOfBirth" value="${new Date(teacher.dateOfBirth).toISOString().substr(0, 10)}"><br>
                    <label for="numberOfClasses">Number of Classes:</label><br>
                    <input type="number" id="numberOfClasses" name="numberOfClasses" value="${teacher.numberOfClasses}"><br><br>
                    <input type="button" value="Submit" onclick="updateTeacher('${teacher._id}')">
                </form>
            `;
        });
}

function updateTeacher(id) {
    const form = document.getElementById('updateTeacherForm');
    const formData = new FormData(form);
    const data = {
        fullName: formData.get('fullName'),
        age: formData.get('age'),
        dateOfBirth: formData.get('dateOfBirth'),
        numberOfClasses: formData.get('numberOfClasses')
    };

    fetch(`/api/teachers/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(() => {
        showAllTeachers();
    });
}

function deleteTeacher(id) {
    fetch(`/api/teachers/${id}`, {
        method: 'DELETE'
    })
    .then(() => {
        showAllTeachers();
    });
}

function showSearchTeacherForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>Search for a Teacher</h2>
        <form id="searchTeacherForm">
            <label for="name">Name:</label><br>
            <input type="text" id="name" name="name"><br><br>
            <input type="button" value="Search" onclick="searchTeacher()">
        </form>
    `;
}

function searchTeacher() {
    const form = document.getElementById('searchTeacherForm');
    const formData = new FormData(form);
    const name = formData.get('name');

    fetch(`/api/teachers/search?name=${name}`)
        .then(response => response.json())
        .then(teacher => {
            const content = document.getElementById('content');
            if (!teacher) {
                content.innerHTML = '<p>Teacher not found.</p>';
            } else {
                content.innerHTML = `
                    <h2>Teacher Found</h2>
                    <p>Name: ${teacher.fullName}</p>
                    <p>Age: ${teacher.age}</p>
                    <p>Date of Birth: ${new Date(teacher.dateOfBirth).toLocaleDateString()}</p>
                    <p>Number of Classes: ${teacher.numberOfClasses}</p>
                `;
            }
        });
}

function showFilterTeachersForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>Filter Teachers</h2>
        <form id="filterTeachersForm">
            <label for="minAge">Min Age:</label><br>
            <input type="number" id="minAge" name="minAge"><br>
            <label for="maxAge">Max Age:</label><br>
            <input type="number" id="maxAge" name="maxAge"><br>
            <label for="minClasses">Min Classes:</label><br>
            <input type="number" id="minClasses" name="minClasses"><br>
            <label for="maxClasses">Max Classes:</label><br>
            <input type="number" id="maxClasses" name="maxClasses"><br><br>
            <input type="button" value="Filter by Age" onclick="filterTeachersByAge()">
            <input type="button" value="Filter by Classes" onclick="filterTeachersByClasses()">
        </form>
    `;
}

function filterTeachersByAge() {
    const form = document.getElementById('filterTeachersForm');
    const formData = new FormData(form);
    const minAge = formData.get('minAge');
    const maxAge = formData.get('maxAge');

    fetch(`/api/teachers/filter/age?minAge=${minAge}&maxAge=${maxAge}`)
        .then(response => response.json())
        .then(data => {
            const content = document.getElementById('content');
            content.innerHTML = '<h2>Filtered Teachers by Age</h2>';
            if (data.length === 0) {
                content.innerHTML += '<p>No teachers found.</p>';
            } else {
                let table = '<table><tr><th>Name</th><th>Age</th><th>Date of Birth</th><th>Number of Classes</th></tr>';
                data.forEach(teacher => {
                    table += `<tr>
                        <td>${teacher.fullName}</td>
                        <td>${teacher.age}</td>
                        <td>${new Date(teacher.dateOfBirth).toLocaleDateString()}</td>
                        <td>${teacher.numberOfClasses}</td>
                    </tr>`;
                });
                table += '</table>';
                content.innerHTML += table;
            }
        });
}

function filterTeachersByClasses() {
    const form = document.getElementById('filterTeachersForm');
    const formData = new FormData(form);
    const minClasses = formData.get('minClasses');
    const maxClasses = formData.get('maxClasses');

    fetch(`/api/teachers/filter/classes?minClasses=${minClasses}&maxClasses=${maxClasses}`)
        .then(response => response.json())
        .then(data => {
            const content = document.getElementById('content');
            content.innerHTML = '<h2>Filtered Teachers by Classes</h2>';
            if (data.length === 0) {
                content.innerHTML += '<p>No teachers found.</p>';
            } else {
                let table = '<table><tr><th>Name</th><th>Age</th><th>Date of Birth</th><th>Number of Classes</th></tr>';
                data.forEach(teacher => {
                    table += `<tr>
                        <td>${teacher.fullName}</td>
                        <td>${teacher.age}</td>
                        <td>${new Date(teacher.dateOfBirth).toLocaleDateString()}</td>
                        <td>${teacher.numberOfClasses}</td>
                    </tr>`;
                });
                table += '</table>';
                content.innerHTML += table;
            }
        });
}
