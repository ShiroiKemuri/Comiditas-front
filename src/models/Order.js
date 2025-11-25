export class Order {
  constructor(
    id = null,
    customerNumber = null,
    items = [],
    totalToPay = 0,
    date = LocalDate.now().toString(),
    time = LocalTime.now().toString()
  ) {
    this.id = id;
    this.customerNumber = customerNumber;
    this.items = items; // platos solicitados
    this.totalToPay = totalToPay;
    this.creationTimestamp = creationTimestamp;
  }
}

export default {
  ...new Order(),
};
