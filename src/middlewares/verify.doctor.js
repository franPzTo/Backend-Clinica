src/middlewares/verifyDoctor.js

module.exports = (req, res, next) => {
    // req.user ya viene de verifyAuth (usuario logueado)
    if (req.user.role !== process.env.DOCTOR_ROLE) {
        return res.status(403).json({
            ok: false,
            message: "Acceso solo para médicos"
        });
    }
    // Si es doctor, sigue a la ruta
    next();
};