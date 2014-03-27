function Cube(descr,data){
    var protoCube = protoCube || plyReader.read("cube.ply");
    var data = data || protoCube.getData();
    this.__proto__.setup(data);
    this.setup(descr);
    this.type = "Cube";
};
Cube.prototype = new Model();

Cube.prototype.modelCopy = function(){
    var data = this.getData();
    data.textureSrc = this.textureSrc;
    var cube = new Model(data);
    cube.isVisited = false;
    return cube;
};


Cube.prototype.isVisited = false;

Cube.prototype.markVisited = function(){
    var yellow= [1.0,1.0,0.0,1.0];
    this.setColor(yellow);
    this.isVisited = true;
};
