import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const uploadFile = async(value) => {
    let imageUrl = "";
    // Các config của firebase

    const firebaseConfig = {
        apiKey: "AIzaSyD73MsHrxTgoUz_DSgSSS9ufpiMNfhYVVw",
        authDomain: "darkangel-dminh.firebaseapp.com",
        projectId: "darkangel-dminh",
        storageBucket: "darkangel-dminh.appspot.com",
        messagingSenderId: "1069257614450",
        appId: "1:1069257614450:web:b6463ff3c4ac0544144eeb",
    };
    // Tạo biến app cho phép sử dụng filebase ở phạm vi toàn cục
    const app = initializeApp(firebaseConfig);

    // Lấy và cho phép lưu dữ liệu trên firebase

    const store = getStorage(app);

    // Lấy giá trị được chuyển lên từ form

    // Kiểm tra giá trị từ form

    if (value) {
        // tạo tham chiếu đến thư mục trên filebase
        const storeRef = ref(store, `uploads/${value.name}`);

        try {
            // Tiến hành upload ảnh lên file base
            const snapshot = await uploadBytes(storeRef, value);
            // Lấy url của hình về sau khi update thành công
            const downloadURL = await getDownloadURL(snapshot.ref);

            imageUrl = downloadURL; // Gán lại đường dẫn

            console.log("Đường dẫn hình ảnh: ", downloadURL);
        } catch (error) {
            console.log("Lỗi tải lên", error);
            imageUrl = "";
        }
    } else {
        imageUrl = "";
    }
    return imageUrl;
};

export default uploadFile;