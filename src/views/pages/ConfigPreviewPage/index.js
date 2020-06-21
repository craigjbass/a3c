import React, {useState, useEffect} from 'react'
import {AnchorButton, Tab, Tabs, Pre} from "@blueprintjs/core";

export default ({Layout, exportConfiguration, navigate}) => {
  const back = (id) => navigate(`/events/${id}`)

  return ({id}) => {
    const [configuration, setConfiguration] = useState(undefined)
    useEffect(() => {
      if (configuration !== undefined) return;
      exportConfiguration({event_id: id}, {
        configurationFiles: (files) => setConfiguration(files)
      })
    }, [configuration, id])

    if (configuration === undefined) return <></>

    return <Layout contextual={<AnchorButton icon={"arrow-left"} minimal={true} onClick={() => back(id)}>Back</AnchorButton>}>
      <Tabs>
        {Object.entries(configuration).map(([fileName, contents]) => {
          return <Tab key={fileName} id={fileName} title={fileName} panel={<Pre>
            {JSON.stringify(contents, null, 2)}
          </Pre>}/>
        })}
      </Tabs>
    </Layout>;
  };
}
