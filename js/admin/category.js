import uploadFile from "../../utils/filebase.config.js";

let fileImage = null;
let page = 1;
let pageSize = 4;
let dataRender = JSON.parse(localStorage.getItem("categories")) || [];
let idDel = null;
let categoryEdit = null;

document.getElementById("btnOpenForm").addEventListener("click", function () {
  // toggle có nhiệm vụ thêm bớt class, classList dùng để liệt kê ra các Class
  document.getElementById("formAddCategory").classList.toggle("hidden");
});

function closeForm() {
  document.getElementById("formAddCategory").classList.toggle("hidden");
  //   Xoá dữ liệu khi đóng form
  fileImage = null;
  categoryEdit = null;
  idDel = null;
  resetForm();
}
document.getElementById("btnCloseForm").addEventListener("click", closeForm);

document.getElementById("iconCloseForm").addEventListener("click", closeForm);

document
  .getElementById("input-file")
  .addEventListener("change", function handleSelectImage(e) {
    fileImage = e.target.files[0];
    document.getElementById("preview-img").src = URL.createObjectURL(
      e.target.files[0]
    );
  });

function validateCategory(category) {
  let check = true;
  if (!category.name) {
    document.getElementById("err-name").style.display = "block";
    check = false;
  } else {
    document.getElementById("err-name").style.display = "none";

    const categories = JSON.parse(localStorage.getItem("categories")) || [];
    const index = categories.findIndex(
      (item) => item.name.toLowerCase() == category.name.toLowerCase()
    );
    if (index != -1) {
      document.getElementById("err-same-name").style.display = "block";
      check = false;
    } else {
      document.getElementById("err-same-name").style.display = "none";
    }
  }

  if (!category.file) {
    document.getElementById("err-image").style.display = "block";
    check = false;
  } else {
    document.getElementById("err-image").style.display = "none";
  }

  return check;
}

function resetForm() {
  document.getElementById("name_category").value = "";
  document.getElementById("preview-img").src = "";
  document.getElementById("err-same-name").style.display = "none";
}

function renderPage(data) {
  let totalPage = Math.ceil(dataRender.length / pageSize);
  let stringPage = "";
  for (let j = 1; j <= totalPage; j++) {
    if (j == page) {
      stringPage += `
            <span class="page-item active-page icon-page">${j}</span>
            `;
      continue;
    }
    stringPage += `
            <span class="page-item icon-page"">${j}</span>
        `;
  }

  document.getElementById("page-icon").innerHTML = stringPage;

  const allItemPage = document.querySelectorAll(".icon-page");
  for (let i = 0; i < allItemPage.length; i++) {
    allItemPage[i].addEventListener("click", () => {
      page = i + 1;
      renderPage();
      renderCategory();
    });
  }
}

document.getElementById("pre-page").addEventListener("click", () => {
  let totalPage = Math.ceil(dataRender.length / pageSize);
  if (page - 1 > 0) {
    page -= 1;
  } else {
    page = totalPage;
  }
  renderPage();
  renderCategory();
});

document.getElementById("next-page").addEventListener("click", () => {
  let totalPage = Math.ceil(dataRender.length / pageSize);
  if (page + 1 > totalPage) {
    page = 1;
  } else {
    page += 1;
  }
  renderPage();
  renderCategory();
});

function renderCategory(data) {
  if (dataRender.length == 0) {
    document.getElementById("tbody").innerHTML = "";
    return;
  }

  let totalPage = Math.ceil(dataRender.length / pageSize);

  if (totalPage < page) {
    page = totalPage;
  }

  let start = (page - 1) * pageSize;
  let end = start + pageSize;

  if (end > dataRender.length) {
    end = dataRender.length;
  }

  let stringHTML = "";
  for (let i = start; i < end; i++) {
    stringHTML += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataRender[i].name}</td>
            <td>
            <img
                width="100px"
                src="${dataRender[i].file}"
                alt="img"
            />
            </td>
            <td>${
              dataRender[i].status == 1 ? "Đang hoạt động" : "Ngưng hoạt động"
            }</td>
            <td>
            <button class="btn-edit btn btn-primary" id="edit+${
              dataRender[i].id
            }">Sửa</button>
            <button class="btn-del btn btn-primary" id="delet+${
              dataRender[i].id
            }">Xoá</button>
            </td>
        </tr>
        `;
  }

  document.getElementById("tbody").innerHTML = stringHTML;

  const allBtnDel = document.querySelectorAll(".btn-del");
  for (let i = 0; i < allBtnDel.length; i++) {
    allBtnDel[i].addEventListener("click", () => {
      idDel = allBtnDel[i].id.split("+")[1];
      document.getElementById("dialog-del").style.display = "flex";
    });
  }

  const allBtnEdit = document.querySelectorAll(".btn-edit");
  for (let i = 0; i < allBtnEdit.length; i++) {
    allBtnEdit[i].addEventListener("click", () => {
      const idEdit = allBtnDel[i].id.split("+")[1];
      categoryEdit = dataRender.find((item) => item.id == idEdit);
      // Lấy ra các mảng của thẻ (classList)
      document.getElementById("formAddCategory").classList.toggle("hidden");

      document.getElementById("name_category").value = categoryEdit.name;
      document.getElementById("preview-img").src = categoryEdit.file;

      if (categoryEdit.status == 1) {
        document.getElementById("other").checked = true;
        document.getElementById("inActive").checked = false;
      } else {
        document.getElementById("other").checked = false;
        document.getElementById("inActive").checked = true;
      }
    });
  }
}

document.getElementById("btn-oke-del").addEventListener("click", () => {
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  const newData = categories.filter((item) => item.id != idDel);
  dataRender = newData;
  page = 1;
  localStorage.setItem("categories", JSON.stringify(newData));
  renderPage();
  renderCategory();
  document.getElementById("dialog-del").style.display = "none";
  document.getElementById("input-search").value = "";
});

document.getElementById("btn-no-del").addEventListener("click", () => {
  idDel = null;
  document.getElementById("dialog-del").style.display = "none";
});

renderPage();
renderCategory();

document
  .getElementById("formCategory")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    if (categoryEdit && categoryEdit.id) {
      const editCategory = {
        ...categoryEdit,
        name: document.getElementById("name_category").value,
        status: document.querySelector('input[name="status"]:checked').value,
      };

      const categoryLocal =
        JSON.parse(localStorage.getItem("categories")) || [];
      const indexEdit = categoryLocal.findIndex(
        (item) => item.id == editCategory.id
      );

      const result = validateCategory(editCategory);

      if (result) {
        if (fileImage) {
          const linkImage = await uploadFile(fileImage);
          if (linkImage) {
            editCategory.file = linkImage;
            categoryLocal[indexEdit] = editCategory;
          }
        } else {
          categoryLocal[indexEdit] = editCategory;
        }
        localStorage.setItem("categories", JSON.stringify(categoryLocal));
        dataRender = categoryLocal;
        resetForm();
        closeForm();
        renderPage();
        renderCategory();
      }

      return;
    }

    const category = {
      id: uuidv4(),
      name: document.getElementById("name_category").value,
      file: fileImage,
      status: document.querySelector('input[name="status"]:checked').value,
    };

    const result = validateCategory(category);

    if (result) {
      const linkImage = await uploadFile(fileImage);
      if (linkImage) {
        category.file = linkImage;
        const categoryLocal =
          JSON.parse(localStorage.getItem("categories")) || [];
        categoryLocal.push(category);
        localStorage.setItem("categories", JSON.stringify(categoryLocal));
        dataRender = categoryLocal;
        resetForm();
        closeForm();
        renderPage();
        renderCategory();
      } else {
        alert("Failed upload image");
      }
    }
  });

document.getElementById("btn-search").addEventListener("click", () => {
  const categories = JSON.parse(localStorage.getItem("categories")) || [];
  const textSearch = document
    .getElementById("input-search")
    .value.trim()
    .toLowerCase();
  const data = categories.filter((item) =>
    item.name.toLowerCase().includes(textSearch)
  );
  dataRender = data;
  page = 1;
  renderPage();
  renderCategory();
});
