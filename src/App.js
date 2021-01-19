import React from 'react'
import { setConfig, cold } from 'react-hot-loader'
import App from './pages/app'

setConfig({
  hotHooks: true,
  onComponentRegister: (type, name, file) => file.indexOf('node_modules') > 0 && cold(type),
  onComponentCreate: (type, name) => {
    const nodeModules = name.indexOf('styled') > 0 && cold(type)
    const hooks = (String(type).indexOf('useState') > 0
        || String(type).indexOf('useEffect') > 0)
      && cold(type)
    return nodeModules || hooks
  }
})

export default App
