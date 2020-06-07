import { v4 as uuidv4 } from "uuid";

interface ISubscriber {
  token: string;
  func: Function;
}

class Pubsub {
  private topics: { [key: string]: ISubscriber[] } = {};

  public publish(topic: string, args: any) {
    if (!this.topics[topic]) {
      return false;
    }

    const subscribers = this.topics[topic];
    let len = subscribers ? subscribers.length : 0;

    while (len--) {
      subscribers[len].func(topic, args);
    }
  }

  public subscribe(topic, func): string {
    if (!this.topics[topic]) {
      this.topics[topic] = [];
    }

    const token = uuidv4();
    this.topics[topic].push({
      token: token,
      func: func,
    });

    return token;
  }

  public unsubscribe(token): string {
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
