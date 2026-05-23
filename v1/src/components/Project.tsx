import { Project as ProjType } from "../types";
import { PrimaryBtn } from "./PrimaryBtn";

export const Project = (props: ProjType) => {
	const { title, displayImageSrc, description, timePeriod, skills, urls } =
		props;
	return (
		<div className="relative group/img flex items-start gap-3 border-b border-dark/50 border-dashed lg:px-10 md:mx-10 mx-3 text-left overflow-hidden lg:mx-0 lg:pl-1">
			<div className="flex flex-col md:flex-row-reverse lg:flex-row items-start lg:items-center gap-3 py-6 md:mt-8 lg:mt-0">
				<img
					src={displayImageSrc}
					alt={title}
					className="lg:opacity-0 w-6/12 md:w-5/12 lg:w-3/12 lg:ml-[-28ch] lg:group-hover/img:opacity-100 lg:group-hover/img:ml-0 transition-all ease-in-out duration-300 rounded-lg border-[0.25rem] border-dark shadow-lg"
				/>
				<div className="md:group-hover/img:ml-3">
					<h3 className="text-xl font-semibold">{title}</h3>
					<p className="text-sm font-thin">{timePeriod}</p>
					<p className="my-3 md:text-sm lg:max-w-[60ch] md:max-w-[45ch]">
						{description}
					</p>
					<div className="flex flex-wrap items-center gap-1">
						{skills.map((skill: string, index: number) => (
							<div
								key={index}
								className="px-2 lg:text-sm text-xs font-medium rounded-full w-fit border-[1.5px] border-dark">
								{skill}
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="absolute flex flex-col items-end md:flex-row lg:flex-col gap-3 lg:gap-1 top-7 right-5 md:right-0 lg:right-5 z-10 lg:group-hover/img:text-xl">
				{urls.map((url: { name: string; to: string }, index: number) => (
					<PrimaryBtn key={index} to={url.to} label={url.name} />
				))}
			</div>
		</div>
	);
};
