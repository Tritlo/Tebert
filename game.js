var canvas;
var gl;
var theta = [ 0, 0, 0 ];
var temptheta = [ 0, 0, 0 ];
var spin = [0,0,0];

//var eye = vec3.create([0.0,0.0,2.0]);
var eye = vec3.create([0.0,4.0,0.0]);
var at = vec3.create([0.0,0.0,0.0]);
var up = vec3.create([0.0,1.0,0.0]);

var lightPosition = vec4.create([5.0, 5.0, 5.0, 1.0] );
var lightAmbient =  vec4.create([0.2, 0.2, 0.2, 1.0  ]);
var lightDiffuse =  vec4.create([ 1.0, 1.0, 1.0, 1.0 ]);
var lightSpecular = vec4.create([ 1.0, 1.0, 1.0, 1.0 ]);

var materialAmbient =  vec4.create([ 0.2, 0.2, 0.2, 1.0 ]); 
var materialDiffuse =  vec4.create([ 0.4824, 0.5647, 0.5843, 1.0 ]);
var materialSpecular = vec4.create([  1, 1, 1, 1.0 ]);
var materialShininess = 100;



var teapot = undefined;
var teapotn = undefined;
var protoCube, cube, cube2;
var ambientProduct,diffuseProduct,specularProduct;
var modelViewM;
var projectionM;

var shouldQuit = false;
var shouldUpdate = true;
var shouldSingleStep = false;

var pyramid;
var tebert;
var plyReader = PlyReader();

var distFromEdgeOfScreen = 22;
window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    canvas.width = window.innerWidth-distFromEdgeOfScreen;
    canvas.height = window.innerHeight-distFromEdgeOfScreen;

    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }


    
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = loadShaders( gl, "vshader.glsl" , "fshader.glsl" );
    
    gl.useProgram( program );
    gl.cBuffer = gl.createBuffer();
    gl.nBuffer = gl.createBuffer();
    gl.vBuffer = gl.createBuffer();

    gl.vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vTex = gl.getAttribLocation( program, "vTexCoord" );
    gl.vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vColor = gl.getAttribLocation( program, "vColor" );
    console.log(gl.vNormal,gl.vColor,gl.vPosition,gl.vTex);
    gl.lightPos = gl.getUniformLocation(program, "lightPosition");
    
    if(gl.vColor && gl.vColor > 0){
	gl.enableVertexAttribArray( gl.vColor );
    }
    gl.enableVertexAttribArray( gl.vNormal );
    gl.enableVertexAttribArray( gl.vPosition );

    /*
    gl.tBuffer = gl.createBuffer();
    //gl.bindBuffer( gl.ARRAY_BUFFER, gl.tBuffer );
    gl.enableVertexAttribArray( gl.vTex );
    */
    
    gl.lineWidth(3);

    gl.mVMLoc = gl.getUniformLocation(program, "modelViewMatrix");
    gl.pMLoc = gl.getUniformLocation(program, "projectionMatrix");
    gl.objMLoc = gl.getUniformLocation(program, "objectMatrix");
    gl.thetaLoc = gl.getUniformLocation(program, "theta");

    ambientProduct =  vec4.mult(lightAmbient, materialAmbient);
    diffuseProduct =  vec4.mult(lightDiffuse, materialDiffuse);
    specularProduct = vec4.mult(lightSpecular, materialSpecular);

    gl.uniform4fv( gl.getUniformLocation(program, 
       "ambientProduct"),ambientProduct );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "diffuseProduct"),diffuseProduct );
    gl.uniform4fv( gl.getUniformLocation(program, 
       "specularProduct"),specularProduct );	
    gl.uniform4fv( gl.getUniformLocation(program, 
       "lightPosition"),[eye[0],eye[1],eye[2],1]);
    
    gl.uniform1f( gl.getUniformLocation(program, 
       "shininess"),materialShininess );
    
    //plyReader.read("teapot.ply",onModelReady);
    //plyReader.read("cube.ply",onModelReady);
    //cube = new Cube();
    //cube2 = new Cube();
    //plyReader.read("teapot-n.ply",onModelReady);
    //tebert = new Tebert({"loc":[0,1,0,1]});
    tebert = new Tebert({"loc":[0,1.5,0,1], "color": [1.0,0.0,0.0,0.0]});
    pyramid = new Pyramid();
    start();
};

function start(){
    //tebert.translate([0.0,1.0,0.0]);
    //cube.scale([0.5,0.5,0.5]);
    //cube.translate([0,0,0]);
    //cube.swapColor();
    //cube.swapColor();
    //cube2.scale([0.5,0.5,0.5]);
    //cube2.swapColor();
    //cube2.translate([1,0,0]);
    window.requestAnimFrame(main);
};


var NOMINAL_UPDATE_INTERVAL = 16.666;
function update(dt) {
    var original_dt = dt;
    // Warn about very large dt values -- they may lead to error
    //
    if (dt > 200) {
        console.log("Big dt =", dt, ": CLAMPING TO NOMINAL");
        dt = NOMINAL_UPDATE_INTERVAL;
    }
    // If using variable time, divide the actual delta by the "nominal" rate,
    
    // giving us a conveniently scaled "du" to work with.
    //
    var du = (dt / NOMINAL_UPDATE_INTERVAL);
    tebert.update(du);
}


var lastUpdate = 0;

function main(currTime){
    var thisUpdate = currTime;
    if (shouldUpdate)
	update(thisUpdate-lastUpdate);
    if(shouldSingleStep){
	update(thisUpdate-lastUpdate);
	shouldSingleStep = false;
	}
    render();
    if (! shouldQuit)
	window.requestAnimFrame(main);
    lastUpdate = thisUpdate;
};

var prevTrueTheta = vec3.create([0,0,0]);
function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var rotM = mat4.identity(mat4.create());
    var truetheta = vec3.add(theta,temptheta,vec3.create());
    mat4.rotate(rotM,-2*radians(truetheta[0]),[0,1,0,0]);
    mat4.rotate(rotM,-2*radians(truetheta[1]),[1,0,0,0]);
    var neye = vec4.create(eye);
    neye[3] = 1;
    neye = mat4.multiplyVec3(rotM,neye);
    neye = vec3.create(neye);
    if(neye[0] === 0 && neye[1] !== 0 && neye[2] === 0){
	neye[2] = 0.01;
    }
    var lp = vec4.create(neye);
    //var lp = vec4.negate(lp);
    lp[3] = 1;
    gl.uniform4fv( gl.lightPos,lp);
    modelViewM = mat4.lookAt(neye,at,up);
    //Setjum sma perspective til ad gera thetta thaeginlegra
    projectionM = mat4.perspective(45,canvas.width/canvas.height,0.1,100);
    gl.uniformMatrix4fv(gl.mVMLoc,false,modelViewM);
    gl.uniformMatrix4fv(gl.pMLoc, false,projectionM);

    tebert.render(gl);
    pyramid.render(gl);
}

