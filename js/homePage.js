let empPayrollList;
window.addEventListener('DOMContentLoaded', (event) => {
  if (site_properties.use_local_storage.match("true")) {
    getEmployeePayrollDataFromStorage();
  } else getEmployeePayrollDataFromServer();
});

const getEmployeePayrollDataFromServer =() => {
  makPromiseCall("GET", site_properties.server_url, false)
    .then(responsiveText => {
      empPayrollList = JSON.parse(responsiveText);
      processEmployeePayrollDataResponsive();
    })
    .catch(error => {
      console.log("GET Error Status: " + JSON.stringify(error));
      empPayrollList = [];
      processEmployeePayrollDataResponsive();  
    });
}

const processEmployeePayrollDataResponsive = () => {
  document.querySelector(".emp-count").textContent = empPayrollList.length;
  createInnerHtml();
  localStorage.removeItem('editEmp');
}

const getEmployeePayrollDataFromStorage = () => {
  empPayrollList = localStorage.getItem('EmployeePayrollList') ?
                              JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
  processEmployeePayrollDataResponsive();                            
}

const createInnerHtml = () => {
  const headerHtml = "<th></th><th>Name</th><th>Gender</th><th>Department</th><th>Salary</th><th>Start Date</th><th>Actions</th>";
  if (empPayrollList.length == 0) return;
  let innerHtml = `${headerHtml}`;
  for (const empPayrollData of empPayrollList) {
    innerHtml = `${innerHtml}
    <tr>
      <td><img class="profile" alt="" src="${empPayrollData._profilePic}"</td>
      <td>${empPayrollData._name}</td>
      <td>${empPayrollData._gender}</td>
      <td>${getDeptHtml(empPayrollData._department)}</td>
      <td>${empPayrollData._salary}</td>
      <td>${stringifyDate(empPayrollData._startDate)}</td>
      <td>
        <img id="${empPayrollData.id}" onclick="remove(this)" alt="delete" src="../assets/icons/delete-black-18dp.svg">
        <img id="${empPayrollData.id}" onclick="update(this)" alt="edit" src="../assets/icons/create-black-18dp.svg">
      </td>
    </tr>
  `;}
  document.querySelector('#table-display').innerHTML = innerHtml;
  }

const getDeptHtml = (deptList) => {
  let deptHtml = '';
  for (const dept of deptList) {
    deptHtml = `${deptHtml} <div class='dept-label'>${dept}</div>`
  }
  return deptHtml;
}

const remove = (node) => {
  let employeePayrollData = empPayrollList.find(empData => empData.id == node.id);
  if(!employeePayrollData) return;
  const index = empPayrollList.map(empData =>empData.id)
                              .indexOf(employeePayrollData.id);
  empPayrollList.splice(index, 1);
  if (site_properties.use_local_storage.match("true")) {
    localStorage.setItem("EmployeePayrollList", JSON.stringify(empPayrollList));
    document.querySelector(".emp-count").textContent = empPayrollList.length;
    createInnerHtml();
  } else {
    const deleteURL = site_properties.server_url + employeePayrollData.id.toString();
    makPromiseCall("DELETE", deleteURL, false)
      .then(resposiveText => {
        createInnerHtml();
      })
      .catch(error => {
        console.log("DELETE Error Status: " + JSON.stringify(error));
      })
  }
  
}

const update = (node) => {
  let employeePayrollData = empPayrollList.find(empData => empData.id == node.id);
  if(!employeePayrollData) return;
  localStorage.setItem('editEmp', JSON.stringify(employeePayrollData));
  window.location.replace(site_properties.add_emp_payroll_page);
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