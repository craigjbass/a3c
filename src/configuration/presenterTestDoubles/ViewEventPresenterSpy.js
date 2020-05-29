export class ViewEventPresenterSpy {
  constructor() {
    this.raceSessions = []
    this.nonRaceSessions = []
    this._track = undefined
    this.wasNotFound = false
    this.isDone = false
  }

  raceSession(session) {
    this.raceSessions.push(session)
  }

  nonRaceSession(session) {
    this.nonRaceSessions.push(session)
  }

  track(track) {
    this._track = track
  }

  notFound() {
    this.wasNotFound = true
  }

  done(eventName) {
    this.isDone = true
    this.eventName = eventName
  }
}