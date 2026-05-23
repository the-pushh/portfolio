import asterisk from "../assets/svgs/asterisk.svg";
import { useEffect, useState } from "react";
interface NavLink {
  name: string;
	idName: string;
}

const Nav = () => {
  const navLinks: NavLink[] = [
		{ name: "home", idName: "home" },
		{ name: "experience", idName: "exp" },
		{ name: "projects", idName: "projects" },
		{ name: "skills", idName: "skills" },
		{ name: "connect", idName: "contact" },
	];
  return (
		<nav className="fixed w-full top-[2.5rem] bg-gradient-to-b from-light to-light/0 px-5 z-20 h-[5rem] backdrop-blur-sm">
			<ul className="flex justify-center items-center gap-5 mt-5">
				{navLinks.map(({ name, idName }: NavLink, index: number) => <NavLink name={name} key={index} idName={idName}  />)}
			</ul>
		</nav>
	);
}

interface NavLinkProps {
	idName: string;
	name: string;
}

const NavLink = ({idName, name}: NavLinkProps) => {
	const [isVisible, setIsVisible] = useState(false);
	
	useEffect(() => {
		const element = document.getElementById(idName);
		if(element){
			const observer = new IntersectionObserver((entries) => {
				const entry = entries[0];
				setIsVisible(
					entry.isIntersecting
				);
			}, { threshold: 0.5});
			observer.observe(element)
		}
		return () => {
			setIsVisible(false);
		}
	}, [idName])
	return (
		<li>
			<button
				onClick={() => {
					if (idName === "home") {
						window.scrollTo({
							top: window.screenTop - 100,
							behavior: "smooth",
						});
						return;
					}
					const element = document.getElementById(idName);
					if (element) {
						window.scrollTo({
							top: element?.offsetTop - 50,
							behavior: "smooth",
						});
					}
				}}
				className="relative group text-xl select-none font-thin">
				{name}
				<img
					className={`w-5 ${
						isVisible ? "top-6" : "top-10"
					} absolute right-[35%] animate-slowspin ${
						isVisible ? "opacity-80" : "opacity-0"
					} group-hover:top-6 group-hover:opacity-80 transition-all ease-in-out duration-300`}
					src={asterisk}
					alt="asterisk"
				/>
			</button>
		</li>
	);
}

export default Nav;