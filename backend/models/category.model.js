import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    catName: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    thumbnail: {
        type: String
    }
}, { timestamps: true });

const Category = mongoose.model("Category", CategorySchema);

export default Category;
