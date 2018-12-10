// @flow

function AggregateFactory(aggregate) {

  // need to
  // - rebuild event from events or snapshot
  // - stream events to an event emitter
  // - raise event ( apply then emit event )
  // - apply event
  // - persist and bump version numbers

  function raise(event: Event) {

  }

  function rebuild(events: Array<Event>) {

  }

  function apply(event: Event) {

  }

}

export default AggregateFactory;
