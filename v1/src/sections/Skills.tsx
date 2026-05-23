import { useMemo } from "react";
import { Layout } from "../components/Layout";
import shapes from "../assets/svgs/shapes.svg";
import { skills } from "../data";
import { SkillsList } from "../components/SkillsList";
import { Skill } from "../types";

const Skills = ({id}: {id: string}) => {
	const frontend = useMemo(
		() => skills.filter((skill: Skill) => skill.type === "frontend"),
		[],
	);
	const backend = useMemo(
		() => skills.filter((skill: Skill) => skill.type === "backend"),
		[],
	);
	const database = useMemo(
		() => skills.filter((skill: Skill) => skill.type === "database"),
		[],
	);
	const web3 = useMemo(
		() => skills.filter((skill: Skill) => skill.type === "web3"),
		[],
	);
	const misc = useMemo(
		() => skills.filter((skill: Skill) => skill.type === "misc"),
		[],
	);

	return (
		<Layout id={id} icon={shapes} title="my toolbox.">
			<div className="grid grid-cols-2 md:grid-cols-4 px-3 md:px-10 mt-5 text-left w-full gap-3 md:mt-5 lg:mx-0 lg:pl-1">
				<SkillsList title="Frontend" skills={frontend} />
				<SkillsList title="Backend" skills={backend} />
				<SkillsList title="Databases" skills={database} />
				<SkillsList title="Web3" skills={web3} />
			</div>
			<div className="ml-3 mt-2 text-left md:ml-10 lg:ml-3 lg:pl-1">
				I also have experience with{" "}
				<span className="font-semibold">{misc[0].name}</span>{" "}
				{misc.slice(1, misc.length - 1).map((skill: Skill, index: number) => (
					<span key={index} className="font-semibold">
						, {skill.name}
					</span>
				))}
				{" &"}
				<span className="font-semibold"> {misc[misc.length - 1].name}</span>
			</div>
		</Layout>
	);
};

export default Skills;