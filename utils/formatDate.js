/**
 * Format tiền tệ
 * @param {*} money Chuỗi tiền tệ cần format
 * @returns Chuỗi tiền tệ đã định dạng theo VND
 * Auth: NVQUY(10/12/2023)
 */
export const formatMoney = (money) => {
    return money.toLocaleString("vi", { style: "currency", currency: "VND" });
};

/**
 * Format thời gian
 * @param {*} date Chuỗi thời gian cần định dạng
 * @returns Chuỗi thời gian đã định dạng dd/mm/yyyy
 * Auth: NGUYENDUYMINH(8/12/2023)
 */
export const formatDate = (date) => {
    const today = new Date(date);

    let day = today.getDate();
    if (day > 0 && day < 10) {
        day = `0${day}`;
    }

    let month = today.getMonth() + 1;
    if (month > 0 && month < 10) {
        month = `0${month}`;
    }

    const year = today.getFullYear();

    return `${day}/${month}/${year}`;
};

/**
 * Kiểm tra định dạng email
 * @param {*} email Chuỗi email cần kiểm tra
 * @returns null nếu sai định dạng,
 * Auth: NVQUY(12/12/2023)
 */
export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};