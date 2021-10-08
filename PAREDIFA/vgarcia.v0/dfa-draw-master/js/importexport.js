var jsonArea = document.getElementById("json-area");

//Commit, usar estado no mutable
class Serialized_state{
	constructor(id, name, coord, radius, end, start) {
		this.id = id;
		this.name = name;
		this.coord = coord;
		this.radius = radius;
		this.end = end;
		this.start = start;
	}
}

//commit, usar hooks
class Serialized_transition{
	constructor(id, state_src_id, state_dst_id, symbols) {
		this.id = id;
		this.state_src_id = state_src_id;
		this.state_dst_id = state_dst_id;
		this.symbols = symbols;
	}
}

function importJson() {
	var json = document.getElementById("json-area").value;
	setJson(json);
}

//commit
function setJson(json) {
	if (json != "") {
		json = JSON.parse(json);
		document.getElementById("alphabet").value = json.alphabet;
		setAlphabet();

		stateList = json.states;

		transitionList = [];

		stateList.forEach(st => { st.transitionsIn = []; st.transitionsOut = [];});
			
		json.transitions.forEach(st => {
			var state_src = getStateByID(st.state_src_id);
			var state_dst = getStateByID(st.state_dst_id); 
			var tr = new transition(st.id,state_src,state_dst,st.symbols);
			transitionList.push(tr);
			!stateContainsTransition(state_src.id, tr.id) ? state_src.transitionsOut.push(tr) : undefined;
			!stateContainsTransition(state_dst.id, tr.id) ? state_dst.transitionsIn.push(tr) : undefined;
		})
	}
}

function getJson() {
	var json_states = [];
	var json_transitions = [];

	stateList.forEach(st => {
		json_states.push(new Serialized_state(st.id,st.name,st.coord,st.radius,st.end,st.start));
	})

	transitionList.forEach(tr => {
		json_transitions.push(new Serialized_transition(tr.id,tr.state_src.id,tr.state_dst.id,tr.symbols));
	})

	var json = {alphabet: alphabet, states: json_states, transitions: json_transitions};

	return JSON.stringify(json);
}

function exportJson() {
	document.getElementById("json-area").value = getJson();
}
