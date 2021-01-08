let isUpdate = false;
let employeePayrollObj = {};

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

    checkForUpdate();
});

const checkForUpdate = () => {
    const employeePayrollJson = localStorage.getItem('editEmp');
    isUpdate = employeePayrollJson ? true : false;
    if (!isUpdate) return;
    employeePayrollObj = JSON.parse(employeePayrollJson);
    setForm();
}
const setForm = () => {
    setValue('#name', employeePayrollObj._name);
    setSelectedValues('[name=profile]', employeePayrollObj._profilePic);
    setSelectedValues('[name=gender]', employeePayrollObj._gender);
    setSelectedValues('[name=department]', employeePayrollObj._department);
    setValue('#salary', employeePayrollObj._salary);
    setTextValue('.salar_output', employeePayrollObj._salary);
    setValue('#notes', employeePayrollObj._note);
    let date = stringifyDate(employeePayrollObj._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month', date[1]);
    setValue('#year', date[2]);
}

const save = (event) => {
     event.preventDefault();
     event.stopPropagation();
    try {
        setEmployeePayrollObject();
        createAndUpdateStorage();
        resetForm();
        window.location.replace(site_properties.home_page);
    } catch (e) {
        return;
    }
}

const setEmployeePayrollObject = () => {
    employeePayrollObj._name = getInputValueById('#name');
    employeePayrollObj._profilePic = getselectedValues('[name=profile]').pop();
    employeePayrollObj._gender = getselectedValues('[name=gender]').pop();
    employeePayrollObj._department = getselectedValues('[name=dept]');
    employeePayrollObj._salary = getInputValueById('#salary');
    employeePayrollObj._note = getInputValueById('#notes');
    let date = getInputValueById('#day') + " " + getInputValueById('#month') + " " +
                getInputValueById('#year');
    employeePayrollObj._startDate = date;
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
    employeePayrollData.startDate = new Date(date);
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

const createAndUpdateStorage = () => {
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
    if (employeePayrollList) {
        let empPayrollData = employeePayrollList.find(empData => empData._id == employeePayrollObj._id);
        if( !empPayrollData) {
            employeePayrollList.push(createEmployeePayrollData());
        } else {
            const index = employeePayrollList.map(empData => empData._id)
                                             .indexOf(empPayrollData._id);
            employeePayrollList.splice(index, 1, createEmployeePayrollData(empPayrollData._id));
        }
    } else {
        employeePayrollList = [createEmployeePayrollData()]
    }
    alert(employeePayrollList.toString());
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList))
}

const createEmployeePayrollData = (id) => {
    let employeePayrollData = new EmployeePayrollData();
    if (!id) employeePayrollData.id = createNewEmployeeId();
    else employeePayrollData.id = id;
    setEmployeePayrollData(employeePayrollData);
    return employeePayrollData;
}

const setEmployeePayrollData = (employeePayrollData) => {
    try {
        employeePayrollData.name = employeePayrollObj._name;
    } catch (e) {
        setTextValue('.text-error', e);
        throw e;
    }
    employeePayrollData.profilePic = employeePayrollObj._profilePic;
    employeePayrollData.gender = employeePayrollObj._gender;
    employeePayrollData.department = employeePayrollObj._department;
    employeePayrollData.salary = employeePayrollObj._salary;
    employeePayrollData.note = employeePayrollObj._note;
    employeePayrollData.startDate = employeePayrollObj._startDate;
    alert(employeePayrollData.toString());
}

const createNewEmployeeId = () => {
    let empId = localStorage.getItem("EmployeeID");
    empId = !empId ? 1 : (parseInt(empId) + 1).toString();
    localStorage.setItem("EmployeeID", empId);
    return empId;
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
    setSelectedIndex('#day', 0);
    setSelectedIndex('#month', 0);
    setSelectedIndex('#year', 0);
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

const setSelectedValues = (propertyValue, value) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        if (Array.isArray(value)) {
            if (value.includes(item.value)) {
                item.checked = true;
            }
        }
        else if (item.value === value)
            item.checked = true;
    });
}

const setSelectedIndex = (id, index) => {
    const element = document.querySelector(id);
    element.setSelectedIndex = index;
}