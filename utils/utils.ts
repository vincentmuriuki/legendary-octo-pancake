const bcrypt = require('bcryptjs')

export async function bcryptCompare(password: any, hash: any) {
    return await bcrypt.compare(password, hash);
}