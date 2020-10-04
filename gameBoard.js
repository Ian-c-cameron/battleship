class Gameboard {
  /**
   * constructor - sets the size of the game board
   * @param {*} maxNum highest number on the Y axis
   * @param {*} maxLetter Highest letter on the X axis
   */
  constructor(maxNum, maxLetter) {
    this.maxNum = maxNum;
    this.maxLetter = maxLetter;
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
      if (position[1] + (ship.length - 1) > this.maxNum) {
        return false;
      }
      for (let x = position[1]; x < position[1] + ship.length; x++) {
        this[position[0] + x] = ship;
        ship.occupies(position[0] + x);
      }
      return true;
    }
    const lastLetter = String.fromCharCode(position[0].charCodeAt(0) + (ship.length - 1));
    if (lastLetter > this.maxLetter) {
      return false;
    }
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
        return 'Ship Sunk!';
      }
    }
    this[index] = 2;
    return 'Hit!';
  }
}



