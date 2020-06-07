const pubsub = {
  publish: undefined,
  subscribe: undefined,
  unsubscribe: undefined,
};

(function (myObject) {
  const topics = {};

  let subUid = -1;

  myObject.publish = function (topic, args) {
    if (!topics[topic]) {
      return false;
    }

    const subscribers = topics[topic];
    let len = subscribers ? subscribers.length : 0;

    while (len--) {
      subscribers[len].func(topic, args);
    }

    return this;
  };

  myObject.subscribe = function (topic, func) {
    if (!topics[topic]) {
      topics[topic] = [];
    }

    const token = (++subUid).toString();
    topics[topic].push({
      token: token,
      func: func,
    });

    return token;
  };

  myObject.unsubscribe = function (token) {
    for (const m in topics) {
      if (topics[m]) {
        for (let i = 0, j = topics[m].length; i < j; i++) {
          if (topics[m][i].token === token) {
            topics[m].splice(i, 1);
            return token;
          }
        }
      }
    }
  };
})(pubsub);

const messageLogger = function (topics, data) {
  console.log(`Logging: ${topics}: ${data}`);
};

const token = pubsub.subscribe("inbox/newMessage", messageLogger);

pubsub.publish("inbox/newMessage", "hello world!");
pubsub.unsubscribe(token);
pubsub.publish("inbox/newMessage", "Are you still there?");
