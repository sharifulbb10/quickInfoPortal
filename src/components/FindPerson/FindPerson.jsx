import React, { useState, useEffect, useRef } from 'react';
import styles from './FindPerson.module.css';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function FindPerson() {
	const [data, setData] = useState([]);
	const [searched, setSearched] = useState(''); // for name search
	const [searched2, setSearched2] = useState(''); // for village search
	const [matched, setMatched] = useState([]);
	const [isFetched, setIsFetched] = useState(false); // FIXED
	const [currentSearch, setCurrentSearch] = useState(''); // 'name' or 'village'

	useEffect(() => {
		async function fetchSheetData() {
			try {
				const response = await fetch('https://docs.google.com/spreadsheets/d/1AAe2XYIYyy-mtbcsaOMpyemnaU6xaVkuElRg3yJli7Y/gviz/tq?tqx=out:json');
				const text = await response.text();
				const json = JSON.parse(text.substring(47).slice(0, -2));
				const rows = json.table.rows.map(row => row.c.map(cell => cell ? cell.v : ''));
				setData(rows);
				console.log(rows);
				setIsFetched(true);
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

	const target = useRef(null);

	useGSAP(()=>{
		gsap.to(target.current, {
			rotate: 180,
			opacity: 1,
			duration: 1,
			repeat: -1,
		})
	},[])

	return (
		<>
			{isFetched ? (
				<div className="flex flex-col items-center min-h-[120vh] text-white text-sm md:text-xs bg-sky-950 relative">
					
					<div className="flex justify-center flex-col mb-5 absolute top-5">
						<p className="self-center">Batch 2016</p>
						<p className="self-center font-bold text-lg">Quick Info Portal</p>
					</div>

					<form className="absolute top-20">
						<label className="p-2" htmlFor="name">Search by name:</label>
						<input
							type="text"
							id="name"
							onChange={handleChange}
							value={searched}
							className="border p-2 rounded"
						/>
					</form>

					<div className="mt-4 absolute top-50">
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

					<div className="absolute top-30">
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
					<div className="mt-4 absolute top-50">
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
				<div className="flex flex-col justify-center items-center h-[100vh] text-white text-sm md:text-xs h-[100vh] bg-sky-950">
					<div className="text-center mt-10">Data is being processed, wait!</div>
					<div ref={target} className={styles.animated}></div>
				</div>
			)}
		</>
	);
}

export default FindPerson;
