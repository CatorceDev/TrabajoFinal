export function handleControllerError(error, res, next) {
    if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
            error: error.errors.map((item) => item.message).join(", "),
        });
    }

    if (error.name === "SequelizeUniqueConstraintError" || error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(409).json({
            error: "El registro está duplicado o relacionado con otros datos",
        });
    }

    return next(error);
}
