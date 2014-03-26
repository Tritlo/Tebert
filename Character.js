function Character(descr){
    this.setup(descr);

    this.moveQueue = [];
};

Character.prototype = new Model();

Character.prototype.move = function(newPos){
    var currLoc = this.loc;
    var trans = [newPos[0],0,newPos[1],0];
    var currH = this.loc[1];
    var newH =
	    - Math.abs(newPos[0]+this.loc[0])
	    - Math.abs(newPos[1]+this.loc[2]);
    var diff = newH - currH + this.origHeight;
    trans[1] = diff;
    trans[3] = 0;
    if(this.isLegal(trans)){
	this.startAnim(trans);
    }
};

Character.prototype.isLegal = function(trans){
    trans = vec4.add(trans,this.loc,vec4.create());
    return (Math.abs(trans[0]) <= 3 &&  Math.abs(trans[3]) <= 3);
};

Character.prototype.onAnimEnd = function(loc){
    //Callback on anim end
};
Character.prototype.onAnimStart = function(loc){
    //Callback on anim start
};

Character.prototype.update = function(du){
    if(this.animating) this.animate();
    else {
	if(this.moveQueue.length !== 0){
	    this.move(this.moveQueue.shift());
	}
    }
};

Character.prototype.addMove = function(trans){
    this.moveQueue.push(trans);
};


Character.prototype.startAnim = function(trans){
    this.currTransParts = 0;
    this.animParts = this.animSpeed || 10;
    this.currentTrans = trans;

    this.transPart = vec4.scale(trans, 2/this.animParts, vec4.create());
    if(this.transPart[1] > 0){
	this.transPart[0] = 0;
	this.transPart[2] = 0;
    } else {
	this.transPart[1] = 0;
    }

    this.animating = true;
    this.onAnimStart(vec4.round(this.loc));
};

Character.prototype.halfAnim = function(){
    console.log("halfanim");
    this.transPart = vec4.scale(this.currentTrans, 2/this.animParts, vec4.create());
    if(this.transPart[1] < 0){
	this.transPart[0] = 0;
	this.transPart[2] = 0;
    } else {
	this.transPart[1] = 0;
    }
};

Character.prototype.endAnim = function(){
    this.animating = false;
    this.currentTrans = [0,0,0,0];
    this.transPart = [0,0,0,0];
    this.onAnimEnd(vec4.round(this.loc));
};

Character.prototype.animate = function(){
    if(this.currTransParts < this.animParts){
	this.translate(this.transPart);
	this.currTransParts +=1;
    } else {
	this.endAnim();
    }
    
    if(this.currTransParts === this.animParts/2){
	this.halfAnim();
    }
};
