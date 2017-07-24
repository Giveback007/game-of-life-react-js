var params = {
	height: Math.floor(window.screen.availHeight / 15),
	length: Math.floor(window.screen.availWidth / 15),
	// height: 50,
	// length: 50,
	randomBirth: false,
	spawnRate: 0.5,
	interval: 75
};

var mem = {
	randGrid: [],
	score: [],
	cycle: 0
};


(function() {
	for (var i = 0; i < params.height; i++) {
		mem.randGrid[i] = [];
		mem.score[i] = [];
		for (var j = 0; j < params.length; j++) {
			var random = Math.random() < params.spawnRate;
			var num = random ? 1 : 0;
			mem.randGrid[i][j] = num;
		}
	}
})();

// </main>
function genNewGridState(cst) {
	var fts = [];
	var score = mem.score;
	for(var i = 0; i < cst.length; i++) {
		fts[i] = cst[i].slice();
	for(var j = 0; j < cst[i].length; j++) {
    mem.score[i][j] = 0; }}

	var ht = params.height - 1;
	var lh = params.length - 1;

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
			if (cst[i][j]) {passScore(i, j)}
		}}

	for (var i = 1; i < ht; i++) {
		if (cst[i][0]) {leftColPass(i, 0)}
	}

	for (var i = 1; i < ht; i++) {
		if (cst[i][lh]) {rightColPass(i, lh)}
	}

		for (var i = 0; i < score.length; i++) {
			for (var j = 0; j < score[i].length; j++) {
				if (score[i][j] > 3 || score[i][j] < 2) {fts[i][j] = 0}
				else if (score[i][j] === 3) {fts[i][j] += 1}
				else if (score[i][j] === 2 && cst[i][j] > 0) {fts[i][j] += 1}
				else {fts[i][j] = 0}
			}
		}
		if (params.randomBirth) {
			var h = Math.floor(Math.random() * ht);
			var l = Math.floor(Math.random() * lh)
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
function Cell(props) {
	return(
		<div
			className={ props.cellState ? 'on' : 'off' }
			onClick={() => props.onClick(props.row, props.col)}
			style={props.cellState? {background:'hsl('+((190)+props.cellState*5)+', 67%, 68%)'}:{}}
		/>)
}

function Row(props) {
	var preRenderRow = props.rowState.map((x, i) => <Cell key={i} col={i} row={props.row} cellState={x} onClick={props.onClick}/>);
	return <div className='row'>{preRenderRow}</div>
}

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gridState: this.props.grid
		}
		this.clickCell = this.clickCell.bind(this);
	}

	clickCell(r, c) {
		if(!this.state.gridState[r][c]) {this.setState({})}
	}

	componentDidMount() {
		this.interv = setInterval(() => {this.setState({gridState: genNewGridState(this.state.gridState)})}, params.interval);
	}

	render() {
		var preRenderGrid = this.state.gridState.map((x, i) => <Row key={i} row={i} rowState={x} />);
		return(
			<section id='grid'>{preRenderGrid}</section>
		);
	}
}

ReactDOM.render(<Main grid={genNewGridState(mem.randGrid, mem.score)}/>, document.getElementById('main'));
// react //
