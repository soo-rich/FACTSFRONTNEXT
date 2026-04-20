// Third-party Imports
import classnames from 'classnames'



// Component Imports
import NavToggle from './NavToggle'
import NavSearch from '@components/layout/shared/search'
import LanguageDropdown from '@components/layout/shared/LanguageDropdown'
import ModeDropdown from '@components/layout/shared/ModeDropdown'

import UserDropdown from '@components/layout/shared/UserDropdown'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'


const NavbarContent = () => {
  return (
    <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
      <div className='flex items-center gap-4'>
        <NavToggle />
        <span id='tour-search'>
          <NavSearch />
        </span>
      </div>
      <div className='flex items-center'>
        <LanguageDropdown />
        <span id='tour-mode'>
          <ModeDropdown />
        </span>

        <span id='tour-user'>
          <UserDropdown />
        </span>
      </div>
    </div>
  )
}

export default NavbarContent
