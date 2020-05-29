export class ListEventsPresenterSpy {
  constructor() {
    this.events = []
    this.isDone = false
  }

  event(event) {
    this.events.push(event)
  }

  done() {
    this.isDone = true
  }
}