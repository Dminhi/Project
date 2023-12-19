let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
const userLogin = JSON.parse(localStorage.getItem("userLogin"));
const userCartLogin = userLogin.carts;
const productLocal = JSON.parse(localStorage.getItem("products"));
let curentPage = 1;
let totalPerPage = 5;

// Hàm render số lượng button tượng trưng cho từng trang
function renderPage() {
  // Số lượng button sẽ xuất hiện
  let totalBtn = Math.ceil(userCartLogin.length / totalPerPage);
  // Xoá nút fix cứng ở trong html

  $("#page-icon").innerHTML = "";
  // Lăp qua số lượng trang
  for (let i = 1; i <= totalBtn; i++) {
    // Tạo phần tử button
    const btnElement = document.createElement("button");
    btnElement.classList.add("page-item");
    // Gán nội dung cho button
    btnElement.textContent = i;
    //   Appen vào trong DOM
    $("#page-icon").appendChild(btnElement);
    //   Lắng nghe sự kiện khi click vào btn page chuyển trang
    btnElement.addEventListener("click", () => {
      // Gán lại Current Page cho i
      curentPage = i;
      // Gọi hàm renderCartLogin
      renderCartLogin();
    });
  }
}
renderPage();

async function renderCartLogin() {
  // Vị trí bắt đầu
  let startIndex = (curentPage - 1) * totalPerPage;
  //   Vị trí kết thúc
  let endIndex = startIndex + totalPerPage;
  // Cắt mảng từ vị trí startIndex tới endIndex
  let userSlice = await userCartLogin.slice(startIndex, endIndex);

  const cartItems = userSlice.map((cart, index) => {
    // Lấy ra thông tin tin từ productId
    const getProduct = productLocal.find((pro) => pro.id === cart.productId);
    return `
    <tr>
    <td>${index + 1}</td>
    <td>${getProduct?.name}</td>
    <td><img style = "width: 120px;
    height: 80px;" src =${getProduct?.file}></td>
    <td>${getProduct?.price}</td>
    <td>
    <button id="btn-decrease" data=${
      getProduct?.id
    } class="btn-decrease" >-</button>
    ${cart.quantity}
    <button id="btn-increase" data=${
      getProduct?.id
    } class = "btn-increase">+</button>
    </td>
    <td>${getProduct?.price * cart.quantity}</td>
    <td></td>
    </tr>
    `;
  });
  $("#tbody").innerHTML = cartItems.join("");
}
renderCartLogin();

// Khi click vào nút Next page hoặc pre page cập nhật gía trị tăng giảm 1

$("#next-page").addEventListener("click", () => {
  // Lấy ra trang cuối cùng
  let maxPage = Math.ceil(userCartLogin.length / totalPerPage);
  if (curentPage < maxPage) {
    // Tăng trang hiện tại lên 1
    curentPage++;
    renderCartLogin();
  }
});
$("#pre-page").addEventListener("click", () => {
  // Lấy ra trang cuối cùng
  if (curentPage > 1) {
    // Giảm trang hiện tại lên 1
    curentPage--;
    renderCartLogin();
  }
});

// Hàm sử lý tăng giảm số lượng
$("#tbody").addEventListener("click", (e) => {
  if (e.target.closest(".btn-increase")) {
    // Lấy ra vị trí của product trong giỏ hàng trong danh sách theo id
    const findIndexCart = userCartLogin.findIndex(
      (cart) => cart.productId === e.target.getAttribute("data")
    );
    userCartLogin[findIndexCart].quantity++;
    localStorage.setItem("userLogin", JSON.stringify(userLogin));
    renderCartLogin();
  }
});

$("#tbody").addEventListener("click", (e) => {
  if (e.target.closest(".btn-decrease")) {
    // Lấy ra vị trí của product trong giỏ hàng trong danh sách theo id
    const findIndexCart = userCartLogin.findIndex(
      (cart) => cart.productId === e.target.getAttribute("data")
    );

    if (userCartLogin[findIndexCart].quantity > 0) {
      userCartLogin[findIndexCart].quantity--;
      localStorage.setItem("userLogin", JSON.stringify(userLogin));
      renderCartLogin();
    }
  }
});
