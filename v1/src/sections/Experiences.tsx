import { Experience } from "../components/Experience";
import { Layout } from "../components/Layout";
import { experiences } from "../data";
import { Experience as ExpType } from '../types';
import pointer from "../assets/svgs/pointer.svg";

const Experiences = ({id}: {id: string}) => (
	<Layout
		id={id}
		icon={pointer}
		title="my experiences."
		iconStyles="mt-[-0.5rem]">
		{experiences.map((exp: ExpType) => (
			<Experience key={exp.id} {...exp} />
		))}
	</Layout>
);

export default Experiences;