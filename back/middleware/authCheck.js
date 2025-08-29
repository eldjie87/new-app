import db from '../db/db.js';

const isLogin = (req, res) => {
    if (!req.body || !req.body.username || !req.body.password) {
        return res.status(400).json({ message: 'User credentials are missing' });
    }

    const { username, password } = req.body;
    const user = db.getUser(username, password);

    if (user) {
        return res.status(200).json({ message: 'User is logged in' });
    } else {
        return res.status(401).json({ message: 'User is not logged in' });
    }
}

export default isLogin;
