// @flow

/*
 *  pubsub
 *  this abstraction serves as the minimal wrapper around a simple pubsub pattern
 *  which could grow to be a distributed event stream system (like kafka)
 */

import EventEmitter from 'events';

class PubSubEmitter extends EventEmitter {};

const emitter = new PubSubEmitter();


/*
 * publish
 * publish a new event
 */
function publish(eventName, event) {
  emitter.emit(eventName, event);
}

/*
 * subscribe
 * attach a handler to an event by name
 */
function subscribe(eventName, handler) {
  emitter.on(eventName, handler);
}

/*
 * subscribeAll
 * subscribe to all events and filter via switch
 */
function subscribeAll(handler) {
}

/*
 * unsubscribe
 * detach handler from an event by name
 */
function unsubscribe(eventName, handler) {
  emitter.off()
}

/*
 * unsubscribeAll
 * detach handler from all events
 */
function unsubscribeAll(handler) {

}

function connect() {
  return Promise.resolve({
    publish,
    subscribe,
    unsubscribe,
    subscribeAll,
    unsubscribeAll
  });
}

export default {
  connect
}
