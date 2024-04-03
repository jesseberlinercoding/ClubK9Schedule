import React, { useState } from 'react';

import './Schedule.css';

import Day from './Day';
import dayjs from 'dayjs';

export default function Schedule() {
	const [globalArray, setGlobalArray] = useState(null);
	const [apiKey, setAPIKey] = useState(null);
	
	const today = dayjs();
	const nextSunday = today.add(7-today.day(), 'day');

	async function getData(dayCount) {
		let dataArray = [];
	
		for (let i = 0; i < dayCount; i++) {
			const dataForDay = await getDataForDay(nextSunday.add(i, 'day'));
			
			dataArray.push(dataForDay);
		}
		let noDataReturned = dataArray.every(item => item.dogArray.length === 0);
		
		if(noDataReturned) {
			alert("Either the API key is incorrect, or Gingr is down");
		}
		else {
			setGlobalArray(dataArray);
		}
		
	}

	function setKey(e) {
		setAPIKey(e.target.value);
		
		// dbe16a9f28ce12c54ac111a8f8a5c6c1
		
		e.target.value = '';
	}

	async function getDataForDay(day) {
		let dogArray = [];
		try {
			let url = 'https://club-k9.gingrapp.com/api/v1/reservations?key=' + apiKey;
			let dayFormatted = day.format('YYYY-MM-DD');
			let dayPlusOneFormatted = day.add(1, 'day').format('YYYY-MM-DD');
			let payload = `start_date=${dayFormatted}&end_date=${dayPlusOneFormatted}`;
			let initStuff = {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: payload
			};
			const req = await fetch(url, initStuff);
			const res = await req.json();
			if(res.status)
			{
				//console.log("problem");
			}
			else {
				dogArray = createArrayData(res.data);
			}
			
			
		} catch (error) {
			console.error('Error fetching data:', error);
			return [];
		}
		
		return {day, dogArray};
	}

	function createArrayData(results) {
		
		let returnObjects = Object.entries(results).map(reservation => (
		{
			dog_name: reservation[1].animal.name.trim(),
			owner_last: reservation[1].owner.last_name.trim(),
			type: reservation[1].reservation_type.type.trim(),
			start: dayjs(reservation[1].start_date),
			end: dayjs(reservation[1].end_date),
			canceled: reservation[1].cancelled_date === null ? false : true
		}
		)).filter(res => !res.canceled);
		
		
		return returnObjects;
	}

	return (
		<div>
			<span className="title">Start date: {nextSunday.format('YYYY-MM-DD')}</span>
			<div className="app_container">
					{globalArray ? 
						(globalArray.map((dayData, index) => (
							<Day key={index} data={dayData} />
						)))
						: "Please choose an option"
					}
			</div>
			<div>Insert key: <input type="text" id="apiKey" onBlur={setKey}></input><input type="button" value="Go"></input></div>
			{apiKey ? 
				(<div>
					<input type="button" value="Get next week" onClick={() => getData(7)}></input>
					<input type="button" value="Get next two weeks" onClick={() => getData(14)}></input>
					<input type="button" value="Get next month" onClick={() => getData(28)}></input>
				</div>)
				: null
			}
		</div>
	);
}

