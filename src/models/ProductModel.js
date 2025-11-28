export class ProductModel {
    constructor(id = null, name = '', price = 0, description = '', imageUrl = '', active = true, stock = true, category = null) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.active = active;
        this.stock = stock;
        this.category = category;
    }
}

export default {
    ...new ProductModel()
};
