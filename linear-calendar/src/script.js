(function drawCalendar(document, thisYear, weekStartsOnMonday = true, crossOutPastDays = false) {
  
  const time = {
    constants: {
      days: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
  }
  
  // create data structure
  
  thisYear = thisYear || (new Date()).getFullYear();
  const year = [];

  time.constants.months.forEach((month, i) => {
    const firstDate = new Date(thisYear, i, 1);
    const lastDate = new Date(thisYear, i + 1, 0);
    const totalDays = lastDate.getDate();
    const weekends = [];
    const offset = firstDate.getDay() - 1;
    for (let date = 1; date <= totalDays; date++) {
      if ((date + offset) % 7 === 0 || (date + offset) % 7 === 6) {
        weekends.push(date);
      }
    }
    year.push({
      name: time.constants.months[i],
      number: i,
      firstDay: firstDate.getDay(),
      totalDays: totalDays,
      weekends: weekends,
    });
  });

  const firstColumnWeekDay = year.reduce((result, current) => {
    if (weekStartsOnMonday && current.firstDay === 0) {
      return result;
    }
    return current.firstDay < result ? current.firstDay : result;
  }, 6);

  const longestRow = year.reduce((result, current) => {
    const cellsBeforeFirstDay = weekStartsOnMonday &&  current.firstDay === 0 ? 
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

  function drawRow(month, totalCellsInEachRow, crossOutPastDays) {
    const row = document.createElement('tr');
    row.className = 'row';
    let currentDay = 1;

    for (let i = 0; i < totalCellsInEachRow; i++) {
      const cell = document.createElement('td');
      cell.className = 'cell';
      if (i >= month.startCell && i <= month.endCell) {
        cell.classList.add('day');
        month.weekends.includes(currentDay) && cell.classList.add('weekend');
        cell.appendChild(document.createTextNode(currentDay));
        if (currentDay === 1) {
          const monthLabel = document.createElement('span');
          monthLabel.className = 'month';
          monthLabel.appendChild(document.createTextNode(month.name));
          cell.appendChild(monthLabel);
        }
        const today = new Date();
        today.setHours(0,0,0,0);
        const currentDayAsDate = new Date(thisYear, month.number, currentDay);
        if (currentDayAsDate.getTime() == today.getTime()) {
          cell.classList.add('today');
        }
        if (crossOutPastDays && currentDayAsDate < today) {
          cell.classList.add('crossed');
        }
        currentDay++;
      }
      row.appendChild(cell);
    }
    calDiv.appendChild(row);
  }

  drawDaysOfWeek(longestRow, weekStartsOnMonday);
  for (let month of year) {
    drawRow(month, longestRow, crossOutPastDays);
  }
  
  const titleDiv = document.createElement('div');
  titleDiv.className = 'title';
  titleDiv.appendChild(document.createTextNode(thisYear));
  
  document.getElementById('calendar').className = 'container';
  document.getElementById('calendar').appendChild(titleDiv);
  document.getElementById('calendar').appendChild(calDiv);
  

  // ======================= DEBUG ===========================

  // const pre = document.createElement('pre');
  // pre.appendChild(document.createTextNode(JSON.stringify(year, null, 2)));
  // document.body.appendChild(pre);
  
})(document);