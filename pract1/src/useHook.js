import React, { useState } from 'react';
import Math from 'math';
import './useHook.css';


function Square(props) {
  return (
    <button
        className={props.winningobj ? "highlight" : "square"}
        onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

function Board(props) {
  	function renderSquare(i) {
    	return (
			<Square
				 key={i}
				 value={props.squares[i]}
				 winningobj={props.winningobj && (props.winningobj.includes(i))}
				 onClick={() => props.onClick(i)}
        	/>
		);
  	}
	const a = [];
	let k = 0;
	for (let i = 0; i<3; i++) {
		const b = [];
			for (let j = 0; j<3; j++) {
				b.push(renderSquare(k));
				k++
			};
		a.push(<div key={k} className="board-row">{b}</div>)
	}
	  
    return (
      	<div>{a}</div>
    );
}

function useHook(props) {
	const [isAscending, setIsAscending] = useState(true);
	const [history, setHistory] = useState([{
				squares: Array(9).fill(null),
				row: [0],
				col: [0],
			}]);
	const [xIsNext, setXIsNext] = useState(true);
	const [stepNumber, setStepNumber] = useState(0);
	const [winningobj, setWinningobj] = useState(null);
	
	function jumpTo(step) {
		setStepNumber(step);
		setXIsNext((step%2)===0);
	}
	
	function handleClick(i) {
		const historySlice = history.slice(0, stepNumber + 1);
		const current = historySlice[historySlice.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares)[0] || squares[i]) {
			return;
		}
		squares[i] = xIsNext ? 'X' : 'O';
		setHistory(historySlice.concat([{
				squares: squares,
				row: Math.floor(i/3)+1,
				col: i%3+1,
			}]));
		setStepNumber(historySlice.length);
		setXIsNext(!xIsNext);
		// this.setState({
		// 	history: history.concat([{
		// 		squares: squares,
		// 		row: Math.floor(i/3)+1,
		// 		col: i%3+1,
		// 	}]),
		// 	stepNumber: history.length,
		// 	xIsNext: !this.state.xIsNext,
		// });
		if (calculateWinner(squares)[0]) {
			setWinningobj(calculateWinner(squares)[1]);
			// this.setState({
			// 	winningobj: calculateWinner(squares)[1],
			// })
		} else {setWinningobj(null);}
	}
	
	function handleReverse() {
		setIsAscending(!isAscending);
	}
	
	const current = history[stepNumber];
	const winner = calculateWinner(current.squares)[0];
	const isFull = !current.squares.includes(null);

	const moves = history.map((step, move) => {
		const desc = move ?
			`Go to move #${move} | ${step.row} ${step.col} ${(move%2)===0 ? 'by O' : 'by X'}` :
			'Go to game start';
		return (
			<li key={move}>
				<button
					onClick={() => jumpTo(move)}
					className={move===stepNumber ? 'selected' : ''}>
					{desc}
				</button>
			</li>
		);
	});

	if (!isAscending) {moves.reverse();}

	const reversebuttontext = isAscending ? '뒤집기' : '원래대로';
	const reversebutton = (
		<button onClick={()=>handleReverse()}>{reversebuttontext}</button>
	)

	let status;
	if (winner) {
		status = 'Winner : ' + winner;
	}	else if (isFull) {
		status = 'Draw!';
	} else {
		status = 'Next Player : ' + (xIsNext ? 'X' : 'O');
	}
	return (
		<div className="game">
			<div className="game-board">
				<Board
					squares={current.squares}
					winningobj={winningobj}
					onClick={(i) => handleClick(i)}
				/>
			</div>
			<div className="game-info">
				<div>{status}</div>
				<ol>{moves}</ol>
				<div>{reversebutton}</div>
			</div>
		</div>
	);
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, null];
}
// ========================================

export default useHook;
