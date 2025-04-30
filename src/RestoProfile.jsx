export default function RestoProfile() {
    return (
        <div className="resto-container">
          <div className="resto-container-green-part">
            <div className="resto-header">
              <div className="resto-name">
                <h1>Kusinang Bayan</h1>
              </div>

              <div className="resto-pfp">
                <img src="assets/resto_default_pfp.png" />
              </div>
            </div>
            <div className="resto-container-white-part">
              <p className="resto-desc">
                "Isang makabayan at masarap na kainan na naghahain ng mga
                paboritong lutong-bahay tulad ng adobo, siningang, at kare-kare,
                gamit and sariwang sangkap mula sa palengke"
              </p>
              <hr />

              <div className="resto-address-container">
                <div className="address-img-container">
                  <img src="assets/address_symbol.png" />
                </div>

                <div className="address-details-container">
                  <p>45 Mabini Street, Barangay Malinis, Quezon City, Manila</p>
                </div>
              </div>

              <div className="resto-phone-container">
                <div className="phone-img-container">
                  <img src="assets/phone_symbol.png" />
                </div>

                <div className="phone-details-container">
                  <p>0977 406 9840</p>
                </div>
              </div>

              <div className="resto-schedule-container">
                <div className="schedule-img-container">
                  <img src="assets/clock_symbol.png" />
                </div>

                <div className="schedule-details-container">
                  <table>
                    <tbody>
                      <tr>
                        <td>Sunday</td>
                        <td className="second-col">10AM-9PM</td>
                      </tr>
                      <tr>
                        <td>Monday</td>
                        <td className="second-col">10AM-9PM</td>
                      </tr>
                      <tr>
                        <td>Tuesday</td>
                        <td className="second-col">10AM-9PM</td>
                      </tr>
                      <tr>
                        <td>Wednesday</td>
                        <td className="second-col">10AM-9PM</td>
                      </tr>
                      <tr>
                        <td>Thursday</td>
                        <td className="second-col">10AM-9PM</td>
                      </tr>
                      <tr>
                        <td>Friday</td>
                        <td className="second-col">10AM-9PM</td>
                      </tr>
                      <tr>
                        <td>Saturday</td>
                        <td className="second-col">10AM-9PM</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
}