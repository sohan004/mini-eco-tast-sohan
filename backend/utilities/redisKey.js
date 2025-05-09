module.exports.cartKey = (userId) => {
    return `cart:user:${userId}`;
}