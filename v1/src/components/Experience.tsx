import { Experience as ExpType } from "../types";
import { PrimaryBtn } from './PrimaryBtn';

export const Experience = (props: ExpType) => {
  const { role, company, companyLogoSrc, companyUrl, start, end, summary, skills  } = props;
  return (
		<div className="flex text-left items-start gap-3 border-b border-dark/50 border-dashed md:px-0 md:mx-10 mx-3 py-7 lg:mx-0 lg:pl-1">
			<img
				src={companyLogoSrc}
				alt={company}
				className="lg:rounded-xl rounded-lg w-[2.25rem] mt-7 md:mt-0 lg:w-[3rem] md:w-[2.5rem] border-2 border-dark shadow-lg"
			/>
			<div className="flex-1 flex flex-col-reverse md:flex-row md:gap-3 justify-between items-start">
				<div className="md:flex-1">
					<h3 className="text-xl font-semibold">{role}</h3>
					<span className="flex gap-1 opacity-75 md:text-sm">
						at{" "}
						{companyUrl ? (
							<PrimaryBtn to={companyUrl} label={company} />
						) : (
							<span className="font-medium">{company}</span>
						)}
					</span>
					<ul className="list-disc ml-4 my-3 mg:text-sm lg:text-md">
						{summary.map((pt: string, index: number) => (
							<li key={index} className="max-w-[85ch]">
								{pt}
							</li>
						))}
					</ul>
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
				<p className="lg:text-sm text-xs opacity-70 mr-5">
					{start} - {end ? end : "Present"}
				</p>
			</div>
		</div>
	);
}