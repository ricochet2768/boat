const PI = Math.PI;

const vertSrc = `#version 300 es
in vec4 a_position;
in vec4 a_colour;

uniform mat4 u_model;
uniform mat4 u_proj;

out vec4 vColour;

void main() {
  gl_Position = u_proj * u_model * a_position;
  vColour = a_colour;
}
`;

const fragSrc = `#version 300 es
precision mediump float;

in vec4 vColour;

out vec4 outColour;

void main() {
  outColour = vColour;
}
`;

function main() {
  var cs = document.getElementById("glcanvas");
  var gl = cs.getContext("webgl2");

  var prog = new Program(gl, vertSrc, fragSrc);
  //var program = createProgram(gl, vertSrc, fragSrc);

  // get uniform and attrib locations
  var vertexLocation = gl.getAttribLocation(prog.program, "a_position");
  var colourLocation = gl.getAttribLocation(prog.program, "a_colour");
  var pMatrix = new UniformMatrix(gl, prog.program, "u_proj");
  var mMatrix = new UniformMatrix(gl, prog.program, "u_model");

  // vertices of the boat
  const vertices = [
    0.0, 0.0,  0.0, // 0
    0.5, 0.0,  0.0, // 1
    0.0, 0.25, 0.0, // 2
    0.5, 0.25, 0.0, // 3
    0.0, 0.0, -1.0, // 4
    0.5, 0.0, -1.0, // 5
    0.0, 0.25,-1.0, // 6
    0.5, 0.25, -1.0 // 7
  ];
  const indices = [
    0, 1, 2, // front face
    1, 2, 3,
    1, 5, 3, // right face
    3, 5, 7,
    0, 2, 4, // left face
    2, 4, 6,
    0, 4, 1, // bottom face
    1, 4, 5,
    2, 3, 6, // top face
    3, 6, 7,
    4, 5, 6, // back face
    5, 6, 7
  ];
  const colours = [
    1.0, 1.0, 1.0, 1.0, 
    0.0, 1.0, 0.5, 1.0, 
    0.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 1.0, 1.0,

    1.0, 1.0, 0.0, 1.0,
    0.2, 1.0, 0.5, 1.0,
    1.0, 1.0, 0.2, 1.0,
    0.0, 1.0, 0.0, 1.0,

    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0
  ];

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const positionBuffer = new Buffer(
    gl,
    gl.ARRAY_BUFFER,
    new Float32Array(vertices),
    gl.STATIC_DRAW
  );

  const indexBuffer = new Buffer(
    gl,
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  const colourBuffer = new Buffer(
    gl,
    gl.ARRAY_BUFFER,
    new Float32Array(colours),
    gl.STATIC_DRAW
  );

  const fov = PI / 2;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const proj = mat4.create();
  mat4.perspective(proj, fov, aspect, zNear, zFar);

  var model = mat4.create();
  mat4.translate(model, model, [-0.0, -0.25, -1.5]);
  //mat4.rotateZ(model, model, -PI / 12);

  var then = 0;

  function draw(now) {
    const delta = (now - then) * 0.0004;
    then = now;

    //mat4.translate(model, model, );
    mat4.rotateY(model, model, -delta);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.CULL_FACE);
    gl.bindVertexArray(vao);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    positionBuffer.bind();
    gl.vertexAttribPointer(vertexLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexLocation);

    colourBuffer.bind();
    gl.vertexAttribPointer(colourLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colourLocation);

    gl.useProgram(prog.program);

    pMatrix.setData(proj);
    mMatrix.setData(model);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

main();
