
import './Day.css';
import dayjs from 'dayjs';


function Day(props) {
	
	let day = props.data.day;
	let dogData = props.data.dogArray;

	
	
	
	let today = dayjs();
	const followingSaturday = today.add(6+(7-today.day()), 'day');
	
	
	
	const isFirstWeek = day.isAfter(followingSaturday, 'day') ? false : true;
	
	dogData.sort(sortByDog);
	
	
	function sortByDog(a, b) {
		if (a.dog_name < b.dog_name) {
			//console.log(`${a.dog_name} before ${b.dog_name}`);
			return -1;
		} else if (a.dog_name > b.dog_name) {
			//console.log(`${a.dog_name} after ${b.dog_name}`);
			return 1;
		}
		return 0;
	}
/*
* 	PROBLEM:
*   This gets the name of the dog and removes the last name (if it's there), then does nothing with the result
	
	dogData.forEach(dog => {
		let regex = new RegExp(`${dog.owner_last}`);
		dog.dog_name.replace(regex, '');
	})
*/	
	


	/*
	*CATEGORIES:
	* Boarding (Stay & Play)
	* Boarding (Stay only)	
	* Daycare - Half		
	* Daycare - Full		
	* Evaluation			
	* Other
	*/
	
	let evalArray = [];
	let halfDayArray = [];
	let fullDayArray = [];
	let boardingArray = [];
	let stayOnlyArray = [];
	let clubTour = [];
	let otherTypesArray = [];

	
	dogData.forEach(reservation => {
		const currentResType = reservation.type.toUpperCase();
		
		if(currentResType.includes("EVALUATION")) {
			evalArray.push(reservation);
		}
		else if(currentResType.includes("HALF")) {
			halfDayArray.push(reservation);
		}
		else if(currentResType.includes("FULL")) {
			fullDayArray.push(reservation);
		}
		else if(currentResType.includes("&")) {
			boardingArray.push(reservation);
		}
		else if(currentResType.includes("STAY ONLY")) {
			stayOnlyArray.push(reservation);
		}
		else if (currentResType.includes("CLUB TOUR")) {
			//skipped
			clubTour.push(reservation);
		}
		else {
			console.log(`Unknown reservation type: ${reservation.type}`);
			otherTypesArray.push(reservation);
		}
		
	});
	

	
	
	let evalHTMLArray = evalArray.map(res => {
		return (
			<div className="dog" key={res.dog_name+today}>
				<div className="eval"> {res.dog_name}</div>
					{isFirstWeek ? (<div className="times">({res.start.format("h:mma")}-{res.end.format("h:mma")})</div>) : null}
			</div>
		)
	});
	
	let halfDayHTMLArray = halfDayArray.map(res => {
		return (
			<div className="dog" key={res.dog_name+today}>
				<div className="halfDay">{res.dog_name}</div>
				{isFirstWeek ? (<div className="times">({res.start.format("h:mma")}-{res.end.format("h:mma")})</div>) : null}
			</div>
		)
	});
	
	let fullDayHTMLArray = fullDayArray.map(res => {
		return (
			<div className="dog" key={res.dog_name+today}>
				<div className="fullDay">{res.dog_name}</div>
				{isFirstWeek ? (<div className="times">({res.start.format("h:mma")}-{res.end.format("h:mma")})</div>) : null}
			</div>
		)
	});
	
	let boardingHTMLArray = boardingArray.map(res => {
		
		return (
			<div className="dog" key={res.dog_name+today}>
				<div className="boarding">
				{res.dog_name}
				{isFirstWeek && res.start.isSame(day, "day") ? ` [In ${res.start.format("h:mma")}]` : null}
				{isFirstWeek && res.end.isSame(day, "day") ? ` [Out ${res.end.format("h:mma")}]` : null}
				</div>
			</div>
		)
	});
	
	let stayOnlyHTMLArray = stayOnlyArray.map(res => {
		return (
			<div className="dog" key={res.dog_name+today}>
				<div className="stayOnly">
				{res.dog_name}
				{isFirstWeek && res.start.isSame(day, "day") ? ` [In ${res.start.format("h:mma")}]` : null}
				{isFirstWeek && res.end.isSame(day, "day") ? ` [Out ${res.end.format("h:mma")}]` : null}
				</div>
			</div>
		)
	});
	
	let otherTypesHTMLArray = otherTypesArray.map(res => {
		
		return (
			<div className="dog" key={res.dog_name+today}>
				<div className="otherTypes">
				{res.dog_name}
				</div>
			</div>
		)
	});

	let totalDogs = dogData.length;
	let totalListed = evalArray.length + halfDayArray.length + fullDayArray.length + boardingArray.length + stayOnlyArray.length + clubTour.length;
	if (totalDogs !== totalListed) {
		console.error(`There are ${totalDogs-totalListed} dogs not listed for ${day.format("M/D")}`);
	}

	
  return (
	<>

		<div className="day">{day.format('dddd, MMM DD') }
		<br/>
		<span className="dogTotal">[Total dogs: {totalDogs}]</span>
			{evalHTMLArray.length >0 ? 
				(<div className="eval type"><span className="typeTitle">Evaluations [{evalHTMLArray.length}]:</span>{evalHTMLArray}</div>)
				:
				null
			}
			{halfDayHTMLArray.length >0 ? 
				(<div className="halfDay type"><span className="typeTitle">Half Day [{halfDayHTMLArray.length}]:</span>{halfDayHTMLArray}</div>)
				:
				null
			}
			{fullDayHTMLArray.length >0 ? 
				(<div className="fullDay type"><span className="typeTitle">Full Day [{fullDayHTMLArray.length}]:</span>{fullDayHTMLArray}</div>)
				:
				null
			}
			{boardingHTMLArray.length >0 ? 
				(<div className="boarding type"><span className="typeTitle">Boarding [{boardingHTMLArray.length}]:</span>{boardingHTMLArray}</div>)
				:
				null
			}
			{stayOnlyHTMLArray.length >0 ? 
				(<div className="boarding type"><span className="typeTitle">Stay Only [{stayOnlyHTMLArray.length}]:</span>{stayOnlyHTMLArray}</div>)
				:
				null
			}
			
			{otherTypesHTMLArray.length >0 ? 
				(<div className="other type"><span className="typeTitle">Other Type [{otherTypesHTMLArray.length}]:</span>{otherTypesHTMLArray}</div>)
				:
				null
			}
		</div>
	</>
			


  );
}

export default Day;


/*

			
		*/