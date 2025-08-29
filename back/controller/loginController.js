import db from '../db/db.js';

const login = (req, res) => {

    if (!req.body || !req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'User credentials are missing' });
    }
    const { username, password } = req.body;

    const user = db.getUser(username, password);
    if (user) {
        return res.status(200).json({ message: 'Login successful' });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
}

const register = (req, res) => {
    if (!req.body || !req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'Registration credentials are missing' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = db.getUser(username, password);
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }

    db.addUser(username, password);
    res.status(201).json({ message: 'User registered successfully' });
}

export default {
    login,
    register
};
