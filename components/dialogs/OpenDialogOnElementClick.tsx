'use client'

import type {ComponentType} from 'react'
// React Imports
import {useState} from 'react'

export type OpenDialogOnElementClickProps = {
    element: ComponentType<any>
    dialog: ComponentType<any>
    elementProps?: any
    dialogProps?: any
}

const OpenDialogOnElementClick = (props: OpenDialogOnElementClickProps) => {
    // Props
    const {element: Element, dialog: Dialog, elementProps, dialogProps} = props

    // States
    const [open, setOpen] = useState(false)

    // Extract onClick from elementProps
    const {onClick: elementOnClick, ...restElementProps} = elementProps

    // Handle onClick event
    const handleOnClick = (e: MouseEvent) => {
        elementOnClick && elementOnClick(e)
        setOpen(true)
    }
    return (
        <>
            <Element onClik={handleOnClick} {...restElementProps} />
            <Dialog open={open} onClose={() => setOpen(false)} {...dialogProps} />
        </>
    )

}

export default OpenDialogOnElementClick