import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Not authorized. No token." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // Contains userId and role
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized. Invalid token." });
    }
};