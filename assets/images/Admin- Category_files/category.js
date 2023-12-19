import uploadFile from "../../utils/filebase.config.js";

let fileImage = null;
let page = 1;
let pageSize = 4;
let dataRender = JSON.parse(localStorage.getItem("categories")) || [];
let idDel = null;

document.getElementById("btnOpenForm").addEventListener("click", function() {
    document.getElementById("formAddCategory").style.display = "block";
});

function closeForm() {
    document.getElementById("formAddCategory").style.display = "none";
}

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
}

function renderPage(data) {
    // let dataRender = [];
    // if (data) {
    //     dataRender = data;
    // } else {
    //     dataRender = JSON.parse(localStorage.getItem("categories")) || [];
    // }

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
    // let dataRender = [];
    // if (data) {
    //     dataRender = data;
    // } else {
    //     dataRender = JSON.parse(localStorage.getItem("categories")) || [];
    // }
    if (dataRender.length == 0) {
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
            <td>${dataRender[i].id}</td>
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
            <button>Sửa</button>
            <button class="btn-del" id="delete+${dataRender[i].id}">Xoá</button>
            </td>
        </tr>
        `;
    }

    document.getElementById("tbody").innerHTML = stringHTML;

    const allBtnDel = document.querySelectorAll(".btn-del");
    for (let i = 0; i < allBtnDel.length; i++) {
        allBtnDel[i].addEventListener("click", () => {
            const idDel = allBtnDel[i].id;
        });
    }
}

function xoa(i) {
    console.log(i);
}

renderPage();
renderCategory();

document
    .getElementById("formCategory")
    .addEventListener("submit", async function(e) {
        e.preventDefault();

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
                console.log(linkImage);
                category.file = linkImage;
                console.log(category);

                const categoryLocal =
                    JSON.parse(localStorage.getItem("categories")) || [];
                categoryLocal.push(category);
                localStorage.setItem("categories", JSON.stringify(categoryLocal));
                dataRender = categoryLocal;
                resetForm();
                closeForm();
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