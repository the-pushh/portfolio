import { Skill } from "../types";

export const SkillsList = ({ title, skills }: { title: string; skills: Skill[] }) => (
	<div className="flex flex-col flex-1 px-3">
		<h3 className="text-xl font-semibold border-b border-dark/50 border-dashed pb-1">
			{title}
		</h3>
		<ul className="list-disc ml-4 my-2">
			{skills.map((skill: Skill, index: number) => (
				<li key={index}>{skill.name}</li>
			))}
		</ul>
	</div>
);