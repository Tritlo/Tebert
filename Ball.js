function Ball(descr){
    this.__proto__.setup("newsphere.ply");
    this.setup(descr);
    this.rotate(Math.PI,[0,1,0]);
    this.origHeight = this.loc[1];
    this.currentTrans = [0,0,0,0];
    this.setColor(this.color || [1.0,0.0,1.0,1.0]);
    this.scale([0.3,0.3,0.3]);
};

Ball.prototype = new Character();

Ball.prototype.onAnimEnd = function(loc){
    pyramid.unVisit(loc[0],loc[2]);
};

Ball.prototype.kill = function() {
    this.addMove([-this.loc[0], -this.loc[2]]);
};


Ball.prototype.waitTime = 100.0;
Ball.prototype.countDown = Ball.prototype.waitTime;


Ball.prototype.update = function(du) {
    Character.prototype.update.call(this,du);
    this.countDown -= du;
    var move = this.getRandMove();
    if (this.countDown < 0) {
	var distFMid = Math.abs(this.loc[0]) + Math.abs(this.loc[2]);
        if (Math.round(distFMid) == pyramid.height - 1){
            this.countDown = this.waitTime*2;
	    this.kill();
	} else {
            this.countDown = this.waitTime;
	    var move = this.getRandMove();
	    this.addMove(move);
	}
    }
    
};

Ball.prototype.getRandMove = function() {
    var rand = randInt(0,4);
    var move;
    if (rand === 0) move = [1,0];
    if (rand === 1) move = [0,1];
    if (rand === 2) move = [-1,0];
    if (rand === 3) move = [0,-1];
    if (this.loc[0] * move[0] < 0)  move[0] *= -1; // can't go up
    if (this.loc[2] * move[1] < 0)  move[1] *= -1;
    return move;
}
