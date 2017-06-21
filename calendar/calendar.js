function Calendar() {
  this.now = new Date();
  this.calendar = [];
  this.element = document.createElement('div');

  this._fillCalendar();
}

Calendar.prototype.daysOfWeek = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

Calendar.prototype.months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/**********************************************************
* PUBLIC METHODS
***********************************************************/
Calendar.prototype.render = function() {
  this.element.innerHTML = `
    <div class="cal-container">
      <div class="cal-day">
        <div class="cal-day-name">${this.daysOfWeek[this.now.getDay()]}</div>
        <div class="cal-day-number">${this.now.getDate()}</div>
      </div>

      <div class="cal-month">
        <div class="cal-month-header">
          <div class="cal-month-prev">&lt;</div>
          <div class="cal-month-name">
            ${this.months[this.now.getMonth()]}
            ${this.now.getFullYear()}
          </div>
          <div class="cal-month-next">&gt;</div>
        </div>

        <div class="cal-month-body">
          <div class="cal-month-weeks">
            ${this._renderDaysOfWeek()}
          </div>
          <div class="cal-month-days">
            ${this._renderCalendarDays()}
          </div>
        </div>
      </div>
    </div>
  `;

  this._setEventListeners();
  return this.element;
}

Calendar.prototype._setEventListeners = function() {
  var self = this;

  // Delegated Event: Set the current day to equal to the clicked date.
  this.element.querySelector('.cal-month-days').addEventListener('click',
  function(event) {
    var day = event.target.getAttribute('data-day');
    if (!day) { return; }

    var date = self.calendar[day - 1];
    self.now = date;
    self.render(); // TODO: More efficient re-render.
  });

  // Event: Set calendar back a month.
  this.element.querySelector('.cal-month-prev').addEventListener('click',
  function(event) {
    self.now = self._changeMonth(self.now, -1);
    self._fillCalendar();
    self.render();
  });

  // Event: Set calendar forward a month.
  this.element.querySelector('.cal-month-next').addEventListener('click',
  function(event) {
    self.now = self._changeMonth(self.now, 1);
    self._fillCalendar();
    self.render();
  });
};

/**********************************************************
* RENDERING METHODS
***********************************************************/
Calendar.prototype._renderDaysOfWeek = function() {
  return this.daysOfWeek.map(function(day) {
    return `<div class="cal-week-day">${day.substring(0, 1)}</div>`;
  }).join('\n');
};

Calendar.prototype._renderCalendarDays = function() {
  var html = '';
  var currentDay = this.now.getDate();

  var placeholderDays = this.calendar[0].getDay();
  for (var i=0; i<placeholderDays; i++) {
    html += '\n<div class="cal-placeholder-day"></div> '; // space important.
  }

  html += this.calendar.map(function(day) {
    var date = day.getDate();
    if (date === currentDay) {
      return `<div class="cal-month-day active" data-day="${date}">${date}</div>`;
    } else {
      return `<div class="cal-month-day" data-day="${date}">${date}</div>`;
    }
  }).join('\n');

  return html;
};

/**********************************************************
* PRIVATE METHODS
***********************************************************/
Calendar.prototype._fillCalendar = function() {
  var firstDay = this._getFirstDay(this.now);
  var lastDay = this._getLastDay(this.now);
  var firstDate = firstDay.getDate();
  var lastDate = lastDay.getDate();
  var currentYear = this.now.getFullYear();
  var currentMonth = this.now.getMonth();
  this.calendar = [];

  for (var i = firstDate; i <= lastDate; i++) {
    var newDay = new Date(currentYear, currentMonth, i);
    this.calendar.push(newDay);
  }
};

Calendar.prototype._getFirstDay = function(date) {
  return new Date(date.getFullYear(), date.getMonth());
};

Calendar.prototype._getLastDay = function(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
};

Calendar.prototype._clamp = function(num, min, max) {
  return Math.max(min, Math.min(num, max));
};

Calendar.prototype._changeMonth = function(date, months) {
  var newDate = new Date(this._getFirstDay(this.now));
  newDate.setMonth(newDate.getMonth() + months);

  // Clamp so that May 31 becomes April 30.
  // Can't just set if day is equal to last day because Jan 30 would skip Feb.
  var lastDay = this._getLastDay(newDate).getDate();
  newDate.setDate(this._clamp(date.getDate(), 1, lastDay));
  return newDate;
};
