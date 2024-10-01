// カンマ区切りの形式に変換する関数
export const formatNumberWithCommas = (number?: number) => {
    return number != undefined ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "-";
};