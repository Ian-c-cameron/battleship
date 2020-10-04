class Gameboard {
  /**
   * constructor - sets the size of the game board
   * @param {*} maxNum highest number on the Y axis
   * @param {*} maxLetter Highest letter on the X axis
   */
  constructor(maxLetter, maxNum) {
    this._maxNum = maxNum;
    this._maxLetter = maxLetter;
    //0=empty and untried, 1=empty and tried, 2=hit but not sunk, 3=sunk
    for (let x = 1; x <= maxNum; x++) {
      for (let char = 'a'; char <= maxLetter; char = String.fromCharCode(char.charCodeAt(0) + 1)) {
        this[char + x] = 0;
      }
    }
  }

  /**
   * markShip - marks that a position on the game board is occupied
   * @param {*} position A position occupied by the ship
   * @param {*} ship The ship object that occupies the space
   * @param {*} direction true=horizontal, false vertical
   */
  markShip(position, ship, direction) {
    if (direction) {
      //check that it doesn't go beyond the right edge of the board
      if (position[1] + (ship.length - 1) > this._maxNum) {
        return false;
      }
      //check that no other ship is occupying the space
      for (let x = position[1]; x < position[1] + ship.length; x++) {
        if (!this[position[0] + x]) {
          return false;
        }
      }
      //assign the space to the ship
      for (let x = position[1]; x < position[1] + ship.length; x++) {
        
        ship.occupies(position[0] + x);
      }
      return true;
    }
    //check that it doesn't go beyond the bottom edge of the board
    const lastLetter = String.fromCharCode(position[0].charCodeAt(0) + (ship.length - 1));
    if (lastLetter > this._maxLetter) {
      return false;
    }
    for (let char = position[0]; char < lastLetter; char = String.fromCharCode(char.charCodeAt(0) + 1)) {
      if (!this[char + position[1]]) {
        return false;
      }
    }

    //assign the space to the ship
    for (let char = position[0]; char < lastLetter; char = String.fromCharCode(char.charCodeAt(0) + 1)) {
      this[char + position[1]] = ship;
      ship.occupies(char + position[1]);
    }
    return true;
  }

  /**
   * attack - an enemy attacks a position on the game board
   * @param {*} position  - the position that is targeted
   */
  attack(position) {
    let index = position[0] + position[1];
    if (!this[index]) {
      this[index] = 1;
      return 'You Missed!';
    }
    if (typeof this[index] === 'number') {
      return 'Already tried that one!';
    }

    //the attack is a hit!
    let sunk = this[index].hit();
    if (sunk) {
      for (const hit of sunk) {
        this[hit] = 3; 
      }
      return 'Ship Sunk!';
    }
    this[index] = 2;
    return 'Hit!';
  }

  printBoard() {
    for (let char = 'a'; char <= this._maxLetter; char = String.fromCharCode(char.charCodeAt(0) + 1)) {
      let output = '';
      for (let x = 1; x <= this._maxNum; x++) {
        if (typeof this[char + x] === 'number') {
          output += '\t' + this[char + x];
        } else {
          output += '\t' + 'S';
        }
      }
      console.log(output);
    }
  }
}

class Ship {
  /**
   * constructor - initialise a new ship
   * @param {*} size - sets how many spaces are taken up and how many hits
   */
  constructor(size) {
    this._length = size;
    this._hits = size;
    this._positions = [];
  }

  /**
   * occupies - adds one position to the list of those occupied by the ship
   * @param {*} position - one position occupied by the ship
   */
  occupies(position) {
    this._positions.push(position);
  }

  /**
   * hit - the ship has been hit! is it sunk?
   */
  hit() {
    this._hits--;
    if (this._hits > 0) {
      return undefined;
    }
    return [...this._positions];
  }
  
  get length() {
    return this._length;
  }
}

let game = new Gameboard('j', 10);
let scout = new Ship(2);
game.markShip(['a', 1], scout, true);
console.log("printing board");

game.attack(['a', 1]);
game.attack(['b', 1]);
game.attack(['j', 10]);
game.printBoard();
game.attack(['a', 2]);
game.printBoard();