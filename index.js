'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

(function () {
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
	for (var i = 0; i < cst.length; i++) {
		fts[i] = cst[i].slice();
		for (var j = 0; j < cst[i].length; j++) {
			mem.score[i][j] = 0;
		}
	}

	var ht = params.height - 1;
	var lh = params.length - 1;

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
			if (cst[i][j]) {
				passScore(i, j);
			}
		}
	}

	for (var i = 1; i < ht; i++) {
		if (cst[i][0]) {
			leftColPass(i, 0);
		}
	}

	for (var i = 1; i < ht; i++) {
		if (cst[i][lh]) {
			rightColPass(i, lh);
		}
	}

	for (var i = 0; i < score.length; i++) {
		for (var j = 0; j < score[i].length; j++) {
			if (score[i][j] > 3 || score[i][j] < 2) {
				fts[i][j] = 0;
			} else if (score[i][j] === 3) {
				fts[i][j] += 1;
			} else if (score[i][j] === 2 && cst[i][j] > 0) {
				fts[i][j] += 1;
			} else {
				fts[i][j] = 0;
			}
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
function Cell(props) {
	return React.createElement('div', {
		className: props.cellState ? 'on' : 'off',
		onClick: function onClick() {
			return props.onClick(props.row, props.col);
		},
		style: props.cellState ? { background: 'hsl(' + (190 + props.cellState * 5) + ', 67%, 68%)' } : {}
	});
}

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

var Main = function (_React$Component) {
	_inherits(Main, _React$Component);

	function Main(props) {
		_classCallCheck(this, Main);

		var _this = _possibleConstructorReturn(this, (Main.__proto__ || Object.getPrototypeOf(Main)).call(this, props));

		_this.state = {
			gridState: _this.props.grid
		};
		_this.clickCell = _this.clickCell.bind(_this);
		return _this;
	}

	_createClass(Main, [{
		key: 'clickCell',
		value: function clickCell(r, c) {
			if (!this.state.gridState[r][c]) {
				this.setState({});
			}
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			var _this2 = this;

			this.interv = setInterval(function () {
				_this2.setState({ gridState: genNewGridState(_this2.state.gridState) });
			}, params.interval);
		}
	}, {
		key: 'render',
		value: function render() {
			var preRenderGrid = this.state.gridState.map(function (x, i) {
				return React.createElement(Row, { key: i, row: i, rowState: x });
			});
			return React.createElement(
				'section',
				{ id: 'grid' },
				preRenderGrid
			);
		}
	}]);

	return Main;
}(React.Component);

ReactDOM.render(React.createElement(Main, { grid: genNewGridState(mem.randGrid, mem.score) }), document.getElementById('main'));
// react //