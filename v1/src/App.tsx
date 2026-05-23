import { useEffect } from "react";
import headshot from "./assets/images/headshot.png"
import TopBar from "./sections/TopBar.tsx";
import Nav from "./sections/Nav.tsx";
import { EmphasisedText } from './components/EmphasisedText';
import { calendlyUrl, headline } from "./data.ts";
import peace from "./assets/svgs/peace.svg";
import About from "./sections/About.tsx";
import Experiences from './sections/Experiences';
import Projects from "./sections/Projects.tsx";
import Skills from "./sections/Skills.tsx";
import Contact from "./sections/Contact.tsx";
import heart from "./assets/svgs/heart.svg";
import link from "./assets/svgs/arrow-light.svg";

function App() {
	function preloadImage(src: string) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = function () {
				resolve(img);
			};
			img.onerror = img.onabort = function () {
				reject(src);
			};
			img.src = src;
		});
	}

	useEffect(() => {
		preloadImage(headshot);
	}, [])

  return (
		<div className="h-[90vh] md:h-[95vh] flex flex-col w-full overflow-x-hidden scroll-smooth">
			<TopBar />
			<Nav />

			<main className="max-w-[120ch] w-full mx-auto md:pb-[12rem] lg:pb-0">
				<div
					id="home"
					className="flex lg:items-center lg:justify-between w-full lg:mb-[5rem] mb-[3rem] lg:mt-[12rem] mt-[10rem] flex-col-reverse lg:flex-row justify-center items-center">
					<div className="flex flex-col lg:flex-row justify-center items-center">
						<img
							src={peace}
							alt="peace"
							className="w-[5rem] mt-10 lg:mt-[-7rem] animate-wiggle"
						/>
						<div className="mt-0 lg:mt-[5rem] text-center lg:text-left">
							<h1 className="text-[2.75rem] font-semibold">
								Hey, I am Pushkar.
							</h1>
							<EmphasisedText className="text-xl " text={headline} />
							<div className="relative w-11/12 mx-auto lg:mx-0 max-w-[62ch] bg-orange-200 mt-5 rounded-2xl bg-opacity-50 p-5 shadow">
								<p className="text-sm leading-1 mb-3">
									I am currently open for full-time roles combining design
									engineering with frontend and backend development. Eager to
									join a collaborative team crafting exceptional products. Let's
									meet!
								</p>
								<a
									href={calendlyUrl}
									target="_blank"
									rel="noreferrer noopener"
									className="group bg-gradient-to-b w-fit from-dark/70 to-dark active:to-dark/80 active:from-dark text-light py-2 px-3 mt-3 rounded-lg text-sm font-medium border border-ridge border-slate-600 shadow-lg transition-all ease-in-out duration-300 selection-none flex justify-center items-center gap-1 mx-auto lg:mx-0">
									Schedule a quick connect
									<img
										src={link}
										alt="link"
										className="w-3 h-3 opacity-0 mr-[-1rem] group-hover:opacity-100 group-hover:mr-0 transition-all ease-in-out duration-300"
									/>
								</a>
								<div className="absolute bottom-5 right-5 h-3 w-3 rounded-full bg-gradient-to-br from-green-400 to-green-600 animate-pulse" />
							</div>
						</div>
					</div>
					<img
						className="w-7/12 md:w-4/12 rounded-[3rem] border-[0.35rem] border-dark shadow-xl rotate-6"
						src={headshot}
						alt="me"
					/>
				</div>
				{/* Intro / Summary */}
				<About />
				{/* Work */}
				<Experiences id="exp" />
				{/* Projects */}
				<Projects id="projects" />
				{/* Skills */}
				<Skills id="skills" />
				{/* Links and Contact */}
				<Contact id="contact" />
				<img
					src={heart}
					alt="heart"
					className="mt-3 mb-10 mx-auto lg:mx-0 lg:ml-auto"
				/>
			</main>
		</div>
	);
}

export default App;
