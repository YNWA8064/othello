import React from 'react';
import ReactDOM from 'react-dom';
import Math from 'math';
import './index.css';


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

class Board extends React.Component {
  renderSquare(i) {
    return (
		<Square
			 key={i}
             value={this.props.squares[i]}
			 winningobj={this.props.winningobj && (this.props.winningobj.includes(i))}
             onClick={() => this.props.onClick(i)}
        />);
  }
	
	// componentDidUpdate(prevProps){
	// 	if (this.props.winningobj !== prevProps.winningobj) {}
	// }

  render() {
	  const a = [];
	  let k = 0;
	  for (let i = 0; i<3; i++) {
		  const b = [];
		  for (let j = 0; j<3; j++) {
			  b.push(this.renderSquare(k));
			  k++
		  };
		  a.push(<div key={k} className="board-row">{b}</div>)
	  }
	  
    return (
      <div>{a}</div>
    );
  }
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isAscending: true,
			history: [{
				squares: Array(9).fill(null),
				row: [0],
				col: [0],
			}],
			xIsNext: true,
			stepNumber: 0,
			winningobj: null,
		};
	}
	
	jumpTo(step) {
		this.setState({
			stepNumber: step,
			xIsNext: (step % 2) === 0,
		})
	}
	
	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length - 1];
		const squares = current.squares.slice();
		if (calculateWinner(squares)[0] || squares[i]) {
			return;
		}
		squares[i] = this.state.xIsNext ? 'X' : 'O';
		this.setState({
			history: history.concat([{
				squares: squares,
				row: Math.floor(i/3)+1,
				col: i%3+1,
			}]),
			stepNumber: history.length,
			xIsNext: !this.state.xIsNext,
		});
		if (calculateWinner(squares)[0]) {
			this.setState({
				winningobj: calculateWinner(squares)[1],
			})
		} else {this.setState({winningobj: null})}
	}
	
	handleReverse() {
		this.setState({
			isAscending: !this.state.isAscending,
		})
	}
	
  	render() {
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares)[0];
		const isAscending = this.state.isAscending;
		const isFull = !current.squares.includes(null);
		
		const moves = history.map((step, move) => {
			const desc = move ?
				`Go to move #${move} | ${step.row} ${step.col} ${(move%2)===0 ? 'by O' : 'by X'}` :
				'Go to game start';
			return (
				<li key={move}>
					<button
						onClick={() => this.jumpTo(move)}
						className={move===this.state.stepNumber ? 'selected' : ''}>
						{desc}
					</button>
				</li>
			);
		});
		
		if (!isAscending) {moves.reverse();}
		
		const reversebuttontext = isAscending ? '뒤집기' : '원래대로';
		const reversebutton = (
			<button onClick={()=>this.handleReverse()}>{reversebuttontext}</button>
		)
		
	    let status;
		if (isFull) {
			status = 'Draw!';
		} else if (winner) {
			status = 'Winner : ' + winner;
		} else {
			status = 'Next Player : ' + (this.state.xIsNext ? 'X' : 'O');
		}
        return (
		    <div className="game">
				<div className="game-board">
					<Board
						squares={current.squares}
						winningobj={this.state.winningobj}
						onClick={(i) => this.handleClick(i)}
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

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


