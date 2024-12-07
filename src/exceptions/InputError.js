import multer from "multer";

const inputError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                status: "fail",
                message: 'Payload content length greater than maximum allowed: 1000000' });
        }
    } else if (err) {
        return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
    next();
};

export default inputError;