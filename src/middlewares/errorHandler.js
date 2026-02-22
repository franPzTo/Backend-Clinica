const { cleanUploadsFiles } = require('../Utils/fileCleanup');

const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    cleanUploadsFiles(req);
    if(err.name === 'ValidationError'){
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            success: false,
            message: err.message,
            errors
        })
    }
    if(err.message && err.message.includes('Solo se permiten imágenes')){
        return res.status(400).json({
            ok:false,
            message:err.message
        })
    }
    if(err.name === 'MulterError'){
        if(err.code === 'LIMIT_FILE_SIZE'){
            return res.status(400).json({
                ok:false,
                message:'El archivo excede el tamaño permitido de 2MB'
            })
        }
        cleanUploadsFiles(req);
        return res.status(400).json({
            ok:false,
            message: err.message
        })
    }
    res.status(err.statusCode || 500).json({
        ok:false,
        message: err.message || 'Error interno del servidor'
    })
}

module.exports = errorHandler;