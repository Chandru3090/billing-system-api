const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

const companySchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    companyAddress: { type: String },
    companyTaxId: { type: String },
    companyWebsite: { type: String },
    companyDescription: { type: String },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v: any) {
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: (props: any) => `${props.value} is not a valid email!`,
        },
    },
    phone: {
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
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'admin',
    },
    company: companySchema
}, {
    timestamps: true, toJSON: {
        transform(doc: any, ret: any) {
            delete ret.password;
            return ret;
        },
    },
    toObject: {
        transform(doc: any, ret: any) {
            delete ret.password;
            return ret;
        },
    },
});

userSchema.pre('save', async function (this: any, next: any) {
    if (this.isModified('password')) {
        // Hash the password before saving
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);