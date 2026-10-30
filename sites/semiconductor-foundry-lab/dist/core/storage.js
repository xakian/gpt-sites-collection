export function browserStorage(key){
 return {read(){try{return localStorage.getItem(key);}catch{throw new Error('瀏覽器目前無法讀取本機存檔。');}},write(value){try{localStorage.setItem(key,value);}catch{throw new Error('無法保存：請檢查瀏覽器儲存空間或隱私設定。');}}};
}
