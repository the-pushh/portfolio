import { cn } from "../utils";
import arrow from "../assets/svgs/arrow.svg";

export const PrimaryBtn = ({
	to,
	className,
	label,
}: {
	to: string;
	className?: string;
	label: string;
}) => (
	<a
		className={cn("group flex items-center no-underline select-none", className)}
		href={to}
		target="_blank"
		rel="noopener noreferrer">
		<span className="underline font-medium underline-offset-1 group-hover:underline-offset-2 ease-in-out transition-all duration-200">
			{label}
		</span>
		<img
			src={arrow}
			alt="arrow"
			className="h-4 ml-[0.1rem] group-hover:rotate-[-5deg] ease-in-out transition-all duration-200"
		/>
	</a>
);