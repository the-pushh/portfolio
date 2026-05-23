import { Layout } from "../components/Layout";
import bubble from "../assets/svgs/bubble.svg";
import { contacts, calendlyUrl } from "../data";
import { Contact as Cntct } from "../types";
import { PrimaryBtn } from "../components/PrimaryBtn";

const Contact = ({ id }: { id: string }) => (
	<Layout id={id} icon={bubble} title="my socials & contact.">
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10 mt-10 md:px-10 mx-3 lg:mx-0 lg:pl-1">
			{contacts.map((contact: Cntct, index: number) => (
				<div
					className="flex justify-between gap-3 border-b border-dark/50 border-dashed pb-1 px-2 text-lg"
					key={index}>
					<p className="font-thin">{contact.name}</p>
					<PrimaryBtn to={contact.to} label={contact.displayName} />
				</div>
			))}
		</div>
		<span className="flex text-2xl ml-2 md:px-10 lg:px-7 lg:mx-0 lg:pl-1 px-3">
			Get in touch. Schedule a call
			<PrimaryBtn className="ml-1" to={calendlyUrl} label="here" />
		</span>
	</Layout>
);

export default Contact;