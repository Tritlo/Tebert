function Ball(descr){
    this.__proto__.setup("monkey.ply");
    this.setup(descr);
    this.rotate(Math.PI,[0,1,0]);
    this.origHeight = this.loc[1];
};

Ball.prototype = new Model();

Ball.prototype.waitTime = 100.0;
Ball.prototype.countDown = Ball.prototype.waitTime;

Ball.prototype.move = function(newPos){
    console.log(this.loc);

    console.log(newPos);
    // if (this.loc[0] < 0)
    //     newPos[0] = -newPos[0];
    // if (this.loc[2] < 0)
    //     newPos[1] = -newPos[1];
    // console.log(newPos);


    var currLoc = this.loc;
    var trans = [newPos[0],0,newPos[1],0];
    var currH = this.loc[1];
    var newH =
	    - Math.abs(newPos[0]+this.loc[0])
	    - Math.abs(newPos[1]+this.loc[2]);
    var diff = newH - currH + this.origHeight;
    trans[1] = diff;
    this.translate(trans);
    pyramid.visit(this.loc[0],this.loc[2]);
};

Ball.prototype.update = function(du) {
    this.countDown -= du;
    if (this.countDown < 0) {
        this.countDown = this.waitTime;
        
        this.move(this.getRandMove());
    }
}

Ball.prototype.getRandMove = function() {
    var rand = randInt(0,4);
    var move;
    if (rand === 0) move = [1,0];
    if (rand === 1) move = [0,1];
    if (rand === 2) move = [-1,0];
    if (rand === 3) move = [0,-1];
    return move;
}
