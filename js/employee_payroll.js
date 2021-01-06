window.addEventListener('DOMContentLoaded', (event) => {
    const name = document.querySelector('#name');
    const textError = document.querySelector('.text-error');
    name.addEventListener('input', function() {
        if(name.value.length == 0) {
            textError.textContent = "";
            return;
        }
        try {
            (new EmployeePayrollData()).name = name.value;
            textError.textContent = "";
        } catch (e) {
            textError.textContent = e;
        }
    });

    const salary = document.querySelector('#salary');
    const output = document.querySelector('.salary-output');
    output.textContent = salary.value;
    salary.addEventListener('input', function() {
        output.textContent = salary.value; 
    });

    var d = new Date(); 
    const daySel = document.querySelector('#day');
    const monthSel = document.querySelector('#month');
    const dateError = document.querySelector('.date-error');
    const yearSel = document.querySelector('#year');
    daySel.addEventListener('input', function() {
        if (yearSel.value == d.getFullYear()) {
            if (monthSel.value != month[d.getMonth()]) {
                dateError.textContent = 'Invalid Date';
            } else {
                if (daySel.value > d.getDate())
                    dateError.textContent = 'Invalid Date';
                else dateError.textContent = '';
            }
        }
        else if (((yearSel.value % 4 == 0) && (yearSel.value % 100 != 0)) || (yearSel.value % 400 == 0)) {
            if (monthSel.value == "Febuary") {
                if (daySel.value > 29) 
                    dateError.textContent = 'Invalid date';
                else dateError.textContent = '';
            } else if (monthSel.value == "April" || monthSel.value == "June" || monthSel.value == "September" || monthSel.value == "November") {
                if (daySel.value > 30) 
                    dateError.textContent = 'Invalid date';
                else dateError.textContent = '';
            } else dateError.textContent = '';
        } else {
            if (monthSel.value == "Febuary") {
                if (daySel.value > 28) 
                    dateError.textContent = 'Invalid date';
                else dateError.textContent = '';
            } else if (monthSel.value == "April" || monthSel.value == "June" || monthSel.value == "September" || monthSel.value == "November") {
                if (daySel.value > 30) 
                    dateError.textContent = 'Invalid date';
                else dateError.textContent = '';
            } else dateError.textContent = '';
        }    
    });
});

const save = () => {
    try {
        let employeePayrollData = createEmployeePayroll();
        createAndUpdateStorage(employeePayrollData);
    } catch (e) {
        return;
    }
}

const createEmployeePayroll = () => {
    let employeePayrollData = new EmployeePayrollData();
    try {
        employeePayrollData.name = getInputValueById('#name');
    } catch (e) {
        setTextValue('.text-error', e);
        throw e;
    }
    employeePayrollData.profilePic = getselectedValues('[name=profile]').pop();
    employeePayrollData.gender = getselectedValues('[name=gender]').pop();
    employeePayrollData.department = getselectedValues('[name=dept]');
    employeePayrollData.salary = getInputValueById('#salary');
    employeePayrollData.note = getInputValueById('#notes');
    let date = getInputValueById('#day') + " " + getInputValueById('#month') + " " +
                getInputValueById('#year');
    employeePayrollData.startDate = date;
    alert(employeePayrollData.toString());
    return employeePayrollData;
}

const getselectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    let selItems = [];
    allItems.forEach(item => {
        if (item.checked) selItems.push(item.value);
    });
    return selItems;
}

const getInputValueById = (id) => {
    let value = document.querySelector(id).value;
    return value;
}

function createAndUpdateStorage(employeePayrollData) {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));

    if (employeePayrollList != undefined) {
        employeePayrollList.push(employeePayrollData);
    } else {
        employeePayrollList = [employeePayrollData];
    }
    alert(employeePayrollList.toString());
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList))
}
var month = ["January","Febuary","March","April","May","June","July","August","September","October","November","December"];

for (i = 0; i < month.length; i++) {
  var opt = document.createElement("option");
  document.getElementById("month").innerHTML += '<option id="' + i + '">' + month[i] + '</option>';
}
for (i = 1; i <= 31; i++) {
    var opt = document.createElement("option");
    document.getElementById("day").innerHTML += '<option id="' + i + '">' + i + '</option>';
}
for (i = 2021; i >= 1950; i--) {
    var opt = document.createElement("option");
    document.getElementById("year").innerHTML += '<option id="' + i + '">' + i + '</option>';
}

const resetForm = () => {
    setValue('#name','');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setTextValue('#salary','');
    setValue('#notes','');
    setValue('#day','1');
    setValue('#month','January');
    setValue('#year','2020');
}

const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        item.checked = false;
    });
}

const setTextValue = (id, value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}

const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}