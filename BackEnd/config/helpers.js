const Mysqli = require('mysqli');

let conn = new Mysqli({
    host: `localhost`,
    post: `3306`,
    user: `mega_user`,
    passwd: `123456`,
    db: `mega_shop`
})

let db = conn.emit(false, ``);

module.exports = {
    database: db
}
