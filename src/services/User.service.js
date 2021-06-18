import User from '../models/User.model';

export default class UserService {
    getAll() {
        return User.find();
    }

    getById(_id) {
        return User.findOne({ _id });
    }

    async create(user) {
        const createdUser = await User.create(user);
        const createdUserLean = createdUser.toObject();
        const { password, ...userData } = createdUserLean;
        return userData;
    }

    async update(_id, data) {
        await User.updateOne({ _id }, data);
        return User.findOne({ _id });
    }

    delete(_id) {
        return User.findOneAndDelete({ _id });
    }
}
