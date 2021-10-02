var stateList = [];

//Modificar a class poner constructor
class coord{
	constructor(x,y){
		this.x = x;
		this.y = y;
	}
}

//Modificar a class poner constructor
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

function createState() {
	stateList[stateList.length] = new state(stateList.length,
		stateList.length.toString(),
		new coord(mousePos.x, mousePos.y),
		20,
		false,
		false,
		[],
		[]);
}

function selectState(state) {
	if (selectedState.adding_transition) {
		createTransition();
		return;
	}

	selectedState.id = state.id;
	selectedState.selecting = true;
	selectedState.moving = true;
}

function resetSelectedState() {
	selectedState.id = -1;
	selectedState.selecting = false;
	selectedState.naming = false;
}

function isSelected(state) {
	return (selectedState.id == state.id && selectedState.selecting);
}

//Modificado
function getSelectedState() {
	var id = selectedState.id;
	return this.id == -1 ? null: stateList[selectedState.id];
}

function moveStateByCursor(state) {
	state.coord.x = mousePos.x;
	state.coord.y = mousePos.y;		
	
	if (state.coord.x + state.radius > canvas.width) {
		state.coord.x = canvas.width - state.radius;
	}

	if (state.coord.x - state.radius < 0) {
		state.coord.x = state.radius;
	}

	if (state.coord.y + state.radius > canvas.height) {
		state.coord.y = canvas.height - state.radius;
	}

	if (state.coord.y - state.radius < 0) {
		state.coord.y = state.radius;
	}
}

function setFinalState() {
	var state = getSelectedState();
	if (!state) {
		return;
	}
	state.end = !state.end;
}

//Modificado
function setInitialState() {
	var state = getSelectedState();
	if (!state) {
		return;
	}
	stateList.map( x => x.start = false);
	state.start = true;
}

//Modificado
function getInitialState() {
	return stateList.find(x => x.start == true);
}

//Modificado
function getStateByID(id) {
	return stateList.find(x => x.id == id);
}

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

function typeStateName(symbol) {
	var state = getStateByID(selectedState.id);

	if (state == null) {
		return;
	}

	if (symbol == "backspace") {
		if (state.name.length > 0) {
			state.name = state.name.slice(0, state.name.length - 1);
		}
		return;
	}
	
	if (state.name.length < 4) {
		state.name = state.name.concat(symbol);
	}
}

//commit
function isThereFinalState() {
	return stateList.find(x => x.end == true) ? true : false;
}
