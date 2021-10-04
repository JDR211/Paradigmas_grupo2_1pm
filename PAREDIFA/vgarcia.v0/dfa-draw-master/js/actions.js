//Eliminar variable global usar hooks
var stateList = [];

//Commit
class coord{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
}

//commit, usar hooks para estado no mutable
class state{
	constructor(id, name, coord, radius, end, start, transitionsIn, transitionsOut){
		this.id = id;
		this.name = name;
		this.coord = coord;
		this.radius = radius;
		this.end = end;
		this.start = start;
		this.transitionsIn = transitionsIn;
		this.transitionsOut = transitionsOut;
	}
}

//commit
function createState() {
	stateList.push(new state(stateList.length,
		stateList.length.toString(),
		new coord(mousePos.x, mousePos.y),
		20,
		false,
		false,
		[],
		[])
	);
}

//commit, usar estado no mutable 
function selectState(state) {
	selectedState.adding_transition ?
		createTransition() : (
		selectedState.id = state.id,
		selectedState.selecting = true,
		selectedState.moving = true
		);
}

//Usar estado no mutable
function resetSelectedState() {
	selectedState.id = -1;
	selectedState.selecting = false;
	selectedState.naming = false;
}

//commit
var isSelected = state => selectedState.id == state.id && selectedState.selecting;


//commit
var  getSelectedState = () => selectedState.id == -1 ? null : stateList[selectedState.id];

//commit
function moveStateByCursor(state) {
	state.coord.x = mousePos.x;
	state.coord.y = mousePos.y;		
	
	state.coord.x + state.radius > canvas.width ? state.coord.x = canvas.width - state.radius : undefined;
	state.coord.x - state.radius < 0 ? state.coord.x = state.radius : undefined;
	state.coord.y + state.radius > canvas.height ? state.coord.y = canvas.height - state.radius : undefined;
	state.coord.y - state.radius < 0 ? state.coord.y = state.radius : undefined;
}

//commit, usar estado no mutable
var setFinalState = () => { 
	var state = getSelectedState();
	!state ? undefined : state.end = !state.end 
};

//commit, usar estado no mutable (hooks)
var setInitialState = () => { 
	var state = getSelectedState();
	!state ? undefined : (
		stateList.map( x => x.start = false),
		state.start = true
	)
}

//commit
var getInitialState = () => stateList.find(x => x.start == true);

//commit
var getStateByID = (id) => stateList.find(x => x.id == id);

//Commit
function removeState(stateID) {
	if (stateID == -1) {
		return;
	} 

	var state = getStateByID(stateID);

	state.transitionsOut.forEach(element => { removeTransition(element.id);});
	state.transitionsIn.forEach(element => { removeTransition(element.id);});
	
	stateList.splice(stateID, 1);
	stateList.filter(x => x.id > stateID).map(x => x.id = x.id -1);
}

//commit
function typeStateName(symbol) {
	var state = getStateByID(selectedState.id);

	!state ? undefined : symbol == "backspace" ? 
		state.name.length > 0 ? 
			state.name = state.name.slice(0, state.name.length - 1) : undefined 
		: state.name.length < 4 ? 
			state.name = state.name.concat(symbol): undefined; 
}

//commit
var isThereFinalState = () => stateList.find(x => x.end == true) ? true : false;
