//Navigate 新重定向;Routes必须要功能相当于Switch;useRoutes路由表
import { Navigate } from "react-router-dom"

import Admin from "../admin"
import Login from "../login"
import Home from "../admin/home"
import User from "../user"
import Detail from "../admin/product/detail"
import  { Edit,Category } from "../admin/product"
import Role from "../admin/role"
import {Pie,Bar,Line} from "../admin/chart"
 export default [
        {
          path:'/admin/:id',
          element:<Admin/>,
          children:[
            {
              path:'home',
              element:<Home/>
            },
            {
              path:'user',
              element:<User/>
            },
            {
              path:'category',
              element:<Category/>
            },
            {
              path:'edit',
              element:<Edit/>,                
            },
            {
              path:'detail',
              element:<Detail/>
            },
            {
              path:'role',
              element:<Role/>
            },
            {
              path:'line',
              element:<Line/>
            },
            {
              path:'bar',
              element:<Bar/>
            },
            {
              path:'pie',
              element:<Pie/>
            },
            {
              path:'',
              element:<Navigate to='/admin/:id/home'/>
            },
          ]
        },
        {
          path:'/admin',
          element:<Admin/>
        },
       {
        path:'/login',
        element:<Login/>
        },
        {
          path:'/',
          element:<Navigate to='/login'/>
        },
      ]