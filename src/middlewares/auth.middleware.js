import * as userService from '../services/user.service.js';

export const authMiddleware = async (req, res, next) => {

    if (req.path === '/' || req.path === '/register') {
        return next();
    }

    const username = req.cookies.user;
    if (username) {
        const user = await userService.getUser(username);
        if (user) {
            req.user = user;
        }
    }
    
    return next();
};
