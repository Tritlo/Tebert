function Pyramid(descr){
    for(var prop in descr){
	this[prop] = descr[prop];
    }
    this.init();
};



Pyramid.prototype.render = function(gl,transformMatrix){
    if(!transformMatrix){
        var transformMatrix = mat4.identity(mat4.create());
    };
    
    for (var i = 0; i < this.cubes.length; i++) {
        for (var j = 0; j < this.cubes.length; j++) {
            if (this.cubes[i][j]) {
                this.cubes[i][j].render(gl,transformMatrix)
            }
        }
    }
};

Pyramid.prototype.swapColor = function(x,y) {
    this.cubes[this.height+x][this.height+y].swapColor();
};

Pyramid.prototype.isVisited = function(x,y) {
    return this.cubes[this.height-x][this.height-y].isVisited;
}

Pyramid.prototype.hasWon = function() {
    for (var i = 0; i < this.cubes.length; i++) {
        for (var j = 0; j < this.cubes.length; j++) {
            if (this.cubes[i][j] && !this.cubes[i][j].isVisited) {
                return false;
            }
        }
    }
    return true;
}


Pyramid.prototype.init = function() {
    this.protoCube = this.protoCube | new Cube();
    this.height = this.height | 4;
    this.cubes = [];
    length = 2*this.height - 1;

    for (var i = 0; i < length+1; i++) {
        this.cubes[i] = [];
        for (var j = 0; j < length+1; j++) {
            if (this.manhattanDist(i,j) < this.height) {
                this.cubes[i][j] = protoCube.modelCopy();
                this.cubes[i][j].scale([0.5,0.5,0.5]);
                this.cubes[i][j].translate([i-this.height, -this.manhattanDist(i,j), j-this.height]);
            }
        }
    }
}


Pyramid.prototype.manhattanDist = function(x,y) {
    return Math.abs(this.height-x) + Math.abs(this.height-y);
}
