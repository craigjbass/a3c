import {saveAs} from 'file-saver';
import JSZip from "jszip";

export default {
  configurationFiles: (configuration, eventName) => {
    const zipFile = new JSZip();
    Object.entries(configuration).forEach(([fileName, content]) => {
      zipFile.file(fileName, JSON.stringify(content, null, 2))
    })
    zipFile.generateAsync({type: "blob"})
      .then(function (content) {
        saveAs(content, `${eventName}-ACC-Config.zip`);
      })
  }
}
