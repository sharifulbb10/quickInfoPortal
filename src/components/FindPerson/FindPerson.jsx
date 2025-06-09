import React, { useState, useEffect, useRef } from 'react';
import styles from './FindPerson.module.css';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Menu from '../menu/Menu.jsx';

function FindPerson() {
	const [data, setData] = useState([]);
	const [searched, setSearched] = useState(''); // for name search
	const [searched2, setSearched2] = useState(''); // for village search
	const [matched, setMatched] = useState([]);
	const [isFetched, setIsFetched] = useState(false); // FIXED
	const [currentSearch, setCurrentSearch] = useState(''); // 'name' or 'village'
	const [isExpanded, setIsExpanded] = useState(false); // for expandable nav bar

	useEffect(() => {
		async function fetchSheetData() {
			try {
				const response = await fetch('https://docs.google.com/spreadsheets/d/1AAe2XYIYyy-mtbcsaOMpyemnaU6xaVkuElRg3yJli7Y/gviz/tq?tqx=out:json');
				const text = await response.text();
				const json = JSON.parse(text.substring(47).slice(0, -2));
				const rows = json.table.rows.map(row => row.c.map(cell => cell ? cell.v : ''));
				setData(rows);
				rows.length? setIsFetched(true): setIsFetched(false);
			} catch (error) {
				setIsFetched(false);
				console.log(error);
			}
		}

		fetchSheetData();
	}, []);

	function handleChange(e) {
		setCurrentSearch('name');
		const inputValue = e.target.value;
		setSearched(inputValue);
		setSearched2('');

		if (inputValue.length === 0) {
			setMatched([]);
			return;
		}

		const filtered = data.filter(row => row[1]?.toLowerCase().startsWith(inputValue.toLowerCase()));
		setMatched(filtered);
	}

	function handleChangeVillage(e) {
		setCurrentSearch('village')
		const inputValue = e.target.value;
		setSearched2(inputValue);
		setSearched('');

		if (inputValue.length === 0) {
			setMatched([]);
			return;
		}

		const filtered = data.filter(row => row[3]?.toLowerCase().startsWith(inputValue.toLowerCase()));
		setMatched(filtered);
	}
	

	// animation during data fetching

	const boxRef = useRef();
	useGSAP(() => {
        gsap.to(boxRef.current, {
        	rotate: 180,
        opacity: 1,
        duration: 1,
        repeat: -1,
        })
	},{ dependencies: [isFetched], revertOnUpdate: true });

	// animated nav menu
	function handleExpand() {
		setIsExpanded((state)=> {
			const newState = !state;
			!isExpanded ? menuExpanded() : menuClosed();
			return newState;
		});		
	}
	// menu expanded
	function menuExpanded() {
		gsap.to('.line1', {
			rotate: 45,
			y: 4.5,
			duration: 0.5,
		});
		gsap.to('.line2', {
			rotate: -45,
			y: -4.5,
			duration: 0.5,
		});
		gsap.to('.expandableDiv', {
			width: 340,
			height: 400,
			duration: 0.5,
		})
		gsap.to('.insideText', {
			display: 'block',
			delay: 0.4,
		})

	}
	function menuClosed() {
		gsap.to('.line1', {
			rotate: 0,
			y: -0.5,
			duration: 0.8,
		});
		gsap.to('.line2', {
			rotate: 0,
			y: 0.5,
			 duration: 0.8,
		});
		gsap.to('.expandableDiv', {
			width: 0,
			height: 0,
			duration: 0.4,
			delay: 0.4,
		})
		gsap.to('.insideText', {
			display: 'none',
		})
	}

	return (
		<>
			{isFetched ? (
				<div className="bg-sky-950 min-h-screen flex flex-col items-center min-h-[100%] w-[100vw] text-white text-xs md:text-sm relative flex-grow">

					{/*This is the expandable nav bar*/}
					<div className="fixed top-2 right-2 z-3 opacity-90">
						<div className="absolute w-10 h-10 bg-black flex flex-col justify-center items-center gap-2 top-0 right-0" onClick={handleExpand}>
							<div className="line1 w-7 h-[2px] bg-white"></div>
							<div className="line2 w-7 h-[2px] bg-white"></div>
						</div>
						<div className="expandableDiv bg-black w-0 h-0 top-0 right-0 flex justify-center items-center">
							<div className="insideText hidden p-3 text-center">
								<span className="">
									<span className="font-semibold">দ্রষ্টব্য:</span> যদি ২০১৬ ব্যাচের কেউ তথ্য না দিয়ে থাকো, তাহলে এই <span className="font-semibold text-green-700">ফরমে</span> গিয়ে তথ্য পুরণ করো। আর তথ্য দিয়ে থাকলে ২য় বার তথ্য দেওয়ার দরকার নেই। 
									<a href="https://forms.gle/YDBxCizUDqNxt6hW6"><div className="w-[80%] h-9 bg-green-800 mx-[auto] mt-4 rounded flex justify-center items-center cursor-pointer">Google Form</div></a>
									<span className="block text-xs opacity-80 mt-12">@Kaktarua, Shah Rahat Ali High School</span>
								</span>
							</div>
						</div>
					</div>

					{/*This the main page content	*/}
					<div className="flex justify-center flex-col mb-5 absolute top-5">
						<p className="self-center font-light text-lg text-green-600">Batch 2016</p>
						<p className="self-center font-light text-lg">Quick Info Portal</p>
					</div>

					<form className="absolute top-24">
						<label className="p-2" htmlFor="name">Search by name:</label>
						<input
							type="text"
							id="name"
							onChange={handleChange}
							value={searched}
							className="border p-2 rounded"
						/>
					</form>

					<div className="mt-4 absolute top-50 z-1">
						{matched.length && currentSearch === 'name' ? (
							matched.map((item, index) => (
								<div key={index} className="flex justify-self-start mb-2">
									<p className="bg-green-950 px-3 mx-2 rounded">
										<span>Name: <span className="text-green-600">{item[1]}</span></span>,
										<span className="ml-2">Phone No: <span className="text-green-600">{item[2]}</span></span>,
										<span className="ml-2">Village: <span className="text-green-600">{item[3]}</span></span>
										<span className="ml-2">Is_Migrant: <span className="text-green-600">{item[4]}</span></span>
										<span className="ml-2">Additional No: <span className="text-green-600">{item[5]}</span></span>
									</p>
								</div>
							))
						) : searched && (
							<div className="flex justify-self-start">No match found!</div>
						)}
					</div>

					<div className="absolute top-32">
						<form className="mt-4">
						<label className="p-2" htmlFor="village">Search by village:</label>
						<input
							type="text"
							id="village"
							onChange={handleChangeVillage}
							value={searched2}
							className="border p-2 rounded"
						/>
					</form>
					</div>
					<div className="mt-4 absolute top-50 z-1">
						{matched.length && currentSearch === 'village' ? (
							matched.map((item, index) => (
								<div key={index} className="flex justify-self-start mb-2">
									<p className="bg-green-950 px-3 mx-2 rounded">
										<span className="">Village: <span className="text-green-600">{item[3]}</span></span>
										<span className="ml-2">Name: <span className="text-green-600">{item[1]}</span></span>,
										<span className="ml-2">Phone No: <span className="text-green-600">{item[2]}</span></span>,
										<span className="ml-2">Is_Migrant: <span className="text-green-600">{item[4]}</span></span>
										<span className="ml-2">Additional No: <span className="text-green-600">{item[5]}</span></span>
									</p>
								</div>
							))
						) : searched2 && (
							<div className="flex justify-self-start">No match found!</div>
						)}
					</div>
					<div className="absolute bottom-2 flex items-center text-xs">@Kaktarua, Shah Rahat Ali High School</div>
				</div>
			) : (
				<div className="beforeDataFetch flex flex-col justify-center items-center h-[100vh] text-white text-sm md:text-xs h-[100vh] bg-sky-950">
					<div className="text-center mt-10">Data is being processed, wait!</div>
					<div ref={boxRef} className={`${styles.animated}`}></div>
					
				</div>
			)}
		</>
	);
}

export default FindPerson;
