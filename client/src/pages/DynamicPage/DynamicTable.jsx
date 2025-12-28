import React from 'react'
import DynamicEntityPage from './components/DynamicEntity'
import {useSelector} from 'react-redux'

const DynamicTable = () => {
    const {menus} = useSelector((state) => state.sidebar)

    const dynamicMenus = menus.filter((item) => item.source === 'dynamic')
    const currentMenu = dynamicMenus.find((item) => item.path === window.location.pathname);

    // console.log('menus', menus)
    // console.log('currentMenu', currentMenu)
    // console.log('dynamicMenus', dynamicMenus)


  return (
    <div>
        {/* <DynamicEntityPage formKey={currentMenu?.path} label={currentMenu?.label} /> */}
    </div>
  )
}

export default DynamicTable