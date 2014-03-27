function Tebert(descr){
    var d  = plyReader.getData("monkey.ply");
    d.textureSrc = "fur.png";
    this.__proto__.setup(d);
    this.setup(descr);
    this.rotate(Math.PI,[0,1,0]);
    this.origHeight = this.loc[1];
    this.currentTrans = [0,0,0,0];
    this.setColor(this.color || [1.0,1.0,1.0,1.0]);
    this.scale([0.3,0.3,0.3]);
};

Tebert.prototype = new Character();

Tebert.prototype.onAnimEnd = function(loc){
    pyramid.visit(loc[0],loc[2]);
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
