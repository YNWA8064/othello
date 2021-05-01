import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	return (
		<button
			winBy={props.winBy}
			className="square"
			onClick={props.onClick}
		>
			{props.value}
		</button>
	);
}

class Board extends React.Component {	
  	renderSquare(i) {
		let winBy;
		if (this.props.howToWin) {
			if (i in this.props.howToWin) {
				winBy = true;
			} else { winBy = false }
		}
		return (
			<Square
				winBy={winBy}
				value={this.props.squares[i]} 
				onClick={() => this.props.onClick(i)}
			/>
		);
  	}

  	render() {
		const borderRow = [];
		let k = 0;
		for (let i=0;i<3;i++) {
			const squares = [];
			for (let j=0;j<3;j++) {
				squares.push(this.renderSquare(3*i + j));
				k++
			}
			borderRow.push(<div key={k} className="board-row">{squares}</div>)
		}
		
		return (
			<div>
				{borderRow}
			</div>
		);
	}
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				move: {
					row: null,
					col: null
				}
			}],
			stepNumber: 0,
			xIsNext: true
		}
	}
	
	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
				move: {
					row: Math.floor(i/3) + 1,
					col: i%3 + 1
				}
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		})
	}
	
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) == 0
		});
	}
	
  	render() {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[this.state.stepNumber];
		const squares = current.squares.slice();
		const winner = calculateWinner(squares);
		
		const moves = history.map((step, move) => {
			const desc = move ?
				`Go to move #${move} | ${step.move.row}, ${step.move.col}` :
				'Go to game start';
			return (
				<li key={move}>
					<button onClick={() => this.jumpTo(move)}
						className={move === this.state.stepNumber ? 'font-weight-bold' : ''}>{desc}</button>
				</li>
			);
		});
		
		let status;
		let howToWin;
		if (winner) {
			status = 'Winner : ' + winner[0];
			howToWin = winner.slice(1,winner.length + 1);
		} else {
			status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
			howToWin = null;
		}
		return (
			<div className="game">
				<div className="game-board">
					<Board
						howToWin={howToWin}
						squares={current.squares}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<ol>{moves}</ol>
				</div>
			</div>
		);
  	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i <lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return [squares[a], [a, b, c]]
		}
	}
	return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);