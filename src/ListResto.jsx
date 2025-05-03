import CardResto from "./CardResto";

export default function ListResto({setRestoProfileScreen, handleScreenChange}) {
    
    return (
        <div className="resto-list-container">
            <CardResto setRestoProfileScreen={setRestoProfileScreen}/>
            <CardResto setRestoProfileScreen={setRestoProfileScreen}/>
            <CardResto setRestoProfileScreen={setRestoProfileScreen}/>
            <CardResto setRestoProfileScreen={setRestoProfileScreen}/>
            <CardResto setRestoProfileScreen={setRestoProfileScreen}/>

            <img className="map-btn" src="assets/map_btn.png" onClick={() => handleScreenChange("map")}/>
            <img className="sort-btn" src="assets/sort_btn.png" />
        </div>
    );
}