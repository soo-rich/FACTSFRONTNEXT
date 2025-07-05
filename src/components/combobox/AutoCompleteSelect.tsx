"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { cn } from "@/lib/utils"
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react"
import * as React from 'react'
import { useEffect } from 'react'


type AutoCompleteSelectProps = {
	element: { id: string, label: string }[]
	onChange: (value: string) => void
	onSelect: (value: string) => void
}

const AutoCompleteSelect = ({ element,  onChange, onSelect }: AutoCompleteSelectProps) => {
	const [open, setOpen] = React.useState(false)
	const [valueInput, setValueInput] = React.useState("")

	useEffect(() => {
		const handletimer = setTimeout(() => {
			onChange?.(valueInput)
		}, 1500)

		return () => {
			clearTimeout(handletimer);
		};
	}, [valueInput]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
				>
					{valueInput
						? element.find((element) => element.label.includes(valueInput))?.label
						: "Selectionner un  Item..."}
					<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className=" p-0">
				<Command>

					<CommandInput placeholder="Recherche un element..." value={valueInput} onValueChange={setValueInput} />
					<CommandList>
						<CommandEmpty>Aucun Element.</CommandEmpty>
						<CommandGroup>
							{element.map((el) => (
								<CommandItem
									key={el.id}
									value={el.label}
									onSelect={(currentValue) => {
										onSelect?.(el.id)
										setValueInput(currentValue)
										setOpen(false)
									}}
								>
									<CheckIcon
										className={cn(
											"mr-2 h-4 w-4",
											valueInput === el.label ? "opacity-100" : "opacity-0",
										)}
									/>
									{el.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}

export { AutoCompleteSelect }