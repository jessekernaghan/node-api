// @flow


export type EventType {
  id: string,
  streamId: string,
  eventName: string,
  payload: { [string]: string }
  timestamp: Date
}
