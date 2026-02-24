const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

const InvoiceFrom = new mongoose.Schema({
    customerLogo: { type: String },
    customerName: { type: String, required: true },
    customerAddress: { type: String },
    customerTaxId: { type: String },
    customerEmail: {
        type: String, required: true,
        unique: true,
        validate: {
            validator: function (v: any) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid email!`,
        }
    },
    customerPhone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v: any) {
                return /^\d{10}$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid phone number!`,
        },
    },
}, { timestamps: true });

const InvoiceFrom = new mongoose.Schema({
    customerLogo: { type: String },
    customerName: { type: String, required: true },
    customerAddress: { type: String },
    customerTaxId: { type: String },
    customerEmail: {
        type: String, required: true,
        unique: true,
        validate: {
            validator: function (v: any) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid email!`,
        }
    },
    customerPhone: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v: any) {
                return /^\d{10}$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid phone number!`,
        },
    },
}, { timestamps: true });