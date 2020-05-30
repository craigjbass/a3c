export class ViewEventPresenterSpy {
  constructor() {
    this.raceSessions = []
    this.nonRaceSessions = []
    this._track = undefined
    this.wasNotFound = false
    this.isDone = false
    this._weather = undefined
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

  weather(weather) {
    this._weather = weather
  }

  notFound() {
    this.wasNotFound = true
  }

  done(eventName) {
    this.isDone = true
    this.eventName = eventName
  }
}