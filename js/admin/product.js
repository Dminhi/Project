import uploadFile from "../../utils/filebase.config.js";

let fileImage = null;
let page = 1;
let pageSize = 4;
let dataRender = JSON.parse(localStorage.getItem("products")) || [];
let idDel = null;
let productEdit = null;
let categoryId = "";
let categoryLocal = JSON.parse(localStorage.getItem("categories")) || [];

function renderCategory() {
  const optionHtmls = categoryLocal.map((cat) => {
    return `<option value=${cat.id}>${cat.name}</option>`;
  });

  const optionHtml = optionHtmls.join("");

  document.querySelector("#menu_product").innerHTML = optionHtml;
}

renderCategory();

// Lấy giá trị select option
document.querySelector("#menu_product").addEventListener("change", (e) => {
  categoryId = e.target.value;
});

document.getElementById("btnOpenForm").addEventListener("click", function () {
  document.getElementById("formAddProduct").classList.toggle("hidden");
});

function closeForm() {
  document.getElementById("formAddProduct").classList.toggle("hidden");
  fileImage = null;
  productEdit = null;
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

function validateProduct(product) {
  let check = true;
  if (!product.name) {
    document.getElementById("err-name").style.display = "block";
    check = false;
  } else {
    document.getElementById("err-name").style.display = "none";

    const products = JSON.parse(localStorage.getItem("products")) || [];
    const index = products.findIndex(
      (item) => item.name.toLowerCase() == product.name.toLowerCase()
    );
    if (index != -1) {
      document.getElementById("err-same-name").style.display = "block";
      check = false;
    } else {
      document.getElementById("err-same-name").style.display = "none";
    }
  }

  if (!productEdit) {
    if (!product.file) {
      document.getElementById("err-image").style.display = "block";
      check = false;
    } else {
      document.getElementById("err-image").style.display = "none";
    }
  }

  return check;
}

function resetForm() {
  document.getElementById("name_product").value = "";
  document.getElementById("preview-img").src = "";
  document.getElementById("err-same-name").style.display = "none";
  document.getElementById("err-name").style.display = "none";
  document.getElementById("err-image").style.display = "none";
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
      renderProduct();
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
  renderProduct();
});

document.getElementById("next-page").addEventListener("click", () => {
  let totalPage = Math.ceil(dataRender.length / pageSize);
  if (page + 1 > totalPage) {
    page = 1;
  } else {
    page += 1;
  }
  renderPage();
  renderProduct();
});

function renderProduct(data) {
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
    // Tìm kiếm tên category theo id
    let findById = categoryLocal.find(
      (cat) => cat.id == dataRender[i].menu_product
    );

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
            <td>${dataRender[i].price}</td>
            <td>${dataRender[i].quantity_product}</td>
            <td>${findById?.name}</td>
            <td>${dataRender[i].discount_product}</td>                   
            <td>
            <button class="btn-edit btn btn-primary" id="edit+${
              dataRender[i].id
            }">Sửa</button>
            <button class="btn-del btn btn-primary" id="delete+${
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

      productEdit = dataRender.find((item) => item.id == idEdit);

      document.getElementById("formAddProduct").classList.toggle("hidden");

      document.getElementById("name_product").value = productEdit.name;
      document.getElementById("preview-img").src = productEdit.file;
      document.getElementById("price_product").value = productEdit.price;
      document.getElementById("quantity_product").value =
        productEdit.quantity_product;
      document.getElementById("discount_product").value =
        productEdit.discount_product;
      document.getElementById("menu_product").value = productEdit.menu_product;
      document.getElementById("detdetail_product").value =
        productEdit.detdetail_product;

      // if (productEdit.status == 1) {
      //     document.getElementById("other").checked = true;
      //     document.getElementById("inActive").checked = false;
      // } else {
      //     document.getElementById("other").checked = false;
      //     document.getElementById("inActive").checked = true;
      // }
    });
  }
}

document.getElementById("btn-oke-del").addEventListener("click", () => {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const newData = products.filter((item) => item.id != idDel);
  dataRender = newData;
  page = 1;
  localStorage.setItem("products", JSON.stringify(newData));
  renderPage();
  renderProduct();
  document.getElementById("dialog-del").style.display = "none";
  document.getElementById("input-search").value = "";
});

document.getElementById("btn-no-del").addEventListener("click", () => {
  idDel = null;
  document.getElementById("dialog-del").style.display = "none";
});

renderPage();
renderProduct();

document
  .getElementById("formProduct")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    if (productEdit && productEdit.id) {
      const editProduct = {
        ...productEdit,
        name: document.getElementById("name_product").value,
        file: fileImage,
        price: document.getElementById("price_product").value,
        quantity_product: document.getElementById("quantity_product").value,
        discount_product: document.getElementById("discount_product").value,
        menu_product: categoryId,
        detdetail_product: document.getElementById("detdetail_product").value,
      };
      const productLocal = JSON.parse(localStorage.getItem("products")) || [];
      const indexEdit = productLocal.findIndex(
        (item) => item.id == editProduct.id
      );

      const result = validateProduct(editProduct);

      if (result) {
        if (fileImage) {
          const linkImage = await uploadFile(fileImage);
          if (linkImage) {
            editProduct.file = linkImage;
            productLocal[indexEdit] = editProduct;
          }
        } else {
          productLocal[indexEdit] = editProduct;
        }
        localStorage.setItem("products", JSON.stringify(productLocal));
        dataRender = productLocal;
        resetForm();
        closeForm();
        renderPage();
        renderProduct();
      }

      return;
    }

    const product = {
      id: uuidv4(),
      name: document.getElementById("name_product").value,
      file: fileImage,
      price: document.getElementById("price_product").value,
      quantity_product: document.getElementById("quantity_product").value,
      discount_product: document.getElementById("discount_product").value,
      menu_product: categoryId,
      detdetail_product: document.getElementById("detdetail_product").value,
    };

    const result = validateProduct(product);

    if (result) {
      const linkImage = await uploadFile(fileImage);
      if (linkImage) {
        product.file = linkImage;
        const productLocal = JSON.parse(localStorage.getItem("products")) || [];
        productLocal.push(product);
        localStorage.setItem("products", JSON.stringify(productLocal));
        dataRender = productLocal;
        resetForm();
        closeForm();
        renderPage();
        renderProduct();
      } else {
        alert("Failed upload image");
      }
    }
  });

document.getElementById("btn-search").addEventListener("click", () => {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const textSearch = document
    .getElementById("input-search")
    .value.trim()
    .toLowerCase();
  const data = products.filter((item) =>
    item.name.toLowerCase().includes(textSearch)
  );
  dataRender = data;
  page = 1;
  renderPage();
  renderProduct();
});

function editProduct() {}
