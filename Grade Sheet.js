const studentForm = document.getElementById("studentForm");
const studentTable = document.getElementById("studentTable");
const marksChartCanvas = document.getElementById("marksChart");

let students = JSON.parse(localStorage.getItem("students")) || [];

// Grade calculation
function calculateGrade(avg) {
    if(avg >= 90) return 'A';
    else if(avg >= 80) return 'B';
    else if(avg >= 70) return 'C';
    else if(avg >= 60) return 'D';
    else return 'F';
}

// Determine color based on mark (extended)
function getColor(mark) {
    if(mark >= 90) return 'rgba(24, 205, 24, 0.7)';       // Dark Green → Excellent
    else if(mark >= 80) return 'rgba(0, 242, 242, 0.7)'; // Teal → Very Good
    else if(mark >= 70) return 'rgba(5, 136, 136, 0.7)'; // Light Teal → Good
    else if(mark >= 60) return 'rgba(182, 7, 83, 0.7)'; // Golden → Average
    else if(mark >= 50) return 'rgba(1, 41, 239, 0.7)'; // Yellow → Below Average
    else if(mark >= 40) return 'rgba(200, 101, 1, 0.7)'; // Orange → Poor
    else return 'rgba(228, 5, 194, 0.7)';               // Red → Fail
}

// Determine row color based on grade
function getRowColor(grade) {
    if(grade === 'A' || grade === 'B') return 'lightgreen';
    else if(grade === 'C' || grade === 'D') return 'lightyellow';
    else return 'lightcoral';
}

// Display students
function displayStudents() {
    studentTable.innerHTML = "";
    students.forEach((student, index) => {
        const marks = [student.math, student.bangla, student.english, student.science, student.chemistry, student.biology];
        const sum = marks.reduce((a,b) => a + (b || 0), 0);
        const count = marks.filter(m => m !== undefined && m !== null).length;
        const avg = (sum / count).toFixed(2);
        const grade = calculateGrade(avg);
        const rowColor = getRowColor(grade);

        studentTable.innerHTML += `
            <tr style="background-color: ${rowColor};">
                <td>${student.name}</td>
                <td>${student.id}</td>
                <td>${student.math || ''}</td>
                <td>${student.bangla || ''}</td>
                <td>${student.english || ''}</td>
                <td>${student.science || ''}</td>
                <td>${student.chemistry || ''}</td>
                <td>${student.biology || ''}</td>
                <td>${avg}</td>
                <td>${grade}</td>
                <td><button class="delete" onclick="deleteStudent(${index})">Delete</button></td>
            </tr>
        `;
    });
    updateChart();
}

// Add student
studentForm.addEventListener("submit", function(e){
    e.preventDefault();
    const student = {
        name: document.getElementById("name").value,
        id: document.getElementById("id").value,
        math: Number(document.getElementById("math").value),
        bangla: Number(document.getElementById("bangla").value),
        english: Number(document.getElementById("english").value),
        science: Number(document.getElementById("science").value),
        chemistry: Number(document.getElementById("chemistry").value),
        biology: Number(document.getElementById("biology").value)
    };
    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));
    studentForm.reset();
    displayStudents();
});

// Delete student
function deleteStudent(index) {
    students.splice(index, 1);
    localStorage.setItem("students", JSON.stringify(students));
    displayStudents();
}

// Chart.js integration with interactive tooltips
let marksChart;
function updateChart() {
    const labels = students.map(s => s.name);
    const subjects = ['math','bangla','english','science','chemistry','biology'];

    const datasets = subjects.map((subj, i) => ({
        label: subj.charAt(0).toUpperCase() + subj.slice(1),
        data: students.map(s => s[subj] || 0),
        backgroundColor: students.map(s => getColor(s[subj] || 0)),
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.8)'
    }));

    const data = { labels, datasets };
    const config = {
        type: 'bar',
        data,
        options: {
            responsive: true,
            interaction: { mode: 'nearest', axis: 'x', intersect: true },
            plugins: {
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw} marks`;
                        }
                    }
                },
                legend: { position: 'top' }
            },
            scales: { y: { beginAtZero: true, max: 100 } }
        }
    };

    if(marksChart) marksChart.destroy();
    marksChart = new Chart(marksChartCanvas, config);
}

// Initial display
displayStudents();
