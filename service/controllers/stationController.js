
exports.get = (req, res) => {
    try {
        return res.status(200).json(req);
    } catch (err) {
        console.error('[ROS] 예외 발생:', err);
        return res.status(500).json({ message: '서버 내부 오류', error: err.toString() });
    }
}