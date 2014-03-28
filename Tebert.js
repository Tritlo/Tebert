function Tebert(descr){
    var modelFile = (lowdef) ? "monkey.ply" : "head.ply";
    //var d = plyReader.getData(modelFile);
    this.__proto__.setup(modelFile);
    this.textureSrc = "fur.png";
    descr.shininess = 2;
    this.setup(descr);
    this.rotate(Math.PI,[0,1,0]);
    this.origHeight = this.loc[1];
    this.currentTrans = [0,0,0,0];
    this.setColor(descr.color || [0.5,0.5,0.5,1.0]);
    this.scale([0.3,0.3,0.3]);
    this.type = "Tebert";
};

Tebert.prototype = new Character();
Tebert.prototype.onAnimStart = function(currloc,nextloc){
    rotateTo(currloc,nextloc);
};

Tebert.prototype.kill = function() {
    console.log('DEAD');
    this.moveQueue = [];
    this.addMove([-this.loc[0], -this.loc[2]]);
};

Tebert.prototype.onAnimEnd = function(currloc,prevloc){
    pyramid.visit(currloc[0],currloc[2]);
    entityManager.checkCollisions();
    entityManager.killOutOfBounds();
};

Tebert.prototype.keys = function(keyPressed){
    var keys = {
	"i": function(){
	     return [0,-1];
	},
	"j": function(){
	     return [-1,0];
	},
	"k": function(){
	     return [0,1];
	},
	"l": function(){
	     return [1,0];
	}
    };

    var newLoc = keys[keyPressed]();
    this.addMove(newLoc);
};
