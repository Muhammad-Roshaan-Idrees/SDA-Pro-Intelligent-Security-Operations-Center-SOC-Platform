// PATTERN: Service Layer
// RATIONALE: Business logic for authentication and authorization

class IdentityService {
    constructor(identityRepository) {
        this.repository = identityRepository;
        this.sessions = new Map(); // In-memory session store
    }

    async authenticate(username, password) {
        // Find user by username
        const user = await this.repository.findByUsername(username);
        
        if (!user) {
            return { success: false, error: 'Invalid username or password' };
        }
        
        // In production, compare hashed passwords
        if (user.password !== password) {
            return { success: false, error: 'Invalid username or password' };
        }
        
        // Generate session token
        const token = this.generateToken();
        const session = {
            token: token,
            userId: user.id,
            username: user.username,
            role: user.role,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour
        };
        
        this.sessions.set(token, session);
        
        return {
            success: true,
            token: token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role,
                email: user.email
            }
        };
    }

    async getAnalystById(id) {
        const user = await this.repository.findById(id);
        
        if (!user) {
            return null;
        }
        
        // Don't return password
        const { password, ...analyst } = user;
        return analyst;
    }

    async authorize(token, resource, action) {
        const session = this.sessions.get(token);
        
        if (!session) {
            return false;
        }
        
        // Check if session expired
        if (new Date(session.expiresAt) < new Date()) {
            this.sessions.delete(token);
            return false;
        }
        
        // Role-based access control
        const rolePermissions = {
            'SOC_ANALYST': ['view_incidents', 'view_alerts', 'execute_response'],
            'SOC_MANAGER': ['view_incidents', 'view_alerts', 'execute_response', 'approve_actions', 'view_reports'],
            'ADMIN': ['*'] // Full access
        };
        
        const permissions = rolePermissions[session.role] || [];
        
        if (permissions.includes('*') || permissions.includes(action)) {
            return true;
        }
        
        return false;
    }

    async verifyToken(token) {
        const session = this.sessions.get(token);
        
        if (!session) {
            return false;
        }
        
        if (new Date(session.expiresAt) < new Date()) {
            this.sessions.delete(token);
            return false;
        }
        
        return true;
    }

    async createAnalyst(analystData) {
        const newAnalyst = {
            id: this.generateId(),
            username: analystData.username,
            password: analystData.password, // In production, hash this!
            name: analystData.name,
            email: analystData.email,
            role: analystData.role || 'SOC_ANALYST',
            createdAt: new Date().toISOString()
        };
        
        await this.repository.save(newAnalyst);
        
        const { password, ...analystWithoutPassword } = newAnalyst;
        return analystWithoutPassword;
    }

    generateToken() {
        return 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 16);
    }

    generateId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Helper method to get session from token (for other services)
    getSession(token) {
        return this.sessions.get(token);
    }
}

module.exports = IdentityService;