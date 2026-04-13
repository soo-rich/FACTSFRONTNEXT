'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

// Next Imports
import { useParams, usePathname } from 'next/navigation'

// MUI Imports
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import classnames from 'classnames'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'cmdk'
import { Title, Description } from '@radix-ui/react-dialog'

// Type Imports
import { useQuery } from '@tanstack/react-query'

import type { Locale } from '@configs/i18n'

// Component Imports

import NoResult from './NoResult'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import './styles.css'
import { DocumentService } from '@/service/document/document.service'
import EmptyData from '@/components/EmptyData'

// Data Imports




type SearchItemProps = {
  children: ReactNode
  shortcut?: string
  value: string
  url: string
  currentPath: string
  onSelect?: () => void
}

// Transform the data to group items by their sections


// SearchItem Component for introduce the shortcut keys
const SearchItem = ({ children, shortcut, value, currentPath, url, onSelect = () => {} }: SearchItemProps) => {
  return (
    <CommandItem
      onSelect={onSelect}
      value={value}
      className={classnames('mli-2 mbe-px last:mbe-0 rounded', {
        'active-searchItem': currentPath === url
      })}
    >
      {children}
      {shortcut && (
        <div cmdk-vercel-shortcuts=''>
          {shortcut.split(' ').map(key => {
            return <kbd key={key}>{key}</kbd>
          })}
        </div>
      )}
    </CommandItem>
  )
}



// Footer component for the search menu
const CommandFooter = () => {
  return (
    <div cmdk-footer=''>
      <div className='flex items-center gap-1'>
        <kbd>
          <i className='tabler-arrow-up text-base' />
        </kbd>
        <kbd>
          <i className='tabler-arrow-down text-base' />
        </kbd>
        <span>to navigate</span>
      </div>
      <div className='flex items-center gap-1'>
        <kbd>
          <i className='tabler-corner-down-left text-base' />
        </kbd>
        <span>to open</span>
      </div>
      <div className='flex items-center gap-1'>
        <kbd>esc</kbd>
        <span>to close</span>
      </div>
    </div>
  )
}

const NavSearch = () => {
  // States
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  // Hooks

  const pathName = usePathname()
  const { settings } = useSettings()
  const { lang: locale } = useParams()
  const { isBreakpointReached } = useVerticalNav()

  // When an item is selected from the search results

  const queryKey = useMemo(() => ['search', searchValue], [searchValue])

  const { data: limitedData } = useQuery({
    queryKey,
    queryFn: async () => {
      return (await DocumentService.getDocument(searchValue)).map(document => ({
        id: document.id,
        name: document.numero,
        url: `/documents/${document.numero}`,
        icon: 'tabler-file',
        shortcut: 'Enter'
      }))
    },
    enabled: !!searchValue
  })

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)

    return () => document.removeEventListener('keydown', down)
  }, [])

  // Reset the search value when the menu is closed
  useEffect(() => {
    if (!open && searchValue !== '') {
      setSearchValue('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <>
      {isBreakpointReached || settings.layout === 'horizontal' ? (
        <IconButton className='text-textPrimary' onClick={() => setOpen(true)}>
          <i className='tabler-search text-2xl' />
        </IconButton>
      ) : (
        <div className='flex items-center gap-2 cursor-pointer' onClick={() => setOpen(true)}>
          <IconButton className='text-textPrimary' onClick={() => setOpen(true)}>
            <i className='tabler-search text-2xl' />
          </IconButton>
          <div className='whitespace-nowrap select-none text-textDisabled'>Search ⌘K</div>
        </div>
      )}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div className='flex items-center justify-between border-be pli-4 plb-3 gap-2'>
          <Title hidden />
          <Description hidden />
          <i className='tabler-search' />
          <CommandInput value={searchValue} onValueChange={setSearchValue} />
          <span className='text-textDisabled'>[esc]</span>
          <i className='tabler-x cursor-pointer' onClick={() => setOpen(false)} />
        </div>
        <CommandList>
          {searchValue && limitedData ? (
            limitedData.length > 0 ? (
              limitedData?.map((section, index) => (
                <CommandGroup key={index} heading={section.name.toUpperCase()} className='text-xs'>
                  <SearchItem
                    shortcut={section.shortcut}
                    key={index}
                    currentPath={pathName}
                    url={getLocalizedUrl(section.url, locale as Locale)}
                    value={`${section.name} ${section.shortcut}`}
                  >
                    {section.icon && <i className={classnames('text-xl', section.icon)} />}
                    {section.name}
                  </SearchItem>
                </CommandGroup>
              ))
            ) : (
              <CommandEmpty>
                <NoResult searchValue={searchValue} setOpen={setOpen} />
              </CommandEmpty>
            )
          ) : (
            <EmptyData />
          )}
        </CommandList>
        <CommandFooter />
      </CommandDialog>
    </>
  )
}

export default NavSearch
