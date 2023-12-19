let productLocal = JSON.parse(localStorage.getItem("products")) || [];
let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
let userLogin = JSON.parse(localStorage.getItem("userLogin")) || {};
// let cartUserLogin = userLogin?.cart;
/**
 * Hiển thị danh sách sản phẩm
 */
function renderProduct() {
  // Lặp qua tưng phần tử của mảng
  let productHtmls = productLocal.map((pro) => {
    return `
        <div class="col mb-5">
            <div class="card h-100">
              <img
                class="card-img-top"
                src=${pro.file}
                alt="..."
              />
              <div class="card-body p-4">
                <div class="text-center">
                  <h5 class="fw-bolder">${pro.name}</h5>   
                  ${pro.price}
                </div>
              </div>
              <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                <div class="text-center">
                  <a id="${pro.id}" class="btn btnAddToCart btn-outline-dark mt-auto"
                    >Add To Cart</a
                  >
                </div>
              </div>
            </div>
          </div>
        `;
  });
  // Ép kiẻu từ mảng thành chuỗi HTML
  let productHtml = productHtmls.join("");
  // append vào phần tử cha
  document.querySelector("#listProduct").innerHTML = productHtml;

  $$(".btnAddToCart").forEach((element) => {
    element.addEventListener("click", (e) => {
      if (!(userLogin && userLogin.id)) {
        window.location.href = "./login.html";
      } else {
        let cartUserLogin = userLogin.carts;
        // Lấy id từ thuộc tính id
        let productId = e.target.getAttribute("id");
        // lấy ra vị trí của productId trong mảng
        const productIndex = cartUserLogin.findIndex(
          (cart) => cart.productId === productId
        );
        if (productIndex === -1) {
          const newCart = {
            cartId: uuidv4(),
            productId: productId,
            quantity: 1,
            createDate: new Date(),
          };
          // Thêm đối tượng newUser vào trong mảng
          cartUserLogin.push(newCart);
          userLogin.carts = cartUserLogin;
          // Lưu dữ liệu trên Local
          localStorage.setItem("userLogin", JSON.stringify(userLogin));

          getNumberCart();
        } else {
          // Lấy ra giỏ hàng tại vị trí thứ index
          cartUserLogin[productIndex].quantity++;

          // Lưu lại thông tin lên Local

          localStorage.setItem("userLogin", JSON.stringify(userLogin));
        }
      }
    });
  });
}
renderProduct();

function getNumberCart() {
  let userLogin = JSON.parse(localStorage.getItem("userLogin")).carts;
  document.getElementById("count").innerHTML = userLogin.length;
}

getNumberCart();
