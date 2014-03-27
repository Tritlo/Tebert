function Sam(descr){
    this.__proto__.setup("monkey.ply");
    this.setup(descr);
    this.rotate(Math.PI,[0,1,0]);
    this.origHeight = this.loc[1];
    this.currentTrans = [0,0,0,0];
    this.setColor(this.color || [1.0,0.0,1.0,1.0]);
    this.scale([0.3,0.3,0.3]);
};

Sam.prototype = new Character();

Sam.prototype.onAnimEnd = function(loc){
    pyramid.unVisit(loc[0],loc[2]);
};

Sam.prototype.kill = function() {
    // this.addMove([-this.loc[0], -this.loc[2]]);
    this.isDead = true;
};


Sam.prototype.waitTime = 200.0;
Sam.prototype.countDown = Sam.prototype.waitTime;


Sam.prototype.update = function(du) {
    Character.prototype.update.call(this,du);
    this.countDown -= du;
    if (this.countDown < 0) {
        this.countDown = this.waitTime;
        var move = this.getRandMove();
        this.addMove(move);
    }

    if (this.isDead) return entityManager.KILL_ME_NOW;
    
};

Sam.prototype.getRandMove = function() {
    var rand = randInt(0,4);
    var move;
    if (rand === 0) move = [1,0];
    if (rand === 1) move = [0,1];
    if (rand === 2) move = [-1,0];
    if (rand === 3) move = [0,-1];
    if (pyramid.isOutOfBounds(this.loc[0] + move[0], this.loc[2] + move[1]))  {
        move[0] *= -1; // Don't kill yourself
        move[1] *= -1; 
        console.log(this.loc, move);
    }

    return move;
}
