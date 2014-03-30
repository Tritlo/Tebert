function Ball(descr){
    var modelFile = (lowdef) ? "sphere.ply" : "newsphere.ply";
    this.__proto__.setup(modelFile);
    descr.shininess = 200;
    this.setup(descr);
    //this.rotate(Math.PI,[0,1,0]);
    this.origHeight = this.loc[1];
    this.currentTrans = [0,0,0,0];
    //this.setColor(descr.color || [0.85,0.64,0.13,1.0]);
    this.setColor(descr.color || [1.0,0.0,0.0,1.0]);
    //this.scale([0.8,0.8,0.8]);
    this.scale([0.48,0.48,0.48]);
    this.type = "Ball";
};

Ball.prototype = new Character();

Ball.prototype.isDeadly = true;

Ball.prototype.onAnimEnd = function(currloc,prevloc){
    entityManager.checkCollisions();
    entityManager.killOutOfBounds();
};

Ball.prototype.kill = function() {
    this.isDead = true;
};


Ball.prototype.waitTime = 50.0;
Ball.prototype.countDown = Ball.prototype.waitTime;


Ball.prototype.update = function(du) {
    Character.prototype.update.call(this,du);
    this.countDown -= du;
    var move = this.getRandMove();
    if (this.countDown < 0) {
        this.countDown = this.waitTime;
	    var move = this.getRandMove();
        // console.log(move);
	    this.addMove(move);
    }
    if (this.isDead) return entityManager.KILL_ME_NOW;
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
