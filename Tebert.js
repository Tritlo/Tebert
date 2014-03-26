function Tebert(descr){
    this.__proto__.setup("monkey.ply");
    this.setup(descr);
    this.rotate(Math.PI,[0,1,0]);
    this.origHeight = this.loc[1];
};

Tebert.prototype = new Model();

Tebert.prototype.move = function(newPos){
    var currLoc = this.loc;
    var trans = [newPos[0],0,newPos[1],0];
    var currH = this.loc[1];
    var newH =
	    - Math.abs(newPos[0]+this.loc[0])
	    - Math.abs(newPos[1]+this.loc[2]);
    var diff = newH - currH + this.origHeight;
    trans[1] = diff;
    this.translate(trans);
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
    this.move(newLoc);
};
