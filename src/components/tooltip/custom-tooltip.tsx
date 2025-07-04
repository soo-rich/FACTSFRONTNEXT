import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { ChildrenType } from '@/types/types'


const CustomTooltip = ({title, children}:ChildrenType&{title:string}) => {

	return (
		<Tooltip>
			<TooltipTrigger>
				{children}
			</TooltipTrigger>
			<TooltipContent>
				{title}
			</TooltipContent>
		</Tooltip>
	)
}

export default CustomTooltip