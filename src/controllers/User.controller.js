import UserService from '../services/User.service';

class UserController {
    async create(req, res) {
        const userService = new UserService();
        const user = await userService.create(req.body);
        return res.json(user);
    }

    async index(req, res) {
        const userService = new UserService();
        const user = await userService.getAll();
        return res.json(user);
    }

    async show(req, res) {
        const { id } = req.params;
        const userService = new UserService();
        const user = await userService.getById(id);
        return res.json(user);
    }

    async update(req, res) {
        const {
            params: { id },
            body,
        } = req;

        const userService = new UserService();

        await userService.update(id, body);
        const user = await userService.getById(id);
        return res.json(user);
    }

    async destroy(req, res) {
        const { id } = req.params;
        const userService = new UserService();
        await userService.delete(id);
        return res.sendStatus(204);
    }
}

export default new UserController();
