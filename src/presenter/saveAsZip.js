import {saveAs} from 'file-saver';
import JSZip from "jszip";

export default {
  configurationFiles: (configuration) => {
    const zipFile = new JSZip();
    Object.entries(configuration).forEach(([fileName, content]) => {
      zipFile.file(fileName, JSON.stringify(content))
    })
    zipFile.generateAsync({type: "blob"})
      .then(function (content) {
        saveAs(content, "ACC-Config.zip");
      })
  }
}
