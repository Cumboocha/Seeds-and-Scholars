import { useState } from "react";

export default function RegisterEstablishment({ onRegEstablishClose }) {
  const [step, setStep] = useState(1);
  // step1 = name, desc, address, phone; step2 = opening closing hours

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];
  const handleNext = () => setStep(2);
  const handlePrevious = () => setStep(1);

  const handleSubmit = () => {
    if (window.addMarkerFromForm) {
      window.addMarkerFromForm();
    }
    onRegEstablishClose();
  };

  return (
    <div className="reg-est-body">
      {/*Left Side*/}
      <div className="reg-est-logo-container">
        <a href="#" onClick={onRegEstablishClose}>
          <img className="reg-est-x-btn" src="assets/login_x_btn.png" />
        </a>
        <img src="assets/reg_establishment_logo.png" />
      </div>

      {/*Right Side*/}
      <div className="reg-est-container">
        <img src="assets/reg_establishment_bg.png" />

        {step === 1 && (
          <form>
            <input placeholder="Establishment Name*" />
            <textarea placeholder="Description" className="est-description" />
            <input placeholder="Address*" />
            <input placeholder="Contact Number*" />

            <button onClick={handleNext} type="button">
              &nbsp;NEXT &gt;
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="step-2">
            <p className="op-close-text">Set Opening and Closing Hours</p>
            <table>
              <tbody>
                {daysOfWeek.map((day) => (
                  <tr key={day}>
                    <td><p>{day}</p></td>
                    <td><input placeholder="From" type="time" /></td>
                    <td><input placeholder="To" type="time" /></td>
                    <td><input type="checkbox" id={`closed-${day}`} /></td>
                    <td><label htmlFor={`closed-${day}`}>Closed</label></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="reg-est-btn-container">
              <button onClick={handlePrevious} type="button">
                &lt;
              </button>
              <button onClick={handleSubmit} type="button">
                &nbsp;REGISTER
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
