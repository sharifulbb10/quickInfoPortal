import React, { useState, useEffect} from 'react'
import styles from './Menu.module.css'

export default function RightTopMenu() {

	const [clicked, setClicked] = useState(false);

	function handleClick() {
		setClicked(!clicked);
		console.log(clicked);
	}

	return (
		<div className="relative m-9 text-white">
			<div className="absolute z-2">
				<div className="w-10 h-10 bg-black flex flex-col justify-center items-center relative" onClick={handleClick}>
					<div className={`${clicked ? styles.animate1: styles.reverseAnimate1} w-7 h-[2px] bg-white absolute top-[40%]`}></div>
					<div className={`${clicked ? styles.animate2: styles.reverseAnimate2} w-7 h-[2px] bg-white absolute top-[60%]`}></div>
				</div>
			</div>
			<div className={`${clicked ? styles.menuOpen: styles.menuClose} z-1 bg-black flex flex-col justify-center items-center absolute`}>
				<div>
					<div className={`${clicked ? styles.link1: styles.link1Close} px-8 py-1 m-3 bg-white text-black hover:text-blue-500 rounded`}><a href="#">Link 1</a></div>
					<div className={`${clicked ? styles.link2: styles.link2Close} px-8 py-1 m-3 bg-white text-black hover:text-blue-500 rounded`}><a href="#">Link 2</a></div>
					<div className={`${clicked ? styles.link3: styles.link3Close} px-8 py-1 m-3 bg-white text-black hover:text-blue-500 rounded`}><a href="#">Link 3</a></div>
					<div className={`${clicked ? styles.link4: styles.link4Close} px-8 py-1 m-3 bg-white text-black hover:text-blue-500 rounded`}><a href="#">Link 4</a></div>
					<div className={`${clicked ? styles.link5: styles.link5Close} px-8 py-1 m-3 bg-white text-black hover:text-blue-500 rounded`}><a href="#">Link 5</a></div>
				</div>
				
			</div>
		</div>
	)
}