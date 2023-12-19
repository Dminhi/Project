let currentPage = 1;
let pageSize = 4;
// Lấy dữ liệu của mảng trên Local
let dataRender = JSON.parse(localStorage.getItem("users")) || [];

function movePage(status) {
  const toltalPage = Math.ceil(dataRender.length / pageSize);
  switch (status) {
    case 0:
      if (currentPage > 1) currentPage--;
      break;
    case 1:
      if (currentPage < toltalPage) currentPage++;
      break;
  }
  renderPage();
  renderUser();
}

function clickPage(pageChoose) {
  currentPage = pageChoose;
  renderPage();
  renderUser();
}

function renderPage() {
  const toltalPage = Math.ceil(dataRender.length / pageSize);
  let stringHTML = "";
  for (let i = 1; i <= toltalPage; i++) {
    if (i == currentPage) {
      stringHTML += `
                <span class="page-item active" onclick="clickPage(${i})">${i}</span>
            `;
      continue;
    }
    stringHTML += `
            <span class="page-item" onclick="clickPage(${i})">${i}</span>
        `;
  }
  document.getElementById("page-icon").innerHTML = stringHTML;
}

function changeStatusUser(id, status) {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const indexBan = users.findIndex((user) => user.id == id);
  if (indexBan != -1) {
    users[indexBan].status = status;

    localStorage.setItem("users", JSON.stringify(users));
    dataRender = users;
    searchUsers();
    renderPage();
    renderUser();
  }
}

function renderUser() {
  let start = (currentPage - 1) * pageSize;
  let end = start + pageSize;
  if (end > dataRender.length) end = dataRender.length;

  let stringHTML = "";
  for (let i = start; i < end; i++) {
    let stringButton = "";
    stringButton =
      dataRender[i].status == 1
        ? `<button class="btn btn-primary" onclick="changeStatusUser('${dataRender[i].id}', 0)">
                <i class="fa-solid fa-lock"></i>
            </button>`
        : `<button class="btn btn-primary" onclick="changeStatusUser('${dataRender[i].id}', 1)">
                <i class="fa-solid fa-lock-open"></i>
            </button>`;

    stringHTML += `
        <tr>
            <td style = "text-align: center;">${i + 1}</td>
            <td>${dataRender[i].fullName}</td>
            <td>${
              dataRender[i].gender == 0
                ? "Nam"
                : dataRender[i].gender == 1
                ? "Nữ"
                : "Khác"
            }</td>
            <td>${dataRender[i].dateOfBirth}</td>
            <td>${dataRender[i].phoneNumber}</td>
            <td>${dataRender[i].email}</td>
            <td>${
              dataRender[i].status == 1 ? "Đang hoạt động" : "Đã bị khoá"
            }</td>
            <td colspan="2">
                <div style="display: flex; gap: 8px">
                    ${stringButton}
                    <button class="btn btn-primary" onclick="toggleForm('${i}')"> 
                        <i class="fa-solid fa-circle-info"></i> 
                    </button>
                </div>
            </td>
        </tr>
        `;
  }
  renderPage();
  document.getElementById("tbody").innerHTML = stringHTML;
}
renderUser();

function searchUsers() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const textSearch = document
    .getElementById("text-search")
    .value.trim()
    .toLowerCase();

  const userSearch = users.filter((user) =>
    user.fullName.toLowerCase().includes(textSearch)
  );
  console.log(userSearch);
  dataRender = userSearch;
  renderPage();
  renderUser();
}

searchUsers();

function toggleForm(index) {
  document.getElementById("container-form").classList.toggle("hidden");
  if (index) {
    document.getElementById("userNameInput").value = dataRender[index].fullName;
    document.getElementById("dateOfBirth").value =
      dataRender[index].dateOfBirth;
    document.getElementById("phoneNumber").value =
      dataRender[index].phoneNumber;
    document.getElementById("email").value = dataRender[index].email;
    document.querySelector(
      `input[name="status"][value="${dataRender[index].status}"]`
    ).checked = true;
    document.querySelector(
      `input[name="gender"][value="${dataRender[index].gender}"]`
    ).checked = true;
  }
}
