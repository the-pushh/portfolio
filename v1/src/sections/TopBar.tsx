import { PrimaryBtn } from "../components/PrimaryBtn";
import resume from "../assets/Pushkar_Borkar_Resume.pdf";
import { useState, useEffect } from "react";

const TopBar = () => {
	const [today, setDate] = useState<Date>(new Date());
	useEffect(() => {
		const timer = setInterval(() => {
			setDate(new Date());
		}, 60 * 1000);
		return () => {
			clearInterval(timer);
		};
	}, []);
	return (
		<div className="fixed px-10 w-full border-b border-dark z-20 bg-light h-[2.5rem] flex justify-center items-center">
			<div className="flex w-full items-center justify-between max-w-[120ch] mx-auto text-sm font-light">
				<p>
					Pune, <span className="font-medium">India</span>
				</p>
				<p>
					<span className="font-medium">
						{today.toLocaleTimeString("en-IN", {
							timeZone: "IST",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</span>{" "}
					|{" "}
					<span>
						{today.toLocaleDateString("en-IN", {
							timeZone: "IST",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</span>
				</p>
				<div className="flex items-center gap-2">
					<PrimaryBtn label="email" to="mailto:pushkarborkar1809@gmail.com" />
					<PrimaryBtn label="resume" to={resume} />
				</div>
			</div>
		</div>
	);
};

export default TopBar;