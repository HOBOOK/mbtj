const ROSLIB = require('roslib');
const { getRosInstance, activeTopics } = require('../config/ros');
const socket = require('../socket.js')

exports.getSubscribedTopics = (req, res) => {
  const topicNames = Object.keys(activeTopics);
  res.json(topicNames);
};

exports.getPublishedTopics = (req, res) => {
  try {
    const ros = getRosInstance();

    ros.getTopics((topics) => {
      return res.status(200).json(topics);
    }, (err) => {
      console.error('[ROS] 토픽 조회 실패:', err);
      return res.status(500).json({ message: 'ROS 토픽 조회 실패', error: err.toString() });
    });

  } catch (err) {
    console.error('[ROS] 예외 발생:', err);
    return res.status(500).json({ message: '서버 내부 오류', error: err.toString() });
  }
}

exports.subscribe = (req, res) => {
  const { topic, type } = req.body;

  if(!topic || !type) {
    return res.status(400).json({message: '필수 파라미터 누락'})
  }

  const ros = getRosInstance();
  if (activeTopics[topic]) {
    return res.status(200).json({ message: `이미 구독독된 토픽: ${topic}` });
  }

  const topicObj = new ROSLIB.Topic({
    ros,
    name: topic,
    messageType: type,
  });

  topicObj.subscribe((msg) => {
    if(socket){
      socket.emit('ros', {topic, msg})
    }
  });

  activeTopics[topic] = topicObj;

  return res.json({ message: `구독됨: ${topic}` });
};

exports.unsubscribe = (req, res) => {
  const { topic } = req.body;

  const topicObj = activeTopics[topic];
  if (!topicObj) {
    return res.status(404).json({ message: `구독되지 않음: ${topic}` });
  }

  topicObj.unsubscribe();
  delete activeTopics[topic];

  return res.json({ message: `구독 해지됨: ${topic}` });
};
