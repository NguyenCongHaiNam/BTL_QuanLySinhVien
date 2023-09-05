document.addEventListener("DOMContentLoaded", function () {
    const addStudentForm = document.getElementById("addStudentForm");
    const editStudentForm = document.getElementById("editStudentForm");
    const studentList = document.getElementById("studentList");
    const searchForm = document.getElementById("searchForm");

    // Hiển thị danh sách sinh viên khi trang tải
    fetchStudents();

    // JavaScript
    function scrollToSection(sectionId) {
        // Lấy phần tử section dựa trên sectionId
        const section = document.getElementById(sectionId);

        if (section) {
            // Sử dụng window.scrollTo để cuộn đến phần tử section
            window.scrollTo({
                top: section.offsetTop,
                behavior: 'smooth' // Tạo hiệu ứng cuộn mượt
            });
        }
    }


    // Gửi yêu cầu thêm sinh viên
    addStudentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const birthYear = document.getElementById("birth_year").value;
        const className = document.getElementById("class_name").value;
        addStudent({ name, birthYear, className });
    });

    

    <script>
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelector("form").addEventListener("submit", function (e) {
            e.preventDefault();
            const form = e.target;

            // Sử dụng Fetch API để gửi yêu cầu POST đến máy chủ
            fetch(form.action, {
                method: "POST",
                body: new FormData(form),
            })
            .then(response => response.text())
            .then(data => {
                // Thay đổi nội dung của phần tử có id là "result" với kết quả nhận được
                document.querySelector("#result").textContent = data;
                });
            })
        });
    </script>


    // Gửi yêu cầu sửa sinh viên
    editStudentForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const id = document.getElementById("editId").value;
        const name = document.getElementById("editName").value;
        const birthYear = document.getElementById("editBirthYear").value;
        const className = document.getElementById("editClassName").value;
        updateStudent(id, { name, birthYear, className });
    });

    // Gửi yêu cầu tìm kiếm và sắp xếp
    searchForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const searchName = document.getElementById("searchName").value;
        const sortBy = document.getElementById("sortBy").value;
        searchStudents(searchName, sortBy);
    });

    // Hủy sửa sinh viên
    document.getElementById("cancelEdit").addEventListener("click", function () {
        editStudentForm.style.display = "none";
    });
    
    // Lấy danh sách sinh viên từ API và hiển thị trên giao diện
    function fetchStudents() {
        fetch("/api/students")
            .then(response => response.json())
            .then(data => {
                studentList.innerHTML = "";
                data.forEach(student => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.birth_year}</td>
                        <td>${student.class_name}</td>
                        <td>
                            <button onclick="editStudent(${student.id})">Sửa</button>
                            <button onclick="deleteStudent(${student.id})">Xóa</button>
                        </td>
                    `;
                    studentList.appendChild(row);
                });
            });
    }

    // Thêm sinh viên
    function addStudent(data) {
        fetch("/api/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (response.status === 201) {
                    fetchStudents();
                }
            });
    }

    // Sửa sinh viên
    function editStudent(id) {
        fetch(`/api/students/${id}`)
            .then(response => response.json())
            .then(student => {
                document.getElementById("editId").value = student.id;
                document.getElementById("editName").value = student.name;
                document.getElementById("editBirthYear").value = student.birth_year;
                document.getElementById("editClassName").value = student.class_name;
                editStudentForm.style.display = "block";
            });
    }

    // Cập nhật sinh viên
    function updateStudent(id, data) {
        fetch(`/api/students/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(response => {
                if (response.status === 200) {
                    editStudentForm.style.display = "none";
                    fetchStudents();
                }
            });
    }

    // Xóa sinh viên
    function deleteStudent(id) {
        fetch(`/api/students/${id}`, {
            method: "DELETE",
        })
            .then(response => {
                if (response.status === 200) {
                    fetchStudents();
                }
            });
    }

    // Tìm kiếm và sắp xếp sinh viên
    function searchStudents(name, sortBy) {
        fetch(`/api/students?name=${name}&sort_by=${sortBy}`)
            .then(response => response.json())
            .then(data => {
                studentList.innerHTML = "";
                data.forEach(student => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${student.id}</td>
                        <td>${student.name}</td>
                        <td>${student.birth_year}</td>
                        <td>${student.class_name}</td>
                        <td>
                            <button onclick="editStudent(${student.id})">Sửa</button>
                            <button onclick="deleteStudent(${student.id})">Xóa</button>
                        </td>
                    `;
                    studentList.appendChild(row);
                });
            });
    }
});
