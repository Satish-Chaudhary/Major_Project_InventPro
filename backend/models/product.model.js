import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    productName:
    {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true,
        unique: true
    },

    productDescription:
    {
        type: String

    },
    category:
    [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    brand:
    {
        type: String

    },
    skuId:
    {
        type: String, unique: true

    },
    barcodeEAN:
    {
        type: String

    },
    initialQty:
    {
        type: Number, default: 0

    },
    lowStockThreshold:
    {
        type: Number, default: 10

    },
    productImage:
    {
        type: String

    },
    basePrice:
    {
        type: Number, required: true

    },
    costPrice:
    {
        type: Number

    },
    tax:
    {
        type: Number, default: 0

    },
    status:
    {
        type: String,
        enum: ['in stock', 'low stock', 'out of stock'],
        default: 'in stock'
    }
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema);
export default Product;
