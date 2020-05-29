export class ExportConfigurationPresenterSpy {
  configurationFiles(configuration, eventName) {
    this.configuration = configuration
    this.eventName = eventName
  }
}