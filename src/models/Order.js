export class Order {
  constructor(
    orderNumber = null,
    customerNumber = null,
    items = [],
    totalToPay = 0,
    date = LocalDate.now().toString(),
    time = LocalTime.now().toString()
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
