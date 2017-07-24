var styleSheet;
(function(){
	var styleEl = document.createElement('style');
	document.head.appendChild(styleEl);
	styleSheet = styleEl.sheet;
})()




var params = {
	cellSize: 15,
	// height: 50,
	// length: 50,
	height: Math.ceil(window.screen.availHeight / 14),
	length: Math.ceil(window.screen.availWidth / 14),
	randomBirth: false,
	spawnRate: 0.25
};

var mem = {
	randGrid: [],
	score: [],
};


function prepGrid() {
	while(params.height * params.length > 5625) {
		params.cellSize += 1;
		params.height = Math.ceil(window.screen.availHeight / (params.cellSize - 1));
		params.length = Math.ceil(window.screen.availWidth / (params.cellSize - 1));
	}

	styleSheet.insertRule(`.row div {width: ${params.cellSize}px; height: ${params.cellSize}px;}`, 0);
	for (var i = 0; i < params.height; i++) {
		mem.randGrid[i] = [];
		mem.score[i] = [];
		for (var j = 0; j < params.length; j++) {
			var random = Math.random() < params.spawnRate;
			var num = random ? 1 : 0;
			mem.randGrid[i][j] = num;
		}
	}
};

prepGrid();

// </main>
function genNewGridState(cst) {
	var fts = [];
	var score = mem.score;
	for(var i = 0; i < cst.length; i++) {
		fts[i] = cst[i].slice();
	for(var j = 0; j < cst[i].length; j++) {
    mem.score[i][j] = 0; }}

		var ht = cst.length - 1;
		var lh = cst[0].length - 1;

	function passScore(row, col) {
		var rowTop = row-1, rowBot = row+1, colL = col-1, colR = col+1;
		if (row == 0) {rowTop = ht}
		else if (row == ht) {rowBot = 0}
			score[rowTop][colL] += 1;
			score[rowTop][col] += 1;
			score[rowTop][colR] += 1;
			score[row][colL] += 1;
			score[row][colR] += 1;
			score[rowBot][colL] += 1;
			score[rowBot][col] += 1;
			score[rowBot][colR] += 1;
	}

	function leftColPass(row, col) {
		var rowTop = row-1, rowBot = row+1, colL = lh, colR = col+1;
			score[rowTop][colL] += 1;
			score[rowTop][col] += 1;
			score[rowTop][colR] += 1;
			score[row][colL] += 1;
			score[row][colR] += 1;
			score[rowBot][colL] += 1;
			score[rowBot][col] += 1;
			score[rowBot][colR] += 1;
	}

	function rightColPass(row, col) {
		var rowTop = row-1, rowBot = row+1, colL = col-1, colR = 0;
			score[rowTop][colL] += 1;
			score[rowTop][col] += 1;
			score[rowTop][colR] += 1;
			score[row][colL] += 1;
			score[row][colR] += 1;
			score[rowBot][colL] += 1;
			score[rowBot][col] += 1;
			score[rowBot][colR] += 1;
	}

	score[0][0] = 1; score[0][lh] = 1; score[ht][0] = 1; score[ht][lh] = 1;
	if (cst[0][0])
	{score[ht][0] += 1; score[ht][1] += 1; score[0][lh] += 1; score[0][1] += 1; score[1][lh] += 1; score[1][0] += 1; score[1][1] += 1}
	if (cst[0][lh])
	{score[ht][lh-1] += 1; score[ht][lh] += 1; score[0][lh-1] += 1; score[0][0] += 1; score[1][lh-1] += 1; score[1][lh] += 1; score[1][0] += 1}
	if (cst[ht][0])
	{score[ht-1][lh] += 1; score[ht-1][0] += 1; score[ht-1][1] += 1; score[ht][lh] += 1; score[ht][1] += 1; score[0][0] += 1; score[0][1] += 1}
	if (cst[ht][lh])
	{score[ht-1][lh-1] += 1; score[ht-1][lh] += 1; score[ht-1][0] += 1; score[ht][lh-1] += 1; score[ht][0] += 1; score[0][lh-1] += 1; score[0][lh] += 1}

	for (var i = 0; i <= ht; i++) {
		for (var j = 1; j < lh; j++) {
			if (cst[i][j] > 0) {passScore(i, j)}
		}}

	for (var i = 1; i < ht; i++) {
		if (cst[i][0] > 0) {leftColPass(i, 0)}
	}

	for (var i = 1; i < ht; i++) {
		if (cst[i][lh] > 0) {rightColPass(i, lh)}
	}

		for (var i = 0; i < score.length; i++) {
			for (var j = 0; j < score[i].length; j++) {
				if (cst[i][j] == 0 && score[i][j] == 0) {}//{fts[i][j] = 0} // stay empty
				else if (cst[i][j] >= 1 && (score[i][j] > 3 || score[i][j] < 2)) {fts[i][j] = -7} // die
				else if (cst[i][j] <= 0 && score[i][j] == 3) {fts[i][j] = 1} // born
				else if (cst[i][j] >= 1 && (score[i][j] == 2 || score[i][j] == 3)) {fts[i][j] += 1} // stay alive
				else if (cst[i][j] < 0) {fts[i][j] += 1} // was dead ------ must stay last
			}
		}
		if (params.randomBirth) {
			var h = Math.floor(Math.random() * ht);
			var l = Math.floor(Math.random() * lh);
			if (!fts[h][l]){fts[h][l] = 1}
		}

	// console.log('---cst---');
	// cst.map(x=> console.log(x));
	// console.log('---score---');
	// score.map(x=> console.log(x));
	// console.log('---fts---');
	// fts.map(x=> console.log(x))
	return fts;
}


// react //
// </cell>
function Cell(props) {
	var color = {};
	var className = 'off';
		if (props.cellState > 0) {
			className = 'on';
			color = {background:'hsl('+(162+(props.cellState*10))+', 58%, 55%)'};
		}
		else if (props.cellState < 0) {
			color = {
				background: 'hsl(162, 66%, '+(66+props.cellState*0.83)+'%)',
				borderRadius: '25%'
			}
		}
		return(
			<div
				className={className}
				style={color}
				onClick={() => props.onClick(props.row, props.col)}
			/>);
	}

// </row>
function Row(props) {
		var preRenderRow = props.rowState.map((x, i) => <Cell key={i} col={i} row={props.row} cellState={x} onClick={props.onClick}/>);
		return <div className='row'>{preRenderRow}</div>;
	}

var perf = Date.now();	// perf
var total = 0;					// perf
// </grid>
class Grid extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gridState: this.props.grid,
			cycles: 0,
			delay: 75
		}
		this.clickCell = this.clickCell.bind(this);
		// this.cellSize = this.cellSize.bind(this);
	}

	clickCell(r, c) {
		// this.state.gridState.map( x => console.log(x) );
		var tempGrid = [];
		this.state.gridState.map( (x, i) => tempGrid.push(x) );
		if(!tempGrid[r][c]) {tempGrid[r][c] = 1}
		else {tempGrid[r][c] = 0}
		this.setState({gridState: tempGrid});
	}

	// cellSize(size) {
	// 	mem.cycles = 0;
	// 	params.cellSize = size;
	// 	params.height = Math.floor(window.screen.availHeight / size);
	// 	params.length = Math.floor(window.screen.availWidth / size);
	// 	styleSheet.deleteRule(0);
	// 	styleSheet.insertRule(`.row div {width: ${size}px;height: ${size}px;}`, 0);
	// 	prepGrid();
	// 	this.setState({gridState: mem.randGrid});
	// }

	componentDidMount() {
		this.interv = setInterval(() => {
			this.setState({
				gridState: genNewGridState(this.state.gridState),
				cycles: this.state.cycles + 1
			});
			total += perf = Date.now() - perf;
			// if(this.state.cycles % 100 === 0 || this.state.cycles < 31) {console.log(this.state.cycles, '-', total / this.state.cycles)}
			perf = Date.now();

		}, this.state.delay);
	}

	render() {
		var preRenderGrid = this.state.gridState.map(
			(x, i) =>
				<Row
					key={i}
					row={i}
					rowState={x}
					onClick={this.clickCell}
				/>
		);
		return(
			<section id='grid'>{preRenderGrid}</section>
		);
	}
}

ReactDOM.render(<Grid grid={genNewGridState(mem.randGrid, mem.score)}/>, document.getElementById('main'));
// react //
