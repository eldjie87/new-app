import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../data/db.json');

const db = {
    users: [],
    addUser: function (username, password) {

        const users = JSON.parse(fs.readFileSync(dbPath));
        users.push({ username, password: bcrypt.hashSync(password, 8) });
        try {
            if (!fs.existsSync(dbPath)) {
                fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
            } else {
                fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));
            }
        } catch (error) {

        }
    },
    
    getUser: function (username, password) {
        const existingUsers = JSON.parse(fs.readFileSync(dbPath));
        const user = existingUsers.find(user => user.username === username);
        if (user && bcrypt.compareSync(password, user.password)) {
            return user;
        }
        return null;
    }
}

export default db;