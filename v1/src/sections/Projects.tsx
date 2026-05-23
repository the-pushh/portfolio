import { Layout } from "../components/Layout";
import gem from "../assets/svgs/gem.svg";
import { projects } from "../data";
import { Project as ProjType } from "../types";
import { Project } from "../components/Project";
import { PrimaryBtn } from "../components/PrimaryBtn";

const Projects = ({ id }: { id: string }) => (
	<Layout id={id} icon={gem} title="things i have built.">
		{projects.map((proj: ProjType) => (
			<Project key={proj.id} {...proj} />
		))}
		<div className="flex items-center gap-1 my-3 md:ml-10 lg:ml-3">
			View more projects on
			<PrimaryBtn label="GitHub" to="https://github.com/Pushkar1809" />
		</div>
	</Layout>
);

export default Projects;