
const verifyDoctor = (req, res, next) => {
  
    if (req.user.role !== 'doctor') {
        return res.status(403).json({
            ok: false,
            message: 'Acceso denegado. Solo doctores.'
        });
    }

    next();
};

module.exports = verifyDoctor;