window.addEventListener('DOMContentLoaded', (event) => {
    createInnerHtml();
});

const createInnerHtml = () => {
  const headerHtml = "<th></th><th>Name</th><th>Gender</th><th>Department</th><th>Salary</th><th>Start Date</th><th>Actions</th>";
  const innerHtml = `${headerHtml}
    <tr>
      <td><img class="profile" alt="" src="../assets/profile-images/Ellipse -2.png"</td>
      <td>Vijay Kumar</td>
      <td>Male</td>
      <td>
        <div class="dept-label">HR</div>
        <div class="dept-label">Engineer</div>
      </td>
      <td>400000</td>
      <td>10 Nov 2020</td>
      <td>
        <img name="1" onclick="remove(this)" alt="delete" src="../assets/icons/delete-black-18dp.svg">
        <img name="1" onclick="update(this)" alt="edit" src="../assets/icons/create-black-18dp.svg">
      </td>
    </tr>
  `;
  document.querySelector('#table-display').innerHTML = innerHtml;
}