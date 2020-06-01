import React from 'react'
import {FormGroup, H1, InputGroup, NumericInput} from "@blueprintjs/core";

export default ({Layout}) => () => <Layout>
  <H1>Server settings</H1>

  <FormGroup label="Server name"
             labelFor="server-name">
    <InputGroup id="server-name"
      disabled={true}
                large={true}
                defaultValue="ACC Server (please edit settings.json)"
      fill={false} />
  </FormGroup>
  <FormGroup label="Admin Password"
             labelFor="admin-password">
    <InputGroup id="admin-password"
                disabled={true}
                large={true}
                defaultValue=""
                fill={false} />
  </FormGroup>
  <FormGroup label="UDP Port"
             labelFor="udp-port">
    <NumericInput id="udp-port"
                  value={9231}
                  large={true}
                  buttonPosition="none"
                  disabled={true}/>
  </FormGroup>
  <FormGroup label="TCP Port"
             labelFor="tcp-port">
    <NumericInput id="tcp-port"
                  value={9232}
                  large={true}
                  buttonPosition="none"
                  disabled={true}/>
  </FormGroup>
  <FormGroup label="Maximum Connections"
             labelFor="max-connections">
    <NumericInput id="max-connections"
                  value={85}
                  large={true}
                  buttonPosition="none"
                  disabled={true}/>
  </FormGroup>
</Layout>