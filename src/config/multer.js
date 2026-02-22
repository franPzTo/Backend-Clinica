const multer = require('multer');
const path = require('path');
const fs = require('fs');


//Configuracion de almacenamiento para fotos de perfil
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const  uploadPath = path.join(__dirname, '../../uploads/profiles');
        if(!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath, {recursive: true})
        }
        cb(null, uploadPath)
    },

    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-profile-' + crypto.randomUUID() + path.extname(file.originalname);
        cb(null, uniqueSuffix)
    }   
});

//Configuracion de almacenamiento de las imagenes para los productos
const productsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const  uploadPath = path.join(__dirname, '../../uploads/products');
        if(!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath, {recursive: true})
        }
        cb(null, uploadPath)
    },

    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-product-' + crypto.randomUUID() + path.extname(file.originalname);
        cb(null, uniqueSuffix)
    }   
});

//Filtros de archivos
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if(extname && mimetype){
        cb(null, true)
    } else {
        cb(new Error('Solo se permiten imágenes (jpg, jpeg, png, webp)'))
    }
};

//Configuracion para foto de perfil (1 archivo, max 2MB)
const uploadProfile = multer({
    storage: profileStorage,
    limits: {fileSize: 2 * 1024 * 1024}, //2MB
    fileFilter: fileFilter
}).single('profilePic');

//Configuración para la subida de las imagenes de los libros (1-3 máximo | max 2MB c/u)
const uploadProductImages = multer({
    storage: productsStorage,
    limits: {fileSize: 2 * 1024 * 1024}, //2MB
    fileFilter: fileFilter
}).array('productImages', 3);// array me permite subir hasta 3 archivos. 

//exportar la función
module.exports = {
    uploadProfile,
    uploadProductImages
}
