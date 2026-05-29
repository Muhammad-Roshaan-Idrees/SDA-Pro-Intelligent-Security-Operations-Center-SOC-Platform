// PATTERN: Repository
// RATIONALE: Data access layer for users and roles

class IdentityRepository {
    constructor() {
        // Seed some initial users
        this.users = [
            {
                id: 'user_001',
                username: 'analyst1',
                password: 'password123', // In production, use hashed passwords!
                name: 'John Analyst',
                email: 'john@company.com',
                role: 'SOC_ANALYST',
                createdAt: new Date().toISOString()
            },
            {
                id: 'user_002',
                username: 'manager1',
                password: 'manager123',
                name: 'Jane Manager',
                email: 'jane@company.com',
                role: 'SOC_MANAGER',
                createdAt: new Date().toISOString()
            },
            {
                id: 'user_003',
                username: 'admin',
                password: 'admin123',
                name: 'Admin User',
                email: 'admin@company.com',
                role: 'ADMIN',
                createdAt: new Date().toISOString()
            }
        ];
    }

    async save(user) {
        const existingIndex = this.users.findIndex(u => u.id === user.id);
        if (existingIndex >= 0) {
            this.users[existingIndex] = user;
        } else {
            this.users.push(user);
        }
        return user;
    }

    async findById(id) {
        return this.users.find(user => user.id === id);
    }

    async findByUsername(username) {
        return this.users.find(user => user.username === username);
    }

    async findAll() {
        return this.users.map(({ password, ...user }) => user);
    }

    async deleteById(id) {
        const index = this.users.findIndex(user => user.id === id);
        if (index >= 0) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }
}

module.exports = IdentityRepository;