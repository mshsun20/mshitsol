import bcrypt from 'bcrypt';

const saltRounds = 9
const salt = bcrypt.genSaltSync(saltRounds)

export const hashPassword = (password) => {
    return bcrypt.hashSync(password, salt)
}

export const comparePassword = (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword)
}