class Pubsub {
  private topics = {};

  private subUid = -1;

  public publish(topic, args) {
    if (!this.topics[topic]) {
      return false;
    }

    const subscribers = this.topics[topic];
    let len = subscribers ? subscribers.length : 0;

    while (len--) {
      subscribers[len].func(topic, args);
    }

    return this;
  }

  public subscribe(topic, func) {
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }

    const token = (++this.subUid).toString();
    this.topics[topic].push({
      token: token,
      func: func,
    });

    return token;
  }

  public unsubscribe(token) {
    for (const m in this.topics) {
      if (this.topics[m]) {
        for (let i = 0, j = this.topics[m].length; i < j; i++) {
          if (this.topics[m][i].token === token) {
            this.topics[m].splice(i, 1);
            return token;
          }
        }
      }
    }
  }
}

const pubsub = new Pubsub();

const messageLogger = function (topics, data) {
  console.log(`Logging: ${topics}: ${data}`);
};

const token = pubsub.subscribe("inbox/newMessage", messageLogger);

pubsub.publish("inbox/newMessage", "hello world!");
pubsub.unsubscribe(token);
pubsub.publish("inbox/newMessage", "Are you still there?");
