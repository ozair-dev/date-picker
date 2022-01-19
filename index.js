const body = document.body;
const dateElem = body.querySelector("#date-picker");
const calenderElem = body.querySelector("#calender");
let date = new Date();
changeDate(date);

const calender = new Calender(date, calenderElem);
calender.onchange = changeDate;
dateElem.onclick = () => calender.show();
document.onclick = handleDocumentClick;

function handleDocumentClick(e) {
  if (!e.path.includes(calenderElem) && !e.path.includes(dateElem)) {
    calender.hide();
  }
}

function changeDate(date) {
  console.log(date);
  dateElem.querySelector(".date_date").textContent = addZeroBeforeInt(
    date.getDate()
  );

  dateElem.querySelector(".date_month").textContent = addZeroBeforeInt(
    date.getMonth() + 1
  );

  dateElem.querySelector(".date_year").textContent = date.getFullYear();
}

function addZeroBeforeInt(num) {
  return num < 10 ? `0${num}` : num;
}
