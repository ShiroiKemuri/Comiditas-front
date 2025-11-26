export class Order {
  constructor(
    orderNumber = null,
    customerNumber = null,
    items = OrderItems,
    totalToPay = 0,
    date = LocalDate.now(),
    time = LocalTime.now()
  ) {
    this.orderNumber = orderNumber;
    this.customerNumber = customerNumber;
    this.items = items; // platos solicitados
    this.totalToPay = totalToPay;
    this.date = date;
    this.time = time;
  }
}

export default {
  ...new Order(),
};
