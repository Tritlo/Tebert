var protoCube;
function Cube(descr){
    protoCube = protoCube || plyReader.read("cube.ply");
    var data = protoCube.getData();
    this.__proto__.setup(data);
    this.setup(descr);
};

Cube.prototype.isVisited = false;

Cube.prototype = new Model();
