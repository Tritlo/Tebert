function Snake(descr){
    this.__proto__.setup("monkey.ply");
    this.setColor([1.0,0.0,1.0,1.0]);
    this.setup(descr);
    this.rotate(Math.PI,[0,1,0]);
    this.origHeight = this.loc[1];
    this.currentTrans = [0,0,0,0];
    this.scale([0.3,0.3,0.3]);
};

Snake.prototype = new Character();

Snake.prototype.isDeadly = true;

Snake.prototype.onAnimEnd = function(loc){
    entityManager.checkCollisions();
};

Snake.prototype.kill = function() {
    // this.addMove([-this.loc[0], -this.loc[2]]);
    this.isDead = true;
};


Snake.prototype.waitTime = 100.0;
Snake.prototype.countDown = Snake.prototype.waitTime;


Snake.prototype.update = function(du) {
    Character.prototype.update.call(this,du);
    this.countDown -= du;
    if (this.countDown < 0) {
        this.countDown = this.waitTime;
        var move = this.getRandMove();
        this.addMove(move);
    }

    if (this.isDead) return entityManager.KILL_ME_NOW;
    
};

Snake.prototype.getRandMove = function() {
    var move;
    var tebert = entityManager.getTebert();
    var dx = tebert.loc[0] - this.loc[0];
    var dz = tebert.loc[2] - this.loc[2];
    if (Math.abs(dx) > Math.abs(dz)) {
        if (dx > 0) move = [ 1, 0]
        else        move = [-1, 0]
    }
    else {
        if (dz > 0) move = [ 0, 1]
        else        move = [ 0,-1]
    }
    return move;
}
