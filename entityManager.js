/*

entityManager.js

A module which handles arbitrary entity-management for "Asteroids"


We create this module as a single global object, and initialise it
with suitable 'data' and 'methods'.

"Private" properties are denoted by an underscore prefix convention.

*/


"use strict";


// Tell jslint not to complain about my use of underscore prefixes (nomen),
// my flattening of some indentation (white), or my use of incr/decr ops 
// (plusplus).
//
/*jslint nomen: true, white: true, plusplus: true*/


var entityManager = {

// "PRIVATE" DATA

_entities   : [],

// "PRIVATE" METHODS

// PUBLIC METHODS

// A special return value, used by other objects,
// to request the blessed release of death!
//
KILL_ME_NOW : -1,
spawnBallInterval : 300,
spawnBallCountDown : 600,

// Some things must be deferred until after initial construction
// i.e. thing which need `this` to be defined.
//

init: function() {
    
},


generateBall : function(descr) {
    this._entities.push(new Ball({"loc":[0,1.5,0,1], "color": [1.0,0.0,0.0,0.0]}));
},

generateSam : function(descr) {
    this._entities.push(new Sam({"loc":[0,1.5,0,1], "color": [1.0,0.0,1.0,0.0]}));
},

generateTebert : function(descr) {
    var t = new Tebert(descr);
    this._entites.push(new Tebert());
},

checkCollisions : function() {
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

}


