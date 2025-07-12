const path = require('path');
const db = require(path.resolve(__dirname, '../config/db.js'))

exports.get = (req, res) => {
    try {
        const json = db.get('rug')
        return res.status(200).json(json);

    } catch (err) {
        console.error('[ROS] 예외 발생:', err);
        return res.status(500).json({ message: '서버 내부 오류', error: err.toString() });
    }
}