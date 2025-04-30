import { useState } from "react";

export default function RegisterEstablishment({ onRegEstablishClose }) {
  const [step, setStep] = useState(1);
  // step1 = name, desc, address, phone; step2 = opening closing hours
  // TO BACK-END DEVS: if nahihirapan kayo na i-store yung data since two-parter yung form, feel free na gawing one part/page lang (meaning tanggalin yung useState, then lipat si step2 html kay step1). If nagulo yung CSS just let me know. ~Daryl 

  const handleNext = () => setStep(2);
  const handlePrevious = () => setStep(1);
  const slideVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.4 } },
    exit: { x: "-100%", opacity: 0, transition: { duration: 0.3 } }
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

            <button onClick={handleNext} type="button">&nbsp;NEXT &gt;</button>
        </form>
        )}
        
        {step === 2 && (
        <form className="step-2">
            <p className="op-close-text">Set Opening and Closing Hours</p>
            <table>
                <tbody>
                    <tr>
                        <td><p>Sunday</p></td>
                        <td><input placeholder="From" type="time"/></td>
                        <td><input placeholder="To" type="time"/></td>
                        <td><input type="checkbox" id="closed"/></td>
                        <td><label for="closed">Closed</label></td>
                    </tr>

                    <tr>
                        <td><p>Monday</p></td>
                        <td><input placeholder="From" type="time"/></td>
                        <td><input placeholder="To" type="time"/></td>
                        <td><input type="checkbox" id="closed"/></td>
                        <td><label for="closed">Closed</label></td>
                    </tr>

                    <tr>
                        <td><p>Tuesday</p></td>
                        <td><input placeholder="From" type="time"/></td>
                        <td><input placeholder="To" type="time"/></td>
                        <td><input type="checkbox" id="closed"/></td>
                        <td><label for="closed">Closed</label></td>
                    </tr>

                    <tr>
                        <td><p>Wednesday</p></td>
                        <td><input placeholder="From" type="time"/></td>
                        <td><input placeholder="To" type="time"/></td>
                        <td><input type="checkbox" id="closed"/></td>
                        <td><label for="closed">Closed</label></td>
                    </tr>

                    <tr>
                        <td><p>Thursday</p></td>
                        <td><input placeholder="From" type="time"/></td>
                        <td><input placeholder="To" type="time"/></td>
                        <td><input type="checkbox" id="closed"/></td>
                        <td><label for="closed">Closed</label></td>
                    </tr>

                    <tr>
                        <td><p>Friday</p></td>
                        <td><input placeholder="From" type="time"/></td>
                        <td><input placeholder="To" type="time"/></td>
                        <td><input type="checkbox" id="closed"/></td>
                        <td><label for="closed">Closed</label></td>
                    </tr>

                    <tr>
                        <td><p>Saturday</p></td>
                        <td><input placeholder="From" type="time"/></td>
                        <td><input placeholder="To" type="time"/></td>
                        <td><input type="checkbox" id="closed"/></td>
                        <td><label for="closed">Closed</label></td>
                    </tr>
                </tbody>
            </table>
            <div className="reg-est-btn-container">
                <button onClick={handlePrevious} type="button">&lt;</button>
                <button onClick={onRegEstablishClose} type="button">&nbsp;SUBMIT</button>
            </div>
        </form>
        )}
      </div>
    </div>
  );
}