function Tebert(descr){
    this.__proto__.setup("monkey.ply");
    this.setup(descr);
};

Tebert.prototype = new Model();
