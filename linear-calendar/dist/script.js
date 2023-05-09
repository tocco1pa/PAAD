import data from './data.json' assert { type: 'json' };
const newEventModal = document.getElementById('newEventModal');
const backDrop = document.getElementById('modalBackDrop');
let nav = 0;


(function drawCalendar(document, thisYear, weekStartsOnMonday = true) {
  const time = {
    constants: {
      days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
  }

  // create data structure

  thisYear = 2022;
  const year = [];
  let dayCount = 0;

  time.constants.months.forEach((month, i) => {
    const firstDate = new Date(thisYear, i, 1);
    const lastDate = new Date(thisYear, i + 1, 0);
    const totalDays = lastDate.getDate();

    year.push({
      name: time.constants.months[i],
      number: i,
      firstDay: firstDate.getDay(),
      totalDays: totalDays,
    });
  });

  const firstColumnWeekDay = year.reduce((result, current) => {
    if (weekStartsOnMonday && current.firstDay === 0) {
      return result;
    }
    return current.firstDay < result ? current.firstDay : result;
  }, 6);

  const longestRow = year.reduce((result, current) => {
    const cellsBeforeFirstDay = weekStartsOnMonday && current.firstDay === 0 ?
      6 :
      current.firstDay - firstColumnWeekDay;
    const rowTotal = cellsBeforeFirstDay + current.totalDays;
    return rowTotal > result ? rowTotal : result;
  }, 0);

  for (let month of year) {
    month.startCell = ((month.firstDay - firstColumnWeekDay) + 7) % 7;
    month.endCell = month.startCell + month.totalDays - 1;
  }

  // Draw the calendar

  const calDiv = document.createElement('table');
  calDiv.className = 'calendar';

  function drawDaysOfWeek(totalCellsInEachRow, weekStartsOnMonday) {
    const startDay = weekStartsOnMonday ? 1 : 0;
    const endDay = weekStartsOnMonday ? totalCellsInEachRow + 1 : totalCellsInEachRow;
    const row = document.createElement('tr');
    row.className = 'row';
    for (let i = startDay; i < endDay; i++) {
      const cell = document.createElement('th');
      cell.className = 'cell header';
      cell.appendChild(document.createTextNode(time.constants.days[i % 7]));
      row.appendChild(cell);
    }
    calDiv.appendChild(row);
  }

  function drawRow(month, totalCellsInEachRow) {
    const row = document.createElement('tr');
    row.className = 'row';
    let currentDay = 1;

    for (let i = 0; i < totalCellsInEachRow; i++) {
      const cell = document.createElement('td');
      cell.className = 'cell';
      if (i >= month.startCell && i <= month.endCell) {
        cell.classList.add('day');
        //each cell has a day num tag to denote the numerical day of the year
        cell.id = "day" + (i - month.startCell + dayCount + 1);

        cell.appendChild(document.createTextNode(currentDay));
        if (currentDay === 1) {
          const monthLabel = document.createElement('span');
          monthLabel.className = 'month';
          monthLabel.appendChild(document.createTextNode(month.name));
          cell.appendChild(monthLabel);
        }
        //change background image of each cell to corresponding album cover art
        cell.style.cssText = "background-image: url(" + data[i - month.startCell + dayCount]['Cover Art'] + ");";

        currentDay++;
      }
      row.appendChild(cell);

      if (i == totalCellsInEachRow - 1) {
        dayCount = dayCount + month.endCell - month.startCell + 1;
      }
      //add a click event listener to each day to open the information modal
      cell.addEventListener('click', () => openModal(cell.id));
    }
    calDiv.appendChild(row);


  }

  drawDaysOfWeek(longestRow, weekStartsOnMonday);
  for (let month of year) {
    drawRow(month, longestRow);
  }

  const titleDiv = document.createElement('div');
  titleDiv.className = 'title';
  titleDiv.appendChild(document.createTextNode(thisYear));

  document.getElementById('calendar').className = 'container';
  document.getElementById('calendar').appendChild(titleDiv);
  document.getElementById('calendar').appendChild(calDiv);


})(document);
//function to open the modal upon request 
function openModal(date) {
  if (typeof date != "number"){
    date = parseInt(date.match(/(\d+)$/)[0], 10) - 1;
  }
  //add or update information in modal to corresponding album 
  listenedDate.innerText = "Listened on " + new Date(2022, 0, data[date]['Order']).toLocaleDateString("fr-CA");
  albumTitle.innerText = data[date]['Album'];
  artistName.innerText = data[date]['Artist(s)'];
  releaseDate.innerText = "Released on " + data[date]['Release Date'];
  art.src = document.getElementById('day' + (date + 1)).style.backgroundImage.split('(')[1].replace(')', '').replace('"', '').replace('"', '');
  console.log(art.src);

  nav = date;
  newEventModal.style.display = 'block';
  document.body.addEventListener("keydown", escapeClose);
  document.getElementById('cancelButton').addEventListener('click', closeModal);
  document.getElementById('nextButton').addEventListener('click', nextModal);
  document.getElementById('prevButton').addEventListener('click', prevModal);
}
//browse the next/prev modal in order (loop)
function nextModal() {
  if(nav == 364) {
    nav = -1;
  }
  openModal(nav + 1);
}
function prevModal() {
  if(nav == 0) {
    nav = 365;
  }
  openModal(nav - 1);
}

//close the modal upon request
function closeModal() {
  newEventModal.style.display = 'none';
  backDrop.style.display = 'none';
  document.body.removeEventListener("keydown", escapeClose);
}
function escapeClose(event) {
  if (event.keyCode === 27) {
    closeModal();
  }
}


