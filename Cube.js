var protoCube;
function Cube(descr){
    protoCube = protoCube || plyReader.read("cube.ply");
    var data = protoCube.getData();
    this.__proto__.setup(data);
    this.setup(descr);
};
Cube.prototype = new Model();

Cube.prototype.isVisited = false;

Cube.prototype.markVisited = function(){
    var yellow= [1.0,1.0,0.0,1.0];
    this.setColor(yellow);
    this.isVisited = true;
};
