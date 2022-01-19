const months = [
  "January",
  "Februry",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const yearsGrid = 4 * 4;
const monthsGrid = 3 * 4;
const datesGrid = 7 * 6;

class Calender {
  date;
  tempDate;
  calenderElem;
  currentlyShowing = "dates";
  constructor(date, elem) {
    this.date = new Date(date);

    // to store any changes in original date
    this.tempDate = new Date(date);
    this.calenderElem = elem;
    this.handleDateClick = this.handleDateClick.bind(this);
    this.handleMonthClick = this.handleMonthClick.bind(this);
    this.handleYearClick = this.handleYearClick.bind(this);
    this.highlightDate = this.highlightDate.bind(this);
    this.showMonths = this.showMonths.bind(this);
    this.showYears = this.showYears.bind(this);
    this.setDates = this.setDates.bind(this);
    this.setMonths = this.setMonths.bind(this);
    this.setYears = this.setYears.bind(this);
    this.handleHighlighterTransitionEnd =
      this.handleHighlighterTransitionEnd.bind(this);
    this.init();
    this.setCalender();
  }

  init = () => {
    this.navbar = this.calenderElem.querySelector("nav");
    this.navbar.addEventListener("mousedown", handleNavbarMousedown.bind(this));

    // element containing dates of month
    this.monthDatesElem = this.calenderElem.querySelector(
      ".calender_body_month_dates"
    );

    this.dateHighlighter = this.calenderElem.querySelector(".date_highlighter");
    this.dateHighlighter.ontransitionend = this.handleHighlighterTransitionEnd;

    this.incDecNavButtons = this.calenderElem.querySelectorAll(
      ".inc_dec_nav_button"
    );

    this.incDecNavButtons.forEach(
      (button) => (button.onclick = this.handleIncDec.bind(this))
    );

    // to show months and to be able to select one
    this.monthNameButton = this.calenderElem.querySelector(
      ".calender_nav_month_button"
    );
    this.monthNameButton.onclick = this.showMonths;

    // to show years and to be able to select one
    this.yearNameButton = this.calenderElem.querySelector(
      ".calender_nav_year_button"
    );
    this.yearNameButton.onclick = this.showYears;

    // this elem contains days and dates elems on month
    this.datesElem = this.calenderElem.querySelector(".calender_body_dates");

    // contains months of years
    this.monthsElem = this.calenderElem.querySelector(".calender_body_months");

    // contains years to select
    this.yearsElem = this.calenderElem.querySelector(".calender_body_years");

    // this.hideButton = this.calenderElem.querySelector(".calender_hide");
    // this.hideButton.onclick = this.hide;

    document.addEventListener("mouseup", handleMouseup.bind(this));
    document.addEventListener("mousemove", handleMousemove.bind(this));
  };

  handleIncDec(e) {
    const op = e.target.dataset.op;
    switch (this.currentlyShowing) {
      case "dates":
        let month = this.tempDate.getMonth();
        op == "+" ? month++ : month--;
        this.tempDate.setMonth(month);
        break;
      case "years":
        let year = this.tempDate.getFullYear();
        op == "+" ? (year += yearsGrid) : (year -= yearsGrid);
        this.tempDate.setYear(year);
        break;
    }

    this.setCalender();
  }

  setCalender = () => {
    const date = new Date(this.tempDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    this.monthNameButton.textContent = months[month];
    this.yearNameButton.textContent = year;
    this.setDates({ date, month, year });
    this.setMonths(month);
    this.setYears(year);

    this.dateHighlighter.dataset.isfresh = true;
    this.highlightDate();
  };

  setDates({ date, month, year }) {
    // deleting previous dates elems except date highlighter
    // it could be done via element.innerHTML="", but it will also delete the
    //date highlighter (which it contains)
    while (this.monthDatesElem.firstChild !== this.monthDatesElem.lastChild) {
      this.monthDatesElem.removeChild(this.monthDatesElem.lastChild);
    }

    date.setDate(1);
    const firstDay = date.getDay();
    Array(datesGrid)
      .fill(null)
      .map((item, idx) => {
        // gives the date offset from the first day of the month so it could be
        // determined whether current date is from pre, curr, or next month
        let dDate = ++idx - firstDay;
        const date = new Date(year, month, dDate);
        dDate = date.getDate();
        const isDateOfMonth = date.getMonth() === month;
        const isCurrentDate = dDate == this.date.getDate() && isDateOfMonth;
        const isExactDate =
          year === this.date.getFullYear() &&
          month === this.date.getMonth() &&
          isCurrentDate;
        return { date: dDate, isDateOfMonth, isCurrentDate, isExactDate };
      })
      .forEach((item) => {
        const dateElem = document.createElement("p");
        dateElem.textContent = item.date;
        dateElem.dataset.value = item.date;
        dateElem.dataset.valid = item.isDateOfMonth;
        dateElem.onclick = this.handleDateClick;
        if (!item.isDateOfMonth) dateElem.classList.add("disabled");
        if (item.isExactDate) this.exactDateElem = dateElem;
        else if (item.isCurrentDate) dateElem.classList.add("current");
        this.monthDatesElem.appendChild(dateElem);
      });
  }

  setMonths(month) {
    // while (this.monthsElem.firstChild) {
    //   this.monthsElem.removeChild(this.monthsElem.lastChild);
    // }
    this.monthsElem.innerHTML = "";

    Array(monthsGrid)
      .fill(null)
      .forEach((item, idx) => {
        const monthValue = idx;
        const monthButton = document.createElement("button");
        monthButton.textContent = months[idx].substring(0, 3);
        monthButton.dataset.value = idx;
        monthValue === month && monthButton.classList.add("current");
        monthButton.onclick = this.handleMonthClick;
        this.monthsElem.appendChild(monthButton);
      });
  }
  setYears(year) {
    this.yearsElem.innerHTML = "";
    const firstYear = year - (year % yearsGrid);
    Array(yearsGrid)
      .fill(null)
      .forEach((item, idx) => {
        const yearValue = firstYear + idx;
        const yearButton = document.createElement("button");
        yearButton.textContent = yearValue;
        yearButton.dataset.value = yearValue;
        yearValue === year && yearButton.classList.add("current");
        yearButton.onclick = this.handleYearClick;
        this.yearsElem.appendChild(yearButton);
      });
  }

  highlightDate() {
    const dateElem = this.exactDateElem;
    // this.exactDateElem?.classList.remove("highlighted");
    dateElem.classList.add("highlighted");
    this.dateHighlighter.style.top = dateElem.offsetTop + "px";
    this.dateHighlighter.style.left = dateElem.offsetLeft + "px";
    this.dateHighlighter.style.width = dateElem.offsetWidth + "px";
    this.dateHighlighter.style.height = dateElem.offsetHeight + "px";
  }

  handleHighlighterTransitionEnd(e) {
    if (
      this.dateHighlighter.offsetTop !== 0 &&
      !JSON.parse(this.dateHighlighter.dataset.isfresh)
    ) {
      this.hide();
    }
  }

  handleMonthClick(e) {
    const month = e.target.dataset.value;
    this.tempDate.setMonth(month);
    this.showDates();
    this.setCalender();
  }

  handleYearClick(e) {
    const year = e.target.dataset.value;
    this.tempDate.setYear(year);
    this.showDates();
    this.setCalender();
  }

  handleDateClick(e) {
    const dateElem = e.target;

    if (JSON.parse(dateElem.dataset.valid)) {
      if (dateElem === this.exactDateElem) {
        this.hide();
        return;
      }
      this.exactDateElem = dateElem;
      this.tempDate.setDate(dateElem.dataset.value);
      this.date = new Date(this.tempDate);
      this.dateHighlighter.dataset.isfresh = false;
      this.highlightDate();

      // changes the date in index.js file
      date = new Date(calender.date);
      this.onchange(date);
    }
  }

  showDates() {
    this.currentlyShowing = "dates";
    this.datesElem.classList.add("visible");
    this.monthsElem.classList.remove("visible");
    this.yearsElem.classList.remove("visible");
    Boolean(this.exactDateElem) && this.highlightDate();
  }

  showMonths() {
    this.currentlyShowing = "months";
    this.datesElem.classList.remove("visible");
    this.monthsElem.classList.add("visible");
    this.yearsElem.classList.remove("visible");
  }
  showYears() {
    this.currentlyShowing = "years";
    this.datesElem.classList.remove("visible");
    this.monthsElem.classList.remove("visible");
    this.yearsElem.classList.add("visible");
  }

  show = () => {
    this.calenderElem.classList.add("visible");
  };
  hide = () => {
    if (this.calenderElem.classList.contains("visible")) {
      this.calenderElem.classList.remove("visible");
      // resets the calender
      this.tempDate = new Date(this.date);
      this.showDates();
      this.setCalender();
    }
  };
}

function handleNavbarMousedown() {
  this.navbar.dataset.clicked = true;
}

function handleMouseup(e) {
  this.navbar.dataset.clicked = false;
}

function handleMousemove(e) {
  const navbar = this.navbar;
  const clicked = JSON.parse(navbar.dataset.clicked);
  if (clicked) {
    const calender = this.calenderElem;
    const rect = calender.getBoundingClientRect();
    const top = rect.top + e.movementY + rect.height / 2;
    const left = rect.left + e.movementX + rect.width / 2;
    calender.style.top = top + "px";
    calender.style.left = left + "px";
  }
}
