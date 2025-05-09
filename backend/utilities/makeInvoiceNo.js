const letter = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const number = '0123456789';

const makeInvoiceNo =  () => {
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += letter.charAt(Math.floor(Math.random() * letter.length));
    }
    for (let i = 0; i < 4; i++) {
        result += number.charAt(Math.floor(Math.random() * number.length));
    }
    return result;
};

module.exports = makeInvoiceNo;