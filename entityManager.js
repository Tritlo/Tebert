"use strict";


var entityManager = {

// "PRIVATE" DATA

_entities   : [],

// "PRIVATE" METHODS

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,
spawnBallInterval : 600,
spawnBallCountDown : 600,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//

init: function() {
    this.generateTebert({"loc":[0,0.5,0,1], "color": [0.5,0.5,0.5,1.0]});
    var protoBall = new Ball({"loc":[0,0.5,0,1], "color": [1.0,0.0,0.0,0.0]});
    this.protoBallData = protoBall.modelCopy();
},


generateBall : function(descr) {
    var bd = {"loc":[0,0.5,0,1], "color": [1.0,0.0,0.0,0.0]};
    //for(var k in this.protoBallData)
	//bd[k] = this.protoBallData[k];
    var b = new Ball(bd);
    this._entities.push(b);
},

generateSam : function(descr) {
    this._entities.push(new Sam({"loc":[0,0.5,0,1], "color": [1.0,0.0,1.0,0.0]}));
},

generateTebert : function(descr) {
    var t = new Tebert(descr);
    this._entities.push(t);
},

getTebert : function(){
    var t = this._entities[0];
    return t;
},
checkCollisions : function() {
    var tebert = this.getTebert();
    for (var i = 0; i < this._entities.length; i++) {
        var entity = this._entities[i];
        if (entity.isDeadly && entity.loc[0] === tebert.loc[0] && entity.loc[2] === tebert.loc[2])
            tebert.kill();
    }
},

killOutOfBounds : function(x,y) {
    for (var i = 0; i < this._entities.length; i++) {
        var entity = this._entities[i];
        if (!entity.loc)
            console.log(entity);
        if (pyramid.isOutOfBounds(entity.loc[0], entity.loc[2]))
            entity.kill();
    }
},

update: function(du) {
    var i = 0;
    while (i < this._entities.length) {

        var status = this._entities[i].update(du);

        if (status === this.KILL_ME_NOW) {
            // remove the dead guy, and shuffle the others down to
            // prevent a confusing gap from appearing in the array
            this._entities.splice(i,1);
        }
        else {
            ++i;
        }
    }

    this.spawnBallCountDown -= du;
    if (this.spawnBallCountDown < 0) {
        this.spawnBallCountDown = this.spawnBallInterval;
        this.generateBall();
    }

},

render: function(gl,transformMatrix) {
    for (var i = 0; i < this._entities.length; i++)
        this._entities[i].render(gl,transformMatrix);
}

};


