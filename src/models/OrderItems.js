export class OrderItems {
  constructor(
    idOrderItem = null,
    dishName = null,
    quantity = null,
    price = null,
    order = null
  ) {
    this.idOrderItem = idOrderItem;
    this.dishName = dishName;
    this.quantity = quantity;
    this.price = price;
    this.order = order;
  }
}

export default {
  ...new OrderItems(),
};
