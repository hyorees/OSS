/*import "./Calendar.jsx"
const Calendar = () => {
  return (
    <div>
      <h1>Calendar </h1>
    </div>
  );
};

export default Calendar;*/
import React, { useState } from 'react';
import './Calendar.jsx';


const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 날짜 변경 함수
  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // 달력에 표시할 날짜 배열 만들기
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // 해당 월의 첫 번째 날짜의 요일
    const firstDay = new Date(year, month, 1).getDay();
    // 해당 월의 마지막 날짜
    const lastDate = new Date(year, month + 1, 0).getDate();

    const days = [];
    let day = 1;

    // 첫 번째 주에 빈 칸 넣기
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 날짜 배열 만들기
    for (let i = firstDay; i < 7 && day <= lastDate; i++) {
      days.push(day);
      day++;
    }

    // 그 이후의 주
    while (day <= lastDate) {
      for (let i = 0; i < 7 && day <= lastDate; i++) {
        days.push(day);
        day++;
      }
    }

    return days;
  };

  return (
    <div className="calendar-wrap">
      <div className="calendar-header">
        <button onClick={() => changeMonth(-1)}>&#60;</button>
        <span>{currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
        <button onClick={() => changeMonth(1)}>&#62;</button>
      </div>
      <table id="calendar" align="center">
        <thead>
          <tr>
            <td className="sun" align="center">Sun</td>
            <td align="center">Mon</td>
            <td align="center">Tue</td>
            <td align="center">Wed</td>
            <td align="center">Thu</td>
            <td align="center">Fri</td>
            <td className="sat" align="center">Sat</td>
          </tr>
        </thead>
        <tbody>
          {(() => {
            const days = getDaysInMonth(currentDate);
            const weeks = [];
            let row = [];
            days.forEach((day, index) => {
              if (day === null) {
                row.push(<td key={index}></td>);
              } else {
                row.push(
                  <td key={index} align="center">{day}</td>
                );
              }
              if (row.length === 7) {
                weeks.push(<tr key={weeks.length}>{row}</tr>);
                row = [];
              }
            });
            return weeks;
          })()}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;


