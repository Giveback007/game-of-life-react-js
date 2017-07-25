'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

document.getElementById('navOnOff').addEventListener('click', toggleNav);

var styleSheet;
(function () {
	var styleEl = document.createElement('style');
	document.head.appendChild(styleEl);
	styleSheet = styleEl.sheet;
})();

var navIsOn = false;
function toggleNav() {
	var btn = document.getElementById('navOnOff');
	var nav = document.getElementById('nav');
	navIsOn = !navIsOn;
	if (navIsOn) {
		btn.classList.add('navOn');nav.classList.add('navOn');
	}
	if (!navIsOn) {
		btn.classList.remove('navOn');nav.classList.remove('navOn');
	}
}

var params = {
	cellSize: 15,
	// height: 50,
	// length: 50,
	height: Math.ceil(window.screen.availHeight / 14),
	length: Math.ceil(window.screen.availWidth / 14),
	randomBirth: false,
	spawnRate: 0.20
};

var mem = {
	randGrid: [],
	score: []
};

function prepGrid() {

	while (params.height * params.length > 5000) {
		params.cellSize += 1;
		params.height = Math.ceil(window.screen.availHeight / (params.cellSize - 1));
		params.length = Math.ceil(window.screen.availWidth / (params.cellSize - 1));
	}

	styleSheet.insertRule('.row div {width: ' + params.cellSize + 'px; height: ' + params.cellSize + 'px;}', 0);
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
	for (var i = 0; i < cst.length; i++) {
		fts[i] = cst[i].slice();
		for (var j = 0; j < cst[i].length; j++) {
			mem.score[i][j] = 0;
		}
	}

	var ht = cst.length - 1;
	var lh = cst[0].length - 1;

	function passScore(row, col) {
		var rowTop = row - 1,
		    rowBot = row + 1,
		    colL = col - 1,
		    colR = col + 1;
		if (row == 0) {
			rowTop = ht;
		} else if (row == ht) {
			rowBot = 0;
		}
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
		var rowTop = row - 1,
		    rowBot = row + 1,
		    colL = lh,
		    colR = col + 1;
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
		var rowTop = row - 1,
		    rowBot = row + 1,
		    colL = col - 1,
		    colR = 0;
		score[rowTop][colL] += 1;
		score[rowTop][col] += 1;
		score[rowTop][colR] += 1;
		score[row][colL] += 1;
		score[row][colR] += 1;
		score[rowBot][colL] += 1;
		score[rowBot][col] += 1;
		score[rowBot][colR] += 1;
	}

	score[0][0] = 1;score[0][lh] = 1;score[ht][0] = 1;score[ht][lh] = 1;
	if (cst[0][0]) {
		score[ht][0] += 1;score[ht][1] += 1;score[0][lh] += 1;score[0][1] += 1;score[1][lh] += 1;score[1][0] += 1;score[1][1] += 1;
	}
	if (cst[0][lh]) {
		score[ht][lh - 1] += 1;score[ht][lh] += 1;score[0][lh - 1] += 1;score[0][0] += 1;score[1][lh - 1] += 1;score[1][lh] += 1;score[1][0] += 1;
	}
	if (cst[ht][0]) {
		score[ht - 1][lh] += 1;score[ht - 1][0] += 1;score[ht - 1][1] += 1;score[ht][lh] += 1;score[ht][1] += 1;score[0][0] += 1;score[0][1] += 1;
	}
	if (cst[ht][lh]) {
		score[ht - 1][lh - 1] += 1;score[ht - 1][lh] += 1;score[ht - 1][0] += 1;score[ht][lh - 1] += 1;score[ht][0] += 1;score[0][lh - 1] += 1;score[0][lh] += 1;
	}

	for (var i = 0; i <= ht; i++) {
		for (var j = 1; j < lh; j++) {
			if (cst[i][j] > 0) {
				passScore(i, j);
			}
		}
	}

	for (var i = 1; i < ht; i++) {
		if (cst[i][0] > 0) {
			leftColPass(i, 0);
		}
	}

	for (var i = 1; i < ht; i++) {
		if (cst[i][lh] > 0) {
			rightColPass(i, lh);
		}
	}

	for (var i = 0; i < score.length; i++) {
		for (var j = 0; j < score[i].length; j++) {
			if (cst[i][j] == 0 && score[i][j] == 0) {} //{fts[i][j] = 0} // stay empty
			else if (cst[i][j] >= 1 && (score[i][j] > 3 || score[i][j] < 2)) {
					fts[i][j] = -35;
				} // die
				else if (cst[i][j] <= 0 && score[i][j] == 3) {
						fts[i][j] = 1;
					} // born
					else if (cst[i][j] >= 1 && (score[i][j] == 2 || score[i][j] == 3)) {
							fts[i][j] += 1;
						} // stay alive
						else if (cst[i][j] < 0) {
								fts[i][j] += 1;
							} // was dead ------ must stay last
		}
	}
	if (params.randomBirth) {
		var h = Math.floor(Math.random() * ht);
		var l = Math.floor(Math.random() * lh);
		if (!fts[h][l]) {
			fts[h][l] = 1;
		}
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
		color = { background: 'hsl(' + (172 + props.cellState * 4.2) + ', 58%, 55%)' };
	} else if (props.cellState < 0) {
		color = {
			background: 'hsl(162, 66%, ' + (66 + props.cellState * 0.45) + '%)', //////////////////////////////
			borderRadius: '25%'
		};
	}
	return React.createElement('div', {
		className: className,
		style: color,
		onClick: function onClick() {
			return props.onClick(props.row, props.col);
		}
	});
}

// </row>
function Row(props) {
	var preRenderRow = props.rowState.map(function (x, i) {
		return React.createElement(Cell, { key: i, col: i, row: props.row, cellState: x, onClick: props.onClick });
	});
	return React.createElement(
		'div',
		{ className: 'row' },
		preRenderRow
	);
}

var perf = Date.now(); // perf
var total = 0; // perf
// </grid>

var Grid = function (_React$Component) {
	_inherits(Grid, _React$Component);

	function Grid(props) {
		_classCallCheck(this, Grid);

		var _this = _possibleConstructorReturn(this, (Grid.__proto__ || Object.getPrototypeOf(Grid)).call(this, props));

		_this.state = {
			gridState: _this.props.grid,
			cycles: 0,
			delay: 75
		};
		_this.clickCell = _this.clickCell.bind(_this);
		// this.cellSize = this.cellSize.bind(this);
		return _this;
	}

	_createClass(Grid, [{
		key: 'clickCell',
		value: function clickCell(r, c) {
			// this.state.gridState.map( x => console.log(x) );
			var tempGrid = [];
			this.state.gridState.map(function (x, i) {
				return tempGrid.push(x);
			});
			if (!tempGrid[r][c]) {
				tempGrid[r][c] = 1;
			} else {
				tempGrid[r][c] = 0;
			}
			this.setState({ gridState: tempGrid });
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			this.interv = setInterval(function () {
				_this2.setState({
					gridState: genNewGridState(_this2.state.gridState),
					cycles: _this2.state.cycles + 1
				});
				total += perf = Date.now() - perf;
				if (_this2.state.cycles % 100 === 0 || _this2.state.cycles < 31) {
					console.log(_this2.state.cycles, '-', total / _this2.state.cycles);
				}
				perf = Date.now();
			}, this.state.delay);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this3 = this;

			var preRenderGrid = this.state.gridState.map(function (x, i) {
				return React.createElement(Row, {
					key: i,
					row: i,
					rowState: x,
					onClick: _this3.clickCell
				});
			});
			return React.createElement(
				'section',
				{ id: 'grid' },
				preRenderGrid
			);
		}
	}]);

	return Grid;
}(React.Component);

var MenuBar = function (_React$Component2) {
	_inherits(MenuBar, _React$Component2);

	function MenuBar(props) {
		_classCallCheck(this, MenuBar);

		var _this4 = _possibleConstructorReturn(this, (MenuBar.__proto__ || Object.getPrototypeOf(MenuBar)).call(this, props));

		_this4.state = {};
		return _this4;
	}

	_createClass(MenuBar, [{
		key: 'render',
		value: function render() {
			return null;
		}
	}]);

	return MenuBar;
}(React.Component);

var Main = function (_React$Component3) {
	_inherits(Main, _React$Component3);

	function Main(props) {
		_classCallCheck(this, Main);

		var _this5 = _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).call(this, props));

		_this5.state = {};
		return _this5;
	}

	_createClass(Main, [{
		key: 'render',
		value: function render() {
			return React.createElement(Grid, { grid: genNewGridState(mem.randGrid, mem.score) });
		}
	}]);

	return Main;
}(React.Component);

ReactDOM.render(React.createElement(Main, null), document.getElementById('main'));

// react //