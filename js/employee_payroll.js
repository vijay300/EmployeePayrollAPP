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
            checkName(name.value);
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

    const date = document.querySelector('#startDate');
    const dateError = document.querySelector('.date-error');
    date.addEventListener('input', function() {
        let startDate = getInputValueById('#day') + " " + getInputValueById('#month') + " "
                        + getInputValueById('#year');
        try {
            checkStartDate(new Date(Date.parse(startDate)));
            dateError.textContent = ""
        } catch (e) {
            dateError.textContent = e;
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
    setSelectedValues('[name=dept]', employeePayrollObj._department);
    setValue('#salary', employeePayrollObj._salary);
    setTextValue('.salary_output', employeePayrollObj._salary);
    setValue('#notes', employeePayrollObj._note);
    let date = stringifyDate(employeePayrollObj.startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month', date[1]);
    setValue('#year', date[2]);
}

const save = (event) => {
     event.preventDefault();
     event.stopPropagation();
    try {
        setEmployeePayrollObject();
        if (site_properties.use_local_storage.match("true")) {
            createAndUpdateStorage();
            resetForm();
            window.location.replace(site_properties.home_page);
        } else {
            createOrUpdateEmployeePayroll();
        }
        
    } catch (e) {
        return;
    }
}

const createOrUpdateEmployeePayroll =() => {
    let postURL = site_properties.server_url;
    let methodCall = "POST";
    if(isUpdate) {
        methodCall = "PUT";
        postURL = postURL + employeePayrollObj.id.toString();
    }
    makPromiseCall(methodCall, postURL, true, employeePayrollObj)
        .then(resposiveText => {
            resetForm();
            window.location.replace(site_properties.home_page);
        })
        .catch(error => {
            throw error;
        });
}

const setEmployeePayrollObject = () => {
    if(!isUpdate && site_properties.use_local_storage.match("true")) {
        employeePayrollObj.id = createNewEmployeeId();
    }
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
        let empPayrollData = employeePayrollList.find(empData => empData.id == employeePayrollObj.id);
        if( !empPayrollData) {
            employeePayrollList.push(employeePayrollObj);
        } else {
            const index = employeePayrollList.map(empData => empData.id)
                                             .indexOf(empPayrollData.id);
            employeePayrollList.splice(index, 1, employeePayrollObj);
        }
    } else {
        employeePayrollList = [createEmployeePayrollData()]
    }
    alert(employeePayrollList.toString());
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList))
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

function makPromiseCall(methodType, url, async = true, data = null) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.onload = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200 || xhr.status === 201) {
                    resolve(xhr.responseText);
                } else if (xhr.status >= 400) {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                    console.log("Handle 400 Client Error or 500 Server Error at: " + showTime());
                }
            }
        }
        
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhttp.statusText
            });
        }
        xhr.open(methodType, url, async);
        if (data) {
            console.log(JSON.stringify(data));
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(data));
        } else xhr.send();
        console.log(methodType + " request sent to the server at : " + showTime());
    });
  }