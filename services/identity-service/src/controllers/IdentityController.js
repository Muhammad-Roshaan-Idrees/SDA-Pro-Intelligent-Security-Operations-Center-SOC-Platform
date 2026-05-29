// PATTERN: MVC (Controller)
// RATIONALE: Handles authentication and authorization requests

class IdentityController {
    constructor(identityService) {
        this.identityService = identityService;
    }

    async authenticate(req, res) {
        try {
            const { username, password } = req.body;
            const result = await this.identityService.authenticate(username, password);
            
            if (result.success) {
                res.json({
                    success: true,
                    token: result.token,
                    user: result.user,
                    expiresIn: 3600
                });
            } else {
                res.status(401).json({ success: false, error: result.error });
            }
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getAnalyst(req, res) {
        try {
            const { id } = req.params;
            const analyst = await this.identityService.getAnalystById(id);
            
            if (analyst) {
                res.json({ success: true, data: analyst });
            } else {
                res.status(404).json({ success: false, error: 'Analyst not found' });
            }
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async authorize(req, res) {
        try {
            const { token, resource, action } = req.body;
            const isAuthorized = await this.identityService.authorize(token, resource, action);
            res.json({ success: true, authorized: isAuthorized });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async verifyToken(req, res) {
        try {
            const { token } = req.params;
            const isValid = await this.identityService.verifyToken(token);
            res.json({ success: true, valid: isValid });
        } catch (error) {
            res.status(401).json({ success: false, valid: false, error: error.message });
        }
    }

    async createAnalyst(req, res) {
        try {
            const analystData = req.body;
            const analyst = await this.identityService.createAnalyst(analystData);
            res.status(201).json({ success: true, data: analyst });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = IdentityController;