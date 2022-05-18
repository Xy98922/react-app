import React, {Suspense} from 'react'
import 'antd/dist/antd.less';
import {useRoutes} from 'react-router-dom';
import routes from './pages/routers';


export default function App() {
    const element=useRoutes(routes);
  return (
    <>{element}</>                          
  )
}
