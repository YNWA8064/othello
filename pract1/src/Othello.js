import React, { useState } from 'react';
import './Othello.css';

const Size = 8;
function createMap(size) {
	const result = [];
	for (let i=0;i<size;i++) {
		result.push(Array(size).fill(null));
	}
	result[size/2-1][size/2-1] = 'X';
	result[size/2-1][size/2] = 'O';
	result[size/2][size/2-1] = 'O';
	result[size/2][size/2] = 'X';
	return result;
}

function Square(props) {
  	return (
    	<button
        	className={props.canI ? 'youcan' : 'square'}
        	onClick={props.onClick}
    	>
      		{props.value}
    	</button>
	);
}

function Board(props) {
  	function renderSquare(i, j) {
		let canI;
		for (let m=0; m<props.canDo.length; m++) {
			if (JSON.stringify([i, j])===JSON.stringify(props.canDo[m])) {
				canI = true;
				break;
			} else {canI = false};
		};
    	return (
			<Square
				key={[i, j]}
				value={props.squares[i][j]}
				canI={canI}
				onClick={() => props.onClick(i, j)}
        	/>
		);
  	}
	const a = [];
	let k = 0;
	for (let i = 0; i<Size; i++) {
		const b = [];
			for (let j = 0; j<Size; j++) {
				b.push(renderSquare(i, j));
				k++
			};
		a.push(<div key={k} className="board-row">{b}</div>)
	}
	  
    return (
      	<div>{a}</div>
    );
}

function Othello(props) {
	const [isAscending, setIsAscending] = useState(true);
	const [history, setHistory] = useState([{
				squares: createMap(Size),
				row: 0,
				col: 0,
			}]
	);
	const [xIsNext, setXIsNext] = useState(true);
	const [stepNumber, setStepNumber] = useState(0);
	
	
	function handleClick(i, j) {
		const historySlice = JSON.parse(JSON.stringify(history)).slice(0, stepNumber+1);
		const current = historySlice[historySlice.length - 1];
		const squares = JSON.parse(JSON.stringify(current.squares));
		if (squares[i][j]) {
			return;
		}
		const result = othelloCal(i, j, squares, xIsNext);
		if (result.length>0) {
			for (let m=0; m<result.length; m++) {
				squares[result[m][0]][result[m][1]] = xIsNext ? 'X' : 'O';
			} squares[i][j] = xIsNext ? 'X' : 'O';
		} else {return;}
		setHistory(historySlice.concat([{
				squares: squares,
				row: i,
				col: j,
			}]));
		setStepNumber(historySlice.length);
		setXIsNext(!xIsNext);
	}
	
	function handleReverse() {
		setIsAscending(!isAscending);
	}
	
	let isFull;

	function jumpTo(step) {
		setStepNumber(step);
		setXIsNext((step%2)===0);
	}
	
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
	
	const historySlice = JSON.parse(JSON.stringify(history)).slice(0, stepNumber+1);
	const current = historySlice[stepNumber];
	const score = [0, 0];
	for (let i=0;i<Size;i++) {
		for (let j=0;j<Size;j++) {
			if (current.squares[i][j]==='X') {
				score[0]++;
			} else if (current.squares[i][j]==='O') {
				score[1]++;
			}
		}
	}
	

	
	function makeCanDo(currentSquares, xIsNext) {
		const canDo = [];
		for (let i=0;i<Size;i++) {
			for (let j=0;j<Size;j++) {
				let a = othelloCal(i, j, currentSquares, xIsNext);
				if ((currentSquares[i][j]===null)&&(a.length>0)) {
					canDo.push([i, j]);	
				}
			}
		}
		return canDo;
	}
	const canDo = makeCanDo(current.squares, xIsNext);
	if (canDo.length===0) {
		if(makeCanDo(current.squares, !xIsNext).length===0) {
			isFull=true;
		} else {
			alert(`${xIsNext ? 'X' : 'O'} should pass!`)
			setHistory(historySlice.concat([{
				squares: current.squares,
				row: 'pass',
				col: 'pass',
			}]));
			setStepNumber(historySlice.length);
			setXIsNext(!xIsNext);
		}
	};
	let status;
	if (isFull) {
		if (score[0]>score[1]) {status = 'Winner : X'}
		else if (score[0]===score[1]) {status = 'Draw!'}
		else {status = 'Winner : O'}
	} else {status = 'Next Player : ' + (xIsNext ? 'X' : 'O');}
	const scoreText = `X: ${score[0]} O: ${score[1]}`;
	
	return (
		<div className="game">
			<div className="game-board">
				<Board
					squares={current.squares}
					canDo={canDo}
					onClick={(i, j) => handleClick(i, j)}
				/>
			</div>
			<div className="game-info">
				<div>{status}</div>
				<ol>{moves}</ol>
				<div>{reversebutton}</div>
				<div>{scoreText}</div>
			</div>
		</div>
	);
}

function othelloCal(i, j, squares, xIsNext) {
	const whoDid = (xIsNext) ? 'X' : 'O'
	let result = [];
	const directionValue = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
	for (let k=0; k<8; k++) {
		const direction = directionValue[k];
		const a = flipCheck(tracking(squares, i, j, whoDid, direction), whoDid);
		result = result.concat(a);
	};
	return result;
}

function tracking(squares, i, j, whoDid, direction) {
	let result = [];
	let checkpoint;
	if ((i+direction[0])>=0 && (i+direction[0])<Size && (j+direction[1])>=0 && (j+direction[1])<Size) {
		checkpoint = [i+direction[0],j+direction[1]];	
	} else {return result;}
	const checkpointValue = squares[checkpoint[0]][checkpoint[1]];
	if (checkpointValue === whoDid) {
		result.push(checkpoint);
		result.push(whoDid);
	} else if (checkpointValue === null) {
	} else {
		result.push(checkpoint);
		result = result.concat(tracking(squares, checkpoint[0], checkpoint[1], whoDid, direction));
	}
	return result;
}

function flipCheck(att, whoDid) {
	if (att.length>=3 && (att[att.length-1]===whoDid)) {
		att.splice(att.length-2);
	} else {return [];}
	return att;
}

// ========================================

export default Othello;
