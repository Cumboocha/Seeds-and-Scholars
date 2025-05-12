const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function RestoAbout({ resto }) {
  // const userId = sessionStorage.getItem("userId") 
  // console.log(userId)

  if (!resto) return <div>Loading...</div>;

  let daysClosed = [];
  if (Array.isArray(resto.daysClosed)) {
    daysClosed = resto.daysClosed;
  } else if (typeof resto.daysClosed === "string") {
    daysClosed = resto.daysClosed.split(",").map(day => day.trim()).filter(Boolean);
  }

  const allDays = Array.from(new Set([...DAYS, ...daysClosed]));

  return (
    <div className="resto-container-white-part">
      <h2 className="resto-text-header" style={{ marginTop: "25px" }}>
        About the Establishment
      </h2>
      <p className="resto-desc">{resto.description}</p>
      <hr />

      <div className="resto-address-container">
        <div className="address-img-container">
          <img src="assets/address_symbol.png" />
        </div>
        <div className="address-details-container">
          <p>{resto.address}</p>
        </div>
      </div>

      <div className="resto-phone-container">
        <div className="phone-img-container">
          <img src="assets/phone_symbol.png" />
        </div>
        <div className="phone-details-container">
          <p>{resto.contactNumber}</p>
        </div>
      </div>

      <div className="resto-schedule-container">
        <div className="schedule-img-container">
          <img src="assets/clock_symbol.png" />
        </div>
        <div className="schedule-details-container">
          <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
            Schedule: {resto.openingHours && resto.closingHours
              ? `${resto.openingHours} - ${resto.closingHours}`
              : "No schedule set"}
          </div>
          <table>
            <tbody>
              {allDays.map(day => (
                <tr key={day}>
                  <td>{day}</td>
                  <td className="second-col">
                    {daysClosed.includes(day)
                      ? "Closed"
                      : (resto.openingHours && resto.closingHours
                        ? `${resto.openingHours} - ${resto.closingHours}`
                        : "Open")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}