import * as authService from '../services/auth.service.js';

export const signup = async (req, res) => {
    try {
        const user = await authService.signup(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const token = await authService.login(req.body);
        res.json({ token });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};
