const forms = document.querySelector(".forms"),
  pwShowHide = document.querySelectorAll(".eye-icon"),
  links = document.querySelectorAll(".link");

const today = new Date();
const maxDateString = today.toISOString().split("T")[0];
document.getElementById("inputDateOfBirth").setAttribute("max", maxDateString);

pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    let pwFields =
      eyeIcon.parentElement.parentElement.querySelectorAll(".password");

    pwFields.forEach((password) => {
      if (password.type === "password") {
        password.type = "text";
        eyeIcon.classList.replace("bx-hide", "bx-show");
        return;
      }
      password.type = "password";
      eyeIcon.classList.replace("bx-show", "bx-hide");
    });
  });
});

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    forms.classList.toggle("show-signup");
  });
});

const inputFullName = document.getElementById("inputFullName");
const inputPhoneNumber = document.getElementById("inputPhoneNumber");
const inputEmail = document.getElementById("inputEmail");
const inputDateOfBirth = document.getElementById("inputDateOfBirth");
const inputPassword = document.getElementById("inputPassword");
const inputConfirm = document.getElementById("inputConfirm");
const Signup = document.getElementById("Signup");
const errorFullName = document.getElementById("errorFullName");
const errorSameName = document.getElementById("errorSameName");
const loginEmail = document.getElementById("loginEmail");
const loginPassWord = document.getElementById("loginPassWord");
const errorAccount = document.getElementById("errorAccount");

Signup.addEventListener("click", () => {
  const inforUser = {
    id: uuidv4(),
    fullName: inputFullName.value.trim(),
    phoneNumber: inputPhoneNumber.value.trim(),
    email: inputEmail.value.trim(),
    dateOfBirth: inputDateOfBirth.value,
    password: inputPassword.value.trim(),
    confirm: inputConfirm.value.trim(),
    gender: document.querySelector('input[name="gender"]:checked').value,
    status: 1,
    carts: [],
  };

  let result = valiDateInput(inforUser);

  if (result) {
    // Lấy trên local
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // lọc confirm ra
    const { confirm, ...data } = inforUser;

    // thêm user

    users.push(data);

    // đẩy lại lên local
    localStorage.setItem("users", JSON.stringify(users));

    // reset form
    inputFullName.value = "";
    inputPhoneNumber.value = "";
    inputEmail.value = "";
    inputDateOfBirth.value = "";
    inputPassword.value = "";
    inputConfirm.value = "";
  }
});

function valiDateInput(user) {
  let check = true;

  if (!user.fullName) {
    check = false;
    errorFullName.style.display = "block";
  } else {
    errorFullName.style.display = "none";

    // Lấy thông tin user về
    const users = JSON.parse(localStorage.getItem("users")) || [];
    // tìm trong đó xem có user nào trùng không
    const result = users.find((item) => item.fullName === user.fullName);
    // neu co thi check = false, thong bao loi
    if (result) {
      check = false;
      errorSameName.style.display = "block";
    } else {
      errorSameName.style.display = "none";
    }
    // neu ko thi xoa loi
  }
  if (!/^0[13579]\d{8}$/.test(user.phoneNumber)) {
    check = false;
    errorPhoneNumber.style.display = "block";
  } else {
    errorPhoneNumber.style.display = "none";
  }
  if (!/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(user.email)) {
    check = false;
    errorEmail.style.display = "block";
  } else {
    errorEmail.style.display = "none";
  }
  if (!user.dateOfBirth) {
    check = false;
    errorDateOfBirth.style.display = "block";
  } else {
    errorDateOfBirth.style.display = "none";
  }
  if (!/^(?=.*[A-Z])(?=.*\d).{6,}$/.test(user.password)) {
    check = false;
    errorPassword.style.display = "block";
  } else {
    errorPassword.style.display = "none";
  }
  if (user.confirm != user.password) {
    check = false;
    errorConfirmPassword.style.display = "block";
  } else {
    errorConfirmPassword.style.display = "none";
  }
  return check;
}

function login() {
  const inforLogin = {
    email: loginEmail.value.trim(),
    password: loginPassWord.value,
  };

  if (inforLogin.email == "admin@gmail.com" && inforLogin.password == "admin") {
    // Nhảy sang trang admin
    window.location.href = "../admin/account.html";
  } else {
    // Lấy users trên local về
    const users = JSON.parse(localStorage.getItem("users")) || [];
    let findUser = users.find(
      (user) =>
        user.email == inforLogin.email && inforLogin.password == user.password
    );

    if (findUser) {
      window.location.href = "../user/home.html";
      localStorage.setItem("userLogin", JSON.stringify(findUser));
    } else {
      errorAccount.style.display = "block";
    }
  }
}
