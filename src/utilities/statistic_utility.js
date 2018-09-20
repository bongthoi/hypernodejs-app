module.exports = function StatisticProduct() {
    this.items ={};
    this.totalItems =0;
    this.totalPrice =0;

    this.add = function(item, id) {
        var cartItem = this.items[id];
        console.log(cartItem);
       // if (!cartItem) {
            cartItem = this.items[id] = {item: item, quantity: 0, subtotal: 0};
//}
        cartItem.quantity++;
        cartItem.subtotal = cartItem.item.price * cartItem.quantity;
        this.totalItems++;
        this.totalPrice += cartItem.item.price;
    };

   
    
    this.getItems = function() {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};