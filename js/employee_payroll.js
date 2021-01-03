const salary = document.querySelector('#salary');
const output = document.querySelector('.salary-output');
output.textContent = salary.value;
salary.addEventListener('input', function() {
    output.textContent=salary.value; 
});

let employeePayrollData = new Array();
let genderHTML;
if(document.getElementById('male').checked) {
    genderHTML = document.getElementById('male').value;
} else
    genderHTML = "female";

const addEmployee = (event) => {
    event.preventDefault();
    let dateArray = [];
    dateArray[0] = document.getElementById('day').value;
    dateArray[1] = document.getElementById('month').value;
    dateArray[2] = document.getElementById('year').value;
    var selected = new Array();
    var chks = document.getElementsByClassName("checkbox");
    for (var i = 0; i < chks.length; i++) {
        if (chks[i].checked) {
            selected.push(chks[i].value);
        }
    }
    
    let employeeDetails = {
        name: document.getElementById('name').value,
        gender: genderHTML,
        department: selected,
        salary: document.querySelector('#salary').value,
        startDate: dateArray
    }
    employeePayrollData.push(employeeDetails);
    document.forms[0].reset();
    
}
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('submitButton').addEventListener('click', addEmployee);
});
