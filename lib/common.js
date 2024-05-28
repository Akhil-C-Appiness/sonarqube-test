export function toPercentage(val, total) {
    return (val/total)*100;
}
export function getDate(val){
    if(val == null || val <= 0){
        return "NA"
    }
    else{
        let datwString = new Date(val).toLocaleString();
        if(datwString == "Invalid Date"){
            return "NA"
        }
        else{
            return datwString;
        }
    }
}
export const validateEmail = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
export const validatePhoneNumber = (number) => {
    const phoneNumberRegex = /^(\+\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;
    return phoneNumberRegex.test(number);
};
export const validatePortNumber = (number) => {
    const portNumberRegex = /^(0|([1-9][0-9]{0,3})|([1-5][0-9]{4})|(6[0-4][0-9]{3})|(65[0-4][0-9]{2})|(655[0-2][0-9])|(6553[0-5]))$/;
    return portNumberRegex.test(number);
};
export const validateIPNumber = (number) => {
    const ipNumberRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    return ipNumberRegex.test(number);
};
