//commit, usar hooks
class frameInfo{
	constructor(stateID, transitionID) {
		this.stateID = stateID;
		this.transitionID = transitionID;
	}
}

//commit, usar esatdo no mutable
function run() {
	var input = document.getElementById("input-word").value;
	runInfo.input = input;

	var currentState = getInitialState();
	var nextState = null;
	var queue = [];

	validateInput();

	input.split('').forEach(element => {
		queue.push(new frameInfo(currentState.id, null));
		currentState.transitionsOut.forEach(x =>  {
			x.symbols.forEach(y => {
				if(y == element){
					nextState = x.state_dst;
					queue.push(new frameInfo(null, x.id));
				}
			})
		});
		currentState = nextState;
	})
	
	queue.push(new frameInfo(currentState.id, null));
	runAnimation(queue);
}

//commit, usar estado no mutable
function runAnimation(queue) {
	runInfo.nowRunning = true;
	runInfo.currentChar = 0;

	var timeSkipAmount = 600;
	var timeSkipCount = 0;

	queue.forEach( frame => setTimeout(
		() => {  
			frame.stateID != null ? 
				(
					runInfo.transitionID = null,
					runInfo.stateID = frame.stateID 
				) : 
				(
					runInfo.transitionID = frame.transitionID,
					runInfo.stateID = null,
					runInfo.currentChar++
				);

		},timeSkipAmount * timeSkipCount++)
	);

	setTimeout( () =>{
		runInfo.nowRunning = false;
		var state_final = getStateByID(queue.pop().stateID);
		logResult(state_final.name, state_final.end);	
		}, timeSkipAmount * timeSkipCount++
	);
}

//Commit, cambiara a variables no mutables
function isAutomataComplete() {
	var exitSymbols = alphabet.sort();
	var result = true;
	var error = "";
	var aux = [];
	
	stateList.forEach(
		st => { st.transitionsOut.forEach(
			tr => tr.symbols.forEach(
				x => aux.unshift(x)
			)
		);
		aux.sort().join() ==  exitSymbols.join() ? undefined : (
			error += "state #" + st.id + " has no exit transition containing the symbols.<br>",
			result = false
		);
		aux = [];
		}
	)

	!result ? logError("AUTOMATA NOT COMPLETE", error) : undefined;
	return result;
}

//commit, usar estado no mutable
function setAlphabet() {
	restart();

	var aux = document.getElementById("alphabet").value;
	aux.replace(" ", "");
	aux.replace(",", "");

	if (aux.length == 0) {
		return;
	}

	alphabet = [];

	aux.split(',').forEach(s => 
		alphabet.indexOf(s) != -1 ? undefined : (s != " ") ? alphabet.push(s): undefined)

	$("#canvas").show();
}

function restart() {
	$("#results").html("");
	$("#error").html("");
	firstResult = true;
	start();
}

function logError(type, msg) {
	var txt = "<b>ERROR - <i>" + type + "</i></b>:<br> ";
	txt += msg;
	$("#error").html(txt);
}

var firstResult = true;

function logResult(final_state_name, accept) {
	if (firstResult) {
		firstResult = false;
		$("#results").html("<br><b>RESULTS:</b><br>");
	}

	var txt = "[input: \"<b>" + runInfo.input + "</b>\", ";
	if (accept) {
		txt += "end state: <b>" + final_state_name + "</b>] - accepted. <br><br>";
	}
	else {
		txt += "end state: <b>" + final_state_name + "</b>] - rejected. <br><br>";
	}

	$("#results").append(txt);
}

function validateInput() {
	var aux = $("#input-word").val();	
	var result = true;
	var incorrect_symbols = [];

	if (aux == null || aux.length == 0) {
		logError("NONE", "automata is good to go.");
		result = false;
	}
	else {
		for (var i = 0; i < aux.length; i++) {
			if (alphabet.indexOf(aux.charAt(i)) == -1) {
				if (incorrect_symbols.indexOf(aux.charAt(i)) == -1) {
					incorrect_symbols.push(aux.charAt(i));
				}
			}
		}
	}

	if (incorrect_symbols.length != 0) {
		logError("IMPOSSIBLE INPUT", "the symbols \'" + incorrect_symbols + "\' don't exist in the alphabet.");
		result = false;
	}

	if (getInitialState() == null) {
		logError("NO INITIAL STATE", "automata doesn't have an initial state.")
		result = false;
	}

	if (!isThereFinalState()) {
		logError("NO FINAL STATE", "automata doesn't have a final state.")
		result = false;
	}

	if (alphabet == []) {
		logError("NO ALPHABET", "alphabet has not been set.")
		result = false;
	}

	if (!isAutomataComplete()) {
		result = false;
	}

	if (result) {
		logError("NONE", "automata is good to go.");
	}

	$("#run-button").prop("disabled", !result);
	return result;
}
function about(){
	var txt = "<br><p>Integrantes:</p>";
	txt += "<p>José Rodriguez<br>";
	txt += "Kevin Gomez<br>";
	txt += "Alberto Conejo<br>";
	txt += "Keylor Barrantes<br>";
	txt += "Paradigmas G02 1pm</p>";
	$("#about").html(txt);
}
