import mongoose from "mongoose";

const SettingSchema = new mongoose.Schema({
    orgName: {
        type: String,
        default: "InventPro",
        maxLength: 50
    },
    currency: {
        type: String,
        default: "USD"
    },
    notifEmail: {
        type: String
    }
}, { timestamps: true });

const Setting = mongoose.model("Setting", SettingSchema);

export default Setting;
