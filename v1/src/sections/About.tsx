import { Layout } from "../components/Layout";
import home from "../assets/svgs/home.svg";
import { aboutMe } from "../data";
import { EmphasisedText } from "../components/EmphasisedText";

const About = () => (
	<Layout icon={home} title="about me.">
    <EmphasisedText className="text-xl mt-3 lg:pr-[12rem] md:pr-0 md:px-5 lg:max-w-[85ch] md:max-w-[60ch] md:mx-auto lg:mx-0 lg:pl-1" text={aboutMe} />
	</Layout>
);

export default About;