export const createUserValidationSchema = {
    username: {
        isLength: {
            options: {
                min: 5, 
                max: 32, 
            }, 
            errorMessage: "Username must be within 5-32 chars"
        }, 
        notEmpty: {
            errorMessage: "Username can't be empty",
        }, 
        isString: {
            errorMessage: "Username must be a string!"
        }
    }, 
    displayName: {
        notEmpty: {
            errorMessage: "Display name can't be empty"
        }
    }
}