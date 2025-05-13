export default function EditResto({onClose}) {
  const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  return (
    <div className="edit-body">
      <div className="navbar-fake">.</div>
      <div className="edit-main">
        <div className="edit-left">
          {/*Edit Mode*/}
          <div className="resto-container-green-part">
            <div className="resto-header">
              <div className="resto-pfp">
                <img src="assets/resto_default_pfp.png" alt="Restaurant" />
              </div>
              <div className="resto-name-fav">
                <h1>resto.name</h1>
              </div>
            </div>

            {/*Resto About (Edit Mode)*/}
            <div className="resto-container-white-part">
              <h2 className="resto-text-header" style={{ marginTop: "25px" }}>
                About the Establishment
              </h2>
              <textarea
                className="resto-edit-textarea"
                placeholder="Write a description."
              />
              <hr />

              <div className="resto-address-container">
                <div className="address-img-container">
                  <img src="assets/address_symbol.png" />
                </div>
                <div className="address-details-container">
                  <input className="resto-edit-input" placeholder="Address" />
                </div>
              </div>

              <div className="resto-phone-container">
                <div className="phone-img-container">
                  <img src="assets/phone_symbol.png" />
                </div>
                <div className="phone-details-container">
                  <input
                    className="resto-edit-input"
                    placeholder="Phone Number"
                  />
                </div>
              </div>

              <div className="resto-schedule-container">
                <div className="schedule-img-container">
                  <img src="assets/clock_symbol.png" />
                </div>
                <div className="schedule-details-container">
                  <input
                    className="resto-edit-input"
                    placeholder="Opening Hour"
                  />
                  <input
                    className="resto-edit-input"
                    placeholder="Closing Hour"
                  />
                </div>
              </div>
              <div className="resto-closed-container">
                <div className="closed-days-img-container">.</div>
                <div className="closed-details-container">
                  <p style={{ fontWeight: "bolder" }}>Closed Days</p>
                  <div
                    className="closed-days-checkboxes"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "10px",
                      marginTop: "5px",
                    }}
                  >
                    {DAYS.map((day) => (
                      <label
                        key={day}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <input type="checkbox" name="closedDays" value={day} />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="edit-right">
          <img src="assets/edit_mode_logo.png" className="edit-logo" />
          <div className="edit-buttons">
            <button className="edit-save">SAVE</button>
            <button className="edit-cancel" onClick={onClose}>CANCEL</button>
          </div>
        </div>
      </div>
    </div>
  );
}
