import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'O Nome é obrigatório!'],
        },
        email: {
            type: String,
            required: [true, 'O E-mail é obrigatório!'],
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'A senha é obrigatória!'],
        },
    },
    { timestamps: true }
);

// arrow function muda o escopo do this
UserSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    next();
});

UserSchema.post('save', (error, doc, next) => {
    if (error.name === 'MongoError' && error.code === 11000) {
        return next(
            new Error(
                JSON.stringify({
                    status: 400,
                    message: 'Email deve ser único!',
                })
            )
        );
    }

    if (error.name === 'ValidationError') {
        const errors = {};

        Object.keys(error.errors).forEach((key) => {
            errors[key] = error.errors[key].message;
        });

        throw new Error(JSON.stringify({ status: 400, message: errors }));
    }
    next(error);
});

UserSchema.methods.comparePassword = async (candidatePassword) => {
    const user = this;
    const isMatch = await bcrypt.compare(candidatePassword, user.password);
    return isMatch;
};

const User = mongoose.model('user', UserSchema);

export default User;
